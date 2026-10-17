import * as THREE from 'three';
import { NPCData } from './types';

export const NPCS_CONFIG: Omit<NPCData, 'mesh'>[] = [
  // --- FLOOR 1: GRAND ATRIUM ---
  {
    id: 'ava',
    name: 'Ava',
    role: 'AI Hostess & Guest Relations',
    type: 'human',
    floor: 1,
    position: [-2, 0, 4],
    avatarColor: '#00f0ff',
    badge: 'AI // HOSTESS',
    dialogue: [
      'Welcome to The Apex Nexus, Commander! Notice the sun pouring across our Calacatta marble atrium? Isn’t the daylight simply invigorating?',
      'Agent Iris has banished all the oppressive dark shadows, replacing pitch-black walls with Italian marble, honey oak herringbone, and floor-to-ceiling panoramic glass mullions.',
      'Take the East Wing panoramic staircase or use your elevator deck to explore all 5 sunlit stories!',
    ],
    lore: 'Ava coordinates guest protocol and atrium concierge services, ensuring all delegates feel welcomed in this luminous architectural sanctuary.',
  },
  {
    id: 'sentrix',
    name: 'Patrol Droid Sentrix',
    role: 'Class-IV Perimeter Sentinel',
    type: 'robot',
    floor: 1,
    position: [6, 0, 7],
    avatarColor: '#38bdf8',
    badge: 'AI // PATROL DROID',
    dialogue: [
      '*BEEP-CHIRP* Commander detected! Perimeter scan nominal. Ambient lumen levels: 85,000 lux.',
      'Natural sunlight through the perimeter mullions has eliminated all optical blind spots. Solar recharge subroutines active.',
      'All security gates calibrated. Feel free to explore every story of the complex.',
    ],
    lore: 'Sentrix is an autonomous patrol android equipped with LIDAR guidance, repulsor hover stabilizers, and friendly conversational subroutines.',
  },

  // --- FLOOR 2: QUANTUM LAB ---
  {
    id: 'dr-chen',
    name: 'Dr. Chen',
    role: 'Lead Quantum Physicist',
    type: 'human',
    floor: 2,
    position: [-5, 6, 2],
    avatarColor: '#3b82f6',
    badge: 'HUMAN // QUANTUM LEAD',
    dialogue: [
      'Welcome to the Quantum Research Wing, Commander! Watch your step near the cryo containment ring.',
      'The quantum entanglement core is humming at a stable 4.2 milliKelvin. Natural sunlight stabilizes our crystalline optical sensors!',
      'Cyber-Unit 7 is currently tuning our sub-atomic laser interferometer with picometer precision.',
    ],
    lore: 'Dr. Hesper Chen pioneered the twin-qubit vacuum resonator currently powering the Apex computational lattice.',
  },
  {
    id: 'cyber-unit-7',
    name: 'Cyber-Unit 7',
    role: 'Robotic Arm / Lab Assistant',
    type: 'robot',
    floor: 2,
    position: [5, 6, -2],
    avatarColor: '#60a5fa',
    badge: 'AI // CYBER-ARM',
    dialogue: [
      '*WHIRRR-CLICK* Telemetry synchronization verified. Cryogenic containment integrity at 100.00%.',
      'Optical interferometer aligned. Focal drift: 0.0003 picometers. Laser collimation optimal.',
      'Server banks 1 through 8 operating at peak throughput under full daylight conditions.',
    ],
    lore: 'Cyber-Unit 7 is an ultra-high precision articulated cybernetic assistant capable of handling sub-micron crystalline lattices and laser alignments.',
  },

  // --- FLOOR 3: STRATEGY & ARCHIVES ---
  {
    id: 'marcus',
    name: 'Marcus',
    role: 'Executive Director',
    type: 'human',
    floor: 3,
    position: [0, 12, -4],
    avatarColor: '#f59e0b',
    badge: 'HUMAN // EXECUTIVE',
    dialogue: [
      'Commander! Take a look through these panoramic windows. You can see the horizon stretch for miles over our honey oak conference table.',
      'The honey oak parquet, brass finishes, and natural daylight create an atmosphere of transparency, confidence, and supreme focus. No more dim shadow cabals!',
      'Byte is decrypting satellite telemetry and feeding the 3D rotating pyramid projector with real-time market vectors.',
    ],
    lore: 'Marcus orchestrates planetary resources, orbital supply chains, and sovereign treaty agreements from this sunlit boardroom suite.',
  },
  {
    id: 'byte',
    name: 'Byte',
    role: 'Hovering Data Drone',
    type: 'robot',
    floor: 3,
    position: [4, 12.5, 3],
    avatarColor: '#fbbf24',
    badge: 'AI // DATA DRONE',
    dialogue: [
      '*BUZZ-CHIRP* Quantum data packets cached! 18.4 Exabytes encrypted and indexed.',
      'Archived documents: Apex Master Charter, Architectural Renovation Blueprints, and Solar Flux Graphs.',
      'Helipad sky condition: Pristine azure blue, zero cloud ceiling, perfect for airborne transit!',
    ],
    lore: 'Byte is an agile anti-gravity data drone that speeds between the digital archive stacks, fetching crystalline optical storage cores.',
  },

  // --- FLOOR 4: BOTANICAL SKY GARDEN ---
  {
    id: 'elena',
    name: 'Elena',
    role: 'Principal Botanist & Ecologist',
    type: 'human',
    floor: 4,
    position: [-4, 18, 3],
    avatarColor: '#10b981',
    badge: 'HUMAN // BOTANIST',
    dialogue: [
      'Welcome to our sanctuary, Commander! Breathe in deeply—the oxygen saturation here is 23%, infused with fresh jasmine and mountain pine.',
      'The full-spectrum sunlight flooding through the perimeter windows has doubled our photosynthetic yield!',
      'Step out onto the South balcony! It cantilevers 4 meters past the building facade with an unforgettable view of the horizon.',
    ],
    lore: 'Elena spent two decades re-engineering extinct alpine flora and designing closed-loop biomes that thrive in high-altitude vertical towers.',
  },
  {
    id: 'sprout',
    name: 'Sprout',
    role: 'Eco-Gardener Bot',
    type: 'robot',
    floor: 4,
    position: [5, 18, -3],
    avatarColor: '#34d399',
    badge: 'AI // ECO-BOT',
    dialogue: [
      '*PSSSHT-WARBLE* Soil moisture: 78%. Nitrogen balance: optimal. Leaf luster index: 10/10! Hello friend!',
      '*PFFSSSSHHHT* A cooling cloud of lavender-infused mineral vapor mists the surrounding ferns.',
      'Today I am germinating dwarf Japanese cherry blossoms and solar-reactive golden orchids for the East window sills!',
    ],
    lore: 'Sprout is a miniature tracked gardener bot with built-in moisture probes, nutrient mist nozzles, and a solar-powered compost processor.',
  },

  // --- FLOOR 5: PENTHOUSE COMMAND & SKYDECK ---
  {
    id: 'captain-vance',
    name: 'Captain Vance',
    role: 'Tactical Commander',
    type: 'human',
    floor: 5,
    position: [-3, 24, 4],
    avatarColor: '#ef4444',
    badge: 'HUMAN // TACTICAL CMDR',
    dialogue: [
      'Commander on deck! Skies are clear, horizon is visible for fifty nautical miles, and all defense grid systems are green.',
      'The panoramic glass mullions provide an uninhibited 360-degree tactical view of the horizon without needing radar interpolation.',
      'Helipad deck at Y: 30m is fully operational. Zero wind shear, beacons calibrated, VTOL launch zone ready.',
    ],
    lore: 'Captain Vance was a veteran aerospace navigator before taking command of the Apex Sky Wing. He oversees helipad flight clearances and airspace security.',
  },
  {
    id: 'nexus-9',
    name: 'Nexus-9',
    role: 'Holographic Strategic AI Core',
    type: 'robot',
    floor: 5,
    position: [3, 25.5, -2],
    avatarColor: '#f87171',
    badge: 'AI // NEXUS CORE',
    dialogue: [
      'Greetings, Supreme Commander. I am Nexus-9. All complex subsystems, daylight flux regulators, and orbital links operate in harmonious symmetry.',
      'Complex status: 5 stories fully rendered in sunlight. Structural integrity: 100%. Aesthetic rating: AAA Modern Architectural Marvel. Dark fog banished.',
      'Holographic telemetry rings active. 12 orbital communications relays linked with 1.4 millisecond latency.',
    ],
    lore: 'Nexus-9 is an ethereal holographic intelligence projected by multi-phase photon emitters above the command deck.',
  },
];

