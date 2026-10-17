import * as THREE from 'three';

export interface MaterialPalette {
  marbleFloor: THREE.MeshStandardMaterial;
  darkFloor: THREE.MeshStandardMaterial;
  woodFloor: THREE.MeshStandardMaterial;
  gardenGrass: THREE.MeshStandardMaterial;
  metalWall: THREE.MeshStandardMaterial;
  glassCurtain: THREE.MeshPhysicalMaterial;
  pillarObsidian: THREE.MeshStandardMaterial;
  emissiveCyan: THREE.MeshStandardMaterial;
  emissiveAmber: THREE.MeshStandardMaterial;
  emissiveEmerald: THREE.MeshStandardMaterial;
  emissiveRed: THREE.MeshStandardMaterial;
  helipadDeck: THREE.MeshStandardMaterial;
  yellowMarking: THREE.MeshStandardMaterial;
  ceilingMaterial: THREE.MeshStandardMaterial;
  // Modern Luxury Architectural & Interior Materials
  brassTrim: THREE.MeshStandardMaterial;
  honeyOak: THREE.MeshStandardMaterial;
  velvetTerracotta: THREE.MeshStandardMaterial;
  velvetTeal: THREE.MeshStandardMaterial;
  nordicBoucle: THREE.MeshStandardMaterial;
  darkMullion: THREE.MeshStandardMaterial;
  plantFoliage: THREE.MeshStandardMaterial;
  plantPot: THREE.MeshStandardMaterial;
  npcSkin: THREE.MeshStandardMaterial;
  npcSuit: THREE.MeshStandardMaterial;
  npcRobot: THREE.MeshStandardMaterial;

  // Architectural Convenience Aliases
  champagneBrass: THREE.MeshStandardMaterial;
  honeyOakWood: THREE.MeshStandardMaterial;
  vibrantFoliage: THREE.MeshStandardMaterial;
  planterCeramic: THREE.MeshStandardMaterial;
  calacattaMarble: THREE.MeshStandardMaterial;
  terrazzoFloor: THREE.MeshStandardMaterial;
  whiteDrywall: THREE.MeshStandardMaterial;
  mullionMaterial: THREE.MeshStandardMaterial;
  panoramicGlass: THREE.MeshPhysicalMaterial;
  leatherWhite: THREE.MeshStandardMaterial;
  travertinePlaza: THREE.MeshStandardMaterial;
}

