'use client';

import React, { useState } from 'react';
import { Activity, ShieldCheck, Cpu, Palette, Compass, ChevronDown, ChevronUp, Bot, X } from 'lucide-react';
import { AgentOperationStatus } from '../game/types';

interface AgentOperationsMonitorProps {
  isMobile?: boolean;
}

const INITIAL_AGENT_STATUSES: AgentOperationStatus[] = [
  {
    id: 'atlas',
    name: 'Agent Atlas',
    title: 'World Architect & Level Designer',
    color: '#00f0ff',
    currentTask: 'Spatial Loft Integration: Aligning slab clearances & staircase entries for free_loft_18.glb & loft_16 across stories',
    status: 'active',
    progress: 100,
  },
  {
    id: 'neo',
    name: 'Agent Neo',
    title: 'Gameplay & Systems Engineer',
    color: '#38bdf8',
    currentTask: 'GLTFLoader Pipeline: Streaming 40MB+ PBR geometry, normalizing bounding offsets & shadow map cascade',
    status: 'active',
    progress: 100,
  },
  {
    id: 'iris',
    name: 'Agent Iris',
    title: '3D Interior Designer & Atmosphere',
    color: '#ec4899',
    currentTask: 'Staging Luxury Lofts: Featured free_loft_18.glb on Executive F3 & Penthouse F5, tuning PBR textures & daylight bounce',
    status: 'active',
    progress: 100,
  },
  {
    id: 'scribe',
    name: 'Agent Scribe',
    title: 'Technical Documentation & DevOps',
    color: '#a855f7',
    currentTask: 'Project Documentation & Git Release: Authoring ARCHITECTURE.md, GAMEPLAY_GUIDE.md & pushing to github.com/antnascimento/agents_map',
    status: 'active',
    progress: 100,
  },
];

export function AgentOperationsMonitor({ isMobile = false }: AgentOperationsMonitorProps) {
  const [agents, setAgents] = useState<AgentOperationStatus[]>(INITIAL_AGENT_STATUSES);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const monitorContent = (
    <div className={`overflow-hidden rounded-2xl border border-cyan-500/30 bg-black/85 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] ${
      isMobile ? 'w-full max-w-md max-h-[80vh] flex flex-col' : 'fixed right-4 bottom-4 z-20 w-80 sm:w-96'
    }`}>
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-white/10 bg-cyan-950/40 px-3.5 py-2.5">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-cyan-400 animate-pulse" />
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-300">
            AGENT OPERATIONS MONITOR
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
          <span className="font-mono text-[10px] text-emerald-400 font-bold uppercase">LIVE</span>
          {isMobile ? (
            <button
              onClick={() => setIsMobileDrawerOpen(false)}
              className="text-zinc-400 hover:text-white p-1 rounded-lg"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-zinc-400 hover:text-white p-0.5 rounded transition-colors"
            >
              {isCollapsed ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Monitor Body */}
      {!isCollapsed && (
        <div className="p-3 space-y-2.5 font-mono">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5 transition-all hover:border-white/20 hover:bg-white/[0.06]"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  {agent.id === 'atlas' && <Compass className="h-3.5 w-3.5" style={{ color: agent.color }} />}
                  {agent.id === 'neo' && <Cpu className="h-3.5 w-3.5" style={{ color: agent.color }} />}
                  {agent.id === 'iris' && <Palette className="h-3.5 w-3.5" style={{ color: agent.color }} />}
                  <span className="text-xs font-bold text-white">{agent.name}</span>
                </div>
                <span
                  className="rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-black"
                  style={{ backgroundColor: agent.color }}
                >
                  {agent.status}
                </span>
              </div>

              <div className="text-[10px] text-zinc-400 mb-1">{agent.title}</div>

              <div className="text-[11px] leading-snug text-zinc-200 bg-black/40 rounded-lg p-2 border border-white/5">
                <span className="text-cyan-400 font-semibold">TASK: </span>
                {agent.currentTask}
              </div>
            </div>
          ))}

          {/* Commander Sync Status */}
          <div className="flex items-center justify-between text-[10px] text-zinc-400 border-t border-white/5 pt-2 px-1">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
              <span>Multi-Agent System Protocol</span>
            </span>
            <span className="text-cyan-300 font-bold">100% OPERATIONAL</span>
          </div>
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <>
        {/* Compact Mobile Pill Trigger */}
        <div className="fixed top-4 right-16 z-20">
          <button
            onClick={() => setIsMobileDrawerOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-black/75 px-2.5 py-2 text-[11px] font-mono font-bold text-cyan-300 backdrop-blur-md shadow-lg"
          >
            <Bot className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
            <span>AGENTS (4)</span>
          </button>
        </div>

        {/* Modal Drawer when opened on mobile */}
        {isMobileDrawerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            {monitorContent}
          </div>
        )}
      </>
    );
  }

  return monitorContent;
}
