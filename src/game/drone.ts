import * as THREE from 'three';
import { DroneTelemetry } from './types';

export class DroneSystem {
  public mesh: THREE.Group;
  public launchPadMesh: THREE.Group;
  public isActive: boolean = false;

  private camera: THREE.PerspectiveCamera;
  private domElement: HTMLElement;
  private scene: THREE.Scene;

  // Drone Kinematics
  public position: THREE.Vector3 = new THREE.Vector3(0, 30.6, 5);
  public velocity: THREE.Vector3 = new THREE.Vector3();
  private rotation: THREE.Euler = new THREE.Euler(0, Math.PI, 0, 'YXZ');
  private angularVelocity: THREE.Vector3 = new THREE.Vector3();

  // Rotors & Lights
  private rotors: THREE.Mesh[] = [];
  private searchlight: THREE.SpotLight;
  private searchlightTarget: THREE.Object3D;
  private navLights: THREE.PointLight[] = [];

  // Input states
  private keyW = false;
  private keyS = false;
  private keyA = false;
  private keyD = false;
  private keyQ = false;
  private keyE = false;
  private keySpace = false;
  private keyCtrl = false;
  private keyShift = false;

  // Mouse look
  private mouseX = 0;
  private mouseY = 0;
  private isPointerLocked = false;

  // Helipad origin
  private readonly HELIPAD_ORIGIN = new THREE.Vector3(0, 30.6, 5);
  private readonly MAX_RADIUS = 1000.0; // 1km radius limit
  private batteryPct = 100.0;

  public onTelemetry?: (telemetry: DroneTelemetry) => void;
  public onExit?: () => void;

  constructor(scene: THREE.Scene, camera: THREE.PerspectiveCamera, domElement: HTMLElement) {
    this.scene = scene;
    this.camera = camera;
    this.domElement = domElement;

    // 1. Build Drone 3D Model
    this.mesh = this.buildDroneMesh();
    this.mesh.position.copy(this.position);
    this.scene.add(this.mesh);

    // 2. Build Helipad Launch Pad Beacon
    this.launchPadMesh = this.buildLaunchPad();
    this.launchPadMesh.position.set(0, 30.05, 5);
    this.scene.add(this.launchPadMesh);

    // 3. Searchlight
    this.searchlight = new THREE.SpotLight(0xffffff, 4.0, 150, Math.PI / 4, 0.4, 1.2);
    this.searchlight.castShadow = true;
    this.searchlight.shadow.mapSize.width = 1024;
    this.searchlight.shadow.mapSize.height = 1024;
    this.searchlightTarget = new THREE.Object3D();
    this.scene.add(this.searchlightTarget);
    this.searchlight.target = this.searchlightTarget;
    this.mesh.add(this.searchlight);
    this.searchlight.position.set(0, -0.2, 0);

    this.bindEvents();
  }