export function createPalette(): MaterialPalette {
  return {
    // 1. Bright Italian Calacatta Marble (Lobby & Atrium)
    marbleFloor: new THREE.MeshStandardMaterial({
      color: 0xfdfdfd,
      roughness: 0.12,
      metalness: 0.08,
    }),

    // 2. Modern Polished Slate & Architectural Limestone (Labs & Executive)
    darkFloor: new THREE.MeshStandardMaterial({
      color: 0xe2e8f0, // bright architectural limestone rather than pitch black!
      roughness: 0.25,
      metalness: 0.1,
    }),

    // 3. Warm Honey Oak Parquet (Executive Suite & Lounge)
    woodFloor: new THREE.MeshStandardMaterial({
      color: 0xd4a373, // rich honey oak tone
      roughness: 0.38,
      metalness: 0.05,
    }),

    // 4. Lush Vibrant Biophilic Grass & Turf
    gardenGrass: new THREE.MeshStandardMaterial({
      color: 0x22c55e, // vibrant emerald green
      roughness: 0.75,
      metalness: 0.02,
    }),

    // 5. Architectural Matte Off-White Wall Finish
    metalWall: new THREE.MeshStandardMaterial({
      color: 0xf4f4f5, // bright crisp architectural surface that reflects daylight
      roughness: 0.6,
      metalness: 0.05,
    }),

    // 6. Ultra-Clear Low-Iron Panoramic Glass
    glassCurtain: new THREE.MeshPhysicalMaterial({
      color: 0xe0f2fe,
      transparent: true,
      opacity: 0.2,
      roughness: 0.02,
      transmission: 0.95,
      ior: 1.52,
    }),

    // 7. Fluted Calacatta Marble & Brushed Champagne Brass Columns
    pillarObsidian: new THREE.MeshStandardMaterial({
      color: 0xf8fafc, // bright architectural fluted stone
      roughness: 0.18,
      metalness: 0.15,
    }),

    // 8. Emissive Accents
    emissiveCyan: new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 1.2,
      roughness: 0.2,
    }),
    emissiveAmber: new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 1.2,
      roughness: 0.2,
    }),
    emissiveEmerald: new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x059669,
      emissiveIntensity: 1.1,
      roughness: 0.25,
    }),
    emissiveRed: new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xdc2626,
      emissiveIntensity: 1.3,
    }),

    // 9. Rooftop Helipad Modern Deck
    helipadDeck: new THREE.MeshStandardMaterial({
      color: 0x475569, // modern architectural slate decking
      roughness: 0.5,
      metalness: 0.3,
    }),
    yellowMarking: new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      emissive: 0xb45309,
      emissiveIntensity: 0.5,
      roughness: 0.4,
    }),
    ceilingMaterial: new THREE.MeshStandardMaterial({
      color: 0xfcfcfd, // crisp white ceiling to bounce daylight
      roughness: 0.8,
      metalness: 0.02,
    }),

    // 10. Designer Luxury Finishes
    brassTrim: new THREE.MeshStandardMaterial({
      color: 0xd4af37, // warm brushed gold / champagne brass
      metalness: 0.85,
      roughness: 0.22,
    }),
    honeyOak: new THREE.MeshStandardMaterial({
      color: 0xc89658,
      roughness: 0.4,
      metalness: 0.05,
    }),
    velvetTerracotta: new THREE.MeshStandardMaterial({
      color: 0xc2410c, // rich warm terracotta velvet
      roughness: 0.85,
      metalness: 0.02,
    }),
    velvetTeal: new THREE.MeshStandardMaterial({
      color: 0x0e7490, // deep elegant teal
      roughness: 0.85,
      metalness: 0.02,
    }),
    nordicBoucle: new THREE.MeshStandardMaterial({
      color: 0xfbf8f3, // warm textured cream
      roughness: 0.9,
      metalness: 0.0,
    }),
    darkMullion: new THREE.MeshStandardMaterial({
      color: 0x1e293b, // slim architectural mullion framing
      roughness: 0.35,
      metalness: 0.65,
    }),
    plantFoliage: new THREE.MeshStandardMaterial({
      color: 0x15803d, // lush indoor plant green
      roughness: 0.35,
      metalness: 0.05,
    }),
    plantPot: new THREE.MeshStandardMaterial({
      color: 0xf8fafc, // minimalist white ceramic
      roughness: 0.25,
      metalness: 0.05,
    }),
    npcSkin: new THREE.MeshStandardMaterial({
      color: 0xfcd34d,
      roughness: 0.6,
      metalness: 0.05,
    }),
    npcSuit: new THREE.MeshStandardMaterial({
      color: 0x1e3a8a,
      roughness: 0.55,
      metalness: 0.1,
    }),
    npcRobot: new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.25,
      metalness: 0.6,
    }),

    // Architectural Convenience Aliases
    champagneBrass: new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.85,
      roughness: 0.22,
    }),
    honeyOakWood: new THREE.MeshStandardMaterial({
      color: 0xc89658,
      roughness: 0.4,
      metalness: 0.05,
    }),
    vibrantFoliage: new THREE.MeshStandardMaterial({
      color: 0x15803d,
      roughness: 0.35,
      metalness: 0.05,
    }),
    planterCeramic: new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.25,
      metalness: 0.05,
    }),
    calacattaMarble: new THREE.MeshStandardMaterial({
      color: 0xfdfdfd,
      roughness: 0.12,
      metalness: 0.08,
    }),
    terrazzoFloor: new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.25,
      metalness: 0.1,
    }),
    whiteDrywall: new THREE.MeshStandardMaterial({
      color: 0xf4f4f5,
      roughness: 0.6,
      metalness: 0.05,
    }),
    mullionMaterial: new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.35,
      metalness: 0.65,
    }),
    panoramicGlass: new THREE.MeshPhysicalMaterial({
      color: 0xe0f2fe,
      transparent: true,
      opacity: 0.2,
      roughness: 0.02,
      transmission: 0.95,
      ior: 1.52,
    }),
    leatherWhite: new THREE.MeshStandardMaterial({
      color: 0xfbf8f3,
      roughness: 0.9,
      metalness: 0.0,
    }),
    travertinePlaza: new THREE.MeshStandardMaterial({
      color: 0xe5e1d5,
      roughness: 0.65,
      metalness: 0.05,
    }),
  };
}
