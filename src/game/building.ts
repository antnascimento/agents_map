import * as THREE from 'three';
import { createPalette, MaterialPalette } from './materials';
import { FloorInfo, FloorLevel, BuildingColliders, NPCData } from './types';

export interface BuildingData {
  group: THREE.Group;
  floorColliders: THREE.Mesh[];
  rampColliders: THREE.Mesh[];
  wallColliders: THREE.Box3[];
  colliders: BuildingColliders;
  floors: FloorInfo[];
  rooftopSpawn: [number, number, number];
  npcs: NPCData[];
  update: (delta: number, elapsed: number) => void;
}

export const ROOFTOP_SPAWN: [number, number, number] = [0, 31.7, 0];

export const FLOOR_DEFINITIONS: FloorInfo[] = [
  {
    level: 1,
    name: 'Story 1: Sunlit Grand Atrium & Lobby',
    subtitle: 'Calacatta marble, champagne brass fluted columns, panoramic glass & concierge',
    elevationRange: [0, 6],
    spawnPosition: [0, 1.7, 12],
    color: '#00f3ff',
  },
  {
    level: 2,
    name: 'Story 2: Quantum & Cybernetics Lab',
    subtitle: 'Cryogenic quantum core, daylight research suites, transparent glass consoles',
    elevationRange: [6, 12],
    spawnPosition: [0, 7.7, 0],
    color: '#3b82f6',
  },
  {
    level: 3,
    name: 'Story 3: Executive Strategy & Archives',
    subtitle: 'Warm honey oak parquet, champagne brass conference table & data vaults',
    elevationRange: [12, 18],
    spawnPosition: [0, 13.7, 0],
    color: '#f59e0b',
  },
  {
    level: 4,
    name: 'Story 4: Botanical Sky Garden',
    subtitle: 'Biophilic daylight conservatory, living walls, tropical planters & viewing balcony',
    elevationRange: [18, 24],
    spawnPosition: [0, 19.7, 0],
    color: '#10b981',
  },
  {
    level: 5,
    name: 'Story 5: Penthouse Command & Helipad',
    subtitle: 'Panoramic command bridge, holographic tactical globe & sunlit rooftop helipad',
    elevationRange: [24, 34],
    spawnPosition: [0, 25.7, 0],
    color: '#ef4444',
  },
];

export const DEFAULT_NPCS: NPCData[] = [
  {
    id: 'npc-1',
    name: 'Elena Vance',
    role: 'Chief Concierge & Host',
    type: 'human',
    floor: 1,
    position: [0, 0, 4],
    dialogue: [
      'Welcome to The Apex Nexus! Bathed in morning light today, isn’t it?',
      'Please explore our 5 stories—each represents a unique facet of our innovation hub.',
      'Take the East Wing panoramic glass stairwell or the express elevator panel to ascend!',
    ],
    lore: 'Chief Concierge overseeing welcoming protocols and VIP relations.',
    avatarColor: '#d6b265',
    badge: 'CONCIERGE',
  },
  {
    id: 'npc-2',
    name: 'Dr. Aris Thorne',
    role: 'Quantum Lead Scientist',
    type: 'human',
    floor: 2,
    position: [4, 6, 2],
    dialogue: [
      'Welcome to the Quantum Research Wing. Notice how natural light stabilizes our crystalline lattice!',
      'The central Quantum Core is operating at 99.8% coherence today.',
      'Feel free to inspect the diagnostic pods and holographic quantum rings.',
    ],
    lore: 'Directs the experimental quantum core and algorithmic simulation grid.',
    avatarColor: '#38bdf8',
    badge: 'RESEARCH',
  },
  {
    id: 'npc-3',
    name: 'Victoria Sterling',
    role: 'Chief Strategy Officer',
    type: 'human',
    floor: 3,
    position: [2, 12, 3],
    dialogue: [
      'Welcome to Executive Operations. The warm honey oak provides an inspiring setting for strategic decisions.',
      'Our holographic War Table is currently mapping transatlantic logistics networks.',
      'The digital archives to the west contain our core institutional repositories.',
    ],
    lore: 'Orchestrates geopolitical strategies and high-level institutional governance.',
    avatarColor: '#f59e0b',
    badge: 'STRATEGY',
  },
  {
    id: 'npc-4',
    name: 'Rowan Lin',
    role: 'Master Biome Architect',
    type: 'human',
    floor: 4,
    position: [-3, 18, 2],
    dialogue: [
      'Take a deep breath! The oxygen levels here in our Sky Garden are pristine.',
      'The floor-to-ceiling daylight fosters our rare biophilic ferns and vertical hydroponic arrays.',
      'Don’t miss the south viewing balcony—the view across the horizon is breathtaking.',
    ],
    lore: 'Oversees the botanical conservatory, hydroponics, and living architecture.',
    avatarColor: '#10b981',
    badge: 'BOTANY',
  },
  {
    id: 'npc-5',
    name: 'Captain Jaxson',
    role: 'Flight & Defense Marshall',
    type: 'human',
    floor: 5,
    position: [0, 24, 2],
    dialogue: [
      'Welcome to the Apex Penthouse Command Bridge, Commander!',
      'All rooftop aviation beacons are calibrated and the helipad is clear for arrival.',
      'The tactical wireframe globe indicates all orbital satellites are locked in sync.',
    ],
    lore: 'Commands the rooftop aerospace deck and perimeter defense sensors.',
    avatarColor: '#ef4444',
    badge: 'COMMAND',
  },
];

