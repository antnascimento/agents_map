'use client';

import React from 'react';
import { DroneTelemetry } from '../game/types';
import { Plane, Compass, Wifi, Battery, Zap, RotateCcw, AlertTriangle, Skull, Crosshair, Shield, Flame } from 'lucide-react';

interface DroneHUDProps {
  telemetry: DroneTelemetry | null;
  onExitDrone: () => void;
  isMobile?: boolean;
}

export function DroneHUD({ telemetry, onExitDrone, isMobile }: DroneHUDProps) {
  if (!telemetry) return null;

  const isNearBoundary = telemetry.distanceFromHelipadM > 880;

  return (
    <div className="pointer-events-none fixed inset-0 z-40 select-none">
      {/* 1. FLIGHT RETICLE & ARTIFICIAL HORIZON (Center) */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="relative h-64 w-64 transition-transform duration-75"
          style={{
            transform: `rotate(${-telemetry.rollDeg}deg)`,
          }}
        >
          {/* Artificial Horizon Center Bar */}
          <div className="absolute left-4 right-4 top-1/2 h-[1px] -translate-y-1/2 bg-cyan-400/50 flex items-center justify-between">
            <span className="text-[9px] font-mono text-cyan-300 font-bold -translate-y-3">-10°</span>
            <div className="h-4 w-4 rounded-full border border-cyan-400/80 flex items-center justify-center">
              <div className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_#00f0ff]" />
            </div>
            <span className="text-[9px] font-mono text-cyan-300 font-bold -translate-y-3">+10°</span>
          </div>

          {/* Pitch Ladder Indicators */}
          <div
            className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-6 text-[9px] font-mono text-cyan-400/70"
            style={{
              transform: `translateY(${telemetry.pitchDeg * 2}px)`,
            }}
          >
            <div className="w-16 border-t border-dashed border-cyan-400/60 text-center font-bold">+20°</div>
            <div className="w-24 border-t border-cyan-400 text-center font-bold">+10°</div>
            <div className="h-8" />
            <div className="w-24 border-t border-cyan-400 text-center font-bold">-10°</div>
            <div className="w-16 border-t border-dashed border-cyan-400/60 text-center font-bold">-20°</div>
          </div>
        </div>

        {/* Tactical Crosshair Gunsight */}
        <div className="absolute h-8 w-8 flex items-center justify-center pointer-events-none">
          <div className="h-2 w-2 rounded-full border-2 border-cyan-400 shadow-[0_0_8px_#00f0ff]" />
          <div className="absolute h-6 w-6 rounded-full border border-cyan-400/40" />
        </div>

        {/* Dynamic Target Locking Reticle on Enemy Alien Ship */}
        {telemetry.targetLocked && (
          <div className="absolute flex flex-col items-center pointer-events-none animate-pulse">
            <div className="h-24 w-24 rounded-full border-2 border-red-500 border-dashed animate-spin flex items-center justify-center shadow-[0_0_20px_#ff0055]">
              <div className="h-4 w-4 rounded-full border border-red-400 bg-red-500/40" />
            </div>
            <div className="mt-2 text-[10px] font-mono font-black text-red-300 bg-red-950/90 border border-red-500 px-2 py-0.5 rounded shadow">
              TARGET LOCKED // {telemetry.targetDistanceM}M
            </div>
          </div>
        )}
      </div>

      {/* 2. TOP FLIGHT STATUS BAR */}
      <div className="pointer-events-auto absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-3 rounded-2xl border border-cyan-500/40 bg-black/75 px-5 py-2.5 backdrop-blur-xl shadow-[0_0_30px_rgba(0,240,255,0.25)]">
        <div className="flex items-center gap-2">
          <Plane className="h-4 w-4 text-cyan-400 animate-pulse" />
          <span className="font-mono text-xs font-black uppercase tracking-widest text-cyan-300">
            APEX-R FIGHTER DRONE // R-TYPE CANNON
          </span>
        </div>

        <div className="h-4 w-[1px] bg-white/20" />

        {/* Drone Hull Shield Bar */}
        <div className="flex items-center gap-1.5 font-mono text-xs">
          <Shield className="h-4 w-4 text-cyan-400" />
          <span className="text-zinc-400">HULL:</span>
          <span className="font-bold text-cyan-300">{Math.round(telemetry.hullHealth ?? 100)}%</span>
        </div>

        <div className="h-4 w-[1px] bg-white/20" />

        {/* Signal & Distance from Helipad */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <Wifi
            className={`h-4 w-4 ${
              telemetry.signalStrengthPct > 40 ? 'text-emerald-400' : 'text-amber-400 animate-ping'
            }`}
          />
          <span className="text-zinc-400">SIGNAL:</span>
          <span
            className={`font-bold ${
              telemetry.signalStrengthPct > 40 ? 'text-emerald-300' : 'text-amber-300'
            }`}
          >
            {telemetry.signalStrengthPct}%
          </span>
        </div>

        <div className="h-4 w-[1px] bg-white/20" />

        {/* Battery */}
        <div className="flex items-center gap-1.5 font-mono text-xs">
          <Battery className="h-4 w-4 text-cyan-400" />
          <span className="font-bold text-white">{telemetry.batteryPct}%</span>
        </div>

        {/* Exit Drone Button */}
        <button
          onClick={onExitDrone}
          className="ml-2 flex items-center gap-1.5 rounded-xl border border-red-500/50 bg-red-950/60 px-3 py-1 text-xs font-mono font-bold text-red-200 hover:bg-red-900/80 transition-all shadow-md"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>RETURN (R)</span>
        </button>
      </div>

      {/* R-TYPE AIR THREAT INCURSION FLEET COUNTER BADGE */}
      <div className="pointer-events-auto absolute top-16 right-6 z-30">
        <div className="flex items-center gap-2.5 rounded-2xl border-2 border-red-500/70 bg-black/85 px-4 py-2 backdrop-blur-xl shadow-[0_0_25px_rgba(239,68,68,0.5)]">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-600/30 border border-red-500 text-red-400 font-mono">
            <Skull className="h-5 w-5 text-red-400 animate-pulse" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono font-bold tracking-widest text-red-400 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
              AIR INCURSION FLEET
            </div>
            <div className="text-sm font-black font-mono text-white flex items-center gap-2">
              <span className="text-red-400 text-base">{telemetry.activeShipsCount ?? 0}</span>
              <span className="text-xs text-zinc-300">/ {telemetry.totalShipsCount ?? 0} SHIPS LEFT</span>
              {(telemetry.defeatedShipsCount ?? 0) > 0 && (
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
                  +{telemetry.aerialScore ?? 0} PTS
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. GEOFENCE WARNING (when near 1km boundary) */}
      {isNearBoundary && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-xl border border-amber-500 bg-amber-950/80 px-4 py-2 text-xs font-mono font-bold text-amber-200 shadow-[0_0_20px_rgba(245,158,11,0.5)] animate-bounce">
          <AlertTriangle className="h-4 w-4 text-amber-400" />
          <span>WARNING: APPROACHING 1KM GEOFENCE BOUNDARY ({telemetry.distanceFromHelipadM}m / 1000m)</span>
        </div>
      )}

      {/* MOBILE COMPACT TELEMETRY STRIP */}
      {isMobile && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 flex items-center gap-2.5 rounded-xl border border-cyan-500/30 bg-black/80 px-3.5 py-1.5 font-mono text-[11px] text-white backdrop-blur-md shadow-lg z-20">
          <div className="flex items-center gap-1 text-cyan-300 font-bold">
            <Zap className="h-3 w-3 text-cyan-400" />
            <span>{telemetry.speedKmh} km/h</span>
          </div>
          <div className="h-3 w-[1px] bg-white/20" />
          <div className="text-amber-300 font-bold">
            ALT: {telemetry.altitudeM}m
          </div>
          <div className="h-3 w-[1px] bg-white/20" />
          <div className="text-zinc-300">
            RAD: {telemetry.distanceFromHelipadM}m
          </div>
        </div>
      )}

      {/* 4. DESKTOP SPEED & ALTITUDE DIALS (Bottom Left & Right - hidden on mobile) */}
      {!isMobile && (
        <>
          {/* Left: Speedometer & Distance */}
          <div className="absolute bottom-6 left-6 flex flex-col gap-2 font-mono text-xs">
            <div className="rounded-2xl border border-cyan-500/30 bg-black/75 p-4 backdrop-blur-xl shadow-xl w-52">
              <div className="text-[10px] uppercase tracking-wider text-cyan-400 font-bold mb-1 flex items-center justify-between">
                <span>AIRSPEED</span>
                {telemetry.isBoosting && (
                  <span className="flex items-center gap-1 text-emerald-400 animate-pulse text-[9px] bg-emerald-950/80 px-1 rounded border border-emerald-500/40">
                    <Zap className="h-3 w-3" /> TURBO
                  </span>
                )}
              </div>
              <div className="text-3xl font-black text-white font-mono flex items-baseline gap-1.5">
                {telemetry.speedKmh}
                <span className="text-xs font-normal text-zinc-400">KM/H</span>
              </div>

              <div className="mt-3 border-t border-white/10 pt-2 flex items-center justify-between text-[11px] text-zinc-300">
                <span className="text-zinc-400">RADIUS:</span>
                <span className="font-bold text-cyan-300">{telemetry.distanceFromHelipadM}m / 1000m</span>
              </div>
              {/* Progress bar to 1km */}
              <div className="mt-1 h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
                <div
                  className={`h-full transition-all duration-150 ${
                    isNearBoundary ? 'bg-amber-400' : 'bg-cyan-400'
                  }`}
                  style={{ width: `${Math.min(100, (telemetry.distanceFromHelipadM / 1000) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Right: Altimeter & Heading */}
          <div className="absolute bottom-6 right-6 flex flex-col gap-2 font-mono text-xs">
            <div className="rounded-2xl border border-cyan-500/30 bg-black/75 p-4 backdrop-blur-xl shadow-xl w-52 text-right">
              <div className="text-[10px] uppercase tracking-wider text-cyan-400 font-bold mb-1">
                ALTITUDE (AGL)
              </div>
              <div className="text-3xl font-black text-white font-mono flex items-baseline justify-end gap-1.5">
                {telemetry.altitudeM}
                <span className="text-xs font-normal text-zinc-400">METERS</span>
              </div>

              <div className="mt-3 border-t border-white/10 pt-2 flex items-center justify-between text-[11px] text-zinc-300">
                <span className="font-bold text-amber-300">{telemetry.headingDeg}°</span>
                <span className="text-zinc-400 flex items-center gap-1">
                  <Compass className="h-3 w-3 text-amber-400" />
                  HEADING
                </span>
              </div>
            </div>
          </div>

          {/* 5. DRONE FLIGHT CONTROLS GUIDE (Bottom Center) */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-white/15 bg-black/75 px-5 py-2 text-xs font-mono text-zinc-300 backdrop-blur-md shadow-2xl">
            <kbd className="text-cyan-300 font-bold">W/S</kbd> Pitch • <kbd className="text-cyan-300 font-bold">A/D</kbd> Roll • <kbd className="text-cyan-300 font-bold">Q/E</kbd> Yaw • <kbd className="text-cyan-300 font-bold">SPACE</kbd> Climb • <kbd className="text-cyan-300 font-bold">CTRL</kbd> Descend • <kbd className="text-emerald-300 font-bold">SHIFT</kbd> Turbo • <kbd className="text-yellow-300 font-bold">CLICK / F</kbd> Cannon (∞) • <kbd className="text-red-400 font-bold">R</kbd> Exit
          </div>
        </>
      )}
    </div>
  );
}
