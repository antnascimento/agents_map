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

1. **5-Story Architectural Complex ("The Apex Nexus")**:
   * **Story 1 (Grand Atrium & Welcome Lounge)**: Calacatta marble with dark Nero borders, brass medallion, contemporary canvas art, and staged with `loft_16_interior.glb`.
   * **Story 2 (Quantum & Cybernetics Lab)**: Reflective epoxy floor grid with illuminated sub-floor cable trenches, cryogenic quantum core, and server clusters.
   * **Story 3 (Executive Strategy Suite)**: Staged with **`free_loft_18.glb`** featuring mezzanine stairs, designer kitchen, and mid-century modern lounge.
   * **Story 4 (Botanical Sky Garden & Terrace)**: Biophilic green lawn, Japanese maple tree, cedar boardwalks, and staged with `interior_7.glb`.
   * **Story 5 (Penthouse Command & Helipad)**: Semicircular master bridge console with wireframe tactical globe, luxury loft staging of `free_loft_18.glb`, and an outdoor rooftop landing deck with aviation hazard beacons.

2. **Slow Roads & Bottled-Inspired Exterior Vistas**:
   * **1200m Rolling Green Hills & Meadows**: Sinusoidal procedural terrain extending to the horizon.
   * **Scenic Highway with Active Traffic**: 18 smoothly animated vehicles (cars & buses) driving in both directions with illuminated headlights and taillights.
   * **420+ Instanced Trees**: Lush stylized foliage clusters rendered efficiently via `THREE.InstancedMesh`.
   * **Distant City Skyline**: 55+ glass skyscrapers and communication spires with flashing beacons.
   * **Drifting 3D Cumulus Clouds**: Low-poly cloud formations slowly crossing the azure daytime sky dome.

3. **Apex-1 Recon Drone (1km Aerial Flight Mode)**:
   * Approach the rooftop helipad drone dock and press **`[F]`** to take flight!
   * Full 6-DOF aerodynamics: pitch forward/back, banking roll, yaw steering, vertical climb/descent, and **Turbo Boost up to 137 km/h**.
   * Fly anywhere within a **1-kilometer (1000m)** radius of the building.
   * Tactical Flight Cockpit HUD with Artificial Horizon, Pitch Ladder, Airspeed (km/h), AGL Altimeter, Geofence Radar, Signal Strength, and Battery monitor.

4. **10 Interactive Resident NPCs (Humans & Specialized Droids)**:
   * Approach within 3.5m of any character and press **`[E]`** to open an interactive dialogue modal with portraits, voice transcripts, and lore dossiers.
   * Distributed 2 per floor across all 5 stories (Ava, Sentrix, Dr. Chen, Cyber-Unit 7, Marcus, Byte, Elena, Sprout, Captain Vance, and Nexus-9).

5. **Generative Ambient Music Synthesizer (Web Audio API)**:
   * Breathing analog synth pads (*Cmaj7* $\to$ *Am7* $\to$ *Fmaj7* $\to$ *Dm7* $\to$ *Gsus4*) with dynamic lowpass filter modulation and crystalline pentatonic chimes.
   * Zero external MP3 downloads; 100% offline and latency-free.
   * HUD audio pill `[🎵 MUSIC: ON / OFF]` with animated equalizer bars.

6. **Live Multi-Agent Operations Monitor & Comms Transceiver**:
   * Real-time HUD widget showing what Agent Atlas, Agent Neo, Agent Iris, and Agent Scribe are doing.
   * Interactive encrypted transceiver terminal (<kbd>T</kbd>) to review agent dialogue and issue commander directives (`fly`, `drone`, `floor 1-5`, `helipad`).

---

## ⌨️ Controls & Keybindings

### Character Exploration Mode
| Key | Action |
| :--- | :--- |
| <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd> / <kbd>Arrows</kbd> | Move forward, backward, and strafe |
| <kbd>Mouse</kbd> | Look / Rotate camera (Click canvas for PointerLock) |
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
