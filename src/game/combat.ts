import * as THREE from 'three';
import { CombatTelemetry, FloorLevel } from './types';
import { ambientAudio } from './audio';

export interface HostileRobot {
  id: string;
  floor: FloorLevel;
  mesh: THREE.Group;
  health: number;
  maxHealth: number;
  patrolOrigin: THREE.Vector3;
  patrolTarget: THREE.Vector3;
  patrolTimer: number;
  lastFireTime: number;
  isAlerted: boolean;
  hitFlashTimer: number;
  isDead: boolean;
}

export interface PlasmaBolt {
  mesh: THREE.Mesh;
  direction: THREE.Vector3;
  speed: number;
  lifetime: number;
  isFromPlayer: boolean;
}

export interface SparkParticle {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
  lifetime: number;
}

export class CombatSystem {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;

  // Player Combat Status
  public health: number = 100;
  public maxHealth: number = 100;
  public shield: number = 100;
  public maxShield: number = 100;
  public isWeaponDrawn: boolean = false;
  public score: number = 0;
  private isDamageFlash: boolean = false;
  private damageFlashTimer: number = 0;
  private timeSinceLastDamage: number = 0;

  // Enemies
  public robots: HostileRobot[] = [];
  public totalRobotsCount: number = 15;
  public defeatedRobotsCount: number = 0;

  // Projectiles & Particles
  public projectiles: PlasmaBolt[] = [];
  public particles: SparkParticle[] = [];

  // First-Person Gun Model
  public gunGroup: THREE.Group;
  private muzzleFlashMesh: THREE.Mesh;
  private muzzleFlashTimer: number = 0;
  private gunRecoil: number = 0;
  private gunEquipProgress: number = 0; // 0 = holstered, 1 = ready

  // Callback
  public onCombatTelemetry?: (telemetry: CombatTelemetry) => void;

  constructor(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
    this.scene = scene;
    this.camera = camera;

    // 1. Build First-Person Doom-Style Plasma Rifle
    this.gunGroup = this.buildDoomPlasmaGun();
    this.camera.add(this.gunGroup);
    this.gunGroup.position.set(0.32, -0.65, -0.7); // Start lowered/holstered

    // Muzzle flash sphere
    const flashGeo = new THREE.SphereGeometry(0.12, 8, 8);
    const flashMat = new THREE.MeshBasicMaterial({ color: 0x00f3ff, transparent: true, opacity: 0 });
    this.muzzleFlashMesh = new THREE.Mesh(flashGeo, flashMat);
    this.muzzleFlashMesh.position.set(0, 0.05, -0.9);
    this.gunGroup.add(this.muzzleFlashMesh);

    // 2. Spawn Hostile Red Robots across 5 floors
    this.spawnRobotsAcrossFloors();

    // 3. Emit initial telemetry
    this.emitTelemetry();
  }

