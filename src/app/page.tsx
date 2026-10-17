'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ThreeEngine } from '../game/engine';
import { FloorLevel, PlayerTelemetry, NPCData, DroneTelemetry, CombatTelemetry } from '../game/types';
import { HUD } from '../components/HUD';
import { ElevatorPanel } from '../components/ElevatorPanel';
import { CommsTransceiver } from '../components/CommsTransceiver';
import { KeybindsModal } from '../components/KeybindsModal';
import { NPCDialogueModal } from '../components/NPCDialogueModal';
import { AgentOperationsMonitor } from '../components/AgentOperationsMonitor';
import { DroneHUD } from '../components/DroneHUD';
import { MobileTouchControls } from '../components/MobileTouchControls';
import { Plane, Zap } from 'lucide-react';

export default function ExplorationGamePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<ThreeEngine | null>(null);

  // Responsive Mobile Detection
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileElevatorOpen, setIsMobileElevatorOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768 || ('ontouchstart' in window && window.innerWidth < 1024);
      setIsMobile(mobile);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const [telemetry, setTelemetry] = useState<PlayerTelemetry | null>(null);
  const [combatTelemetry, setCombatTelemetry] = useState<CombatTelemetry | null>(null);
  const [nearNPC, setNearNPC] = useState<NPCData | null>(null);
  const [activeNPC, setActiveNPC] = useState<NPCData | null>(null);

  // Drone Flight State
  const [isDroneFlight, setIsDroneFlight] = useState(false);
  const [droneTelemetry, setDroneTelemetry] = useState<DroneTelemetry | null>(null);

  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isCommsOpen, setIsCommsOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [warpMessage, setWarpMessage] = useState<string | null>(null);

  // Reference to always have latest nearNPC inside event listeners
  const nearNPCRef = useRef<NPCData | null>(null);
  nearNPCRef.current = nearNPC;
  const activeNPCRef = useRef<NPCData | null>(null);
  activeNPCRef.current = activeNPC;

  const handleStartDroneFlight = useCallback(() => {
    if (!engineRef.current) return;
    setIsDroneFlight(true);
    engineRef.current.startDroneFlight();
  }, []);

  const handleExitDroneFlight = useCallback(() => {
    if (!engineRef.current) return;
    setIsDroneFlight(false);
    engineRef.current.exitDroneFlight();
  }, []);

  // Floor quick-travel handler
  const handleSelectFloor = useCallback((level: FloorLevel) => {
    if (!engineRef.current) return;

    setIsTransitioning(true);
    setWarpMessage(`ELEVATOR TRANSIT >> LEVEL ${level}`);

    setTimeout(() => {
      engineRef.current?.controls.teleportToFloor(level);
      setTimeout(() => {
        setIsTransitioning(false);
        setWarpMessage(null);
      }, 300);
    }, 200);
  }, []);

  // Rooftop quick-travel handler
  const handleSelectRooftop = useCallback(() => {
    if (!engineRef.current) return;

    setIsTransitioning(true);
    setWarpMessage('ELEVATOR TRANSIT >> ROOFTOP HELIPAD (31.7m)');

    setTimeout(() => {
      engineRef.current?.controls.teleportTo(0, 31.7, 0);
      setTimeout(() => {
        setIsTransitioning(false);
        setWarpMessage(null);
      }, 300);
    }, 200);
  }, []);

  const handleSelectFloorRef = useRef(handleSelectFloor);
  handleSelectFloorRef.current = handleSelectFloor;
  const handleSelectRooftopRef = useRef(handleSelectRooftop);
  handleSelectRooftopRef.current = handleSelectRooftop;
  const handleStartDroneFlightRef = useRef(handleStartDroneFlight);
  handleStartDroneFlightRef.current = handleStartDroneFlight;
  const telemetryRef = useRef<PlayerTelemetry | null>(null);
  const lastTelemetryTime = useRef(0);
  const lastDroneTelemetryTime = useRef(0);

  // Initialize Three.js Engine once on mount
  useEffect(() => {
    if (!containerRef.current) return;

    const engine = new ThreeEngine(
      containerRef.current,
      (newTelemetry) => {
        const now = performance.now();
        // Throttle React state updates to 10 FPS (100ms) unless floor changes, keeping Three.js rendering at 60-120 FPS
        if (now - lastTelemetryTime.current > 100 || telemetryRef.current?.currentFloor !== newTelemetry.currentFloor) {
          lastTelemetryTime.current = now;
          telemetryRef.current = newTelemetry;
          setTelemetry(newTelemetry);
        }
      },
      (npc) => {
        setNearNPC(npc);
      },
      (newDroneTelemetry) => {
        const now = performance.now();
        if (now - lastDroneTelemetryTime.current > 100) {
          lastDroneTelemetryTime.current = now;
          setDroneTelemetry(newDroneTelemetry);
        }
      },
      (newCombatTelemetry) => {
        setCombatTelemetry(newCombatTelemetry);
      }
    );

    engine.drone.onExit = () => {
      setIsDroneFlight(false);
    };

    engineRef.current = engine;

    // Global Key Listener
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid triggering when user is typing in transceiver input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.code === 'KeyE') {
        if (activeNPCRef.current) {
          // In dialog
        } else if (nearNPCRef.current) {
          setActiveNPC(nearNPCRef.current);
        }
      } else if (e.code === 'KeyG') {
        // Draw / holster plasma rifle
        engineRef.current?.combat.toggleWeapon();
      } else if (e.code === 'KeyF') {
        // Quick drone launch shortcut when on helipad
        if (engineRef.current && !engineRef.current.drone.isActive && engineRef.current.controls.position.y >= 28) {
          handleStartDroneFlightRef.current();
        }
      } else if (e.code === 'KeyH') {
        setIsHelpOpen((prev) => !prev);
      } else if (e.code === 'KeyT') {
        setIsCommsOpen((prev) => !prev);
      } else if (e.code === 'Digit1') {
        handleSelectFloorRef.current(1);
      } else if (e.code === 'Digit2') {
        handleSelectFloorRef.current(2);
      } else if (e.code === 'Digit3') {
        handleSelectFloorRef.current(3);
      } else if (e.code === 'Digit4') {
        handleSelectFloorRef.current(4);
      } else if (e.code === 'Digit5') {
        handleSelectFloorRef.current(5);
      }
    };

    // Global Mouse Click for Shooting Doom Plasma Rifle
    const handleMouseDown = (e: MouseEvent) => {
      // Left click fires weapon when cursor is locked or canvas active
      if (e.button === 0 && document.pointerLockElement) {
        engineRef.current?.combat.shoot();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleMouseDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleMouseDown);
      engine.dispose();
      engineRef.current = null;
    };
  }, []); // Strictly empty dependency array so engine stays permanently alive

  // Handle commander commands sent through comms
  const handleCommanderCommand = useCallback((cmd: string) => {
    const normalized = cmd.trim().toLowerCase();
    if (normalized.includes('drone') || normalized.includes('fly')) {
      handleSelectRooftop();
      setTimeout(() => {
        handleStartDroneFlight();
      }, 500);
    } else if (normalized.includes('floor 1') || normalized === '1' || normalized === 'f1') {
      handleSelectFloor(1);
    } else if (normalized.includes('floor 2') || normalized === '2' || normalized === 'f2') {
      handleSelectFloor(2);
    } else if (normalized.includes('floor 3') || normalized === '3' || normalized === 'f3') {
      handleSelectFloor(3);
    } else if (normalized.includes('floor 4') || normalized === '4' || normalized === 'f4') {
      handleSelectFloor(4);
    } else if (normalized.includes('floor 5') || normalized === '5' || normalized === 'f5') {
      handleSelectFloor(5);
    } else if (normalized.includes('roof') || normalized.includes('helipad')) {
      handleSelectRooftop();
    }
  }, [handleSelectFloor, handleSelectRooftop, handleStartDroneFlight]);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-black select-none">
      {/* Three.js Canvas Container */}
      <div ref={containerRef} className="absolute inset-0 cursor-crosshair" />

      {/* Warp Transition Screen Overlay */}
      {isTransitioning && (
        <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md transition-opacity duration-300">
          <div className="flex flex-col items-center gap-3">
            <div className="h-12 w-12 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin shadow-[0_0_20px_#00f0ff]" />
            <div className="font-mono text-sm font-bold tracking-widest text-cyan-300 animate-pulse">
              {warpMessage || 'ENGAGING ELEVATOR WARP...'}
            </div>
          </div>
        </div>
      )}

      {/* DRONE FLIGHT MODE ACTIVE */}
      {isDroneFlight ? (
        <DroneHUD
          telemetry={droneTelemetry}
          onExitDrone={handleExitDroneFlight}
          isMobile={isMobile}
        />
      ) : (
        /* STANDARD CHARACTER EXPLORATION MODE */
        <>
          {/* Tactical HUD Header & Badges */}
          <HUD
            telemetry={telemetry}
            combat={combatTelemetry}
            nearNPC={nearNPC}
            onInteractNPC={() => {
              if (nearNPC) setActiveNPC(nearNPC);
            }}
            onOpenHelp={() => setIsHelpOpen(true)}
            onOpenComms={() => setIsCommsOpen(true)}
            isMobile={isMobile}
          />

          {/* Desktop Helipad Drone Launch Button (Visible on Rooftop) */}
          {!isMobile && telemetry && telemetry.position.y >= 28 && (
            <div className="fixed left-4 bottom-80 z-30 animate-pulse">
              <button
                onClick={handleStartDroneFlight}
                className="flex items-center gap-3 rounded-2xl border-2 border-cyan-400 bg-cyan-950/85 px-4 py-3 text-white font-mono shadow-[0_0_25px_rgba(0,240,255,0.5)] backdrop-blur-xl hover:scale-105 hover:bg-cyan-900 transition-all cursor-pointer"
              >
                <Plane className="h-6 w-6 text-cyan-300 animate-bounce" />
                <div className="text-left">
                  <div className="text-[10px] uppercase tracking-wider text-cyan-300 font-bold flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                    ROOFTOP HELIPAD // DOCK
                  </div>
                  <div className="text-xs font-black text-white">
                    LAUNCH RECON DRONE (1KM) [F]
                  </div>
                </div>
              </button>
            </div>
          )}

          {/* Floor Selector / Quick Elevator Deck */}
          <ElevatorPanel
            currentFloor={telemetry?.currentFloor ?? 1}
            onSelectFloor={handleSelectFloor}
            onSelectRooftop={handleSelectRooftop}
            isMobile={isMobile}
            isOpen={isMobile ? isMobileElevatorOpen : true}
            onClose={() => setIsMobileElevatorOpen(false)}
          />

          {/* Agent Comms Transceiver Terminal */}
          <CommsTransceiver
            isOpen={isCommsOpen}
            onClose={() => setIsCommsOpen(false)}
            onCommanderCommand={handleCommanderCommand}
          />

          {/* Controls & Keybinds Reference Modal */}
          <KeybindsModal
            isOpen={isHelpOpen}
            onClose={() => setIsHelpOpen(false)}
          />

          {/* Interactive NPC Dialogue Modal */}
          <NPCDialogueModal
            npc={activeNPC}
            isOpen={!!activeNPC}
            onClose={() => setActiveNPC(null)}
          />
        </>
      )}

      {/* MOBILE CIRCLE BUTTON PAD & TOUCH CONTROLS */}
      {isMobile && (
        <MobileTouchControls
          isDroneFlight={isDroneFlight}
          nearNPC={nearNPC}
          onHelipad={!!(telemetry && telemetry.position.y >= 28)}
          isWeaponDrawn={combatTelemetry?.isWeaponDrawn ?? false}
          onToggleWeapon={() => {
            engineRef.current?.combat.toggleWeapon();
          }}
          onShoot={() => {
            engineRef.current?.combat.shoot();
          }}
          onMove={(x, y) => {
            if (isDroneFlight) {
              engineRef.current?.drone.setJoystick(x, y);
            } else {
              engineRef.current?.controls.setJoystick(x, y);
            }
          }}
          onLook={(dx, dy) => {
            if (isDroneFlight) {
              engineRef.current?.drone.applyLookDelta(dx, dy);
            } else {
              engineRef.current?.controls.applyLookDelta(dx, dy);
            }
          }}
          onJump={() => {
            engineRef.current?.controls.triggerJump();
          }}
          onSprintToggle={(sprint) => {
            engineRef.current?.controls.setMobileSprint(sprint);
          }}
          onInteractNPC={() => {
            if (nearNPCRef.current) setActiveNPC(nearNPCRef.current);
          }}
          onLaunchDrone={() => {
            handleStartDroneFlight();
          }}
          onOpenElevator={() => {
            setIsMobileElevatorOpen(true);
          }}
          onDroneAscend={(ascend) => {
            engineRef.current?.drone.setAltitude(ascend, false);
          }}
          onDroneDescend={(descend) => {
            engineRef.current?.drone.setAltitude(false, descend);
          }}
          onDroneTurbo={(turbo) => {
            engineRef.current?.drone.setTurbo(turbo);
          }}
          onDroneYaw={(dir) => {
            engineRef.current?.drone.setYaw(dir);
          }}
          onDroneExit={() => {
            handleExitDroneFlight();
          }}
        />
      )}

      {/* On-Screen Agent Operations Monitor (Desktop floating panel or mobile pill drawer) */}
      <AgentOperationsMonitor isMobile={isMobile} />
    </main>
  );
}
