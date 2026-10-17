import * as THREE from 'three';
import { build5StoryBuilding, BuildingData } from './building';
import { ExplorationControls } from './controls';
import { PlayerTelemetry, NPCData, DroneTelemetry } from './types';
import { NPCManager } from './npc';
import { createExteriorWorld, ExteriorWorld } from './exteriorWorld';
import { DroneSystem } from './drone';
import { LoftManager } from './loftLoader';

export class ThreeEngine {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  public controls: ExplorationControls;
  public building: BuildingData;
  public npcManager: NPCManager;
  public exteriorWorld: ExteriorWorld;
  public drone: DroneSystem;
  public loftManager: LoftManager;

  private clock: THREE.Clock;
  private animationFrameId: number | null = null;
  private isDisposed: boolean = false;

  constructor(
    container: HTMLElement,
    onTelemetry?: (telemetry: PlayerTelemetry) => void,
    onNearNPCChange?: (npc: NPCData | null) => void,
    onDroneTelemetry?: (telemetry: DroneTelemetry) => void
  ) {
    this.clock = new THREE.Clock();

    // 1. Scene - Slow Roads inspired Sky & Atmospheric Horizon
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x9bd0ea); // Atmospheric summer sky
    this.scene.fog = new THREE.FogExp2(0xbfe0f2, 0.0016); // Atmospheric depth haze

    // 2. Camera - Extended horizon for distant mountain hills & skyline vistas
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1500);

    // 3. WebGLRenderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(this.renderer.domElement);

    // 4. Natural Daylight Lighting Rig
    this.setupLighting();

    // 5. Exterior World Generation (Slow Roads rolling hills, 400+ trees, highway traffic, city skyline)
    this.exteriorWorld = createExteriorWorld();
    this.scene.add(this.exteriorWorld.group);

    // 6. Build 5-Story Building Complex
    this.building = build5StoryBuilding();
    this.scene.add(this.building.group);

    // 7. Interactive NPC System (Humans & Robots across 5 stories)
    this.npcManager = new NPCManager(this.scene, onNearNPCChange);

    // 8. Drone Flight System on Helipad (1km exploration radius)
    this.drone = new DroneSystem(this.scene, this.camera, this.renderer.domElement);
    if (onDroneTelemetry) {
      this.drone.onTelemetry = onDroneTelemetry;
    }

    // 9. Load User-Provided Architectural GLB Lofts (free_loft_18.glb, loft_16_interior.glb, interior_7.glb)
    this.loftManager = new LoftManager(this.scene);
    this.loftManager.loadAllUserLofts();

    // 10. Controls
    this.controls = new ExplorationControls(this.camera, this.renderer.domElement);
    this.controls.setColliders(
      this.building.floorColliders,
      this.building.rampColliders,
      this.building.wallColliders
    );
    if (onTelemetry) {
      this.controls.onTelemetry = onTelemetry;
    }

    // 11. Window resize listener
    window.addEventListener('resize', this.onWindowResize);

    // 12. Start Animation Loop
    this.animate();
  }

  private setupLighting() {
    // Bright Hemisphere Light (Sky: #87CEEB, Ground bounce: #607d8b)
    const hemiLight = new THREE.HemisphereLight(0x87ceeb, 0x546e7a, 1.3);
    hemiLight.position.set(0, 80, 0);
    this.scene.add(hemiLight);

    // Warm Golden Sun with Soft Shadows
    const sunLight = new THREE.DirectionalLight(0xfff3d6, 2.1);
    sunLight.position.set(45, 75, 40);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 180;
    const d = 50;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    sunLight.shadow.bias = -0.0003;
    this.scene.add(sunLight);

    // Daylight Fill Light from opposite angle
    const fillLight = new THREE.DirectionalLight(0xcde9ff, 0.7);
    fillLight.position.set(-40, 50, -35);
    this.scene.add(fillLight);

    // Ambient soft interior bounce
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);
  }

  public startDroneFlight() {
    this.drone.startFlight();
  }

  public exitDroneFlight() {
    this.drone.exitFlight();
    this.controls.position.set(0, 31.7, 0);
    this.controls.teleportTo(0, 31.7, 0);
  }

  private onWindowResize = () => {
    if (!this.renderer || !this.camera) return;
    const parent = this.renderer.domElement.parentElement;
    const w = parent ? parent.clientWidth : window.innerWidth;
    const h = parent ? parent.clientHeight : window.innerHeight;

    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  };

  private animate = () => {
    if (this.isDisposed) return;
    this.animationFrameId = requestAnimationFrame(this.animate);

    const delta = this.clock.getDelta();
    const elapsed = this.clock.getElapsedTime();

    // Flight vs Exploration loop branching
    if (this.drone.isActive) {
      this.drone.update(delta, elapsed);
    } else {
      this.controls.update(delta);
      this.drone.update(delta, elapsed); // Keep rotors idling and launch pad pulsing
      this.npcManager.update(this.controls.position, elapsed);
    }

    // Update exterior world (highway cars, drifting clouds, water shimmer)
    this.exteriorWorld.update(delta, elapsed);

    // Update building animated features (quantum core, holograms, beacon strobes)
    this.building.update(delta, elapsed);

    // Render Scene
    this.renderer.render(this.scene, this.camera);
  };

  public dispose() {
    this.isDisposed = true;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('resize', this.onWindowResize);
    this.controls.dispose();
    this.drone.dispose();
    this.loftManager.dispose();

    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
    this.renderer.dispose();
  }
}
