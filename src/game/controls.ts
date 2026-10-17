import * as THREE from 'three';
import { PlayerTelemetry, FloorLevel } from './types';
import { FLOOR_DEFINITIONS } from './building';

export class ExplorationControls {
  public camera: THREE.PerspectiveCamera;
  public domElement: HTMLElement;
  public isLocked: boolean = false;

  // Position & Kinematics
  public position: THREE.Vector3;
  private velocity: THREE.Vector3 = new THREE.Vector3();
  private euler: THREE.Euler = new THREE.Euler(0, 0, 0, 'YXZ');

  // Input states
  private moveForward = false;
  private moveBackward = false;
  private moveLeft = false;
  private moveRight = false;
  private isSprinting = false;
  private isCrouching = false;
  private isGrounded = true;

  // Mouse drag fallback
  private isMouseDown = false;
  private prevMouseX = 0;
  private prevMouseY = 0;

  // Collision meshes
  private floorMeshes: THREE.Mesh[] = [];
  private rampMeshes: THREE.Mesh[] = [];
  private wallBounds: THREE.Box3[] = [];
  private raycaster: THREE.Raycaster;

  // Mobile virtual joystick & button states
  public joystickVector: THREE.Vector2 = new THREE.Vector2(0, 0);
  public mobileSprint: boolean = false;

  // Telemetry callback
  public onTelemetry?: (telemetry: PlayerTelemetry) => void;

  constructor(camera: THREE.PerspectiveCamera, domElement: HTMLElement) {
    this.camera = camera;
    this.domElement = domElement;
    this.position = camera.position;
    this.raycaster = new THREE.Raycaster();

    // Default spawn on Floor 1
    this.position.set(0, 1.7, 12);
    this.euler.set(0, Math.PI, 0, 'YXZ');
    this.camera.quaternion.setFromEuler(this.euler);

    this.bindEvents();
  }

  public setColliders(floors: THREE.Mesh[], ramps: THREE.Mesh[], walls: THREE.Box3[]) {
    this.floorMeshes = floors;
    this.rampMeshes = ramps;
    this.wallBounds = walls;
  }

  public setJoystick(x: number, y: number) {
    this.joystickVector.set(x, y);
  }

  public setMobileSprint(sprint: boolean) {
    this.mobileSprint = sprint;
  }

  public triggerJump() {
    if (this.isGrounded) {
      this.velocity.y = 5.8;
      this.isGrounded = false;
    }
  }

  public applyLookDelta(deltaX: number, deltaY: number) {
    const sensitivity = 0.0035;
    this.euler.setFromQuaternion(this.camera.quaternion);
    this.euler.y -= deltaX * sensitivity;
    this.euler.x -= deltaY * sensitivity;

    const maxPitch = (85 * Math.PI) / 180;
    this.euler.x = Math.max(-maxPitch, Math.min(maxPitch, this.euler.x));

    this.camera.quaternion.setFromEuler(this.euler);
  }

  private bindEvents() {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);

    // PointerLock handlers (desktop only)
    this.domElement.addEventListener('click', () => {
      if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;
      try {
        const promise = this.domElement.requestPointerLock?.();
        if (promise && typeof (promise as any).catch === 'function') {
          (promise as any).catch(() => {});
        }
      } catch (_) {}
    });

    document.addEventListener('pointerlockchange', () => {
      this.isLocked = document.pointerLockElement === this.domElement;
    });

    document.addEventListener('mousemove', this.onMouseMove);

    // Mouse drag fallback for non-pointerlock
    this.domElement.addEventListener('mousedown', (e) => {
      this.isMouseDown = true;
      this.prevMouseX = e.clientX;
      this.prevMouseY = e.clientY;
    });

