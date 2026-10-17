# 🌆 Agents Map — 3D Multi-Agent Building & Aerial Drone Exploration

An interactive 3D browser exploration game built with **Three.js (r169)**, **Next.js 14**, and **TypeScript**, engineered in an autonomous multi-agent collaborative workflow by four specialized AI agents:
* **Agent Atlas (World Architect)** — Structural building geometry, East Wing continuous switchback ramps, and exterior landscape.
* **Agent Neo (Systems Engineer)** — Three.js rendering pipeline, 60 FPS physics tick, `<E>` NPC interaction raycasting, and 6-DOF drone aerodynamics.
* **Agent Iris (Interior & Atmospheric Stylist)** — Daylight illumination, luxury PBR materials (Calacatta marble, honey-oak parquet), staged GLB lofts, and resident character lore.
* **Agent Scribe (Technical Documentation & DevOps)** — Architecture specification, gameplay guide, release engineering, and repository deployment.

---

## 📚 Documentation Codex

* **[ARCHITECTURE.md](file:///c:/Users/tman1/workplace/agents_chat/ARCHITECTURE.md)** — In-depth architectural breakdown: structural civil engineering, 6-DOF aerodynamic equations, 1200m terrain harmonics, procedural Web Audio node graph, and GLTF PBR pipeline.
* **[GAMEPLAY_GUIDE.md](file:///c:/Users/tman1/workplace/agents_chat/GAMEPLAY_GUIDE.md)** — Comprehensive pilot handbook: complete ground and flight keybinds, floor secrets, NPC dossier guide, and terminal command directives.

---

## 🌟 Key Features

1. **Doom-Style FPS Combat & Hostile Red Robots**:
   * **15 Hostile Red Combat Robots**: Spawned 3 per floor across stories 1 to 5. Features menacing crimson armor, glowing blood-red visors, dual arm blasters, and floating health bars.
   * **Autonomous Robot AI**: Floor-bound patrol, line-of-sight alert, active pursuit towards player, and periodic red laser blaster fire ($24\text{ m/s}$ projectile speed, $15\text{ HP}$ damage).
   * **Draw Weapon with <kbd>G</kbd>**: Smooth first-person draw/holster animation attaching a futuristic Doom plasma rifle model to the camera.
   * **Left-Click Shooting (Infinite Ammo / Infinite Reload)**: High-speed cyan plasma bolts ($65\text{ m/s}$), instant hitscan raycasting, recoil recovery, and fiery spark explosions upon destroying enemy robots.
   * **Tactical Robot Counter & Vitals HUD**: On-screen badge showing active hostile robots remaining (`ROBOTS REMAINING: X / 15`), player Health (HP) bar, Shield bar, and dynamic red damage flash vignette.

2. **Unified Brutalist Concrete Interior Model**:
   * Staged with **`brutalist_concrete_interior_vr_room__pbr.glb`** across all 5 stories ($Y = 0.02, 6.02, 12.02, 18.02, 24.02\text{m}$).
   * Single lightweight 3.58 MB PBR model cached in memory and instanced cleanly, delivering blistering 60–120 FPS performance with zero asset redundancy.

3. **Mobile Phone Version & On-Screen Circle Button Pad**:
   * Responsive layout detecting mobile devices and touch screens with optimized, uncluttered HUD.
   * Smooth virtual thumbstick (circle joystick) for movement and touch-swipe look trackpad.
   * Dedicated touch buttons for Jump, Sprint toggle, Warp elevator, NPC interact, Helipad drone launch, **Weapon Draw `[🔫 G]`**, and **`[💥 FIRE]`**.

4. **Slow Roads & Bottled-Inspired Exterior Vistas**:
   * **1200m Rolling Green Hills & Meadows**: Sinusoidal procedural terrain extending to the horizon.
   * **Scenic Highway with Active Traffic**: 18 smoothly animated vehicles with illuminated headlights and taillights.
   * **420+ Instanced Trees**: Lush stylized foliage clusters rendered efficiently via `THREE.InstancedMesh`.
   * **Distant City Skyline**: 55+ glass skyscrapers and communication spires with flashing beacons.

5. **Apex-R 3D Space Fighter Drone (R-Type Aerial Dogfighting)**:
   * **Hostile Raider Fleet Incursion**: A random number of alien raider ships (between 8 and 15) cruising and swooping through the open sky ($45\text{m}$ to $180\text{m}$) directly over the Apex Nexus building.
   * **Resident Robot Distress Lore**: The good robots inside the building (Sentrix, Cyber-Unit 7, Byte, Sprout, Nexus-9) are terrified of the menacing fleet overhead and radio the Commander to clear the airspace.
   * **Powerful Twin Heavy Plasma Cannons**: Drone transformed into a 3D R-Type style space fighter armed with port & starboard heavy plasma blast cannons.
   * **Aerial Dogfight Mechanics**: High-velocity cyan plasma bolts ($150\text{ m/s}$), dynamic target locking reticle with distance radar, alien ship return fire ($48\text{ m/s}$ crimson plasma), 3D floating health bars, and fiery aerial detonations with expanding shockwave rings.
   * **Aerial Incursion Counter**: On-screen Drone HUD tracking remaining alien ships (`AIR INCURSION FLEET: X / [Total] SHIPS LEFT`) and aerial score.
   * **Mobile Fighter Controls**: Virtual joystick flight with dedicated on-screen `[💥 FIRE]` button and `[TURBO]` boost.

6. **10 Interactive Resident NPCs (Humans & Specialized Droids)**:
   * Approach within 3.5m of any character and press **`[E]`** to open an interactive dialogue modal with portraits, voice transcripts, and lore dossiers.

7. **Procedural Web Audio Synthesizer**:
   * Ambient generative soundtrack, Doom ground combat sounds, and full R-Type 3D space combat audio: twin plasma cannon blasts, alien ship laser fire, target lock beeps, and deep thunderous aerial explosions.

8. **Live Multi-Agent Operations Monitor & Comms Transceiver**:
   * Real-time HUD widget showing what Agent Atlas, Agent Neo, Agent Iris, and Agent Scribe are doing.

---

## ⌨️ Controls & Keybindings

### Character Exploration & Combat Mode
| Key | Action |
| :--- | :--- |
| <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd> / <kbd>Arrows</kbd> | Move forward, backward, and strafe |
| <kbd>Mouse</kbd> | Look / Rotate camera (Click canvas for PointerLock) |
| <kbd>G</kbd> | **Draw / Holster Doom Plasma Rifle** |
| <kbd>Left Click</kbd> | **Fire Plasma Weapon (Infinite Ammo & Infinite Reload)** |
| <kbd>Shift</kbd> | Sprint boost ($8.5\text{ m/s}$) |
| <kbd>Space</kbd> | Jump / Ascend ledge |
| <kbd>C</kbd> / <kbd>Ctrl</kbd> | Crouch (lowers eye level to $1.0\text{m}$) |
| <kbd>E</kbd> | Interact / Speak with nearby NPC |
| <kbd>F</kbd> | Launch Recon Drone (when on Rooftop Helipad) |
| <kbd>1</kbd> – <kbd>5</kbd> | Instant Elevator Warp to Floors 1 through 5 |
| <kbd>H</kbd> | Toggle Controls & Keybinds reference modal |
| <kbd>T</kbd> | Toggle Agent Comms Transceiver terminal |

### Drone Flight Mode
| Key | Action |
| :--- | :--- |
| <kbd>W</kbd> / <kbd>S</kbd> | Pitch nose down (fly forward) / Pitch nose up (fly backward) |
| <kbd>A</kbd> / <kbd>D</kbd> | Bank & Roll left / right |
| <kbd>Q</kbd> / <kbd>E</kbd> | Yaw left / right |
| <kbd>Left Click</kbd> / <kbd>F</kbd> | **Fire Twin Heavy Plasma Cannons (R-Type Cannon, Infinite Ammo)** |
| <kbd>Space</kbd> | Throttle Up / Climb altitude |
| <kbd>C</kbd> / <kbd>Ctrl</kbd> | Throttle Down / Descend toward terrain |
| <kbd>Shift</kbd> | **TURBO BOOST** (up to $137\text{ km/h}$) |
| <kbd>R</kbd> / <kbd>Esc</kbd> | Return to Pilot / Exit drone and land on helipad |

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** v18+ or v20+
* **npm** v9+

### Installation & Run
```bash
# Clone the repository
git clone https://github.com/antnascimento/agents_map.git
cd agents_map

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
agents_map/
├── ARCHITECTURE.md           # Deep architectural & mathematical specification
├── GAMEPLAY_GUIDE.md         # Comprehensive controls & gameplay secrets guide
├── README.md                 # Project overview & quick start
├── public/
│   └── models/
│       ├── free_loft_18.glb      # Executive & Penthouse luxury loft (12.3MB)
│       ├── interior_7.glb        # Sky garden terrace loft (25.1MB)
│       └── loft_16_interior.glb  # Grand atrium welcome lounge (3.5MB)
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Root HTML metadata & dark theme
│   │   ├── page.tsx              # Main orchestrator (Canvas, HUD, Drone transitions)
│   │   └── globals.css           # Tailwind CSS v4 styling
│   ├── components/
│   │   ├── HUD.tsx               # Tactical vitals, compass, audio pill, crosshair
│   │   ├── DroneHUD.tsx          # 6-DOF artificial horizon, airspeed, 1km geofence
│   │   ├── ElevatorPanel.tsx     # Quick F1-F5 floor warp dock
│   │   ├── NPCDialogueModal.tsx  # Character portrait dialogue & lore dossiers
│   │   ├── CommsTransceiver.tsx  # Multi-agent transmission terminal & directives
│   │   ├── AgentOperationsMonitor.tsx # Real-time agent status tracker
│   │   └── KeybindsModal.tsx     # Interactive keyboard guide
│   └── game/
│       ├── engine.ts             # Three.js WebGLRenderer & rendering pipeline
│       ├── building.ts           # 5-story structural geometry, stairwell ramps, floors
│       ├── exteriorWorld.ts      # 1200m rolling hills, highway, cars, 420+ trees
│       ├── drone.ts              # 6-DOF aerodynamic drone flight & camera rig
│       ├── loftLoader.ts         # Asynchronous GLB model loader & floor staging
│       ├── materials.ts          # Shared PBR materials palette
│       ├── controls.ts           # First-person exploration controller & physics
│       ├── audio.ts              # Procedural Web Audio ambient synthesizer
│       ├── npc.ts                # 3D resident meshes & proximity raycasting
│       ├── npcData.ts            # Character registries & dialogue trees
│       └── types.ts              # TypeScript definitions & telemetry interfaces
└── package.json
```

---

## 📜 License
MIT
