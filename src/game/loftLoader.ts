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

  private modelCache: Map<string, THREE.Group> = new Map();

  /**
   * Load and place a GLB interior model onto a specific floor
   */
  public loadFloorLoft(
    config: LoftConfig,
    onLoaded?: (group: THREE.Group) => void,
    onError?: (error: any) => void
  ) {
    const applyPlacement = (sourceScene: THREE.Group) => {
      // Clone from cached scene
      const rawModel = sourceScene.clone(true);

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
      let targetScale = config.scale;
      if (!targetScale) {
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

      // 3. Optimize PBR Materials (Receive daylight shadows, omit expensive castShadow on interior micro-meshes)
      rawModel.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.castShadow = false; // Major performance boost
          mesh.receiveShadow = true;

          if (mesh.material) {
            const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            materials.forEach((mat) => {
              if ((mat as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
                const stdMat = mat as THREE.MeshStandardMaterial;
                stdMat.roughness = Math.max(0.1, stdMat.roughness);
                stdMat.envMapIntensity = 1.0;
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
    };

    if (this.modelCache.has(config.url)) {
      applyPlacement(this.modelCache.get(config.url)!);
      return;
    }

    this.loader.load(
      config.url,
      (gltf) => {
        this.modelCache.set(config.url, gltf.scene);
        applyPlacement(gltf.scene);
      },
      undefined,
      (err) => {
        console.warn(`[LoftManager] Failed to load GLB: ${config.url}`, err);
        if (onError) onError(err);
      }
    );
  }

  /**
   * Load brutalist concrete VR room PBR model across all floors of the building complex
   */
  public loadAllUserLofts(onAllComplete?: () => void) {
    let loadedCount = 0;
    const modelUrl = '/models/brutalist_concrete_interior_vr_room__pbr.glb';
    const configs: LoftConfig[] = [
      // Story 1: Ground Atrium - Brutalist Entrance Vault
      {
        url: modelUrl,
        floorLevel: 1,
        baseY: 0.02,
        offset: [-2, 0, 0],
        rotationY: 0,
      },
      // Story 2: Cybernetics & Quantum Core - Concrete Laboratory
      {
        url: modelUrl,
        floorLevel: 2,
        baseY: 6.02,
        offset: [-2, 0, 0],
        rotationY: Math.PI / 2,
      },
      // Story 3: Strategy Deck - Brutalist Command Vault
      {
        url: modelUrl,
        floorLevel: 3,
        baseY: 12.02,
        offset: [-2, 0, 0],
        rotationY: Math.PI,
      },
      // Story 4: Sky Garden - Concrete Biome Chamber
      {
        url: modelUrl,
        floorLevel: 4,
        baseY: 18.02,
        offset: [-2, 0, 0],
        rotationY: -Math.PI / 2,
      },
      // Story 5: Penthouse Command - Brutalist Apex Bunker
      {
        url: modelUrl,
        floorLevel: 5,
        baseY: 24.02,
        offset: [-2, 0, 0],
        rotationY: 0,
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
