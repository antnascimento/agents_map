'use client';

import React from 'react';
import { FloorLevel } from '../game/types';
import { Building2, ChevronsUp, X } from 'lucide-react';

interface ElevatorPanelProps {
  currentFloor: FloorLevel;
  onSelectFloor: (floor: FloorLevel) => void;
  onSelectRooftop: () => void;
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

export function ElevatorPanel({
  currentFloor,
  onSelectFloor,
  onSelectRooftop,
  isMobile = false,
  isOpen = true,
  onClose,
}: ElevatorPanelProps) {
  if (isMobile && !isOpen) return null;

  const floors: { level: FloorLevel; label: string; desc: string }[] = [
    { level: 5, label: 'F5', desc: 'Penthouse & Helipad' },
    { level: 4, label: 'F4', desc: 'Botanical Sky Garden' },
    { level: 3, label: 'F3', desc: 'Strategy & Archives' },
    { level: 2, label: 'F2', desc: 'Quantum Lab' },
    { level: 1, label: 'F1', desc: 'Grand Atrium Lobby' },
  ];

  const panelContent = (
    <div className={`flex flex-col gap-1.5 rounded-2xl border border-white/10 bg-black/85 p-3 backdrop-blur-xl shadow-2xl ${
      isMobile ? 'w-80 max-w-[90vw]' : 'fixed left-4 bottom-16 z-20'
    }`}>
      <div className="flex items-center justify-between px-2 py-1 text-[11px] font-mono font-semibold uppercase tracking-wider text-cyan-400 border-b border-white/10 mb-1">
        <span className="flex items-center gap-1.5">
          <Building2 className="h-3.5 w-3.5" />
          ELEVATOR EXPRESS
        </span>
        {isMobile && onClose ? (
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-lg"
          >
            <X className="h-4 w-4" />
          </button>
        ) : (
          <span className="text-zinc-500 text-[10px]">WARP</span>
        )}
      </div>

      {floors.map((f) => {
        const isActive = currentFloor === f.level;
        return (
          <button
            key={f.level}
            onClick={() => {
              onSelectFloor(f.level);
              if (isMobile && onClose) onClose();
            }}
            className={`flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-xs font-mono transition-all text-left ${
              isActive
                ? 'bg-cyan-500/25 border border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(0,240,255,0.25)] font-bold'
                : 'hover:bg-white/10 text-zinc-400 hover:text-zinc-200 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className={`inline-block w-6 text-center font-bold ${isActive ? 'text-cyan-300' : 'text-zinc-400'}`}>
                {f.label}
              </span>
              <span className="text-[11px] tracking-tight">{f.desc}</span>
            </div>
            {isActive && (
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            )}
          </button>
        );
      })}

      <button
        onClick={() => {
          onSelectRooftop();
          if (isMobile && onClose) onClose();
        }}
        className="mt-1 flex items-center justify-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-950/30 px-3 py-2 text-[11px] font-mono font-semibold text-amber-300 hover:bg-amber-900/40 hover:border-amber-400 transition-all"
      >
        <ChevronsUp className="h-3.5 w-3.5" />
        <span>ROOFTOP HELIPAD (31m)</span>
      </button>
    </div>
  );

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        {panelContent}
      </div>
    );
  }

  return panelContent;
}

