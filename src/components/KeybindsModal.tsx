'use client';

import React from 'react';
import { X, Keyboard, MousePointer, Move, Zap, ArrowUpCircle, MessageSquare, Crosshair, Skull } from 'lucide-react';

interface KeybindsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KeybindsModal({ isOpen, onClose }: KeybindsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg rounded-2xl border border-cyan-500/40 bg-zinc-950/90 p-6 shadow-2xl backdrop-blur-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-zinc-400 hover:bg-white/10 hover:text-white transition-all"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-950/70 border border-cyan-500/40 text-cyan-400">
            <Keyboard className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold font-mono text-white">CONTROLS & KEYBINDINGS</h2>
            <p className="text-xs text-zinc-400">Tactical Exploration & Combat Matrix</p>
          </div>
        </div>

        <div className="space-y-2.5 font-mono text-xs">
          {/* Doom Combat Controls */}
          <div className="flex items-center justify-between rounded-xl border border-red-500/50 bg-red-950/30 p-2.5">
            <div className="flex items-center gap-2 text-red-200">
              <Crosshair className="h-4 w-4 text-red-400" />
              <span className="font-bold text-red-300">Draw / Holster Weapon</span>
            </div>
            <div>
              <kbd className="rounded border border-red-400/50 bg-red-950/80 px-2.5 py-1 text-red-300 font-bold">G</kbd>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-red-500/40 bg-red-950/20 p-2.5">
            <div className="flex items-center gap-2 text-zinc-200">
              <Skull className="h-4 w-4 text-red-400" />
              <span>Shoot Plasma Rifle (Infinite Ammo)</span>
            </div>
            <div>
              <span className="rounded border border-red-400/40 bg-zinc-900 px-2.5 py-1 text-red-300 font-bold">Left Mouse Click</span>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-2.5">
            <div className="flex items-center gap-2 text-zinc-200">
              <Move className="h-4 w-4 text-cyan-400" />
              <span>Walk / Strafe</span>
            </div>
            <div className="flex gap-1">
              <kbd className="rounded border border-white/20 bg-zinc-800 px-2 py-1 text-cyan-300 font-bold">W</kbd>
              <kbd className="rounded border border-white/20 bg-zinc-800 px-2 py-1 text-cyan-300 font-bold">A</kbd>
              <kbd className="rounded border border-white/20 bg-zinc-800 px-2 py-1 text-cyan-300 font-bold">S</kbd>
              <kbd className="rounded border border-white/20 bg-zinc-800 px-2 py-1 text-cyan-300 font-bold">D</kbd>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-2.5">
            <div className="flex items-center gap-2 text-zinc-200">
              <MousePointer className="h-4 w-4 text-cyan-400" />
              <span>Look / Rotate View</span>
            </div>
            <div className="text-zinc-300">
              <span className="rounded border border-white/20 bg-zinc-800 px-2 py-1">Click Canvas / PointerLock</span>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-2.5">
            <div className="flex items-center gap-2 text-zinc-200">
              <MessageSquare className="h-4 w-4 text-cyan-300" />
              <span className="text-cyan-300 font-semibold">Talk / Interact with NPCs</span>
            </div>
            <div>
              <kbd className="rounded border border-cyan-400/50 bg-cyan-950/60 px-2.5 py-1 text-cyan-300 font-bold">E</kbd>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-2.5">
            <div className="flex items-center gap-2 text-zinc-200">
              <span className="text-cyan-300 font-semibold">Launch Drone (on Helipad)</span>
            </div>
            <div className="flex gap-1">
              <kbd className="rounded border border-cyan-400/50 bg-cyan-950/80 px-2 py-1 text-cyan-300 font-bold">F</kbd>
              <span className="text-[10px] text-zinc-400 self-center">or click Launch</span>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-2.5">
            <div className="flex items-center gap-2 text-zinc-200">
              <span className="text-zinc-300">Drone 1km Flight</span>
            </div>
            <div className="text-[10px] font-mono text-zinc-300">
              <kbd className="text-cyan-300 font-bold">W/S</kbd> Pitch • <kbd className="text-cyan-300 font-bold">A/D</kbd> Roll • <kbd className="text-cyan-300 font-bold">Q/E</kbd> Yaw • <kbd className="text-cyan-300 font-bold">SPACE</kbd> Climb • <kbd className="text-red-400 font-bold">R</kbd> Exit
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-2.5">
            <div className="flex items-center gap-2 text-zinc-200">
              <Zap className="h-4 w-4 text-emerald-400" />
              <span>Sprint Boost (8.5 m/s)</span>
            </div>
            <div>
              <kbd className="rounded border border-white/20 bg-zinc-800 px-2.5 py-1 text-emerald-300 font-bold">SHIFT</kbd>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-2.5">
            <div className="flex items-center gap-2 text-zinc-200">
              <ArrowUpCircle className="h-4 w-4 text-amber-400" />
              <span>Jump / Ascend Ledge</span>
            </div>
            <div>
              <kbd className="rounded border border-white/20 bg-zinc-800 px-2.5 py-1 text-amber-300 font-bold">SPACE</kbd>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-2.5">
            <div className="flex items-center gap-2 text-zinc-200">
              <span>Crouch (Lower Cam)</span>
            </div>
            <div>
              <kbd className="rounded border border-white/20 bg-zinc-800 px-2.5 py-1 text-zinc-300 font-bold">C / CTRL</kbd>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-2.5">
            <div className="flex items-center gap-2 text-zinc-200">
              <span>Instant Floor Jump</span>
            </div>
            <div className="flex gap-1">
              <kbd className="rounded border border-white/20 bg-zinc-800 px-1.5 py-1 text-cyan-300">1</kbd>
              <kbd className="rounded border border-white/20 bg-zinc-800 px-1.5 py-1 text-cyan-300">2</kbd>
              <kbd className="rounded border border-white/20 bg-zinc-800 px-1.5 py-1 text-cyan-300">3</kbd>
              <kbd className="rounded border border-white/20 bg-zinc-800 px-1.5 py-1 text-cyan-300">4</kbd>
              <kbd className="rounded border border-white/20 bg-zinc-800 px-1.5 py-1 text-cyan-300">5</kbd>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full rounded-xl bg-cyan-500 py-2.5 font-mono text-xs font-bold text-black hover:bg-cyan-400 transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)]"
        >
          ENTER 3D EXPLORATION
        </button>
      </div>
    </div>
  );
}