export function build5StoryBuilding(): BuildingData {
  const root = new THREE.Group();
  const palette = createPalette();

  const floorColliders: THREE.Mesh[] = [];
  const rampColliders: THREE.Mesh[] = [];
  const wallColliders: THREE.Box3[] = [];

  const animatedObjects: {
    quantumRings: THREE.Group;
    quantumCore: THREE.Mesh;
    holoProjector: THREE.Mesh;
    commandGlobe: THREE.Mesh;
    beaconLights: THREE.PointLight[];
    npcRings: THREE.Mesh[];
  } = {
    quantumRings: new THREE.Group(),
    quantumCore: new THREE.Mesh(),
    holoProjector: new THREE.Mesh(),
    commandGlobe: new THREE.Mesh(),
    beaconLights: [],
    npcRings: [],
  };

  const BUILDING_WIDTH = 40;
  const BUILDING_DEPTH = 40;
  const HALF_W = BUILDING_WIDTH / 2;
  const HALF_D = BUILDING_DEPTH / 2;
  const FLOOR_HEIGHT = 6;
  const SLAB_THICKNESS = 0.4;

  // --- 1. LUSH DAYLIGHT EXTERIOR LANDSCAPE ---
  // Manicured Emerald Lawn Ground
  const lawnGeo = new THREE.PlaneGeometry(160, 160);
  const lawnMat = new THREE.MeshStandardMaterial({
    color: 0x3f9e4d,
    roughness: 0.85,
    metalness: 0.05,
  });
  const lawn = new THREE.Mesh(lawnGeo, lawnMat);
  lawn.rotation.x = -Math.PI / 2;
  lawn.receiveShadow = true;
  root.add(lawn);

  // Exterior Sunny Travertine Plaza with Warm Stone Pavers
  const plazaGeo = new THREE.BoxGeometry(68, 0.25, 68);
  const plaza = new THREE.Mesh(plazaGeo, palette.travertinePlaza);
  plaza.position.set(0, -0.12, 0);
  plaza.receiveShadow = true;
  root.add(plaza);

  // Decorative Reflection Water Basin in Front Plaza
  const pondGeo = new THREE.BoxGeometry(18, 0.2, 8);
  const pondWaterMat = new THREE.MeshPhysicalMaterial({
    color: 0x60a5fa,
    transparent: true,
    opacity: 0.85,
    roughness: 0.05,
    transmission: 0.8,
  });
  const pond = new THREE.Mesh(pondGeo, pondWaterMat);
  pond.position.set(0, 0.05, 26);
  root.add(pond);

  // Travertine curb around reflection pond
  const curbGeo = new THREE.BoxGeometry(19, 0.35, 9);
  const curbMat = palette.champagneBrass;
  const curb = new THREE.Mesh(curbGeo, curbMat);
  curb.position.set(0, 0.02, 26);
  root.add(curb);

  // Landscape Palm / Shade Trees around the Plaza
  const treeOffsets = [
    [-24, 0, 22],
    [24, 0, 22],
    [-26, 0, -22],
    [26, 0, -22],
    [-26, 0, 0],
    [26, 0, 0],
  ];
  treeOffsets.forEach(([tx, ty, tz]) => {
    // Tree Trunk
    const tTrunkGeo = new THREE.CylinderGeometry(0.35, 0.5, 4.5, 10);
    const tTrunkMat = new THREE.MeshStandardMaterial({ color: 0x5a3e28, roughness: 0.8 });
    const tTrunk = new THREE.Mesh(tTrunkGeo, tTrunkMat);
    tTrunk.position.set(tx, 2.25, tz);
    tTrunk.castShadow = true;
    root.add(tTrunk);

    // Tree Foliage Canopy
    const tCanopyGeo = new THREE.DodecahedronGeometry(2.2);
    const tCanopy = new THREE.Mesh(tCanopyGeo, palette.vibrantFoliage);
    tCanopy.position.set(tx, 4.8, tz);
    tCanopy.castShadow = true;
    root.add(tCanopy);

    // Stone planter box
    const tPlanterGeo = new THREE.CylinderGeometry(1.4, 1.4, 0.6, 16);
    const tPlanter = new THREE.Mesh(tPlanterGeo, palette.travertinePlaza);
    tPlanter.position.set(tx, 0.3, tz);
    root.add(tPlanter);
  });

  // --- 2. PERIMETER WALL BOUNDS & PANORAMIC STRUCTURAL MULLIONS ---
  const wallThickness = 0.8;
  const totalHeight = 30.0;

  // North wall boundary collider
  wallColliders.push(
    new THREE.Box3(
      new THREE.Vector3(-HALF_W, 0, -HALF_D - wallThickness),
      new THREE.Vector3(HALF_W, totalHeight, -HALF_D)
    )
  );
  // South wall boundary collider
  wallColliders.push(
    new THREE.Box3(
      new THREE.Vector3(-HALF_W, 0, HALF_D),
      new THREE.Vector3(HALF_W, totalHeight, HALF_D + wallThickness)
    )
  );
  // West wall boundary collider
  wallColliders.push(
    new THREE.Box3(
      new THREE.Vector3(-HALF_W - wallThickness, 0, -HALF_D),
      new THREE.Vector3(-HALF_W, totalHeight, HALF_D)
    )
  );
  // East wall boundary collider
  wallColliders.push(
    new THREE.Box3(
      new THREE.Vector3(HALF_W, 0, -HALF_D),
      new THREE.Vector3(HALF_W + wallThickness, totalHeight, HALF_D)
    )
  );

  // --- PANORAMIC FLOOR-TO-CEILING GLASS FACADE & CHAMPAGNE BRASS MULLIONS ---
  // Vertical structural mullions spaced every 4 meters along all 4 facades
  const mullionGeo = new THREE.BoxGeometry(0.25, totalHeight, 0.25);
  for (let offset = -HALF_W; offset <= HALF_W; offset += 4) {
    // North & South facade mullions
    const mulNorth = new THREE.Mesh(mullionGeo, palette.mullionMaterial);
    mulNorth.position.set(offset, totalHeight / 2, -HALF_D);
    root.add(mulNorth);

    const mulSouth = new THREE.Mesh(mullionGeo, palette.mullionMaterial);
    mulSouth.position.set(offset, totalHeight / 2, HALF_D);
    root.add(mulSouth);

    // East & West facade mullions
    const mulWest = new THREE.Mesh(mullionGeo, palette.mullionMaterial);
    mulWest.position.set(-HALF_W, totalHeight / 2, offset);
    root.add(mulWest);

    const mulEast = new THREE.Mesh(mullionGeo, palette.mullionMaterial);
    mulEast.position.set(HALF_W, totalHeight / 2, offset);
    root.add(mulEast);
  }

  // Horizontal Champagne Brass Spandrel Bands at each floor slab elevation
  [6, 12, 18, 24, 30].forEach((elev) => {
    const spandrelGeoX = new THREE.BoxGeometry(BUILDING_WIDTH + 0.4, 0.45, 0.3);
    const spandrelN = new THREE.Mesh(spandrelGeoX, palette.champagneBrass);
    spandrelN.position.set(0, elev, -HALF_D);
    root.add(spandrelN);

    const spandrelS = new THREE.Mesh(spandrelGeoX, palette.champagneBrass);
    spandrelS.position.set(0, elev, HALF_D);
    root.add(spandrelS);

    const spandrelGeoZ = new THREE.BoxGeometry(0.3, 0.45, BUILDING_DEPTH + 0.4);
    const spandrelW = new THREE.Mesh(spandrelGeoZ, palette.champagneBrass);
    spandrelW.position.set(-HALF_W, elev, 0);
    root.add(spandrelW);

    const spandrelE = new THREE.Mesh(spandrelGeoZ, palette.champagneBrass);
    spandrelE.position.set(HALF_W, elev, 0);
    root.add(spandrelE);
  });

  // Floor-to-Ceiling Ultra-Clear Glass Curtain Walls for every story
  for (let s = 0; s < 5; s++) {
    const floorY = s * FLOOR_HEIGHT + FLOOR_HEIGHT / 2;
    const glassGlassH = FLOOR_HEIGHT - 0.4;

    // North Glass
    const gGeoX = new THREE.BoxGeometry(BUILDING_WIDTH - 0.2, glassGlassH, 0.08);
    const gNorth = new THREE.Mesh(gGeoX, palette.panoramicGlass);
    gNorth.position.set(0, floorY, -HALF_D);
    root.add(gNorth);

    // South Glass
    const gSouth = new THREE.Mesh(gGeoX, palette.panoramicGlass);
    gSouth.position.set(0, floorY, HALF_D);
    root.add(gSouth);

    // West Glass
    const gGeoZ = new THREE.BoxGeometry(0.08, glassGlassH, BUILDING_DEPTH - 0.2);
    const gWest = new THREE.Mesh(gGeoZ, palette.panoramicGlass);
    gWest.position.set(-HALF_W, floorY, 0);
    root.add(gWest);

    // East Glass (stairwell side panoramic view)
    const gEast = new THREE.Mesh(gGeoZ, palette.panoramicGlass);
    gEast.position.set(HALF_W, floorY, 0);
    root.add(gEast);
  }

  // Helper to create a floor slab with an opening for the stairwell core
  // Stairwell bounds: X in [11.5, 18.5], Z in [-6.5, 6.5]
  function createFloorWithStairOpening(y: number, mat: THREE.Material): THREE.Mesh[] {
    const meshes: THREE.Mesh[] = [];
    const slabH = SLAB_THICKNESS;

    // Section 1: Main West & Center area: X: [-20, 11.5], Z: [-20, 20]
    const w1 = 31.5;
    const geo1 = new THREE.BoxGeometry(w1, slabH, 40);
    const m1 = new THREE.Mesh(geo1, mat);
    m1.position.set(-20 + w1 / 2, y - slabH / 2, 0);
    m1.receiveShadow = true;
    root.add(m1);
    meshes.push(m1);

    // Section 2: East North wing: X: [11.5, 20], Z: [-20, -6.5]
    const w2 = 8.5;
    const d2 = 13.5;
    const geo2 = new THREE.BoxGeometry(w2, slabH, d2);
    const m2 = new THREE.Mesh(geo2, mat);
    m2.position.set(11.5 + w2 / 2, y - slabH / 2, -20 + d2 / 2);
    m2.receiveShadow = true;
    root.add(m2);
    meshes.push(m2);

    // Section 3: East South wing: X: [11.5, 20], Z: [6.5, 20]
    const d3 = 13.5;
    const geo3 = new THREE.BoxGeometry(w2, slabH, d3);
    const m3 = new THREE.Mesh(geo3, mat);
    m3.position.set(11.5 + w2 / 2, y - slabH / 2, 6.5 + d3 / 2);
    m3.receiveShadow = true;
    root.add(m3);
    meshes.push(m3);

    return meshes;
  }

  // --- HELPER: POTTED PLANTS FOR LUXURY INTERIOR VIBES ---
  function addPottedPlant(x: number, y: number, z: number, scale = 1.0) {
    const potGeo = new THREE.CylinderGeometry(0.45 * scale, 0.35 * scale, 0.8 * scale, 16);
    const pot = new THREE.Mesh(potGeo, palette.planterCeramic);
    pot.position.set(x, y + 0.4 * scale, z);
    pot.castShadow = true;
    root.add(pot);

    const soilGeo = new THREE.CylinderGeometry(0.42 * scale, 0.42 * scale, 0.1 * scale, 16);
    const soilMat = new THREE.MeshStandardMaterial({ color: 0x2b1d14, roughness: 0.9 });
    const soil = new THREE.Mesh(soilGeo, soilMat);
    soil.position.set(x, y + 0.78 * scale, z);
    root.add(soil);

    // Foliage Fronds
    const plantGeo = new THREE.DodecahedronGeometry(0.75 * scale, 1);
    const plant = new THREE.Mesh(plantGeo, palette.vibrantFoliage);
    plant.position.set(x, y + 1.25 * scale, z);
    plant.castShadow = true;
    root.add(plant);
  }

  // --- STORY 1: SUNLIT GRAND ATRIUM & LOBBY (Y: 0 - 6m) ---
  // Luminous Calacatta Marble Floor Slab
  const f1SlabGeo = new THREE.BoxGeometry(BUILDING_WIDTH, SLAB_THICKNESS, BUILDING_DEPTH);
  const f1Slab = new THREE.Mesh(f1SlabGeo, palette.calacattaMarble);
  f1Slab.position.set(0, -SLAB_THICKNESS / 2, 0);
  f1Slab.receiveShadow = true;
  root.add(f1Slab);
  floorColliders.push(f1Slab);

  // Champagne Brass Fluted Monolithic Columns
  const colGeo = new THREE.CylinderGeometry(0.65, 0.65, 5.6, 24);
  const colPositions = [
    [-8, 2.8, -8],
    [8, 2.8, -8],
    [-8, 2.8, 8],
    [8, 2.8, 8],
    [-14, 2.8, 0],
    [14, 2.8, 0],
  ];
  colPositions.forEach(([cx, cy, cz]) => {
    const col = new THREE.Mesh(colGeo, palette.champagneBrass);
    col.position.set(cx, cy, cz);
    col.castShadow = true;
    root.add(col);

    // Warm vertical accent glow runner
    const stripGeo = new THREE.BoxGeometry(0.06, 5.2, 0.06);
    const strip = new THREE.Mesh(stripGeo, palette.emissiveAmber);
    strip.position.set(cx, cy, cz + 0.68);
    root.add(strip);

    wallColliders.push(
      new THREE.Box3(
        new THREE.Vector3(cx - 0.7, cy - 2.8, cz - 0.7),
        new THREE.Vector3(cx + 0.7, cy + 2.8, cz + 0.7)
      )
    );
  });

  // Story 1 White Quartz & Champagne Brass Reception Desk
  const deskGeo = new THREE.BoxGeometry(8, 1.1, 2.2);
  const deskMat = palette.calacattaMarble;
  const desk = new THREE.Mesh(deskGeo, deskMat);
  desk.position.set(0, 0.55, -2);
  desk.castShadow = true;
  root.add(desk);

  // Champagne brass trim on reception desk
  const deskTrimGeo = new THREE.BoxGeometry(8.1, 0.08, 2.3);
  const deskTrim = new THREE.Mesh(deskTrimGeo, palette.champagneBrass);
  deskTrim.position.set(0, 1.1, -2);
  root.add(deskTrim);

  // Recessed warm golden base glow
  const deskGlowGeo = new THREE.BoxGeometry(8.1, 0.08, 2.3);
  const deskGlow = new THREE.Mesh(deskGlowGeo, palette.emissiveAmber);
  deskGlow.position.set(0, 0.04, -2);
  root.add(deskGlow);

  wallColliders.push(
    new THREE.Box3(new THREE.Vector3(-4.1, 0, -3.2), new THREE.Vector3(4.1, 1.2, -0.8))
  );

  // Security Turnstile Checkpoints (Champagne Brass & Emerald Glow)
  for (let gx = -6; gx <= 6; gx += 4) {
    if (gx === 0) continue;
    const gatePostGeo = new THREE.BoxGeometry(0.3, 1.2, 1.4);
    const gatePost = new THREE.Mesh(gatePostGeo, palette.champagneBrass);
    gatePost.position.set(gx, 0.6, 6);
    root.add(gatePost);

    const gateArchGeo = new THREE.BoxGeometry(0.05, 0.9, 0.05);
    const gateArch = new THREE.Mesh(gateArchGeo, palette.emissiveEmerald);
    gateArch.position.set(gx + 0.5, 0.7, 6);
    root.add(gateArch);
  }

  // Luxury White Leather Designer Lounge Sofas & Coffee Tables
  const sofaGeo = new THREE.BoxGeometry(5.0, 0.75, 1.6);
  const sofa1 = new THREE.Mesh(sofaGeo, palette.leatherWhite);
  sofa1.position.set(-13, 0.38, 10);
  root.add(sofa1);

  const sofa2 = new THREE.Mesh(sofaGeo, palette.leatherWhite);
  sofa2.position.set(13, 0.38, 10);
  root.add(sofa2);

  // Honey oak low coffee tables
  const coffeeGeo = new THREE.BoxGeometry(3.0, 0.35, 1.2);
  const coffeeTable1 = new THREE.Mesh(coffeeGeo, palette.honeyOakWood);
  coffeeTable1.position.set(-13, 0.18, 7.5);
  root.add(coffeeTable1);

  const coffeeTable2 = new THREE.Mesh(coffeeGeo, palette.honeyOakWood);
  coffeeTable2.position.set(13, 0.18, 7.5);
  root.add(coffeeTable2);

  // Vibrant Indoor Potted Plants in Lobby
  addPottedPlant(-4.8, 0, -2, 1.2);
  addPottedPlant(4.8, 0, -2, 1.2);
  addPottedPlant(-10, 0, 10, 1.1);
  addPottedPlant(10, 0, 10, 1.1);

  // Warm daylight atrium chandelier light
  const lobbyLight1 = new THREE.PointLight(0xfffaed, 2.0, 24);
  lobbyLight1.position.set(0, 5.0, 0);
  root.add(lobbyLight1);

  // --- STORY 2: QUANTUM & CYBERNETICS LAB (Y: 6 - 12m) ---
  // Bright White Terrazzo Lab Floor
  const f2Meshes = createFloorWithStairOpening(6.0, palette.terrazzoFloor);
  f2Meshes.forEach((m) => floorColliders.push(m));

  // Central Cryogenic Quantum Core Chamber with Clear Glass & Champagne Trim
  const coreChamberGeo = new THREE.CylinderGeometry(2.5, 2.5, 5.2, 32);
  const coreChamberMat = new THREE.MeshPhysicalMaterial({
    color: 0x93c5fd,
    transparent: true,
    opacity: 0.35,
    roughness: 0.05,
    transmission: 0.92,
  });
  const coreChamber = new THREE.Mesh(coreChamberGeo, coreChamberMat);
  coreChamber.position.set(0, 8.6, 0);
  root.add(coreChamber);

  // Champagne brass caps on quantum chamber
  const capGeo = new THREE.CylinderGeometry(2.6, 2.6, 0.25, 32);
  const capTop = new THREE.Mesh(capGeo, palette.champagneBrass);
  capTop.position.set(0, 11.2, 0);
  root.add(capTop);
  const capBottom = new THREE.Mesh(capGeo, palette.champagneBrass);
  capBottom.position.set(0, 6.1, 0);
  root.add(capBottom);

  // Pulsing Quantum Core Sphere inside
  const coreSphereGeo = new THREE.IcosahedronGeometry(1.2, 3);
  const coreSphere = new THREE.Mesh(coreSphereGeo, palette.emissiveCyan);
  coreSphere.position.set(0, 8.6, 0);
  root.add(coreSphere);
  animatedObjects.quantumCore = coreSphere;

  // Orbiting Quantum Gyroscopic Rings
  const ringGeo = new THREE.TorusGeometry(1.8, 0.06, 16, 64);
  const ring1 = new THREE.Mesh(ringGeo, palette.emissiveCyan);
  const ring2 = new THREE.Mesh(ringGeo, palette.emissiveAmber);
  ring2.rotation.x = Math.PI / 2;
  animatedObjects.quantumRings.add(ring1);
  animatedObjects.quantumRings.add(ring2);
  animatedObjects.quantumRings.position.set(0, 8.6, 0);
  root.add(animatedObjects.quantumRings);

  // Modern Cleanroom Server Aisles (Architectural White with Champagne Brass & LEDs)
  const rackGeo = new THREE.BoxGeometry(1.2, 4.0, 3.0);
  const rackMat = palette.whiteDrywall;
  const serverPositions = [
    [-10, 8.0, -10],
    [-6, 8.0, -10],
    [-10, 8.0, -4],
    [-6, 8.0, -4],
    [-10, 8.0, 4],
    [-6, 8.0, 4],
    [-10, 8.0, 10],
    [-6, 8.0, 10],
  ];
  serverPositions.forEach(([rx, ry, rz]) => {
    const rack = new THREE.Mesh(rackGeo, rackMat);
    rack.position.set(rx, ry, rz);
    rack.castShadow = true;
    root.add(rack);

    // Champagne brass framing
    const trimGeo = new THREE.BoxGeometry(1.22, 0.08, 3.02);
    const trimT = new THREE.Mesh(trimGeo, palette.champagneBrass);
    trimT.position.set(rx, ry + 2.0, rz);
    root.add(trimT);

    // Blinking LED panels on server fronts
    const ledGeo = new THREE.BoxGeometry(0.04, 0.1, 2.6);
    const led = new THREE.Mesh(ledGeo, palette.emissiveCyan);
    led.position.set(rx + 0.62, ry + 0.5, rz);
    root.add(led);

    const led2 = new THREE.Mesh(ledGeo, palette.emissiveEmerald);
    led2.position.set(rx + 0.62, ry - 0.5, rz);
    root.add(led2);

    wallColliders.push(
      new THREE.Box3(
        new THREE.Vector3(rx - 0.7, ry - 2.0, rz - 1.6),
        new THREE.Vector3(rx + 0.7, ry + 2.0, rz + 1.6)
      )
    );
  });

  // Greenery in Lab
  addPottedPlant(-4.0, 6.0, 0, 1.0);
  addPottedPlant(-4.0, 6.0, -8, 1.0);

  // --- STORY 3: EXECUTIVE STRATEGY & DIGITAL ARCHIVES (Y: 12 - 18m) ---
  // Warm Honey Oak Parquet Floor
  const f3Meshes = createFloorWithStairOpening(12.0, palette.honeyOakWood);
  f3Meshes.forEach((m) => floorColliders.push(m));

  // Executive War Room Hexagonal Conference Table in Honey Oak & Champagne Brass
  const tableGeo = new THREE.CylinderGeometry(3.6, 3.6, 0.8, 6);
  const table = new THREE.Mesh(tableGeo, palette.honeyOakWood);
  table.position.set(0, 12.4, 0);
  table.castShadow = true;
  root.add(table);

  // Champagne brass bevel ring on table
  const tableBevelGeo = new THREE.CylinderGeometry(3.65, 3.65, 0.1, 6);
  const tableBevel = new THREE.Mesh(tableBevelGeo, palette.champagneBrass);
  tableBevel.position.set(0, 12.8, 0);
  root.add(tableBevel);

  // Central Hologram Projector Plate
  const holoGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.05, 24);
  const holoPlate = new THREE.Mesh(holoGeo, palette.emissiveAmber);
  holoPlate.position.set(0, 12.86, 0);
  root.add(holoPlate);

  // Rotating 3D Holographic Tactical Pyramid
  const holoConeGeo = new THREE.ConeGeometry(0.85, 1.5, 4);
  const holoConeMat = new THREE.MeshBasicMaterial({
    color: 0xffb703,
    wireframe: true,
  });
  const holoCone = new THREE.Mesh(holoConeGeo, holoConeMat);
  holoCone.position.set(0, 13.8, 0);
  root.add(holoCone);
  animatedObjects.holoProjector = holoCone;

  // Warm Amber Strategy Room Chandelier
  const f3Light = new THREE.PointLight(0xffecc7, 2.2, 22);
  f3Light.position.set(0, 16.0, 0);
  root.add(f3Light);

  // Executive Digital Archive Stacks (Warm Walnut/Oak with Champagne Brass & Glowing Rods)
  for (let az = -12; az <= 12; az += 6) {
    const stackGeo = new THREE.BoxGeometry(1.6, 4.5, 4.0);
    const stack = new THREE.Mesh(stackGeo, palette.whiteDrywall);
    stack.position.set(-14, 14.25, az);
    root.add(stack);

    const goldRunnerGeo = new THREE.BoxGeometry(0.08, 4.0, 3.6);
    const goldRunner = new THREE.Mesh(goldRunnerGeo, palette.emissiveAmber);
    goldRunner.position.set(-13.15, 14.25, az);
    root.add(goldRunner);

    const frameGeo = new THREE.BoxGeometry(1.65, 0.1, 4.05);
    const frame = new THREE.Mesh(frameGeo, palette.champagneBrass);
    frame.position.set(-14, 16.5, az);
    root.add(frame);

    wallColliders.push(
      new THREE.Box3(
        new THREE.Vector3(-15.0, 12.0, az - 2.1),
        new THREE.Vector3(-13.0, 16.5, az + 2.1)
      )
    );
  }

  // Potted indoor trees in Strategy Suite
  addPottedPlant(-6, 12, -4, 1.1);
  addPottedPlant(-6, 12, 4, 1.1);
  addPottedPlant(6, 12, -4, 1.1);
  addPottedPlant(6, 12, 4, 1.1);

  // --- STORY 4: BOTANICAL SKY GARDEN & HYDROPONICS (Y: 18 - 24m) ---
  // Lush Garden & Oak Decking Floor
  const f4Meshes = createFloorWithStairOpening(18.0, palette.honeyOakWood);
  f4Meshes.forEach((m) => floorColliders.push(m));

  // Center Biome Raised Planter Bed in Ceramic & Oak Trim
  const planterGeo = new THREE.BoxGeometry(9, 0.7, 9);
  const planter = new THREE.Mesh(planterGeo, palette.planterCeramic);
  planter.position.set(0, 18.35, 0);
  root.add(planter);

  // Sculpted Biome Tree with Lush Greenery
  const trunkGeo = new THREE.CylinderGeometry(0.35, 0.5, 3.8, 12);
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5a3e28, roughness: 0.8 });
  const trunk = new THREE.Mesh(trunkGeo, trunkMat);
  trunk.position.set(0, 20.2, 0);
  root.add(trunk);

  const canopyGeo = new THREE.DodecahedronGeometry(2.4, 1);
  const canopy1 = new THREE.Mesh(canopyGeo, palette.vibrantFoliage);
  canopy1.position.set(0, 22.2, 0);
  root.add(canopy1);

  // Hydroponic Vertical Farming Columns (White Ceramic & Champagne Lamps)
  for (let hx of [-8, 8]) {
    for (let hz of [-8, 8]) {
      const towerGeo = new THREE.CylinderGeometry(0.4, 0.4, 4.8, 16);
      const tower = new THREE.Mesh(towerGeo, palette.whiteDrywall);
      tower.position.set(hx, 20.4, hz);
      root.add(tower);

      const ringGrowGeo = new THREE.TorusGeometry(0.55, 0.05, 8, 24);
      const ringGrow = new THREE.Mesh(ringGrowGeo, palette.emissiveEmerald);
      ringGrow.rotation.x = Math.PI / 2;
      ringGrow.position.set(hx, 20.8, hz);
      root.add(ringGrow);
    }
  }

  // Abundant tropical indoor planters
  addPottedPlant(-12, 18, -12, 1.3);
  addPottedPlant(-12, 18, 12, 1.3);
  addPottedPlant(10, 18, -12, 1.3);
  addPottedPlant(10, 18, 12, 1.3);

  // Cantilevered Panoramic Glass Viewing Balcony jutting over the South facade
  const balconyGeo = new THREE.BoxGeometry(14, 0.35, 4.5);
  const balcony = new THREE.Mesh(balconyGeo, palette.calacattaMarble);
  balcony.position.set(0, 18.0, 22.25);
  root.add(balcony);
  floorColliders.push(balcony);

  // Balcony Glass Railing & Champagne Handrail
  const railingGeo = new THREE.BoxGeometry(14, 1.2, 0.1);
  const railing = new THREE.Mesh(railingGeo, palette.panoramicGlass);
  railing.position.set(0, 18.7, 24.45);
  root.add(railing);

  const handrailGeo = new THREE.BoxGeometry(14.1, 0.08, 0.15);
  const handrail = new THREE.Mesh(handrailGeo, palette.champagneBrass);
  handrail.position.set(0, 19.3, 24.45);
  root.add(handrail);

  // --- STORY 5: PENTHOUSE COMMAND & ROOFTOP HELIPAD (Y: 24 - 32m) ---
  // Luminous Terrazzo Penthouse Floor
  const f5Meshes = createFloorWithStairOpening(24.0, palette.terrazzoFloor);
  f5Meshes.forEach((m) => floorColliders.push(m));

  // Semicircular Master Command Console in Champagne Brass & White Quartz
  const bridgeDeskGeo = new THREE.CylinderGeometry(4.2, 4.2, 0.9, 16, 1, false, 0, Math.PI);
  const bridgeDesk = new THREE.Mesh(bridgeDeskGeo, palette.champagneBrass);
  bridgeDesk.position.set(0, 24.45, -2);
  bridgeDesk.rotation.y = Math.PI;
  root.add(bridgeDesk);

  // Tactical Holographic 3D Globe
  const globeGeo = new THREE.SphereGeometry(1.3, 20, 20);
  const globeMat = new THREE.MeshBasicMaterial({
    color: 0x00f3ff,
    wireframe: true,
  });
  const globe = new THREE.Mesh(globeGeo, globeMat);
  globe.position.set(0, 26.3, -2);
  root.add(globe);
  animatedObjects.commandGlobe = globe;

  // ROOFTOP HELIPAD TERRACE (Y = 30.0m)
  const roofSlabGeo = new THREE.BoxGeometry(BUILDING_WIDTH, SLAB_THICKNESS, BUILDING_DEPTH);
  const roofSlab = new THREE.Mesh(roofSlabGeo, palette.helipadDeck);
  roofSlab.position.set(0, 30.0 - SLAB_THICKNESS / 2, 0);
  roofSlab.receiveShadow = true;
  root.add(roofSlab);
  floorColliders.push(roofSlab);

  // Helipad Yellow Landing Circle
  const heliRingGeo = new THREE.RingGeometry(8, 8.6, 48);
  const heliRing = new THREE.Mesh(heliRingGeo, palette.yellowMarking);
  heliRing.rotation.x = -Math.PI / 2;
  heliRing.position.set(0, 30.02, 0);
  root.add(heliRing);

  // Helipad "H" Marking
  const hBar1Geo = new THREE.PlaneGeometry(0.8, 6.0);
  const hBar1 = new THREE.Mesh(hBar1Geo, palette.yellowMarking);
  hBar1.rotation.x = -Math.PI / 2;
  hBar1.position.set(-1.8, 30.02, 0);
  root.add(hBar1);

  const hBar2 = new THREE.Mesh(hBar1Geo, palette.yellowMarking);
  hBar2.rotation.x = -Math.PI / 2;
  hBar2.position.set(1.8, 30.02, 0);
  root.add(hBar2);

  const hCrossGeo = new THREE.PlaneGeometry(3.6, 0.8);
  const hCross = new THREE.Mesh(hCrossGeo, palette.yellowMarking);
  hCross.rotation.x = -Math.PI / 2;
  hCross.position.set(0, 30.02, 0);
  root.add(hCross);

  // Rooftop Perimeter Glass Railing & Champagne Posts
  const roofRailNGeo = new THREE.BoxGeometry(BUILDING_WIDTH - 1, 1.2, 0.1);
  const roofRailN = new THREE.Mesh(roofRailNGeo, palette.panoramicGlass);
  roofRailN.position.set(0, 30.6, -HALF_D + 0.5);
  root.add(roofRailN);

  const roofRailS = new THREE.Mesh(roofRailNGeo, palette.panoramicGlass);
  roofRailS.position.set(0, 30.6, HALF_D - 0.5);
  root.add(roofRailS);

  // Rooftop Corner Aviation Hazard Beacons
  const beaconOffsets = [
    [-HALF_W + 1.2, 30.6, -HALF_D + 1.2],
    [HALF_W - 1.2, 30.6, -HALF_D + 1.2],
    [-HALF_W + 1.2, 30.6, HALF_D - 1.2],
    [HALF_W - 1.2, 30.6, HALF_D - 1.2],
  ];
  beaconOffsets.forEach(([bx, by, bz]) => {
    const postGeo = new THREE.CylinderGeometry(0.1, 0.1, 1.2, 8);
    const post = new THREE.Mesh(postGeo, palette.champagneBrass);
    post.position.set(bx, by, bz);
    root.add(post);

    const bBulbGeo = new THREE.SphereGeometry(0.2, 12, 12);
    const bBulb = new THREE.Mesh(bBulbGeo, palette.emissiveRed);
    bBulb.position.set(bx, by + 0.6, bz);
    root.add(bBulb);

    const bLight = new THREE.PointLight(0xff2222, 1.6, 14);
    bLight.position.set(bx, by + 0.7, bz);
    root.add(bLight);
    animatedObjects.beaconLights.push(bLight);
  });

  // --- 3. EAST-WING CONTINUOUS STAIRWELL & RAMP CORE ---
  // Connects all 5 floors seamlessly with smooth slope colliders and panoramic glass vistas
  const stairFloors = [
    { startY: 0.0, endY: 6.0 },
    { startY: 6.0, endY: 12.0 },
    { startY: 12.0, endY: 18.0 },
    { startY: 18.0, endY: 24.0 },
    { startY: 24.0, endY: 30.0 },
  ];

  stairFloors.forEach(({ startY, endY }) => {
    const midY = startY + 3.0;

    // Flight 1: Ascends from Z = -5 to Z = 0 (dZ = 5m, dY = 3m)
    const rampLength = Math.hypot(5, 3);
    const angle1 = Math.atan2(3, 5);

    // Visual step treads with champagne brass trim
    const stepCount = 10;
    for (let s = 0; s < stepCount; s++) {
      const stepH = 3.0 / stepCount;
      const stepD = 5.0 / stepCount;
      const stepGeo = new THREE.BoxGeometry(2.2, stepH, stepD);
      const stepMesh = new THREE.Mesh(stepGeo, palette.honeyOakWood);
      stepMesh.position.set(13.8, startY + s * stepH + stepH / 2, -5.0 + s * stepD + stepD / 2);
      stepMesh.receiveShadow = true;
      root.add(stepMesh);
    }

    // Invisible Smooth Ramp Collider Plane for Flight 1 (guarantees silky smooth climbing)
    const ramp1Geo = new THREE.BoxGeometry(2.4, 0.1, rampLength);
    const ramp1 = new THREE.Mesh(ramp1Geo, new THREE.MeshBasicMaterial({ visible: false }));
    ramp1.position.set(13.8, startY + 1.5, -2.5);
    ramp1.rotation.x = angle1;
    root.add(ramp1);
    rampColliders.push(ramp1);

    // Mid-landing Platform at (X = 15.0, Y = midY, Z = 0)
    const landingGeo = new THREE.BoxGeometry(4.6, SLAB_THICKNESS, 2.4);
    const landing = new THREE.Mesh(landingGeo, palette.calacattaMarble);
    landing.position.set(15.0, midY - SLAB_THICKNESS / 2, 0);
    landing.receiveShadow = true;
    root.add(landing);
    floorColliders.push(landing);

    // Flight 2: Ascends from Z = 0 to Z = +5 (dZ = 5m, dY = 3m)
    for (let s = 0; s < stepCount; s++) {
      const stepH = 3.0 / stepCount;
      const stepD = 5.0 / stepCount;
      const stepGeo = new THREE.BoxGeometry(2.2, stepH, stepD);
      const stepMesh = new THREE.Mesh(stepGeo, palette.honeyOakWood);
      stepMesh.position.set(16.2, midY + s * stepH + stepH / 2, 0.0 + s * stepD + stepD / 2);
      stepMesh.receiveShadow = true;
      root.add(stepMesh);
    }

    // Invisible Smooth Ramp Collider Plane for Flight 2
    const ramp2Geo = new THREE.BoxGeometry(2.4, 0.1, rampLength);
    const ramp2 = new THREE.Mesh(ramp2Geo, new THREE.MeshBasicMaterial({ visible: false }));
    ramp2.position.set(16.2, midY + 1.5, 2.5);
    ramp2.rotation.x = angle1;
    root.add(ramp2);
    rampColliders.push(ramp2);
  });

  // Glass Enclosure for Stairwell Shaft
  const shaftGlassGeo = new THREE.BoxGeometry(7.0, 30.0, 12.0);
  const shaftGlass = new THREE.Mesh(shaftGlassGeo, palette.panoramicGlass);
  shaftGlass.position.set(15.0, 15.0, 0);
  root.add(shaftGlass);

  // --- 4. PROCEDURAL 3D NPC AVATAR FIGURES ON EACH FLOOR ---
  // Stylized architectural humanoid models for Iris's characters
  DEFAULT_NPCS.forEach((npc) => {
    const [nx, ny, nz] = npc.position;
    const npcGroup = new THREE.Group();
    npcGroup.position.set(nx, ny, nz);

    // Floor Interaction Pulsing Halo Ring
    const haloGeo = new THREE.RingGeometry(0.8, 0.95, 32);
    const haloMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(npc.avatarColor),
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.rotation.x = -Math.PI / 2;
    halo.position.y = 0.03;
    npcGroup.add(halo);
    animatedObjects.npcRings.push(halo);

    // Character Torso
    const torsoGeo = new THREE.CylinderGeometry(0.24, 0.28, 0.8, 12);
    const torsoMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(npc.avatarColor),
      roughness: 0.4,
      metalness: 0.2,
    });
    const torso = new THREE.Mesh(torsoGeo, torsoMat);
    torso.position.y = 1.0;
    torso.castShadow = true;
    npcGroup.add(torso);

    // Character Head
    const headGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const headMat = new THREE.MeshStandardMaterial({
      color: 0xfde047,
      roughness: 0.5,
    });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 1.55;
    head.castShadow = true;
    npcGroup.add(head);

    // Floating Holographic Identity Diamond
    const badgeGeo = new THREE.OctahedronGeometry(0.12);
    const badgeMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(npc.avatarColor),
      wireframe: true,
    });
    const badge = new THREE.Mesh(badgeGeo, badgeMat);
    badge.position.y = 1.95;
    npcGroup.add(badge);

    npc.mesh = npcGroup;
    root.add(npcGroup);
  });

  // --- 4.5 DETAILED ARCHITECTURAL FLOOR INLAYS & COFFERED CEILINGS ---
  // Transforms plain floors into rich, luxury, modern game spaces
  const neroMarbleMat = new THREE.MeshStandardMaterial({
    color: 0x18181b,
    roughness: 0.15,
    metalness: 0.3,
  });

  const cedarDeckMat = new THREE.MeshStandardMaterial({
    color: 0x8a5a36,
    roughness: 0.6,
    metalness: 0.05,
  });

  const ceilingGridMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.5,
    metalness: 0.1,
  });

  const artMat1 = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.4 });
  const artMat2 = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4 });
  const artMat3 = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.4 });

  // Story 1: Calacatta Floor with Dark Nero Borders & Brass Medallion
  // Outer Nero Border (Width: 38m, Depth: 38m, Border width: 0.8m)
  const border1Geo = new THREE.BoxGeometry(37, 0.02, 0.8);
  const border1N = new THREE.Mesh(border1Geo, neroMarbleMat);
  border1N.position.set(0, 0.01, -17.5);
  root.add(border1N);
  const border1S = new THREE.Mesh(border1Geo, neroMarbleMat);
  border1S.position.set(0, 0.01, 17.5);
  root.add(border1S);

  const border1SideGeo = new THREE.BoxGeometry(0.8, 0.02, 35);
  const border1W = new THREE.Mesh(border1SideGeo, neroMarbleMat);
  border1W.position.set(-17.5, 0.01, 0);
  root.add(border1W);
  const border1E = new THREE.Mesh(border1SideGeo, neroMarbleMat);
  border1E.position.set(10.5, 0.01, 0); // Stops before stairwell
  root.add(border1E);

  // Central Brass Inlay Ring Medallion (Radius: 6m)
  const medallionGeo = new THREE.RingGeometry(5.8, 6.2, 48);
  const medallion = new THREE.Mesh(medallionGeo, palette.champagneBrass);
  medallion.rotation.x = -Math.PI / 2;
  medallion.position.set(0, 0.02, 2);
  root.add(medallion);

  // Story 1 Contemporary Large Canvas Art Wall
  const artGeo = new THREE.BoxGeometry(7.0, 3.2, 0.1);
  const artMesh1 = new THREE.Mesh(artGeo, artMat1);
  artMesh1.position.set(-14, 2.8, -19.4);
  root.add(artMesh1);

  // Story 2: Cybernetics Lab Reflective Glass Subfloor Channels
  for (let cz of [-6, 6]) {
    const channelGlowGeo = new THREE.BoxGeometry(22, 0.05, 1.2);
    const channelGlow = new THREE.Mesh(channelGlowGeo, palette.emissiveCyan);
    channelGlow.position.set(-3, 6.02, cz);
    root.add(channelGlow);

    const channelGlassGeo = new THREE.BoxGeometry(22, 0.04, 1.4);
    const channelGlass = new THREE.Mesh(channelGlassGeo, palette.glassCurtain);
    channelGlass.position.set(-3, 6.06, cz);
    root.add(channelGlass);
  }

  // Story 3: Executive Herringbone Honey-Oak Floor Border & Slatted Wood Wall Art
  const border3Geo = new THREE.BoxGeometry(36, 0.02, 0.6);
  const border3N = new THREE.Mesh(border3Geo, neroMarbleMat);
  border3N.position.set(-1, 12.01, -17.5);
  root.add(border3N);
  const border3S = new THREE.Mesh(border3Geo, neroMarbleMat);
  border3S.position.set(-1, 12.01, 17.5);
  root.add(border3S);

  const artMesh3 = new THREE.Mesh(artGeo, artMat2);
  artMesh3.position.set(-14, 14.8, -19.4);
  root.add(artMesh3);

  // Story 4: Botanical Sky Garden Cedar Boardwalk Pathways
  const boardwalkGeo = new THREE.BoxGeometry(32, 0.08, 3.5);
  const boardwalk = new THREE.Mesh(boardwalkGeo, cedarDeckMat);
  boardwalk.position.set(-3, 18.04, 0);
  root.add(boardwalk);

  const boardwalkCrossGeo = new THREE.BoxGeometry(3.5, 0.08, 28);
  const boardwalkCross = new THREE.Mesh(boardwalkCrossGeo, cedarDeckMat);
  boardwalkCross.position.set(0, 18.04, 0);
  root.add(boardwalkCross);

  // Story 5: Penthouse Imperial Granite Floor with Runway Beacon Lines
  const lineGeo = new THREE.BoxGeometry(26, 0.02, 0.2);
  const line1 = new THREE.Mesh(lineGeo, palette.yellowMarking);
  line1.position.set(-2, 24.02, -5);
  root.add(line1);
  const line2 = new THREE.Mesh(lineGeo, palette.yellowMarking);
  line2.position.set(-2, 24.02, 5);
  root.add(line2);

  // COFFERED CEILING BEAMS ON ALL FLOORS (Y = 5.8, 11.8, 17.8, 23.8)
  for (let floorY of [5.8, 11.8, 17.8, 23.8]) {
    for (let bx = -12; bx <= 6; bx += 9) {
      const beamGeo = new THREE.BoxGeometry(0.5, 0.35, 38);
      const beam = new THREE.Mesh(beamGeo, ceilingGridMat);
      beam.position.set(bx, floorY, 0);
      root.add(beam);
    }

    // Recessed warm linear LED troffers on ceilings
    const trofferGeo = new THREE.BoxGeometry(16, 0.05, 0.4);
    const troffer = new THREE.Mesh(trofferGeo, palette.emissiveAmber);
    troffer.position.set(-3, floorY - 0.02, 0);
    root.add(troffer);
  }

  // --- 5. ANIMATION TICKER ---
  const update = (_delta: number, elapsed: number) => {
    // Quantum Core rotation & pulse
    if (animatedObjects.quantumCore) {
      animatedObjects.quantumCore.rotation.y = elapsed * 0.8;
      animatedObjects.quantumCore.rotation.x = elapsed * 0.4;
    }
    if (animatedObjects.quantumRings) {
      animatedObjects.quantumRings.rotation.y = -elapsed * 0.5;
      animatedObjects.quantumRings.rotation.z = elapsed * 0.3;
    }

    // Strategy War Room Holographic Projector
    if (animatedObjects.holoProjector) {
      animatedObjects.holoProjector.rotation.y = elapsed * 1.2;
    }

    // Penthouse Command Globe
    if (animatedObjects.commandGlobe) {
      animatedObjects.commandGlobe.rotation.y = elapsed * 0.6;
    }

    // Helipad red aviation warning strobes
    const strobe = (Math.sin(elapsed * 6) + 1) * 0.5;
    animatedObjects.beaconLights.forEach((light) => {
      light.intensity = 0.6 + strobe * 2.2;
    });

    // NPC Interaction Halos Gentle Pulse
    const haloScale = 1.0 + Math.sin(elapsed * 3) * 0.08;
    animatedObjects.npcRings.forEach((ring) => {
      ring.scale.set(haloScale, haloScale, 1.0);
    });
  };

  const colliders: BuildingColliders = {
    floors: floorColliders,
    ramps: rampColliders,
    walls: wallColliders,
  };

  return {
    group: root,
    floorColliders,
    rampColliders,
    wallColliders,
    colliders,
    floors: FLOOR_DEFINITIONS,
    rooftopSpawn: ROOFTOP_SPAWN,
    npcs: DEFAULT_NPCS,
    update,
  };
}
