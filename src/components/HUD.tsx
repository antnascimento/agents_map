'use client';

import React, { useState } from 'react';
import { PlayerTelemetry, NPCData } from '../game/types';
import { Compass, Footprints, Shield, Eye, MessageSquare, Bot, User, Volume2, VolumeX, Music } from 'lucide-react';
import { ambientAudio } from '../game/audio';

interface HUDProps {
  telemetry: PlayerTelemetry | null;
  nearNPC?: NPCData | null;
  onInteractNPC?: () => void;
  onOpenHelp: () => void;
  onOpenComms: () => void;
  unreadCommsCount?: number;
  isMobile?: boolean;
}

export function HUD({
  telemetry,
  nearNPC,
  onInteractNPC,
  onOpenHelp,
  onOpenComms,
  unreadCommsCount = 0,
  isMobile = false,
}: HUDProps) {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const handleToggleAudio = () => {
    if (ambientAudio) {
      const playing = ambientAudio.toggle();
      setIsAudioPlaying(playing);
    }
  };

  if (!telemetry) return null;

  const cardinalPoints = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const headingIndex = Math.round(telemetry.heading / 45) % 8;
  const cardinal = cardinalPoints[headingIndex];

  return (
    <>
      {/* Center Screen Tactical Crosshair */}
      <div className="pointer-events-none fixed inset-0 z-10 flex items-center justify-center">
        <div className="relative h-6 w-6">
          <div className="absolute left-1/2 top-0 h-2 w-[1.5px] -translate-x-1/2 bg-cyan-400/80 shadow-[0_0_6px_#00f0ff]" />
          <div className="absolute bottom-0 left-1/2 h-2 w-[1.5px] -translate-x-1/2 bg-cyan-400/80 shadow-[0_0_6px_#00f0ff]" />
          <div className="absolute left-0 top-1/2 h-[1.5px] w-2 -translate-y-1/2 bg-cyan-400/80 shadow-[0_0_6px_#00f0ff]" />
          <div className="absolute right-0 top-1/2 h-[1.5px] w-2 -translate-y-1/2 bg-cyan-400/80 shadow-[0_0_6px_#00f0ff]" />
          <div className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300 shadow-[0_0_8px_#00f0ff]" />
        </div>
      </div>

      {/* Top Left: Floor Level & Building Telemetry */}
      <div className="pointer-events-auto fixed left-4 top-4 z-20 flex flex-col gap-1.5">
        <div className="flex items-center gap-2.5 rounded-2xl border border-cyan-500/40 bg-black/65 px-3.5 py-2 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-950/80 border border-cyan-400/60 text-cyan-300 font-mono font-bold text-base shadow-[0_0_15px_rgba(0,240,255,0.4)]">
            F{telemetry.currentFloor}
          </div>
          <div>
            {!isMobile && (
              <div className="text-[10px] uppercase tracking-widest text-cyan-400 font-mono font-semibold flex items-center gap-1.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00f0ff]" />
                APEX NEXUS
              </div>
            )}
            <div className="text-sm sm:text-base font-bold text-white drop-shadow truncate max-w-[140px] sm:max-w-none">
              {telemetry.floorName}
            </div>
          </div>
        </div>

        {/* Tactical Vitals Strip (Condensed on mobile) */}
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-300">
          <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/55 px-2 py-1 backdrop-blur-sm text-[11px]">
            <span className="text-cyan-400 font-bold">ALT:</span>
            <span>{telemetry.position.y.toFixed(1)}m</span>
          </div>

          {!isMobile && (
            <>
              <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/55 px-2.5 py-1.5 backdrop-blur-sm">
                <Compass className="h-3.5 w-3.5 text-amber-400" />
                <span className="text-amber-400 font-bold">{telemetry.heading}°</span>
                <span>({cardinal})</span>
              </div>

              <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/55 px-2.5 py-1.5 backdrop-blur-sm">
                <Footprints className="h-3.5 w-3.5 text-emerald-400" />
                <span>{telemetry.speed} m/s</span>
                {telemetry.isSprinting && (
                  <span className="text-[10px] uppercase font-bold text-emerald-300 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/40">
                    SPRINT
                  </span>
                )}
                {telemetry.isCrouching && (
                  <span className="text-[10px] uppercase font-bold text-amber-300 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-500/40">
                    CROUCH
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Top Right: Agent Comms & Music Toggle */}
      <div className="pointer-events-auto fixed right-4 top-4 z-20 flex items-center gap-2">
        {/* Agent Comms Button */}
        <button
          onClick={onOpenComms}
          className="relative flex items-center gap-2 rounded-xl border border-cyan-500/40 bg-black/65 px-3 py-2 text-xs font-mono font-medium text-cyan-200 backdrop-blur-md hover:bg-cyan-950/40 hover:border-cyan-400 transition-all shadow-[0_0_15px_rgba(0,240,255,0.2)]"
          title="Open Agent Communications"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
          </span>
          <span className={isMobile ? 'hidden sm:inline' : 'inline'}>COMMS</span>
          {unreadCommsCount > 0 && (
            <span className="rounded-full bg-cyan-500 px-1.5 py-0.2 text-[10px] font-bold text-black">
              {unreadCommsCount}
            </span>
          )}
        </button>

        {/* Ambient Music Toggle Pill */}
        <button
          onClick={handleToggleAudio}
          className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-mono font-medium backdrop-blur-md transition-all shadow-lg ${
            isAudioPlaying
              ? 'border-emerald-400/50 bg-emerald-950/50 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
              : 'border-white/15 bg-black/60 text-zinc-400 hover:text-white hover:bg-white/10'
          }`}
          title="Toggle Ambient Soundtrack"
        >
          {isAudioPlaying ? (
            <>
              <Volume2 className="h-4 w-4 text-emerald-400" />
              <span className={isMobile ? 'hidden sm:inline' : 'inline'}>MUSIC</span>
            </>
          ) : (
            <>
              <VolumeX className="h-4 w-4" />
              <span className={isMobile ? 'hidden sm:inline' : 'inline'}>MUTE</span>
            </>
          )}
        </button>

        {/* Controls Guide button (Desktop only) */}
        {!isMobile && (
          <button
            onClick={onOpenHelp}
            className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-black/60 px-3 py-2 text-xs font-mono font-medium text-zinc-300 backdrop-blur-md hover:bg-white/10 transition-all"
          >
            <Eye className="h-3.5 w-3.5 text-amber-400" />
            <span>CONTROLS (H)</span>
          </button>
        )}
      </div>

      {/* Proximity Interaction Prompt [E] (Desktop only, as mobile has on-screen button) */}
      {!isMobile && nearNPC && (
        <div className="pointer-events-auto fixed bottom-24 left-1/2 -translate-x-1/2 z-30 animate-bounce">
          <button
            onClick={onInteractNPC}
            className="flex items-center gap-3 rounded-2xl border border-cyan-400 bg-black/85 px-5 py-3 shadow-[0_0_30px_rgba(0,240,255,0.4)] backdrop-blur-xl hover:scale-105 transition-all text-left"
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl text-black font-bold"
              style={{ backgroundColor: nearNPC.avatarColor }}
            >
              {nearNPC.type === 'robot' ? (
                <Bot className="h-6 w-6 text-black" />
              ) : (
                <User className="h-6 w-6 text-black" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <kbd className="rounded bg-cyan-400 px-2 py-0.5 text-xs font-mono font-black text-black shadow">
                  PRESS [E]
                </kbd>
                <span className="text-[11px] font-mono font-semibold uppercase text-cyan-300">
                  INTERACT WITH NPC
                </span>
              </div>
              <div className="text-sm font-bold font-mono text-white mt-0.5">
                {nearNPC.name}{' '}
                <span className="text-xs font-normal text-zinc-400">({nearNPC.role})</span>
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Bottom Center Click-to-Explore Notice (Desktop only) */}
      {!isMobile && (
        <div className="pointer-events-none fixed bottom-4 left-1/2 -translate-x-1/2 z-20">
          <div className="rounded-full border border-white/10 bg-black/60 px-4 py-1.5 text-xs font-mono text-zinc-300 backdrop-blur-sm text-center shadow-lg">
            Click screen to lock cursor • <kbd className="text-cyan-300 font-bold">W A S D</kbd> walk • <kbd className="text-cyan-300 font-bold">SHIFT</kbd> sprint • <kbd className="text-cyan-300 font-bold">SPACE</kbd> jump • <kbd className="text-cyan-300 font-bold">[E]</kbd> talk • <kbd className="text-cyan-300 font-bold">1-5</kbd> quick-warp
          </div>
        </div>
      )}
    </>
  );
}
