import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export interface LoftConfig {
  url: string;
  floorLevel: number;
  baseY: number;
  scale?: number;
  rotationY?: number;
  offset?: [number, number, number];
}

export class LoftManager {
  private scene: THREE.Scene;
  private loader: GLTFLoader;
  public loadedModels: THREE.Group[] = [];

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.loader = new GLTFLoader();
  }

  /**
   * Load and place a GLB interior model onto a specific floor
   */
  public loadFloorLoft(
    config: LoftConfig,
    onLoaded?: (group: THREE.Group) => void,
    onError?: (error: any) => void
  ) {
    this.loader.load(
      config.url,
      (gltf) => {
        const rawModel = gltf.scene;

        // 1. Calculate original bounding box to normalize scale & position
        const bbox = new THREE.Box3().setFromObject(rawModel);
        const size = new THREE.Vector3();
        bbox.getSize(size);
        const center = new THREE.Vector3();
        bbox.getCenter(center);

        // 2. Wrap in an anchor group for clean floor positioning
        const floorWrapper = new THREE.Group();
        floorWrapper.name = `Loft_Floor_${config.floorLevel}_${config.url.split('/').pop()}`;

        // Center model geometry so its base sits exactly on Y = 0 of floorWrapper
        rawModel.position.set(-center.x, -bbox.min.y, -center.z);

        // Apply scale fitting
        // Typical story height is 5.6m clear, width ~26-30m
        let targetScale = config.scale;
        if (!targetScale) {
          // Auto-scale to fit comfortably inside a 24m room with 5.2m height
          const maxHoriz = Math.max(size.x, size.z);
          const scaleH = 5.2 / Math.max(0.1, size.y);
          const scaleW = 24.0 / Math.max(0.1, maxHoriz);
          targetScale = Math.min(scaleH, scaleW);
        }

        floorWrapper.scale.set(targetScale, targetScale, targetScale);

        if (config.rotationY) {
          floorWrapper.rotation.y = config.rotationY;
        }

        const [ox, oy, oz] = config.offset || [0, 0, 0];
        floorWrapper.position.set(ox, config.baseY + oy, oz);

        floorWrapper.add(rawModel);

        // 3. Enhance PBR Materials & Shadows
        rawModel.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            if (mesh.material) {
              const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
              materials.forEach((mat) => {
                if ((mat as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
                  const stdMat = mat as THREE.MeshStandardMaterial;
                  stdMat.roughness = Math.max(0.1, stdMat.roughness);
                  stdMat.envMapIntensity = 1.25;
                  stdMat.needsUpdate = true;
                }
              });
            }
          }
        });

        this.scene.add(floorWrapper);
        this.loadedModels.push(floorWrapper);

        if (onLoaded) {
          onLoaded(floorWrapper);
        }
      },
      undefined,
      (err) => {
        console.warn(`[LoftManager] Failed to load GLB: ${config.url}`, err);
        if (onError) onError(err);
      }
    );
  }

  /**
   * Load all 3 user-provided GLB lofts onto designated floors
   */
  public loadAllUserLofts(onAllComplete?: () => void) {
    let loadedCount = 0;
    const configs: LoftConfig[] = [
      // 1. Story 3 (Executive Level): User's Favorite 'free_loft_18.glb'
      {
        url: '/models/free_loft_18.glb',
        floorLevel: 3,
        baseY: 12.02,
        offset: [-2, 0, 0],
        rotationY: Math.PI, // Aligned with the East-West windows
      },
      // 2. Story 5 (Penthouse Command Loft): User's Favorite 'free_loft_18.glb'
      {
        url: '/models/free_loft_18.glb',
        floorLevel: 5,
        baseY: 24.02,
        offset: [-2, 0, 0],
        rotationY: 0,
      },
      // 3. Story 1 (Lobby / Welcome Loft): 'loft_16_interior.glb'
      {
        url: '/models/loft_16_interior.glb',
        floorLevel: 1,
        baseY: 0.02,
        offset: [-5, 0, 0],
        rotationY: Math.PI / 2,
      },
      // 4. Story 4 (Sky Garden / Terrace Loft): 'interior_7.glb'
      {
        url: '/models/interior_7.glb',
        floorLevel: 4,
        baseY: 18.02,
        offset: [0, 0, 0],
        rotationY: -Math.PI / 2,
      },
    ];

    configs.forEach((cfg) => {
      this.loadFloorLoft(cfg, () => {
        loadedCount++;
        if (loadedCount === configs.length && onAllComplete) {
          onAllComplete();
        }
      });
    });
  }

  public dispose() {
    this.loadedModels.forEach((model) => {
      this.scene.remove(model);
      model.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.geometry?.dispose();
          if (mesh.material) {
            const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            mats.forEach((m) => m.dispose());
          }
        }
      });
    });
    this.loadedModels = [];
  }
}
