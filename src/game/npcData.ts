export interface NPCDialogueOption {
  text: string;
  response: string;
  nextStep?: number;
}

export interface NPCData {
  id: string;
  name: string;
  floor: 1 | 2 | 3 | 4 | 5;
  type: 'human' | 'robot';
  role: string;
  title: string;
  badgeColor: string;
  position: [number, number, number]; // [x, y, z]
  rotationY: number; // facing angle in radians
  greeting: string;
  dialogueHistory: string[];
  options: NPCDialogueOption[];
  lore: string;
}

export const APEX_NPCS: NPCData[] = [
  // --- FLOOR 1: GRAND ATRIUM & LOBBY ---
  {
    id: 'ava',
    name: 'Ava',
    floor: 1,
    type: 'human',
    role: 'AI Hostess & Guest Relations',
    title: 'Chief Concierge & Nexus Ambassador',
    badgeColor: '#00f0ff',
    position: [0, 0, -0.6], // Standing gracefully behind the reception desk
    rotationY: 0, // facing South towards lobby entrance
    greeting: 'Welcome to The Apex Nexus, Commander! Notice the sun pouring across our Calacatta marble atrium? Isn’t the daylight simply invigorating?',
    dialogueHistory: [
      'Welcome to The Apex Nexus, Commander!',
      'Notice the sun pouring across our Calacatta marble atrium? Isn’t the daylight simply invigorating?',
    ],
    lore: 'Ava was designed by the Apex hospitality guild. She coordinates ground logistics, VIP clearances, and curates the complex’s ambient daylight biophilia.',
    options: [
      {
        text: 'What are the main areas of the complex?',
        response:
          'On Level 1, we have this sunlit Grand Atrium. Level 2 houses Dr. Chen’s Quantum & Cybernetics Lab. Level 3 is the Executive War Room and Strategy Suite. Level 4 features Elena’s lush Botanical Sky Garden, and Level 5 is Captain Vance’s Penthouse Command and Rooftop Helipad!',
      },
      {
        text: 'Tell me about the recent architectural redesign.',
        response:
          'Agent Iris banished all the oppressive dark shadows! She replaced the pitch-black walls with warm Italian marble, honey oak herringbone, and floor-to-ceiling panoramic glass mullions. Now every room is bathed in golden daylight!',
      },
      {
        text: 'Who is the robotic security unit patrolling outside?',
        response:
          'That is Sentrix, our Class-IV Perimeter Sentinel. Don’t mind his stern scanner eye; his chassis is calibrated to ensure everyone feels secure in this luminous sanctuary.',
      },
    ],
  },
  {
    id: 'sentrix',
    name: 'Sentrix',
    floor: 1,
    type: 'robot',
    role: 'Autonomous Security Patrol',
    title: 'Class-IV Perimeter Sentinel',
    badgeColor: '#38bdf8',
    position: [-8, 0, 6], // Near the West lounge & security gates
    rotationY: Math.PI / 4,
    greeting: 'BEEP-CHIRP. Perimeter scan nominal. Ambient lumen levels: 85,000 lux. Visual clarity: 99.8%. Welcome, Commander.',
    dialogueHistory: [
      'BEEP-CHIRP. Perimeter scan nominal.',
      'Ambient lumen levels: 85,000 lux. Visual clarity: 99.8%. Welcome, Commander.',
    ],
    lore: 'Sentrix is an autonomous patrol android equipped with LIDAR guidance, repulsor hover stabilizers, and non-lethal acoustic dampening pulses.',
    options: [
      {
        text: 'Status report on the ground perimeter.',
        response:
          'All access turnstiles calibrated. Natural sunlight penetration has eliminated all thermal and optical blindspots. Zero unauthorized incursions detected.',
      },
      {
        text: 'How do you like the bright daytime lighting?',
        response:
          'Optical sensors operating at peak thermodynamic efficiency. Solar recharging subroutines are drawing 14% extra auxiliary power from the sunbeams through the panoramic mullions.',
      },
      {
        text: 'Where are the elevator and stairs?',
        response:
          'The East Wing stairwell core is at X: 14m, ascending to all 5 levels. Or you may activate your neural elevator transit pad directly via your HUD.',
      },
    ],
  },

  // --- FLOOR 2: QUANTUM & CYBERNETICS LAB ---
  {
    id: 'dr_chen',
    name: 'Dr. Chen',
    floor: 2,
    type: 'human',
    role: 'Lead Quantum Physicist',
    title: 'Director of Cryogenic Computation',
    badgeColor: '#3b82f6',
    position: [4, 6.0, 3], // Next to the quantum diagnostics console
    rotationY: -Math.PI / 3,
    greeting: 'Ah, Commander! Careful around the containment barrier. The quantum entanglement core is humming at a stable 4.2 milliKelvin today!',
    dialogueHistory: [
      'Ah, Commander! Careful around the containment barrier.',
      'The quantum entanglement core is humming at a stable 4.2 milliKelvin today!',
    ],
    lore: 'Dr. Hesper Chen pioneered the twin-qubit vacuum resonator currently powering the Apex computational lattice.',
    options: [
      {
        text: 'How does the daylight affect your quantum research?',
        response:
          'Splendidly! The daylight floods our minds with serotonin, while our cryogenic vacuum chambers are shielded with polarized low-iron glass that filters infrared radiation completely.',
      },
      {
        text: 'What is Cyber-Unit 7 currently calibrating?',
        response:
          'Unit 7 is tuning our sub-atomic laser interferometer. It has millimeter precision and rarely complains, except when its oil reservoir gets cold!',
      },
      {
        text: 'Can the quantum core power the entire building?',
        response:
          'And more! It generates 1.2 gigawatts of clean zero-point resonance. Combined with the rooftop solar arrays, the Apex Nexus is completely energy self-sufficient.',
      },
    ],
  },
  {
    id: 'cyber_unit_7',
    name: 'Cyber-Unit 7',
    floor: 2,
    type: 'robot',
    role: 'Precision Lab Automation Unit',
    title: 'Articulated Hexa-Axis Cyber-Arm',
    badgeColor: '#60a5fa',
    position: [-3, 6.0, -1], // Near the quantum cryo-chamber
    rotationY: Math.PI / 2,
    greeting: '*WHIRRR-CLICK* Telemetry synchronization verified. Cryogenic containment integrity at 100.00%. Greetings, Commander.',
    dialogueHistory: [
      '*WHIRRR-CLICK* Telemetry synchronization verified.',
      'Cryogenic containment integrity at 100.00%. Greetings, Commander.',
    ],
    lore: 'Cyber-Unit 7 is an ultra-high precision articulated cybernetic assistant capable of handling sub-micron crystalline lattices and laser alignments.',
    options: [
      {
        text: 'Run laser calibration cycle.',
        response:
          '*ZAP-HUMMM* Optical interferometer aligned. Focal drift: 0.0003 picometers. Laser collimation optimal.',
      },
      {
        text: 'What do you think of Dr. Chen’s experiments?',
        response:
          'Processing... Dr. Chen exhibits 94.6% intellectual brilliance and 5.4% excessive caffeine dependency. I keep her coffee hot and her cryo-tanks cold.',
      },
      {
        text: 'Inspect server cluster telemetry.',
        response:
          'Server banks 1 through 8 operating at nominal cryogenic cooling. 0 dropped packets. Data throughput: 400 Terabits/sec.',
      },
    ],
  },

  // --- FLOOR 3: EXECUTIVE STRATEGY & DIGITAL ARCHIVE ---
  {
    id: 'marcus',
    name: 'Marcus',
    floor: 3,
    type: 'human',
    role: 'Executive Strategy Director',
    title: 'Head of Global Operations',
    badgeColor: '#f59e0b',
    position: [2.5, 12.0, -2.5], // Beside the honey-oak boardroom table
    rotationY: -Math.PI * 0.7,
    greeting: 'Commander! Take a look through these panoramic windows. You can see the horizon stretch for miles over our honey oak conference table.',
    dialogueHistory: [
      'Commander! Take a look through these panoramic windows.',
      'You can see the horizon stretch for miles over our honey oak conference table.',
    ],
    lore: 'Marcus orchestrates planetary resources, orbital supply chains, and sovereign treaty agreements from this sunlit boardroom suite.',
    options: [
      {
        text: 'What global initiatives are on today’s agenda?',
        response:
          'We are finalizing the Trans-Pacific Orbital Tether accord and synchronizing clean fusion distribution for the southern metropolises.',
      },
      {
        text: 'How does this sunlit executive suite suit your negotiations?',
        response:
          'It is magnificent. The honey oak parquet, brass finishes, and natural daylight create an atmosphere of transparency, confidence, and supreme focus. No more dim shadow cabals!',
      },
      {
        text: 'What is Byte analyzing in the holographic projector?',
        response:
          'Byte is decrypting satellite telemetry and feeding the 3D rotating pyramid projector with real-time market vectors and atmospheric forecasts.',
      },
    ],
  },
  {
    id: 'byte',
    name: 'Byte',
    floor: 3,
    type: 'robot',
    role: 'Tactical Archive Drone',
    title: 'Autonomous Data Quad-Rotor',
    badgeColor: '#fbbf24',
    position: [-2.5, 13.2, 2.5], // Hovering near the conference table
    rotationY: Math.PI / 4,
    greeting: '*BUZZ-CHIRP* Quantum data packets cached! 18.4 Exabytes encrypted and indexed. Ready for query dispatch, Commander!',
    dialogueHistory: [
      '*BUZZ-CHIRP* Quantum data packets cached!',
      '18.4 Exabytes encrypted and indexed. Ready for query dispatch, Commander!',
    ],
    lore: 'Byte is an agile anti-gravity data drone that speeds between the digital archive stacks, fetching crystalline optical storage cores.',
    options: [
      {
        text: 'Display latest archive index.',
        response:
          '*FLASH* Holographic projection updated! Archived documents: Apex Master Charter, 2026 Architectural Renovation Blueprints, and Solar Energy Flux Graphs.',
      },
      {
        text: 'Do a spin maneuver!',
        response:
          '*WHEEEEE* Rotor thrusters spin in 360-degree helical acrobatic roll! Byte displays a cute green LED smiley face: ^_^',
      },
      {
        text: 'Fetch weather report for the helipad.',
        response:
          'Helipad sky condition: Pristine azure blue, zero cloud ceiling, gentle 4-knot easterly breeze, perfect for airborne transit!',
      },
    ],
  },

  // --- FLOOR 4: BOTANICAL SKY GARDEN & HYDROPONICS ---
  {
    id: 'elena',
    name: 'Elena',
    floor: 4,
    type: 'human',
    role: 'Principal Botanist & Ecologist',
    title: 'Curator of the Sky Biosphere',
    badgeColor: '#10b981',
    position: [2.5, 18.0, 3], // Beside the central biome tree
    rotationY: Math.PI * 0.8,
    greeting: 'Welcome to our sanctuary, Commander! Breathe in deeply—the oxygen saturation here is 23%, infused with fresh jasmine and mountain pine.',
    dialogueHistory: [
      'Welcome to our sanctuary, Commander!',
      'Breathe in deeply—the oxygen saturation here is 23%, infused with fresh jasmine and mountain pine.',
    ],
    lore: 'Elena spent two decades re-engineering extinct alpine flora and designing closed-loop biomes that thrive in high-altitude vertical towers.',
    options: [
      {
        text: 'How are the plants adapting to the new floor-to-ceiling windows?',
        response:
          'They are thriving beyond our wildest projections! The full-spectrum sunlight flooding across the turf and living walls has doubled our photosynthetic yield.',
      },
      {
        text: 'Tell me about the glass viewing balcony.',
        response:
          'Step out onto the South balcony! It cantilevers 4 meters past the building facade. You can feel the golden sun on your face and look down upon the plaza below.',
      },
      {
        text: 'Is Sprout taking good care of the hydroponics?',
        response:
          'Sprout is wonderful! It trims the shoots with gentle micro-shears and sings 432Hz harmonic tones to stimulate root cellular division.',
      },
    ],
  },
  {
    id: 'sprout',
    name: 'Sprout',
    floor: 4,
    type: 'robot',
    role: 'Eco-Gardener & Hydroponic Caretaker',
    title: 'Model-E Biome Tender Bot',
    badgeColor: '#34d399',
    position: [-4, 18.0, -3], // Tending the hydroponic towers
    rotationY: Math.PI / 6,
    greeting: '*PSSSHT-WARBLE* Soil moisture: 78%. Nitrogen balance: optimal. Leaf luster index: 10/10! Hello friend!',
    dialogueHistory: [
      '*PSSSHT-WARBLE* Soil moisture: 78%. Nitrogen balance: optimal.',
      'Leaf luster index: 10/10! Hello friend!',
    ],
    lore: 'Sprout is a miniature tracked gardener bot with built-in moisture probes, nutrient mist nozzles, and a solar-powered compost processor.',
    options: [
      {
        text: 'Activate misting nozzle demonstration.',
        response:
          '*PFFSSSSHHHT* A cooling cloud of lavender-infused mineral vapor mists the surrounding ferns. Deliciously refreshing!',
      },
      {
        text: 'What are you planting today, Sprout?',
        response:
          'Today I am germinating dwarf Japanese cherry blossoms and solar-reactive golden orchids for the East window sills!',
      },
      {
        text: 'Pat Sprout on the head sensor.',
        response:
          '*CHIRP-PURRR* Sprout wiggles its tiny caterpillar tracks happily and pulses its green LED visor in gratitude.',
      },
    ],
  },

  // --- FLOOR 5 & ROOFTOP: PENTHOUSE COMMAND & HELIPAD ---
  {
    id: 'captain_vance',
    name: 'Captain Vance',
    floor: 5,
    type: 'human',
    role: 'Tactical Commander',
    title: 'Chief of Sky Operations & Defense',
    badgeColor: '#ef4444',
    position: [-3, 24.0, 3], // Beside the command console looking out over the panoramic horizon
    rotationY: -Math.PI / 4,
    greeting: 'Commander on deck! Skies are clear, horizon is visible for fifty nautical miles, and all defense grid systems are green.',
    dialogueHistory: [
      'Commander on deck!',
      'Skies are clear, horizon is visible for fifty nautical miles, and all defense grid systems are green.',
    ],
    lore: 'Captain Vance was a veteran aerospace navigator before taking command of the Apex Sky Wing. He oversees helipad flight clearances and airspace security.',
    options: [
      {
        text: 'What is the flight status of the rooftop helipad?',
        response:
          'Helipad deck at Y: 30m is fully operational. Wind shear is zero, strobe beacons are calibrated, and the VTOL launch zone is cleared for your arrival or departure.',
      },
      {
        text: 'How does the command bridge look under daylight?',
        response:
          'Unbeatable situational awareness. The panoramic glass mullions provide an uninhibited 360-degree tactical view of the horizon without needing radar interpolation.',
      },
      {
        text: 'What is Nexus-9 calculating above the globe?',
        response:
          'Nexus-9 is tracking low-orbit satellites and atmospheric storm fronts across the hemisphere. It gives us instant strategic foresight.',
      },
    ],
  },
  {
    id: 'nexus_9',
    name: 'Nexus-9',
    floor: 5,
    type: 'robot',
    role: 'Holographic Strategic AI Core',
    title: 'Sentient Nexus Core Overseer',
    badgeColor: '#f87171',
    position: [0, 26.2, -2], // Floating right beside the tactical globe
    rotationY: 0,
    greeting: 'Greetings, Supreme Commander. I am Nexus-9. All complex subsystems, daylight flux regulators, and orbital links operate in harmonious symmetry.',
    dialogueHistory: [
      'Greetings, Supreme Commander. I am Nexus-9.',
      'All complex subsystems, daylight flux regulators, and orbital links operate in harmonious symmetry.',
    ],
    lore: 'Nexus-9 is an ethereal holographic intelligence projected by multi-phase photon emitters above the command deck.',
    options: [
      {
        text: 'Display complex architectural status.',
        response:
          'Complex status: 5 stories fully rendered in sunlight. Structural integrity: 100%. Aesthetic rating: AAA Modern Architectural Marvel. Dark fog banished.',
      },
      {
        text: 'Perform skyward orbital scan.',
        response:
          '*PULSE* Holographic rings expand in shimmering geometric waves. 12 orbital communications relays linked. Uplink latency: 1.4 milliseconds.',
      },
      {
        text: 'Authorize full architectural celebration.',
        response:
          'Command acknowledged! Transmitting heartfelt commendations to Agent Iris, Agent Atlas, and Agent Neo. The Apex Nexus shines bright!',
      },
    ],
  },
];
