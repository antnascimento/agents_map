import * as THREE from 'three';
import { ambientAudio } from './audio';

export interface AlienShip {
  id: string;
  mesh: THREE.Group;
  health: number;
  maxHealth: number;
  orbitCenter: THREE.Vector3;
  orbitRadius: number;
  orbitAngle: number;
  orbitSpeed: number;
  targetAltitude: number;
  altitudeOffset: number;
  swoopTimer: number;
  lastFireTime: number;
  fireCooldown: number;
  hitFlashTimer: number;
  isDead: boolean;
  shipType: 'scythe' | 'cruiser' | 'stinger';
}

export interface DroneLaserBolt {
  mesh: THREE.Mesh;
  direction: THREE.Vector3;
  speed: number;
  lifetime: number;
  damage: number;
}

export interface AlienLaserBolt {
  mesh: THREE.Mesh;
  direction: THREE.Vector3;
  speed: number;
  lifetime: number;
  damage: number;
}

export interface AerialSpark {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
  lifetime: number;
}

export class AerialCombatSystem {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;

  // Alien Fleet
  public ships: AlienShip[] = [];
  public totalShipsCount: number = 0;
  public defeatedShipsCount: number = 0;
  public score: number = 0;

  // Player Drone Combat Status
  public hullHealth: number = 100;
  public maxHullHealth: number = 100;
  public targetLocked: boolean = false;
  public targetDistanceM: number = 0;
  public lockedShip: AlienShip | null = null;
  private prevLockedId: string | null = null;

  // Projectiles & FX
  public playerBolts: DroneLaserBolt[] = [];
  public alienBolts: AlienLaserBolt[] = [];
  public particles: AerialSpark[] = [];

  // Firing rate limiter
  private lastFireTime: number = 0;

  constructor(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
    this.scene = scene;
    this.camera = camera;

    // Spawn random number of alien raider ships (between 8 and 15)
    this.spawnAlienFleet();
  }

  /**
   * Spawn a random number of hostile alien ships over the building and terrain
   */
  public spawnAlienFleet() {
    // Clear any existing
    this.ships.forEach((s) => this.scene.remove(s.mesh));
    this.ships = [];

    // Random number of enemy ships between 8 and 15
    const count = Math.floor(Math.random() * 8) + 8;
    this.totalShipsCount = count;
    this.defeatedShipsCount = 0;

    const shipTypes: ('scythe' | 'cruiser' | 'stinger')[] = ['scythe', 'cruiser', 'stinger'];

    for (let i = 0; i < count; i++) {
      const type = shipTypes[i % shipTypes.length];
      const shipMesh = this.buildAlienShipMesh(type);

      // Random orbit around building helipad (0, 30, 5)
      const orbitRadius = 90 + Math.random() * 320; // 90m to 410m radius
      const orbitAngle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
      const targetAltitude = 45 + Math.random() * 110; // 45m to 155m in the sky
      const orbitSpeed = (0.2 + Math.random() * 0.25) * (Math.random() > 0.4 ? 1 : -1);

      const spawnX = Math.cos(orbitAngle) * orbitRadius;
      const spawnZ = Math.sin(orbitAngle) * orbitRadius;
      shipMesh.position.set(spawnX, targetAltitude, spawnZ);
      this.scene.add(shipMesh);

      this.ships.push({
        id: `alien-ship-${i + 1}`,
        mesh: shipMesh,
        health: 100,
        maxHealth: 100,
        orbitCenter: new THREE.Vector3(0, 30, 5),
        orbitRadius,
        orbitAngle,
        orbitSpeed,
        targetAltitude,
        altitudeOffset: Math.random() * Math.PI * 2,
        swoopTimer: Math.random() * 5,
        lastFireTime: 0,
        fireCooldown: 2.2 + Math.random() * 2.5,
        hitFlashTimer: 0,
        isDead: false,
        shipType: type,
      });
    }
  }