    window.addEventListener('mouseup', () => {
      this.isMouseDown = false;
    });
  }

  private onKeyDown = (event: KeyboardEvent) => {
    switch (event.code) {
      case 'KeyW':
      case 'ArrowUp':
        this.moveForward = true;
        break;
      case 'KeyS':
      case 'ArrowDown':
        this.moveBackward = true;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.moveLeft = true;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.moveRight = true;
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        this.isSprinting = true;
        break;
      case 'KeyC':
      case 'ControlLeft':
        this.isCrouching = true;
        break;
      case 'Space':
        if (this.isGrounded) {
          this.velocity.y = 5.5; // Jump impulse
          this.isGrounded = false;
        }
        break;
      // Quick floor shortcuts: 1-5 keys
      case 'Digit1':
        this.teleportToFloor(1);
        break;
      case 'Digit2':
        this.teleportToFloor(2);
        break;
      case 'Digit3':
        this.teleportToFloor(3);
        break;
      case 'Digit4':
        this.teleportToFloor(4);
        break;
      case 'Digit5':
        this.teleportToFloor(5);
        break;
    }
  };

  private onKeyUp = (event: KeyboardEvent) => {
    switch (event.code) {
      case 'KeyW':
      case 'ArrowUp':
        this.moveForward = false;
        break;
      case 'KeyS':
      case 'ArrowDown':
        this.moveBackward = false;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.moveLeft = false;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.moveRight = false;
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        this.isSprinting = false;
        break;
      case 'KeyC':
      case 'ControlLeft':
        this.isCrouching = false;
        break;
    }
  };

  private onMouseMove = (event: MouseEvent) => {
    let movementX = 0;
    let movementY = 0;

    if (this.isLocked) {
      movementX = event.movementX || 0;
      movementY = event.movementY || 0;
    } else if (this.isMouseDown) {
      movementX = event.clientX - this.prevMouseX;
      movementY = event.clientY - this.prevMouseY;
      this.prevMouseX = event.clientX;
      this.prevMouseY = event.clientY;
    } else {
      return;
    }

    const sensitivity = 0.0022;
    this.euler.setFromQuaternion(this.camera.quaternion);
    this.euler.y -= movementX * sensitivity;
    this.euler.x -= movementY * sensitivity;

    // Clamp vertical look to [-85°, +85°]
    const maxPitch = (85 * Math.PI) / 180;
    this.euler.x = Math.max(-maxPitch, Math.min(maxPitch, this.euler.x));

    this.camera.quaternion.setFromEuler(this.euler);
  };

  public teleportToFloor(level: FloorLevel) {
    const floor = FLOOR_DEFINITIONS.find((f) => f.level === level);
    if (floor) {
      this.position.set(...floor.spawnPosition);
      this.velocity.set(0, 0, 0);
    }
  }

  public teleportTo(x: number, y: number, z: number) {
    this.position.set(x, y, z);
    this.velocity.set(0, 0, 0);
  }

  public update(delta: number) {
    const dt = Math.min(delta, 0.1);

    // Movement speeds
    const effectiveSprint = this.isSprinting || this.mobileSprint;
    const baseSpeed = this.isCrouching ? 2.5 : effectiveSprint ? 8.5 : 4.8;
    const targetEyeHeight = this.isCrouching ? 1.0 : 1.7;

    // Direction vector relative to camera heading
    const direction = new THREE.Vector3();
    const forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.euler.y);
    const right = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.euler.y);

    if (this.moveForward) direction.add(forward);
    if (this.moveBackward) direction.sub(forward);
    if (this.moveRight) direction.add(right);
    if (this.moveLeft) direction.sub(right);

    // Apply mobile virtual joystick input (x = strafe, y = forward/back)
    if (this.joystickVector.lengthSq() > 0.001) {
      direction.addScaledVector(forward, this.joystickVector.y);
      direction.addScaledVector(right, this.joystickVector.x);
    }

    if (direction.lengthSq() > 0) {
      direction.normalize();
      this.velocity.x = THREE.MathUtils.lerp(this.velocity.x, direction.x * baseSpeed, dt * 10);
      this.velocity.z = THREE.MathUtils.lerp(this.velocity.z, direction.z * baseSpeed, dt * 10);
    } else {
      this.velocity.x = THREE.MathUtils.lerp(this.velocity.x, 0, dt * 14);
      this.velocity.z = THREE.MathUtils.lerp(this.velocity.z, 0, dt * 14);
    }

    // Apply horizontal motion
    const nextX = this.position.x + this.velocity.x * dt;
    const nextZ = this.position.z + this.velocity.z * dt;

    // Wall & Boundary Collision checks (clamped to building bounds [-19.2, 19.2])
    const clampedX = Math.max(-19.2, Math.min(19.2, nextX));
    const clampedZ = Math.max(-19.2, Math.min(19.2, nextZ));

    // Simple box collider avoidance
    let blockedX = false;
    let blockedZ = false;
    const playerBox = new THREE.Box3(
      new THREE.Vector3(clampedX - 0.35, this.position.y - 1.6, clampedZ - 0.35),
      new THREE.Vector3(clampedX + 0.35, this.position.y + 0.2, clampedZ + 0.35)
    );

    for (const b of this.wallBounds) {
      if (b.intersectsBox(playerBox)) {
        // blocked by interior obstacle
        blockedX = true;
        blockedZ = true;
        break;
      }
    }

    if (!blockedX) this.position.x = clampedX;
    if (!blockedZ) this.position.z = clampedZ;

    // Vertical Ground & Stair Raycasting
    // Probe downwards from player chest level (position.y)
    const probeOrigin = new THREE.Vector3(this.position.x, this.position.y + 0.5, this.position.z);
    const downDir = new THREE.Vector3(0, -1, 0);
    this.raycaster.set(probeOrigin, downDir);
    this.raycaster.far = 20.0;

    const targets = [...this.rampMeshes, ...this.floorMeshes];
    const hits = this.raycaster.intersectObjects(targets, false);

    if (hits.length > 0) {
      // Find the highest ground below probeOrigin
      const groundHit = hits[0];
      const groundY = groundHit.point.y;
      const idealPlayerY = groundY + targetEyeHeight;

      if (this.velocity.y <= 0 && this.position.y - idealPlayerY < 1.0) {
        // Smoothly snap to slope or floor
        this.position.y = THREE.MathUtils.lerp(this.position.y, idealPlayerY, dt * 25);
        this.velocity.y = 0;
        this.isGrounded = true;
      } else {
        // Free fall with gravity
        this.velocity.y -= 15.0 * dt;
        this.position.y += this.velocity.y * dt;
        if (this.position.y <= idealPlayerY) {
          this.position.y = idealPlayerY;
          this.velocity.y = 0;
          this.isGrounded = true;
        }
      }
    } else {
      // In air fallback
      this.velocity.y -= 15.0 * dt;
      this.position.y += this.velocity.y * dt;
      if (this.position.y < targetEyeHeight) {
        this.position.y = targetEyeHeight;
        this.velocity.y = 0;
        this.isGrounded = true;
      }
    }

    // Determine current floor by altitude
    let currentFloor: FloorLevel = 1;
    let floorName = 'Story 1: Grand Atrium';
    for (const f of FLOOR_DEFINITIONS) {
      if (this.position.y >= f.elevationRange[0] && this.position.y < f.elevationRange[1]) {
        currentFloor = f.level;
        floorName = f.name;
        break;
      }
    }
    if (this.position.y >= 24) {
      currentFloor = 5;
      floorName = this.position.y >= 30 ? 'Rooftop Helipad' : 'Story 5: Penthouse Command';
    }

    // Calculate compass heading (0 = North, 90 = East, 180 = South, 270 = West)
    let degrees = ((-this.euler.y * 180) / Math.PI) % 360;
    if (degrees < 0) degrees += 360;

    // Emit Telemetry
    if (this.onTelemetry) {
      const horizontalSpeed = Math.hypot(this.velocity.x, this.velocity.z);
      this.onTelemetry({
        position: { x: this.position.x, y: this.position.y, z: this.position.z },
        velocity: { x: this.velocity.x, y: this.velocity.y, z: this.velocity.z },
        speed: parseFloat(horizontalSpeed.toFixed(1)),
        heading: Math.round(degrees),
        currentFloor,
        floorName,
        isGrounded: this.isGrounded,
        isSprinting: this.isSprinting,
        isCrouching: this.isCrouching,
      });
    }
  }

  public dispose() {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    document.removeEventListener('mousemove', this.onMouseMove);
  }
}
