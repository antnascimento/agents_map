'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  ChevronsUp,
  ChevronsDown,
  Zap,
  RotateCcw,
  Plane,
  Building2,
  MessageSquare,
  ArrowUp,
  ArrowDown,
  RotateCw,
  Crosshair,
  Flame,
} from 'lucide-react';
import { NPCData } from '../game/types';

interface MobileTouchControlsProps {
  isDroneFlight: boolean;
  nearNPC: NPCData | null;
  onHelipad: boolean;
  isWeaponDrawn?: boolean;
  onToggleWeapon?: () => void;
  onShoot?: () => void;
  onMove: (x: number, y: number) => void;
  onLook: (deltaX: number, deltaY: number) => void;
  onJump?: () => void;
  onSprintToggle?: (sprinting: boolean) => void;
  onInteractNPC?: () => void;
  onLaunchDrone?: () => void;
  onOpenElevator?: () => void;
  onDroneAscend?: (active: boolean) => void;
  onDroneDescend?: (active: boolean) => void;
  onDroneTurbo?: (active: boolean) => void;
  onDroneYaw?: (direction: number) => void; // -1 left, 0 none, +1 right
  onDroneFire?: () => void;
  onDroneExit?: () => void;
}

export function MobileTouchControls({
  isDroneFlight,
  nearNPC,
  onHelipad,
  isWeaponDrawn = false,
  onToggleWeapon,
  onShoot,
  onMove,
  onLook,
  onJump,
  onSprintToggle,
  onInteractNPC,
  onLaunchDrone,
  onOpenElevator,
  onDroneAscend,
  onDroneDescend,
  onDroneTurbo,
  onDroneYaw,
  onDroneFire,
  onDroneExit,
}: MobileTouchControlsProps) {
  // --- 1. VIRTUAL JOYSTICK STATE & HANDLERS ---
  const joystickBaseRef = useRef<HTMLDivElement>(null);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const [isJoystickActive, setIsJoystickActive] = useState(false);
  const activePointerIdRef = useRef<number | null>(null);
  const centerCoordRef = useRef({ x: 0, y: 0 });
  const MAX_RADIUS = 46; // max px distance knob can travel from center

  const handleJoystickPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!joystickBaseRef.current) return;
    const rect = joystickBaseRef.current.getBoundingClientRect();
    centerCoordRef.current = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
    activePointerIdRef.current = e.pointerId;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setIsJoystickActive(true);
    updateJoystick(e.clientX, e.clientY);
  };

  const updateJoystick = (clientX: number, clientY: number) => {
    const dx = clientX - centerCoordRef.current.x;
    const dy = clientY - centerCoordRef.current.y;
    const dist = Math.hypot(dx, dy);

    let clampedX = dx;
    let clampedY = dy;
    if (dist > MAX_RADIUS) {
      clampedX = (dx / dist) * MAX_RADIUS;
      clampedY = (dy / dist) * MAX_RADIUS;
    }

    setKnobPos({ x: clampedX, y: clampedY });

    // Output normalized vector: x [-1, 1], y [-1, 1] (y is inverted so dragging up is positive forward)
    const normX = clampedX / MAX_RADIUS;
    const normY = -clampedY / MAX_RADIUS;
    onMove(normX, normY);
  };

  const handleJoystickPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isJoystickActive || e.pointerId !== activePointerIdRef.current) return;
    e.stopPropagation();
    updateJoystick(e.clientX, e.clientY);
  };

  const handleJoystickPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerId !== activePointerIdRef.current) return;
    e.stopPropagation();
    setIsJoystickActive(false);
    activePointerIdRef.current = null;
    setKnobPos({ x: 0, y: 0 });
    onMove(0, 0);
  };

  // --- 2. CAMERA TOUCH LOOK PAD HANDLERS ---
  const lookPointerIdRef = useRef<number | null>(null);
  const lastLookCoordRef = useRef({ x: 0, y: 0 });

  const handleLookPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only capture if not clicking interactive buttons
    if ((e.target as HTMLElement).closest('button')) return;
    lookPointerIdRef.current = e.pointerId;
    lastLookCoordRef.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleLookPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (lookPointerIdRef.current !== e.pointerId) return;
    const deltaX = e.clientX - lastLookCoordRef.current.x;
    const deltaY = e.clientY - lastLookCoordRef.current.y;
    lastLookCoordRef.current = { x: e.clientX, y: e.clientY };
    onLook(deltaX, deltaY);
  };

  const handleLookPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (lookPointerIdRef.current === e.pointerId) {
      lookPointerIdRef.current = null;
    }
  };

  // --- 3. CHARACTER SPRINT STATE ---
  const [isSprinting, setIsSprinting] = useState(false);
  const toggleSprint = () => {
    const nextSprint = !isSprinting;
    setIsSprinting(nextSprint);
    if (onSprintToggle) onSprintToggle(nextSprint);
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-30 select-none overflow-hidden touch-none">
      {/* RIGHT-HALF TOUCH LOOK ZONE */}
      <div
        className="pointer-events-auto absolute right-0 top-16 bottom-0 w-3/5"
        onPointerDown={handleLookPointerDown}
        onPointerMove={handleLookPointerMove}
        onPointerUp={handleLookPointerUp}
        onPointerCancel={handleLookPointerUp}
      />

      {/* LEFT: VIRTUAL CIRCLE BUTTON PAD (JOYSTICK) */}
      <div className="pointer-events-auto absolute bottom-6 left-6 z-40">
        <div
          ref={joystickBaseRef}
          onPointerDown={handleJoystickPointerDown}
          onPointerMove={handleJoystickPointerMove}
          onPointerUp={handleJoystickPointerUp}
          onPointerCancel={handleJoystickPointerUp}
          className={`relative h-32 w-32 rounded-full border-2 transition-colors flex items-center justify-center backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.6)] ${
            isJoystickActive
              ? 'border-cyan-400 bg-cyan-950/40 shadow-[0_0_20px_rgba(0,240,255,0.3)]'
              : 'border-white/20 bg-black/45'
          }`}
        >
          {/* Subtle directional indicators */}
          <div className="absolute top-2 text-[9px] font-mono text-cyan-400/50 font-bold">▲</div>
          <div className="absolute bottom-2 text-[9px] font-mono text-cyan-400/50 font-bold">▼</div>
          <div className="absolute left-2 text-[9px] font-mono text-cyan-400/50 font-bold">◀</div>
          <div className="absolute right-2 text-[9px] font-mono text-cyan-400/50 font-bold">▶</div>

          {/* Crosshair guidelines */}
          <div className="absolute h-full w-[1px] bg-white/10" />
          <div className="absolute w-full h-[1px] bg-white/10" />

          {/* Moving Knob */}
          <div
            className={`h-12 w-12 rounded-full border border-cyan-300 transition-transform duration-75 flex items-center justify-center shadow-lg ${
              isJoystickActive
                ? 'bg-cyan-400 text-black scale-105 shadow-[0_0_15px_#00f0ff]'
                : 'bg-cyan-500/30 text-cyan-200'
            }`}
            style={{
              transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
            }}
          >
            <div className="h-3 w-3 rounded-full bg-cyan-200 shadow" />
          </div>
        </div>
      </div>

      {/* RIGHT: VIRTUAL ACTION BUTTONS */}
      {isDroneFlight ? (
        /* --- DRONE FLIGHT ACTION CLUSTER --- */
        <div className="pointer-events-auto absolute bottom-6 right-5 z-40 flex flex-col items-end gap-3">
          {/* Top row: Yaw & Turbo */}
          <div className="flex items-center gap-2.5">
            {/* Yaw Left */}
            <button
              onPointerDown={() => onDroneYaw && onDroneYaw(-1)}
              onPointerUp={() => onDroneYaw && onDroneYaw(0)}
              onPointerCancel={() => onDroneYaw && onDroneYaw(0)}
              className="h-12 w-12 rounded-2xl border border-cyan-400/50 bg-black/70 flex flex-col items-center justify-center text-cyan-300 active:bg-cyan-500 active:text-black shadow-md"
              title="Yaw Left"
            >
              <RotateCcw className="h-5 w-5" />
              <span className="text-[8px] font-mono font-bold">YAW L</span>
            </button>

            {/* Yaw Right */}
            <button
              onPointerDown={() => onDroneYaw && onDroneYaw(1)}
              onPointerUp={() => onDroneYaw && onDroneYaw(0)}
              onPointerCancel={() => onDroneYaw && onDroneYaw(0)}
              className="h-12 w-12 rounded-2xl border border-cyan-400/50 bg-black/70 flex flex-col items-center justify-center text-cyan-300 active:bg-cyan-500 active:text-black shadow-md"
              title="Yaw Right"
            >
              <RotateCw className="h-5 w-5" />
              <span className="text-[8px] font-mono font-bold">YAW R</span>
            </button>

            {/* Turbo Boost */}
            <button
              onPointerDown={() => onDroneTurbo && onDroneTurbo(true)}
              onPointerUp={() => onDroneTurbo && onDroneTurbo(false)}
              onPointerCancel={() => onDroneTurbo && onDroneTurbo(false)}
              className="h-14 w-14 rounded-2xl border-2 border-emerald-400 bg-emerald-950/70 flex flex-col items-center justify-center text-emerald-300 active:bg-emerald-400 active:text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]"
              title="Hold for Turbo Boost"
            >
              <Zap className="h-6 w-6 animate-pulse" />
              <span className="text-[8px] font-mono font-black">TURBO</span>
            </button>

            {/* R-Type Heavy Cannon Fire */}
            <button
              onPointerDown={(e) => {
                e.stopPropagation();
                onDroneFire && onDroneFire();
              }}
              className="h-14 w-14 rounded-2xl border-2 border-red-500 bg-red-600/90 flex flex-col items-center justify-center text-white active:scale-90 active:bg-red-400 shadow-[0_0_20px_rgba(239,68,68,0.8)] animate-pulse"
              title="Fire Twin Plasma Cannons"
            >
              <Flame className="h-6 w-6 text-yellow-200" />
              <span className="text-[8px] font-mono font-black">FIRE</span>
            </button>
          </div>

          {/* Bottom row: Ascend, Descend, Exit */}
          <div className="flex items-center gap-2.5">
            {/* Ascend / Climb */}
            <button
              onPointerDown={() => onDroneAscend && onDroneAscend(true)}
              onPointerUp={() => onDroneAscend && onDroneAscend(false)}
              onPointerCancel={() => onDroneAscend && onDroneAscend(false)}
              className="h-14 w-14 rounded-2xl border-2 border-cyan-400 bg-cyan-950/70 flex flex-col items-center justify-center text-cyan-200 active:bg-cyan-400 active:text-black shadow-[0_0_15px_rgba(0,240,255,0.4)]"
              title="Climb Altitude"
            >
              <ArrowUp className="h-6 w-6" />
              <span className="text-[8px] font-mono font-black">CLIMB</span>
            </button>

            {/* Descend / Dive */}
            <button
              onPointerDown={() => onDroneDescend && onDroneDescend(true)}
              onPointerUp={() => onDroneDescend && onDroneDescend(false)}
              onPointerCancel={() => onDroneDescend && onDroneDescend(false)}
              className="h-14 w-14 rounded-2xl border-2 border-cyan-400/60 bg-black/70 flex flex-col items-center justify-center text-cyan-300 active:bg-cyan-400 active:text-black shadow-md"
              title="Descend Altitude"
            >
              <ArrowDown className="h-6 w-6" />
              <span className="text-[8px] font-mono font-black">DESCEND</span>
            </button>

            {/* Return / Land */}
            <button
              onClick={onDroneExit}
              className="h-14 w-14 rounded-2xl border-2 border-red-500/70 bg-red-950/80 flex flex-col items-center justify-center text-red-200 active:bg-red-500 active:text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]"
              title="Exit Drone Flight"
            >
              <RotateCcw className="h-5 w-5" />
              <span className="text-[8px] font-mono font-black">LAND</span>
            </button>
          </div>
        </div>
      ) : (
        /* --- CHARACTER EXPLORATION ACTION CLUSTER --- */
        <div className="pointer-events-auto absolute bottom-6 right-5 z-40 flex flex-col items-end gap-3">
          {/* Top row: Special Context Actions (Interact / Fly Drone / Elevator) */}
          <div className="flex items-center gap-2.5">
            {/* NPC Interact button (glows when near NPC) */}
            {nearNPC && (
              <button
                onClick={onInteractNPC}
                className="flex items-center gap-2 rounded-2xl border-2 border-cyan-400 bg-cyan-950/90 px-4 py-3 text-cyan-200 shadow-[0_0_20px_rgba(0,240,255,0.6)] backdrop-blur-md animate-pulse active:scale-95 transition-all"
              >
                <MessageSquare className="h-5 w-5 text-cyan-300" />
                <span className="text-xs font-mono font-black text-white">TALK [E]</span>
              </button>
            )}

            {/* Helipad Drone Launch button (glows when on roof) */}
            {onHelipad && (
              <button
                onClick={onLaunchDrone}
                className="flex items-center gap-2 rounded-2xl border-2 border-amber-400 bg-amber-950/90 px-4 py-3 text-amber-200 shadow-[0_0_20px_rgba(245,158,11,0.6)] backdrop-blur-md animate-bounce active:scale-95 transition-all"
              >
                <Plane className="h-5 w-5 text-amber-300" />
                <span className="text-xs font-mono font-black text-white">FLY DRONE</span>
              </button>
            )}

            {/* Draw / Holster Weapon [G] */}
            <button
              onClick={onToggleWeapon}
              className={`h-12 w-12 rounded-2xl border-2 flex flex-col items-center justify-center transition-all backdrop-blur-md shadow-md active:scale-95 ${
                isWeaponDrawn
                  ? 'border-red-400 bg-red-950/80 text-red-200 shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                  : 'border-white/20 bg-black/70 text-zinc-300 active:bg-white/20'
              }`}
              title="Toggle Weapon [G]"
            >
              <Crosshair className="h-5 w-5" />
              <span className="text-[7px] font-mono font-black">{isWeaponDrawn ? 'GUN [G]' : 'DRAW [G]'}</span>
            </button>

            {/* Quick Elevator Drawer Trigger */}
            <button
              onClick={onOpenElevator}
              className="h-12 w-12 rounded-2xl border border-cyan-500/40 bg-black/70 flex flex-col items-center justify-center text-cyan-300 backdrop-blur-md active:bg-cyan-500 active:text-black shadow-md"
              title="Open Elevator"
            >
              <Building2 className="h-5 w-5" />
              <span className="text-[8px] font-mono font-bold">WARP</span>
            </button>
          </div>

          {/* Bottom row: Sprint Toggle, Jump, and Fire Button (when drawn) */}
          <div className="flex items-center gap-3">
            {/* Fire Button (Only visible when weapon is drawn) */}
            {isWeaponDrawn && (
              <button
                onPointerDown={(e) => {
                  e.stopPropagation();
                  onShoot && onShoot();
                }}
                className="h-16 w-16 rounded-3xl border-2 border-red-500 bg-red-600/90 text-white flex flex-col items-center justify-center active:scale-90 active:bg-red-400 shadow-[0_0_25px_rgba(239,68,68,0.8)] backdrop-blur-md animate-pulse"
                title="Fire Plasma Weapon"
              >
                <Flame className="h-7 w-7 text-yellow-200" />
                <span className="text-[9px] font-mono font-black tracking-wider">FIRE</span>
              </button>
            )}

            {/* Sprint Toggle */}
            <button
              onClick={toggleSprint}
              className={`h-14 w-14 rounded-2xl border-2 flex flex-col items-center justify-center transition-all backdrop-blur-md shadow-lg ${
                isSprinting
                  ? 'border-emerald-400 bg-emerald-950/80 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.5)] font-black'
                  : 'border-white/20 bg-black/60 text-zinc-300 active:bg-white/20'
              }`}
              title="Toggle Sprint"
            >
              <Zap className={`h-6 w-6 ${isSprinting ? 'text-emerald-300 animate-pulse' : 'text-zinc-400'}`} />
              <span className="text-[8px] font-mono font-bold">
                {isSprinting ? 'SPRINT' : 'WALK'}
              </span>
            </button>

            {/* Jump Button */}
            <button
              onClick={onJump}
              className="h-16 w-16 rounded-3xl border-2 border-cyan-400 bg-cyan-950/85 flex flex-col items-center justify-center text-cyan-200 active:bg-cyan-400 active:text-black shadow-[0_0_20px_rgba(0,240,255,0.4)] backdrop-blur-md active:scale-95 transition-all"
              title="Jump"
            >
              <ChevronsUp className="h-7 w-7 text-cyan-300" />
              <span className="text-[9px] font-mono font-black">JUMP</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