  private buildDroneMesh(): THREE.Group {
    const drone = new THREE.Group();

    // Central Aerodynamic Fuselage
    const bodyGeo = new THREE.BoxGeometry(0.9, 0.28, 1.3);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.85,
      roughness: 0.25,
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.castShadow = true;
    drone.add(body);

    // Upper Shell / Hood
    const shellGeo = new THREE.BoxGeometry(0.7, 0.16, 0.9);
    const shellMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7, // High-visibility tactical blue
      metalness: 0.5,
      roughness: 0.2,
    });
    const shell = new THREE.Mesh(shellGeo, shellMat);
    shell.position.set(0, 0.18, -0.05);
    drone.add(shell);

    // Sensor Gimbal Eye (Front)
    const eyeGeo = new THREE.SphereGeometry(0.14, 16, 16);
    const eyeMat = new THREE.MeshStandardMaterial({
      color: 0x00f3ff,
      emissive: 0x00f3ff,
      emissiveIntensity: 2.0,
      roughness: 0.1,
    });
    const eye = new THREE.Mesh(eyeGeo, eyeMat);
    eye.position.set(0, -0.05, -0.68);
    drone.add(eye);

    // 4 Diagonal Motor Boom Arms & Rotor Assemblies
    const armGeo = new THREE.BoxGeometry(0.1, 0.08, 1.0);
    const armMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.3 });

    const motorGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.2, 16);
    const motorMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.9 });

    const bladeGeo = new THREE.BoxGeometry(0.06, 0.015, 0.9);
    const bladeMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.75,
      roughness: 0.1,
    });

    const guardRingGeo = new THREE.TorusGeometry(0.5, 0.02, 8, 24);
    const guardMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.7 });

    const armOffsets = [
      { x: -0.85, z: -0.85, angle: Math.PI / 4 },
      { x: 0.85, z: -0.85, angle: -Math.PI / 4 },
      { x: -0.85, z: 0.85, angle: (3 * Math.PI) / 4 },
      { x: 0.85, z: 0.85, angle: -(3 * Math.PI) / 4 },
    ];

    armOffsets.forEach((pos) => {
      // Boom Arm
      const arm = new THREE.Mesh(armGeo, armMat);
      arm.position.set(pos.x * 0.5, 0, pos.z * 0.5);
      arm.rotation.y = pos.angle;
      drone.add(arm);

      // Motor Hub
      const motor = new THREE.Mesh(motorGeo, motorMat);
      motor.position.set(pos.x, 0.08, pos.z);
      drone.add(motor);

      // Prop Guard Ring
      const guard = new THREE.Mesh(guardRingGeo, guardMat);
      guard.rotation.x = Math.PI / 2;
      guard.position.set(pos.x, 0.15, pos.z);
      drone.add(guard);

      // Spinning Rotor Propeller
      const rotor = new THREE.Mesh(bladeGeo, bladeMat);
      rotor.position.set(pos.x, 0.16, pos.z);
      drone.add(rotor);
      this.rotors.push(rotor);

      // Wingtip Navigation LED
      const ledColor = pos.z < 0 ? 0x22c55e : 0xef4444; // Green front, Red rear
      const ledGeo = new THREE.SphereGeometry(0.04, 8, 8);
      const led = new THREE.Mesh(ledGeo, new THREE.MeshBasicMaterial({ color: ledColor }));
      led.position.set(pos.x, 0.18, pos.z);
      drone.add(led);

      const navLight = new THREE.PointLight(ledColor, 0.8, 4);
      navLight.position.set(pos.x, 0.2, pos.z);
      drone.add(navLight);
      this.navLights.push(navLight);
    });

    return drone;
  }

  private buildLaunchPad(): THREE.Group {
    const pad = new THREE.Group();

    // Circular Launch Ring
    const ringGeo = new THREE.RingGeometry(1.6, 1.9, 32);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x00f3ff,
      emissive: 0x00f3ff,
      emissiveIntensity: 1.5,
      side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    pad.add(ring);

    // Center Cross
    const crossGeo = new THREE.PlaneGeometry(0.25, 2.8);
    const cross1 = new THREE.Mesh(crossGeo, ringMat);
    cross1.rotation.x = -Math.PI / 2;
    pad.add(cross1);

    const cross2 = new THREE.Mesh(crossGeo, ringMat);
    cross2.rotation.x = -Math.PI / 2;
    cross2.rotation.z = Math.PI / 2;
    pad.add(cross2);

    return pad;
  }

  private bindEvents() {
    window.addEventListener('keydown', (e) => {
      if (!this.isActive) return;
      if (e.code === 'KeyW' || e.code === 'ArrowUp') this.keyW = true;
      if (e.code === 'KeyS' || e.code === 'ArrowDown') this.keyS = true;
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') this.keyA = true;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') this.keyD = true;
      if (e.code === 'KeyQ') this.keyQ = true;
      if (e.code === 'KeyE') this.keyE = true;
      if (e.code === 'Space') this.keySpace = true;
      if (e.code === 'KeyC' || e.code === 'ControlLeft') this.keyCtrl = true;
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') this.keyShift = true;
      if (e.code === 'KeyR' || e.code === 'Escape') {
        this.exitFlight();
      }
    });

    window.addEventListener('keyup', (e) => {
      if (!this.isActive) return;
      if (e.code === 'KeyW' || e.code === 'ArrowUp') this.keyW = false;
      if (e.code === 'KeyS' || e.code === 'ArrowDown') this.keyS = false;
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') this.keyA = false;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') this.keyD = false;
      if (e.code === 'KeyQ') this.keyQ = false;
      if (e.code === 'KeyE') this.keyE = false;
      if (e.code === 'Space') this.keySpace = false;
      if (e.code === 'KeyC' || e.code === 'ControlLeft') this.keyCtrl = false;
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') this.keyShift = false;
    });

    document.addEventListener('pointerlockchange', () => {
      this.isPointerLocked = document.pointerLockElement === this.domElement;
    });

    document.addEventListener('mousemove', (e) => {
      if (!this.isActive) return;
      if (this.isPointerLocked) {
        this.rotation.y -= e.movementX * 0.0025;
        this.rotation.x = Math.max(-0.6, Math.min(0.6, this.rotation.x - e.movementY * 0.002));
      }
    });
  }

  // Mobile virtual joystick & button inputs
  public joystickVector: THREE.Vector2 = new THREE.Vector2(0, 0);
  public mobileAscend: boolean = false;
  public mobileDescend: boolean = false;
  public mobileTurbo: boolean = false;
  public mobileYaw: number = 0; // -1 to rotate left, +1 to rotate right

  public setJoystick(x: number, y: number) {
    this.joystickVector.set(x, y);
  }

  public setAltitude(ascend: boolean, descend: boolean) {
    this.mobileAscend = ascend;
    this.mobileDescend = descend;
  }

  public setTurbo(turbo: boolean) {
    this.mobileTurbo = turbo;
  }

  public setYaw(yaw: number) {
    this.mobileYaw = yaw;
  }

  public applyLookDelta(deltaX: number, deltaY: number) {
    this.rotation.y -= deltaX * 0.0035;
    this.rotation.x = Math.max(-0.6, Math.min(0.6, this.rotation.x - deltaY * 0.003));
  }

  public startFlight() {
    this.isActive = true;
    this.position.set(0, 32.5, 5); // Lift off 2m above helipad
    this.velocity.set(0, 0, 0);
    this.rotation.set(0, Math.PI, 0); // Face South outward over the hills

    if (!('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
      try {
        const promise = this.domElement.requestPointerLock?.();
        if (promise && typeof (promise as any).catch === 'function') {
          (promise as any).catch(() => {});
        }
      } catch (_) {}
    }
  }

  public exitFlight() {
    this.isActive = false;
    this.keyW = false;
    this.keyS = false;
    this.keyA = false;
    this.keyD = false;
    this.keySpace = false;
    this.keyCtrl = false;
    this.keyShift = false;

    // Reset mobile states
    this.mobileAscend = false;
    this.mobileDescend = false;
    this.mobileTurbo = false;
    this.mobileYaw = 0;
    this.joystickVector.set(0, 0);

    // Reset drone back to resting dock on helipad
    this.position.copy(this.HELIPAD_ORIGIN);
    this.mesh.position.copy(this.position);
    this.mesh.rotation.set(0, Math.PI, 0);

    if (this.onExit) {
      this.onExit();
    }
  }

  public update(delta: number, elapsed: number) {
    // Spin rotor blades
    const spinSpeed = this.isActive ? (this.keyShift ? 45 : 30) : 4;
    this.rotors.forEach((rotor, idx) => {
      rotor.rotation.y += spinSpeed * delta * (idx % 2 === 0 ? 1 : -1);
    });

    // Pulse launch pad ring
    const padPulse = 1.0 + Math.sin(elapsed * 4) * 0.2;
    this.launchPadMesh.scale.set(padPulse, 1.0, padPulse);

    if (!this.isActive) {
      // Parked on helipad
      this.mesh.position.copy(this.HELIPAD_ORIGIN);
      return;
    }

    const dt = Math.min(delta, 0.1);

    // 1. Aerodynamic Thruster Flight Model
    const isTurbo = this.keyShift || this.mobileTurbo;
    const maxSpeed = isTurbo ? 38.0 : 18.0; // Turbo boost up to 38 m/s (~137 km/h)
    const acceleration = isTurbo ? 45.0 : 25.0;
    const climbSpeed = 16.0;

    // Forward / Backward & Strafe directions relative to current drone Yaw
    const forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.rotation.y);
    const right = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.rotation.y);

    const inputDir = new THREE.Vector3();
    if (this.keyW) inputDir.add(forward);
    if (this.keyS) inputDir.sub(forward);
    if (this.keyD) inputDir.add(right);
    if (this.keyA) inputDir.sub(right);

    // Apply mobile virtual joystick input (x: strafe, y: pitch forward/back)
    if (this.joystickVector.lengthSq() > 0.001) {
      inputDir.addScaledVector(forward, this.joystickVector.y);
      inputDir.addScaledVector(right, this.joystickVector.x);
    }

    if (inputDir.lengthSq() > 0) {
      inputDir.normalize();
      this.velocity.x += inputDir.x * acceleration * dt;
      this.velocity.z += inputDir.z * acceleration * dt;
    }

    // Vertical climb / descent
    if (this.keySpace || this.mobileAscend) {
      this.velocity.y += climbSpeed * 2.2 * dt;
    } else if (this.keyCtrl || this.mobileDescend) {
      this.velocity.y -= climbSpeed * 2.2 * dt;
    } else {
      // Hover stabilization
      this.velocity.y = THREE.MathUtils.lerp(this.velocity.y, 0, dt * 5);
    }

    // Yaw rotation from Q / E or mobile yaw
    if (this.keyQ || this.mobileYaw < -0.1) this.rotation.y += 1.8 * dt * (this.mobileYaw < -0.1 ? -this.mobileYaw : 1);
    if (this.keyE || this.mobileYaw > 0.1) this.rotation.y -= 1.8 * dt * (this.mobileYaw > 0.1 ? this.mobileYaw : 1);

    // Apply aerodynamic air friction / damping
    const airDrag = 0.94;
    this.velocity.x *= Math.pow(airDrag, dt * 60);
    this.velocity.z *= Math.pow(airDrag, dt * 60);
    this.velocity.y *= Math.pow(airDrag, dt * 60);

    // Clamp horizontal speed
    const horizSpeed = Math.hypot(this.velocity.x, this.velocity.z);
    if (horizSpeed > maxSpeed) {
      const scale = maxSpeed / horizSpeed;
      this.velocity.x *= scale;
      this.velocity.z *= scale;
    }

    // Dynamic Banking Roll & Pitch
    // Drone tilts forward when accelerating forward, banks sideways into turns
    const targetPitch = (this.velocity.z * Math.cos(this.rotation.y) - this.velocity.x * Math.sin(this.rotation.y)) * 0.025;
    const targetRoll = (-this.velocity.x * Math.cos(this.rotation.y) - this.velocity.z * Math.sin(this.rotation.y)) * 0.035;

    this.rotation.x = THREE.MathUtils.lerp(this.rotation.x, targetPitch, dt * 8);
    this.rotation.z = THREE.MathUtils.lerp(this.rotation.z, targetRoll, dt * 8);

    // Apply motion to position
    this.position.addScaledVector(this.velocity, dt);

    // 2. 1KM GEOFENCE & ALTITUDE CLAMPS
    const distFromCenter = Math.hypot(this.position.x, this.position.z);
    if (distFromCenter > this.MAX_RADIUS) {
      // Soft pushback boundary
      const angle = Math.atan2(this.position.z, this.position.x);
      this.position.x = Math.cos(angle) * this.MAX_RADIUS;
      this.position.z = Math.sin(angle) * this.MAX_RADIUS;
      this.velocity.multiplyScalar(0.5); // absorb speed at boundary
    }

    // Altitude limits: Min 5m above terrain, Max 280m into the sky
    this.position.y = Math.max(4.0, Math.min(280.0, this.position.y));

    // Update 3D mesh
    this.mesh.position.copy(this.position);
    this.mesh.rotation.copy(this.rotation);

    // Update searchlight aiming straight down / slightly forward
    const spotAim = this.position.clone().add(forward.clone().multiplyScalar(15)).add(new THREE.Vector3(0, -30, 0));
    this.searchlightTarget.position.copy(spotAim);

    // 3. Drone Chase Camera Rig
    // Position camera behind and above the drone, smoothing orientation
    const camOffset = new THREE.Vector3(0, 1.8, 4.8).applyEuler(this.rotation);
    const targetCamPos = this.position.clone().add(camOffset);
    this.camera.position.lerp(targetCamPos, dt * 14);

    const lookTarget = this.position.clone().add(new THREE.Vector3(0, 0.4, 0)).add(forward.clone().multiplyScalar(8));
    this.camera.lookAt(lookTarget);

    // 4. Battery drain & signal calculation
    if (this.keyShift) {
      this.batteryPct = Math.max(10, this.batteryPct - dt * 0.35);
    } else {
      this.batteryPct = Math.max(10, this.batteryPct - dt * 0.1);
    }

    const signalPct = Math.max(12, Math.round(100 - (distFromCenter / this.MAX_RADIUS) * 88));

    // Emit Flight Telemetry
    if (this.onTelemetry) {
      const speedKmh = Math.round(this.velocity.length() * 3.6);
      let heading = Math.round((-this.rotation.y * 180) / Math.PI) % 360;
      if (heading < 0) heading += 360;

      this.onTelemetry({
        position: { x: this.position.x, y: this.position.y, z: this.position.z },
        velocity: { x: this.velocity.x, y: this.velocity.y, z: this.velocity.z },
        speedKmh,
        altitudeM: Math.round(this.position.y),
        pitchDeg: Math.round((this.rotation.x * 180) / Math.PI),
        rollDeg: Math.round((this.rotation.z * 180) / Math.PI),
        headingDeg: heading,
        distanceFromHelipadM: Math.round(distFromCenter),
        signalStrengthPct: signalPct,
        batteryPct: Math.round(this.batteryPct),
        isBoosting: this.keyShift,
      });
    }
  }

  public dispose() {
    this.scene.remove(this.mesh);
    this.scene.remove(this.launchPadMesh);
    this.scene.remove(this.searchlightTarget);
  }
}