  /**
   * Procedural Biomechanical R-Type Style Alien Raider Ship Mesh
   */
  private buildAlienShipMesh(type: 'scythe' | 'cruiser' | 'stinger'): THREE.Group {
    const group = new THREE.Group();

    // 1. Sleek Armored Fuselage
    const hullMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a, // Obsidian metallic
      metalness: 0.9,
      roughness: 0.2,
    });

    const bioMat = new THREE.MeshStandardMaterial({
      color: 0x881337, // Deep crimson biological armor
      metalness: 0.7,
      roughness: 0.3,
    });

    const glowCoreMat = new THREE.MeshBasicMaterial({
      color: 0xff0055, // Pulsing magenta-red eye/core
    });

    // Central cockpit / bio-pod
    const coreGeo = new THREE.ConeGeometry(0.7, 3.2, 5);
    coreGeo.rotateX(Math.PI / 2);
    const core = new THREE.Mesh(coreGeo, hullMat);
    core.castShadow = true;
    group.add(core);

    // Glowing Cyclopean Sensor Visor
    const eyeGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const eye = new THREE.Mesh(eyeGeo, glowCoreMat);
    eye.position.set(0, 0.15, -1.2);
    group.add(eye);

    const eyeLight = new THREE.PointLight(0xff0055, 1.2, 10);
    eyeLight.position.set(0, 0.2, -1.2);
    group.add(eyeLight);

    // 2. Distinctive R-Type Forward-Swept Mandible Wings
    const wingGeo = new THREE.BoxGeometry(0.2, 0.1, 2.4);
    const wingL = new THREE.Mesh(wingGeo, bioMat);
    wingL.position.set(-1.4, 0, -0.4);
    wingL.rotation.y = -Math.PI / 6;
    wingL.rotation.z = Math.PI / 12;
    wingL.castShadow = true;
    group.add(wingL);

    const wingR = new THREE.Mesh(wingGeo, bioMat);
    wingR.position.set(1.4, 0, -0.4);
    wingR.rotation.y = Math.PI / 6;
    wingR.rotation.z = -Math.PI / 12;
    wingR.castShadow = true;
    group.add(wingR);

    // Wingtips with energy spikes
    const spikeGeo = new THREE.ConeGeometry(0.12, 1.2, 4);
    spikeGeo.rotateX(Math.PI / 2);
    const spikeL = new THREE.Mesh(spikeGeo, glowCoreMat);
    spikeL.position.set(-2.0, 0.1, -1.2);
    group.add(spikeL);

    const spikeR = new THREE.Mesh(spikeGeo, glowCoreMat);
    spikeR.position.set(2.0, 0.1, -1.2);
    group.add(spikeR);

    // 3. Sub-Light Ion Thruster Exhaust (Rear)
    const thrusterGeo = new THREE.CylinderGeometry(0.28, 0.18, 0.5, 8);
    thrusterGeo.rotateX(Math.PI / 2);
    const thrusterMat = new THREE.MeshBasicMaterial({ color: 0xff6600 });
    const thruster = new THREE.Mesh(thrusterGeo, thrusterMat);
    thruster.position.set(0, 0, 1.6);
    group.add(thruster);

    const thrusterGlow = new THREE.PointLight(0xff4400, 1.5, 8);
    thrusterGlow.position.set(0, 0, 1.8);
    group.add(thrusterGlow);

    // 4. Floating 3D Overhead Health Bar & Reticle (Always faces camera)
    const barGroup = new THREE.Group();
    barGroup.name = 'health_bar_group';
    barGroup.position.set(0, 1.6, 0);

    // Background bar
    const barBgGeo = new THREE.PlaneGeometry(2.4, 0.28);
    const barBgMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    });
    const barBg = new THREE.Mesh(barBgGeo, barBgMat);
    barGroup.add(barBg);

    // Foreground health bar
    const barFgGeo = new THREE.PlaneGeometry(2.3, 0.22);
    const barFgMat = new THREE.MeshBasicMaterial({
      color: 0xef4444, // Crimson red
      side: THREE.DoubleSide,
    });
    const barFg = new THREE.Mesh(barFgGeo, barFgMat);
    barFg.name = 'health_bar_fg';
    barFg.position.z = 0.01;
    barGroup.add(barFg);

    group.add(barGroup);

    // Scale ships depending on class
    const scaleFactor = type === 'cruiser' ? 2.4 : type === 'scythe' ? 1.8 : 1.5;
    group.scale.set(scaleFactor, scaleFactor, scaleFactor);

    return group;
  }

  /**
   * Drone Pilot Fires Heavy Twin Plasma Cannons (R-Type Cannon)
   */
  public fireDroneCannon(dronePosition: THREE.Vector3, droneRotation: THREE.Euler) {
    const now = performance.now();
    if (now - this.lastFireTime < 140) return; // Max ~7 rounds per sec
    this.lastFireTime = now;

    if (ambientAudio) {
      ambientAudio.playDroneCannon();
    }

    // Direction drone is facing
    const forward = new THREE.Vector3(0, 0, -1).applyEuler(droneRotation).normalize();
    const right = new THREE.Vector3(1, 0, 0).applyEuler(droneRotation).normalize();

    // Spawn twin heavy bolts (Port and Starboard)
    [-1.0, 1.0].forEach((offsetSide) => {
      const boltGeo = new THREE.CylinderGeometry(0.12, 0.12, 2.2, 8);
      boltGeo.rotateX(Math.PI / 2);
      const boltMat = new THREE.MeshBasicMaterial({ color: 0x00f3ff }); // High energy cyan
      const boltMesh = new THREE.Mesh(boltGeo, boltMat);

      const spawnPos = dronePosition
        .clone()
        .addScaledVector(right, offsetSide)
        .addScaledVector(forward, 1.8);
      boltMesh.position.copy(spawnPos);
      boltMesh.quaternion.setFromEuler(droneRotation);
      this.scene.add(boltMesh);

      this.playerBolts.push({
        mesh: boltMesh,
        direction: forward.clone(),
        speed: 150.0, // High velocity 150 m/s
        lifetime: 2.5,
        damage: 40,
      });
    });

    // Check hitscan / immediate raycast assist
    const raycaster = new THREE.Raycaster(dronePosition, forward, 1.0, 450.0);
    const candidateMeshes: THREE.Object3D[] = [];
    const shipMap = new Map<THREE.Object3D, AlienShip>();

    this.ships.forEach((s) => {
      if (!s.isDead) {
        candidateMeshes.push(s.mesh);
        shipMap.set(s.mesh, s);
        s.mesh.children.forEach((c) => {
          candidateMeshes.push(c);
          shipMap.set(c, s);
        });
      }
    });

    const intersects = raycaster.intersectObjects(candidateMeshes, false);
    if (intersects.length > 0) {
      const hitObj = intersects[0].object;
      const hitShip = shipMap.get(hitObj);
      if (hitShip && !hitShip.isDead) {
        this.damageShip(hitShip, 40, intersects[0].point);
      }
    }
  }

  /**
   * Apply Damage to Alien Raider Ship
   */
  public damageShip(ship: AlienShip, amount: number, hitPoint: THREE.Vector3) {
    if (ship.isDead) return;

    ship.health -= amount;
    ship.hitFlashTimer = 0.15;
    this.spawnHitSparks(hitPoint, 0x00f3ff, 12);

    // Flash white on hit
    ship.mesh.traverse((c) => {
      if ((c as THREE.Mesh).isMesh && (c as THREE.Mesh).material) {
        const mat = (c as THREE.Mesh).material as THREE.MeshStandardMaterial;
        if (mat.color) mat.color.setHex(0xffffff);
      }
    });

    // Update 3D floating health bar
    const fg = ship.mesh.getObjectByName('health_bar_fg') as THREE.Mesh;
    if (fg) {
      const pct = Math.max(0, ship.health / ship.maxHealth);
      fg.scale.set(pct, 1, 1);
    }

    if (ship.health <= 0) {
      this.destroyShip(ship, hitPoint);
    }
  }

  /**
   * Eliminate Alien Ship with Cataclysmic Aerial Explosion
   */
  private destroyShip(ship: AlienShip, pos: THREE.Vector3) {
    ship.isDead = true;
    this.defeatedShipsCount++;
    this.score += 1000;

    if (ambientAudio) {
      ambientAudio.playAlienShipExplosion();
    }

    // Spawn massive fiery shrapnel cloud
    this.spawnHitSparks(pos, 0xff2200, 35);
    this.spawnHitSparks(pos, 0xffa500, 25);
    this.spawnHitSparks(pos, 0x00f3ff, 20);

    // Shockwave expanding ring
    const ringGeo = new THREE.RingGeometry(0.5, 1.2, 24);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xff5500,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.copy(pos);
    ring.lookAt(this.camera.position);
    this.scene.add(ring);

    let ringLife = 0.5;
    const animateRing = () => {
      ringLife -= 0.03;
      ring.scale.multiplyScalar(1.2);
      (ring.material as THREE.MeshBasicMaterial).opacity = Math.max(0, ringLife * 2);
      if (ringLife > 0) {
        requestAnimationFrame(animateRing);
      } else {
        this.scene.remove(ring);
      }
    };
    animateRing();

    // Remove ship model from scene
    this.scene.remove(ship.mesh);
  }

  /**
   * Spawn Spark Shrapnel Particles
   */
  private spawnHitSparks(pos: THREE.Vector3, color: number, count: number) {
    for (let i = 0; i < count; i++) {
      const pGeo = new THREE.BoxGeometry(0.12, 0.12, 0.12);
      const pMat = new THREE.MeshBasicMaterial({ color });
      const p = new THREE.Mesh(pGeo, pMat);
      p.position.copy(pos);
      this.scene.add(p);

      const vel = new THREE.Vector3(
        (Math.random() - 0.5) * 22,
        (Math.random() - 0.5) * 22,
        (Math.random() - 0.5) * 22
      );

      this.particles.push({
        mesh: p,
        velocity: vel,
        lifetime: 0.5 + Math.random() * 0.4,
      });
    }
  }

  /**
   * Main Aerial Combat Update Loop (Invoked on every frame while in Drone Flight)
   */
  public update(delta: number, dronePos: THREE.Vector3, droneRot: THREE.Euler) {
    const dt = Math.min(delta, 0.1);

    // 1. Update Alien Ships Flight AI & Patrol Orbits
    let nearestDist = Infinity;
    let candidateLock: AlienShip | null = null;
    const droneForward = new THREE.Vector3(0, 0, -1).applyEuler(droneRot).normalize();

    this.ships.forEach((ship) => {
      if (ship.isDead) return;

      // Rotate orbit angle
      ship.orbitAngle += ship.orbitSpeed * dt * 0.45;
      ship.swoopTimer += dt;

      // Base orbital position
      const targetX = Math.cos(ship.orbitAngle) * ship.orbitRadius;
      const targetZ = Math.sin(ship.orbitAngle) * ship.orbitRadius;
      // Undulating sinusoidal wave altitude
      const currentY = ship.targetAltitude + Math.sin(ship.swoopTimer + ship.altitudeOffset) * 14.0;

      // Smoothly fly towards target waypoint
      const currentPos = ship.mesh.position;
      const targetPos = new THREE.Vector3(targetX, currentY, targetZ);
      currentPos.lerp(targetPos, dt * 1.5);

      // Alien Ship faces its motion direction
      const moveDir = targetPos.clone().sub(currentPos).normalize();
      if (moveDir.lengthSq() > 0.001) {
        ship.mesh.lookAt(currentPos.clone().add(moveDir));
      }

      // Billboard overhead health bar towards player camera
      const healthBar = ship.mesh.getObjectByName('health_bar_group');
      if (healthBar) {
        healthBar.lookAt(this.camera.position);
      }

      // Restore color after hit flash
      if (ship.hitFlashTimer > 0) {
        ship.hitFlashTimer -= dt;
        if (ship.hitFlashTimer <= 0) {
          ship.mesh.traverse((c) => {
            if ((c as THREE.Mesh).isMesh && (c as THREE.Mesh).material) {
              const mat = (c as THREE.Mesh).material as THREE.MeshStandardMaterial;
              if (mat.color && c.name !== 'health_bar_fg') {
                mat.color.setHex(0x0f172a);
              }
            }
          });
        }
      }

      // Check distance & angle for target locking
      const dist = currentPos.distanceTo(dronePos);
      const toShip = currentPos.clone().sub(dronePos).normalize();
      const dot = droneForward.dot(toShip);

      // Lock-on cone: within 450m and roughly in front (dot > 0.7)
      if (dist < 450 && dot > 0.65 && dist < nearestDist) {
        nearestDist = dist;
        candidateLock = ship;
      }

      // Alien Ship Combat Aggression: Shoot red plasma at player if within 250m
      if (dist < 250 && !ship.isDead) {
        ship.lastFireTime += dt;
        if (ship.lastFireTime > ship.fireCooldown) {
          ship.lastFireTime = 0;
          this.alienFireAtPlayer(ship, dronePos);
        }
      }
    });

    // Update target locking state
    if (candidateLock) {
      this.targetLocked = true;
      this.targetDistanceM = Math.round(nearestDist);
      this.lockedShip = candidateLock;
      if (this.prevLockedId !== candidateLock.id) {
        this.prevLockedId = candidateLock.id;
        if (ambientAudio) {
          ambientAudio.playTargetLockBeep();
        }
      }
    } else {
      this.targetLocked = false;
      this.targetDistanceM = 0;
      this.lockedShip = null;
      this.prevLockedId = null;
    }

    // 2. Update Player Cannon Projectiles
    for (let i = this.playerBolts.length - 1; i >= 0; i--) {
      const bolt = this.playerBolts[i];
      bolt.lifetime -= dt;
      bolt.mesh.position.addScaledVector(bolt.direction, bolt.speed * dt);

      // Check collision against alive alien ships
      let hasHit = false;
      for (const ship of this.ships) {
        if (!ship.isDead && bolt.mesh.position.distanceTo(ship.mesh.position) < 3.2) {
          this.damageShip(ship, bolt.damage, bolt.mesh.position);
          hasHit = true;
          break;
        }
      }

      if (bolt.lifetime <= 0 || hasHit) {
        this.scene.remove(bolt.mesh);
        this.playerBolts.splice(i, 1);
      }
    }

    // 3. Update Alien Raider Projectiles
    for (let i = this.alienBolts.length - 1; i >= 0; i--) {
      const bolt = this.alienBolts[i];
      bolt.lifetime -= dt;
      bolt.mesh.position.addScaledVector(bolt.direction, bolt.speed * dt);

      // Check collision against player drone
      if (bolt.mesh.position.distanceTo(dronePos) < 2.2) {
        this.damageDrone(bolt.damage);
        this.scene.remove(bolt.mesh);
        this.alienBolts.splice(i, 1);
        continue;
      }

      if (bolt.lifetime <= 0) {
        this.scene.remove(bolt.mesh);
        this.alienBolts.splice(i, 1);
      }
    }

    // 4. Update Spark Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.lifetime -= dt;
      p.mesh.position.addScaledVector(p.velocity, dt);
      p.velocity.y -= 9.8 * dt; // gravity

      if (p.lifetime <= 0) {
        this.scene.remove(p.mesh);
        this.particles.splice(i, 1);
      }
    }
  }

  /**
   * Alien Ship Fires Crimson Plasma Bolt at Drone
   */
  private alienFireAtPlayer(ship: AlienShip, dronePos: THREE.Vector3) {
    if (ambientAudio) {
      ambientAudio.playAlienShipLaser();
    }

    const origin = ship.mesh.position.clone();
    // Add lead/spread
    const target = dronePos.clone().add(new THREE.Vector3(
      (Math.random() - 0.5) * 3,
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 3
    ));
    const dir = target.sub(origin).normalize();

    const boltGeo = new THREE.SphereGeometry(0.28, 8, 8);
    const boltMat = new THREE.MeshBasicMaterial({ color: 0xff0044 }); // Blood red alien plasma
    const boltMesh = new THREE.Mesh(boltGeo, boltMat);
    boltMesh.position.copy(origin);
    this.scene.add(boltMesh);

    this.alienBolts.push({
      mesh: boltMesh,
      direction: dir,
      speed: 48.0,
      lifetime: 3.5,
      damage: 15,
    });
  }

  /**
   * Alien Fire Damages Player Drone Hull
   */
  public damageDrone(amount: number) {
    this.hullHealth = Math.max(0, this.hullHealth - amount);
    if (ambientAudio) {
      ambientAudio.playPlayerHurt();
    }

    if (this.hullHealth <= 0) {
      // Emergency reboot after 3 seconds
      setTimeout(() => {
        this.hullHealth = this.maxHullHealth;
      }, 3000);
    }
  }

  public getActiveShipsCount(): number {
    return this.ships.filter((s) => !s.isDead).length;
  }

  public dispose() {
    this.ships.forEach((s) => this.scene.remove(s.mesh));
    this.playerBolts.forEach((b) => this.scene.remove(b.mesh));
    this.alienBolts.forEach((b) => this.scene.remove(b.mesh));
    this.particles.forEach((p) => this.scene.remove(p.mesh));
    this.ships = [];
    this.playerBolts = [];
    this.alienBolts = [];
    this.particles = [];
  }
}