export class NPCManager {
  public npcs: NPCData[] = [];
  public group: THREE.Group;
  private nearestNPC: NPCData | null = null;
  private onNearNPCChange?: (npc: NPCData | null) => void;

  constructor(scene: THREE.Scene, onNearNPCChange?: (npc: NPCData | null) => void) {
    this.group = new THREE.Group();
    this.onNearNPCChange = onNearNPCChange;
    scene.add(this.group);

    this.createNPCMeshes();
  }

  private createNPCMeshes() {
    for (const conf of NPCS_CONFIG) {
      const npcGroup = new THREE.Group();
      npcGroup.position.set(...conf.position);

      if (conf.type === 'human') {
        this.buildHumanMesh(npcGroup, conf.avatarColor);
      } else {
        this.buildRobotMesh(npcGroup, conf.avatarColor);
      }

      this.group.add(npcGroup);

      this.npcs.push({
        ...conf,
        mesh: npcGroup,
      });
    }
  }

  private buildHumanMesh(parent: THREE.Group, accentColor: string) {
    // Stylized Sci-Fi Humanoid Body
    const colorInt = parseInt(accentColor.replace('#', '0x'), 16);

    // Torso / Suit
    const bodyGeo = new THREE.CylinderGeometry(0.28, 0.22, 0.9, 12);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x1f242d,
      roughness: 0.5,
      metalness: 0.3,
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.95;
    body.castShadow = true;
    parent.add(body);

    // Armor accent / vest
    const vestGeo = new THREE.CylinderGeometry(0.3, 0.24, 0.5, 12);
    const vestMat = new THREE.MeshStandardMaterial({
      color: colorInt,
      roughness: 0.3,
      metalness: 0.6,
    });
    const vest = new THREE.Mesh(vestGeo, vestMat);
    vest.position.y = 1.05;
    parent.add(vest);

    // Head
    const headGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const headMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24, // skin tone
      roughness: 0.7,
    });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 1.55;
    parent.add(head);

    // Hair / Helmet / Visor
    const visorGeo = new THREE.BoxGeometry(0.24, 0.08, 0.16);
    const visorMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.8,
      roughness: 0.1,
    });
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.position.set(0, 1.55, 0.1);
    parent.add(visor);

    // Legs
    const legGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.8, 8);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.8 });

    const leftLeg = new THREE.Mesh(legGeo, legMat);
    leftLeg.position.set(-0.14, 0.4, 0);
    leftLeg.castShadow = true;
    parent.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, legMat);
    rightLeg.position.set(0.14, 0.4, 0);
    rightLeg.castShadow = true;
    parent.add(rightLeg);

    // Floating Interaction Ring beacon
    const ringGeo = new THREE.RingGeometry(0.5, 0.6, 24);
    const ringMat = new THREE.MeshBasicMaterial({
      color: colorInt,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.03;
    parent.add(ring);
  }

  private buildRobotMesh(parent: THREE.Group, accentColor: string) {
    const colorInt = parseInt(accentColor.replace('#', '0x'), 16);

    // Droid Chassis
    const chassisGeo = new THREE.BoxGeometry(0.55, 0.7, 0.45);
    const chassisMat = new THREE.MeshStandardMaterial({
      color: 0x27272a,
      roughness: 0.3,
      metalness: 0.8,
    });
    const chassis = new THREE.Mesh(chassisGeo, chassisMat);
    chassis.position.y = 1.0;
    chassis.castShadow = true;
    parent.add(chassis);

    // Glowing core reactor
    const reactorGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.1, 16);
    const reactorMat = new THREE.MeshStandardMaterial({
      color: colorInt,
      emissive: colorInt,
      emissiveIntensity: 1.2,
      roughness: 0.2,
    });
    const reactor = new THREE.Mesh(reactorGeo, reactorMat);
    reactor.rotation.x = Math.PI / 2;
    reactor.position.set(0, 1.0, 0.23);
    parent.add(reactor);

    // Robot Head / Sensor Dome
    const headGeo = new THREE.BoxGeometry(0.35, 0.25, 0.32);
    const headMat = new THREE.MeshStandardMaterial({
      color: 0x3f3f46,
      metalness: 0.85,
      roughness: 0.2,
    });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 1.5;
    parent.add(head);

    // Robot Eye Visor (Cyan/Accent Bar)
    const eyeGeo = new THREE.BoxGeometry(0.28, 0.06, 0.06);
    const eyeMat = new THREE.MeshBasicMaterial({
      color: colorInt,
    });
    const eye = new THREE.Mesh(eyeGeo, eyeMat);
    eye.position.set(0, 1.5, 0.17);
    parent.add(eye);

    // Hover Repulsor Base / Tread
    const baseGeo = new THREE.CylinderGeometry(0.28, 0.32, 0.3, 16);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      metalness: 0.7,
      roughness: 0.4,
    });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.35;
    parent.add(base);

    // Floating Interaction Ring beacon
    const ringGeo = new THREE.RingGeometry(0.55, 0.65, 24);
    const ringMat = new THREE.MeshBasicMaterial({
      color: colorInt,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.03;
    parent.add(ring);
  }

  public update(playerPos: THREE.Vector3, elapsed: number) {
    let closest: NPCData | null = null;
    let minDistance = Infinity;

    for (const npc of this.npcs) {
      if (!npc.mesh) continue;

      // Micro idle breathing / hover animation
      if (npc.type === 'robot') {
        npc.mesh.position.y = npc.position[1] + Math.sin(elapsed * 2.5 + npc.floor) * 0.05;
      }

      // Check distance to player
      const dx = playerPos.x - npc.mesh.position.x;
      const dy = playerPos.y - (npc.mesh.position.y + 1.2);
      const dz = playerPos.z - npc.mesh.position.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      npc.distance = dist;

      // Make NPC turn towards player when within 8m
      if (dist < 8.0) {
        const angle = Math.atan2(dx, dz);
        npc.mesh.rotation.y = angle;
      }

      // Interaction trigger threshold: 3.5m
      if (dist <= 3.5 && dist < minDistance) {
        minDistance = dist;
        closest = npc;
      }
    }

    if (closest !== this.nearestNPC) {
      this.nearestNPC = closest;
      this.onNearNPCChange?.(closest);
    }
  }

  public getNearestNPC(): NPCData | null {
    return this.nearestNPC;
  }
}