  /**
   * Build First-Person Doom-Style Heavy Plasma Blaster Model
   */
  private buildDoomPlasmaGun(): THREE.Group {
    const gun = new THREE.Group();

    // Heavy Brutalist Gun Body
    const bodyGeo = new THREE.BoxGeometry(0.22, 0.22, 0.7);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x1f2937,
      metalness: 0.9,
      roughness: 0.3,
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    gun.add(body);

    // Twin Plasma Barrel Assembly
    const barrelGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.55, 12);
    barrelGeo.rotateX(-Math.PI / 2);
    const barrelMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      metalness: 0.95,
      roughness: 0.2,
    });

    const barrelL = new THREE.Mesh(barrelGeo, barrelMat);
    barrelL.position.set(-0.06, 0.03, -0.45);
    gun.add(barrelL);

    const barrelR = new THREE.Mesh(barrelGeo, barrelMat);
    barrelR.position.set(0.06, 0.03, -0.45);
    gun.add(barrelR);

    // Cyan Neon Energy Rails (Glow runners)
    const railGeo = new THREE.BoxGeometry(0.02, 0.04, 0.5);
    const railMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const railL = new THREE.Mesh(railGeo, railMat);
    railL.position.set(-0.11, 0.04, -0.15);
    gun.add(railL);

    const railR = new THREE.Mesh(railGeo, railMat);
    railR.position.set(0.11, 0.04, -0.15);
    gun.add(railR);

    // Ammo / Battery Cell Indicator (Cyan glowing cylinder)
    const cellGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.18, 10);
    cellGeo.rotateZ(Math.PI / 2);
    const cellMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 1.8,
    });
    const cell = new THREE.Mesh(cellGeo, cellMat);
    cell.position.set(0, 0.11, 0.05);
    gun.add(cell);

    return gun;
  }

  /**
   * Spawn 15 Hostile Red Combat Robots (3 per floor from F1 to F5)
   */
  private spawnRobotsAcrossFloors() {
    const floorSpawns: { floor: FloorLevel; baseElevation: number; coords: [number, number][] }[] = [
      {
        floor: 1,
        baseElevation: 0,
        coords: [
          [-8, -6],
          [8, -6],
          [-10, 6],
        ],
      },
      {
        floor: 2,
        baseElevation: 6,
        coords: [
          [-7, -7],
          [6, 7],
          [8, -5],
        ],
      },
      {
        floor: 3,
        baseElevation: 12,
        coords: [
          [-9, 5],
          [5, -8],
          [6, 6],
        ],
      },
      {
        floor: 4,
        baseElevation: 18,
        coords: [
          [-6, -8],
          [8, 4],
          [-8, 6],
        ],
      },
      {
        floor: 5,
        baseElevation: 24,
        coords: [
          [-7, 5],
          [7, -5],
          [5, 5],
        ],
      },
    ];

    let robotIdCounter = 1;
    floorSpawns.forEach((cfg) => {
      cfg.coords.forEach(([rx, rz]) => {
        const robotMesh = this.buildHostileRobotMesh();
        const originPos = new THREE.Vector3(rx, cfg.baseElevation + 1.2, rz);
        robotMesh.position.copy(originPos);
        this.scene.add(robotMesh);

        this.robots.push({
          id: `robot-${robotIdCounter++}`,
          floor: cfg.floor,
          mesh: robotMesh,
          health: 100,
          maxHealth: 100,
          patrolOrigin: originPos.clone(),
          patrolTarget: originPos.clone().add(new THREE.Vector3((Math.random() - 0.5) * 8, 0, (Math.random() - 0.5) * 8)),
          patrolTimer: Math.random() * 3,
          lastFireTime: 0,
          isAlerted: false,
          hitFlashTimer: 0,
          isDead: false,
        });
      });
    });

    this.totalRobotsCount = this.robots.length;
  }

  /**
   * Build Menacing Crimson Red Combat Robot with Heavy Armor and Blaster Cannons
   */
  private buildHostileRobotMesh(): THREE.Group {
    const group = new THREE.Group();

    // 1. Angular Red Torso
    const torsoGeo = new THREE.BoxGeometry(0.9, 1.1, 0.7);
    const redArmorMat = new THREE.MeshStandardMaterial({
      color: 0xdc2626, // Crimson red
      metalness: 0.8,
      roughness: 0.25,
    });
    const torso = new THREE.Mesh(torsoGeo, redArmorMat);
    torso.position.y = 0.55;
    torso.castShadow = true;
    torso.name = 'robot_torso';
    group.add(torso);

    // 2. Armored Head with Glowing Blood-Red Optical Visor
    const headGeo = new THREE.BoxGeometry(0.55, 0.45, 0.5);
    const headMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, metalness: 0.9, roughness: 0.2 });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.set(0, 1.25, 0.05);
    head.castShadow = true;
    group.add(head);

    // Glowing Red Visor
    const visorGeo = new THREE.BoxGeometry(0.42, 0.12, 0.05);
    const visorMat = new THREE.MeshBasicMaterial({ color: 0xff0033 });
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.position.set(0, 1.25, 0.31);
    group.add(visor);

    // 3. Dual Heavy Plasma Arm Cannons
    const armMat = new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.9 });
    const gunCannonGeo = new THREE.BoxGeometry(0.18, 0.18, 0.7);

    // Left Arm Cannon
    const armL = new THREE.Mesh(gunCannonGeo, armMat);
    armL.position.set(-0.62, 0.65, 0.15);
    armL.castShadow = true;
    group.add(armL);

    // Right Arm Cannon
    const armR = new THREE.Mesh(gunCannonGeo, armMat);
    armR.position.set(0.62, 0.65, 0.15);
    armR.castShadow = true;
    group.add(armR);

    // Red Laser Emitter Tips
    const tipGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.08, 8);
    tipGeo.rotateX(Math.PI / 2);
    const tipMat = new THREE.MeshBasicMaterial({ color: 0xff1100 });

    const tipL = new THREE.Mesh(tipGeo, tipMat);
    tipL.position.set(-0.62, 0.65, 0.52);
    group.add(tipL);

    const tipR = new THREE.Mesh(tipGeo, tipMat);
    tipR.position.set(0.62, 0.65, 0.52);
    group.add(tipR);

    // 4. Heavy Bipedal Legs
    const legGeo = new THREE.BoxGeometry(0.24, 0.6, 0.32);
    const legL = new THREE.Mesh(legGeo, redArmorMat);
    legL.position.set(-0.25, -0.3, 0);
    legL.castShadow = true;
    group.add(legL);

    const legR = new THREE.Mesh(legGeo, redArmorMat);
    legR.position.set(0.25, -0.3, 0);
    legR.castShadow = true;
    group.add(legR);

    // Floating Health Bar (Above Robot)
    const barBgGeo = new THREE.PlaneGeometry(1.2, 0.12);
    const barBgMat = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });
    const barBg = new THREE.Mesh(barBgGeo, barBgMat);
    barBg.position.set(0, 1.8, 0);
    barBg.name = 'health_bar_bg';
    group.add(barBg);

    const barFgGeo = new THREE.PlaneGeometry(1.16, 0.09);
    const barFgMat = new THREE.MeshBasicMaterial({ color: 0xef4444, side: THREE.DoubleSide });
    const barFg = new THREE.Mesh(barFgGeo, barFgMat);
    barFg.position.set(0, 1.8, 0.01);
    barFg.name = 'health_bar_fg';
    group.add(barFg);

    return group;
  }

  /**
   * Toggle Drawing Weapon with Key G
   */
  public toggleWeapon() {
    this.isWeaponDrawn = !this.isWeaponDrawn;
    if (this.isWeaponDrawn && ambientAudio) {
      ambientAudio.playWeaponEquip();
    }
    this.emitTelemetry();
  }

  /**
   * Player Shoots Doom-style Plasma Rifle (Mouse Left Click or Mobile Button)
   */
  public shoot() {
    if (!this.isWeaponDrawn || this.health <= 0) return;

    // Trigger Gun Recoil & Muzzle Flash
    this.gunRecoil = 0.18;
    this.muzzleFlashTimer = 0.08;
    (this.muzzleFlashMesh.material as THREE.MeshBasicMaterial).opacity = 1.0;

    // Play Audio
    if (ambientAudio) {
      ambientAudio.playPlayerShoot();
    }

    // Raycast along camera forward vector to detect robot hits
    const origin = this.camera.position.clone();
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion).normalize();

    // Spawn visual cyan plasma projectile bolt
    const boltGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.6, 8);
    boltGeo.rotateX(Math.PI / 2);
    const boltMat = new THREE.MeshBasicMaterial({ color: 0x00f3ff });
    const boltMesh = new THREE.Mesh(boltGeo, boltMat);

    // Position bolt in front of gun
    boltMesh.position.copy(origin).addScaledVector(forward, 0.8);
    boltMesh.quaternion.copy(this.camera.quaternion);
    this.scene.add(boltMesh);

    this.projectiles.push({
      mesh: boltMesh,
      direction: forward.clone(),
      speed: 65.0, // High velocity
      lifetime: 2.0,
      isFromPlayer: true,
    });

    // Check hitscan against alive hostile robots
    const raycaster = new THREE.Raycaster(origin, forward, 0.5, 60.0);
    const candidateMeshes: THREE.Object3D[] = [];
    const robotMap = new Map<THREE.Object3D, HostileRobot>();

    this.robots.forEach((r) => {
      if (!r.isDead) {
        candidateMeshes.push(r.mesh);
        robotMap.set(r.mesh, r);
        r.mesh.children.forEach((child) => {
          candidateMeshes.push(child);
          robotMap.set(child, r);
        });
      }
    });

    const intersects = raycaster.intersectObjects(candidateMeshes, false);
    if (intersects.length > 0) {
      const hitObj = intersects[0].object;
      const hitRobot = robotMap.get(hitObj);

      if (hitRobot && !hitRobot.isDead) {
        this.damageRobot(hitRobot, 35, intersects[0].point);
      }
    }
  }

  /**
   * Apply Damage to Hostile Robot
   */
  private damageRobot(robot: HostileRobot, amount: number, hitPoint: THREE.Vector3) {
    robot.health -= amount;
    robot.hitFlashTimer = 0.18;
    this.spawnHitSparks(hitPoint, 0x00f3ff, 8);

    if (ambientAudio) {
      ambientAudio.playRobotHit();
    }

    // Flash white on hit
    robot.mesh.traverse((child) => {
      if ((child as THREE.Mesh).isMesh && (child as THREE.Mesh).material) {
        const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
        if (mat.color) mat.color.setHex(0xffffff);
      }
    });

    // Update floating health bar
    const fg = robot.mesh.getObjectByName('health_bar_fg') as THREE.Mesh;
    if (fg) {
      const pct = Math.max(0, robot.health / robot.maxHealth);
      fg.scale.set(pct, 1, 1);
    }

    if (robot.health <= 0) {
      this.destroyRobot(robot, hitPoint);
    }
  }

  /**
   * Eliminate Robot with Explosion
   */
  private destroyRobot(robot: HostileRobot, pos: THREE.Vector3) {
    robot.isDead = true;
    this.defeatedRobotsCount++;
    this.score += 500;

    if (ambientAudio) {
      ambientAudio.playRobotExplosion();
    }

    // Spawn massive fiery spark explosion
    this.spawnHitSparks(pos, 0xff2200, 24);
    this.spawnHitSparks(pos, 0xffa500, 16);

    // Remove from scene
    this.scene.remove(robot.mesh);

    this.emitTelemetry();
  }

  /**
   * Spawn Spark Shrapnel Particles
   */
  private spawnHitSparks(pos: THREE.Vector3, color: number, count: number) {
    for (let i = 0; i < count; i++) {
      const pGeo = new THREE.BoxGeometry(0.06, 0.06, 0.06);
      const pMat = new THREE.MeshBasicMaterial({ color });
      const p = new THREE.Mesh(pGeo, pMat);
      p.position.copy(pos);
      this.scene.add(p);

      const vel = new THREE.Vector3(
        (Math.random() - 0.5) * 8,
        Math.random() * 6,
        (Math.random() - 0.5) * 8
      );

      this.particles.push({
        mesh: p,
        velocity: vel,
        lifetime: 0.4 + Math.random() * 0.3,
      });
    }
  }

  /**
   * Apply Damage to Player
   */
  public damagePlayer(amount: number) {
    if (this.health <= 0) return;

    this.timeSinceLastDamage = 0;
    this.isDamageFlash = true;
    this.damageFlashTimer = 0.25;

    if (ambientAudio) {
      ambientAudio.playPlayerHurt();
    }

    // Shield absorbs damage first
    if (this.shield > 0) {
      const shieldDmg = Math.min(this.shield, amount);
      this.shield -= shieldDmg;
      amount -= shieldDmg;
    }

    if (amount > 0) {
      this.health = Math.max(0, this.health - amount);
    }

    if (this.health <= 0) {
      this.handlePlayerDeath();
    }

    this.emitTelemetry();
  }

  private handlePlayerDeath() {
    this.emitTelemetry();
    // Reboot / Respawn sequence after 2.5 seconds
    setTimeout(() => {
      this.health = this.maxHealth;
      this.shield = this.maxShield;
      this.emitTelemetry();
    }, 2500);
  }

  /**
   * Main Combat Engine Update Loop
   */
  public update(delta: number, playerPos: THREE.Vector3, currentFloor: FloorLevel) {
    const dt = Math.min(delta, 0.1);

    // 1. First-Person Gun Animation & Smooth Draw/Holster
    const targetEquip = this.isWeaponDrawn ? 1.0 : 0.0;
    this.gunEquipProgress = THREE.MathUtils.lerp(this.gunEquipProgress, targetEquip, dt * 10);

    // Gun resting position in camera space
    const readyY = -0.28;
    const holsteredY = -0.75;
    const currentY = THREE.MathUtils.lerp(holsteredY, readyY, this.gunEquipProgress);

    // Apply recoil recovery
    this.gunRecoil = THREE.MathUtils.lerp(this.gunRecoil, 0, dt * 18);
    this.gunGroup.position.set(0.32, currentY, -0.65 + this.gunRecoil);

    // Muzzle flash timer
    if (this.muzzleFlashTimer > 0) {
      this.muzzleFlashTimer -= dt;
      if (this.muzzleFlashTimer <= 0) {
        (this.muzzleFlashMesh.material as THREE.MeshBasicMaterial).opacity = 0;
      }
    }

    // Damage flash timer
    if (this.damageFlashTimer > 0) {
      this.damageFlashTimer -= dt;
      if (this.damageFlashTimer <= 0) {
        this.isDamageFlash = false;
        this.emitTelemetry();
      }
    }

    // Shield passive regeneration after 5s without taking damage
    this.timeSinceLastDamage += dt;
    if (this.timeSinceLastDamage > 5.0 && this.shield < this.maxShield && this.health > 0) {
      this.shield = Math.min(this.maxShield, this.shield + dt * 18);
    }

    // 2. Update Hostile Red Robots AI
    this.robots.forEach((robot) => {
      if (robot.isDead) return;

      // Reset hit flash
      if (robot.hitFlashTimer > 0) {
        robot.hitFlashTimer -= dt;
        if (robot.hitFlashTimer <= 0) {
          robot.mesh.traverse((child) => {
            if ((child as THREE.Mesh).isMesh && (child as THREE.Mesh).material) {
              const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
              if (mat.color && child.name === 'robot_torso') mat.color.setHex(0xdc2626);
            }
          });
        }
      }

      // Look at camera for floating health bar
      const bg = robot.mesh.getObjectByName('health_bar_bg');
      const fg = robot.mesh.getObjectByName('health_bar_fg');
      if (bg && fg) {
        bg.lookAt(playerPos.x, bg.position.y + robot.mesh.position.y, playerPos.z);
        fg.lookAt(playerPos.x, fg.position.y + robot.mesh.position.y, playerPos.z);
      }

      // Check proximity and floor
      const distToPlayer = robot.mesh.position.distanceTo(playerPos);
      const isOnSameFloor = robot.floor === currentFloor;

      if (isOnSameFloor && distToPlayer < 24.0) {
        robot.isAlerted = true;

        // Turn towards player (yaw only)
        robot.mesh.lookAt(playerPos.x, robot.mesh.position.y, playerPos.z);

        // March towards player if outside minimum firing distance (~7m)
        if (distToPlayer > 7.0) {
          const moveDir = new THREE.Vector3().subVectors(playerPos, robot.mesh.position).normalize();
          robot.mesh.position.x += moveDir.x * 2.8 * dt;
          robot.mesh.position.z += moveDir.z * 2.8 * dt;
        }

        // Shoot red plasma bolts at player periodically
        robot.lastFireTime += dt;
        if (robot.lastFireTime > 2.2 && distToPlayer < 22.0) {
          robot.lastFireTime = 0;
          this.robotFireLaser(robot, playerPos);
        }
      } else {
        // Patrol around origin
        robot.isAlerted = false;
        robot.patrolTimer -= dt;
        if (robot.patrolTimer <= 0) {
          robot.patrolTimer = 3 + Math.random() * 4;
          robot.patrolTarget.copy(robot.patrolOrigin).add(
            new THREE.Vector3((Math.random() - 0.5) * 10, 0, (Math.random() - 0.5) * 10)
          );
        }

        const toTarget = new THREE.Vector3().subVectors(robot.patrolTarget, robot.mesh.position);
        if (toTarget.lengthSq() > 0.5) {
          toTarget.normalize();
          robot.mesh.position.x += toTarget.x * 1.5 * dt;
          robot.mesh.position.z += toTarget.z * 1.5 * dt;
          robot.mesh.lookAt(robot.patrolTarget.x, robot.mesh.position.y, robot.patrolTarget.z);
        }
      }
    });

    // 3. Update Plasma Projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.lifetime -= dt;
      p.mesh.position.addScaledVector(p.direction, p.speed * dt);

      // Check collision with player if it's from a robot
      if (!p.isFromPlayer) {
        const distToPlayer = p.mesh.position.distanceTo(playerPos);
        if (distToPlayer < 1.1) {
          this.damagePlayer(15);
          this.spawnHitSparks(p.mesh.position, 0xff0033, 6);
          this.scene.remove(p.mesh);
          this.projectiles.splice(i, 1);
          continue;
        }
      }

      if (p.lifetime <= 0) {
        this.scene.remove(p.mesh);
        this.projectiles.splice(i, 1);
      }
    }

    // 4. Update Particle Sparks
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const pt = this.particles[i];
      pt.lifetime -= dt;
      pt.velocity.y -= 15 * dt; // Gravity
      pt.mesh.position.addScaledVector(pt.velocity, dt);

      if (pt.lifetime <= 0) {
        this.scene.remove(pt.mesh);
        this.particles.splice(i, 1);
      }
    }
  }

  /**
   * Hostile Robot Fires Red Plasma Laser Bolt at Player
   */
  private robotFireLaser(robot: HostileRobot, playerPos: THREE.Vector3) {
    if (ambientAudio) {
      ambientAudio.playRobotLaser();
    }

    const fireOrigin = robot.mesh.position.clone().add(new THREE.Vector3(0, 0.65, 0));
    // Aim towards player chest level
    const target = playerPos.clone().add(new THREE.Vector3((Math.random() - 0.5) * 0.4, 0.1, (Math.random() - 0.5) * 0.4));
    const dir = new THREE.Vector3().subVectors(target, fireOrigin).normalize();

    // Red Laser Bolt Mesh
    const boltGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.7, 8);
    boltGeo.rotateX(Math.PI / 2);
    const boltMat = new THREE.MeshBasicMaterial({ color: 0xff0033 });
    const boltMesh = new THREE.Mesh(boltGeo, boltMat);
    boltMesh.position.copy(fireOrigin).addScaledVector(dir, 0.6);
    boltMesh.lookAt(target);
    this.scene.add(boltMesh);

    this.projectiles.push({
      mesh: boltMesh,
      direction: dir,
      speed: 24.0, // Projectile velocity
      lifetime: 3.5,
      isFromPlayer: false,
    });
  }

  public getActiveRobotsCount(): number {
    return this.robots.filter((r) => !r.isDead).length;
  }

  private emitTelemetry() {
    if (this.onCombatTelemetry) {
      this.onCombatTelemetry({
        health: Math.round(this.health),
        maxHealth: this.maxHealth,
        shield: Math.round(this.shield),
        maxShield: this.maxShield,
        isWeaponDrawn: this.isWeaponDrawn,
        activeRobotsCount: this.getActiveRobotsCount(),
        totalRobotsCount: this.totalRobotsCount,
        defeatedRobotsCount: this.defeatedRobotsCount,
        isGameOver: this.health <= 0,
        isDamageFlash: this.isDamageFlash,
        score: this.score,
      });
    }
  }

  public dispose() {
    this.robots.forEach((r) => this.scene.remove(r.mesh));
    this.projectiles.forEach((p) => this.scene.remove(p.mesh));
    this.particles.forEach((pt) => this.scene.remove(pt.mesh));
    this.camera.remove(this.gunGroup);
  }
}
