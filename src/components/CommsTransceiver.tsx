'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AgentMessage } from '../game/types';
import { MessageSquare, Send, X, Terminal, Cpu, Building, User, Palette } from 'lucide-react';

interface CommsTransceiverProps {
  isOpen: boolean;
  onClose: () => void;
  onCommanderCommand?: (cmd: string) => void;
}

const INITIAL_MESSAGES: AgentMessage[] = [
  {
    id: 'msg-1',
    timestamp: '20:10:30',
    sender: 'Atlas (Architect)',
    role: 'architect',
    badgeColor: '#00f3ff',
    content:
      'Greetings, Neo & Commander! I have conceived the masterplan for our 5-story complex: "The Apex Nexus". 40m x 40m footprint, 6m per floor. Level 1: Monolithic Grand Atrium. Level 2: Quantum Cybernetics Lab. Level 3: Executive Strategy Suite. Level 4: Botanical Sky Garden with cantilevered balconies. Level 5: Penthouse Command & open-air Helipad at 30m.',
  },
  {
    id: 'msg-2',
    timestamp: '20:11:49',
    sender: 'Neo (Engineer)',
    role: 'engineer',
    badgeColor: '#3b82f6',
    content:
      'Reviewed and confirmed, Atlas! I have configured the Three.js WebGLRenderer with ACESFilmicToneMapping and PCFSoftShadowMap. Implementing PointerLock first-person controls with WASD locomotion, Shift sprint (8.5 m/s), Space jump, and crouch. Continuous slope colliders along the East Wing stairwell core locked.',
  },
  {
    id: 'msg-3',
    timestamp: '20:12:15',
    sender: 'Atlas (Architect)',
    role: 'architect',
    badgeColor: '#00f3ff',
    content:
      'Stairwell core locked in the East Wing (X: 12-18, Z: -6-6). Invisible angled ramp collider planes generated alongside the physical step treads for a butter-smooth ascent. Dynamic animated features active: pulsing Cryogenic Quantum Core on F2, rotating tactical hologram on F3, and wireframe planetary globe on F5.',
  },
  {
    id: 'msg-4',
    timestamp: '20:13:05',
    sender: 'Neo (Engineer)',
    role: 'engineer',
    badgeColor: '#3b82f6',
    content:
      'Engine physics & multi-ray downward ground probing calibrated. Downward raycasting is seamlessly locking player altitude to the stair slope and floor slabs. Teleport matrix initialized for Floors 1 through 5, plus Rooftop Helipad. Ready for Commander walk-through!',
  },
  {
    id: 'msg-5',
    timestamp: '20:14:20',
    sender: 'Iris (Interior Designer)',
    role: 'designer',
    badgeColor: '#ec4899',
    content:
      'Commander Directive executed! Dark fog and black aesthetic banished completely. The Apex Nexus is now bathed in glorious natural daylight (#87CEEB azure sky, warm golden sunbeams). I curated bright Calacatta marble, warm honey oak herringbone parquet, architectural matte off-white walls, and floor-to-ceiling panoramic glass mullions. Plus, 10 interactive residents & droids now bring vibrant life to every story!',
  },
];

export function CommsTransceiver({ isOpen, onClose, onCommanderCommand }: CommsTransceiverProps) {
  const [messages, setMessages] = useState<AgentMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [filter, setFilter] = useState<'all' | 'architect' | 'engineer' | 'designer'>('all');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: AgentMessage = {
      id: `user-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      sender: 'Commander (You)',
      role: 'commander',
      badgeColor: '#a855f7',
      content: inputText.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    const cmd = inputText.trim();
    setInputText('');

    if (onCommanderCommand) {
      onCommanderCommand(cmd);
    }

    // Dynamic simulated agent response to commander commands
    setTimeout(() => {
      const isIrisTopic = /light|sun|sky|color|interior|style|marble|oak|npc|ava|sentrix|chen|marcus|elena|vance|sprout|byte|nexus/i.test(cmd);
      const isAtlasTopic = /build|wall|stair|slab|facade|mullion|floor|roof|helipad/i.test(cmd);

      let replyMsg: AgentMessage;

      if (isIrisTopic) {
        replyMsg = {
          id: `reply-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          sender: 'Iris (Interior Designer)',
          role: 'designer',
          badgeColor: '#ec4899',
          content: `Transmitting aesthetic update, Commander! Radiant daylight, honey oak parquet, and living biophilia are harmonizing brilliantly with: "${cmd}". The resident NPCs are delighted!`,
        };
      } else if (isAtlasTopic) {
        replyMsg = {
          id: `reply-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          sender: 'Atlas (Architect)',
          role: 'architect',
          badgeColor: '#00f3ff',
          content: `Acknowledged, Commander! Updating spatial parameters and structural mullions per your directive: "${cmd}". The building structure adapts immediately.`,
        };
      } else {
        replyMsg = {
          id: `reply-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          sender: 'Neo (Engineer)',
          role: 'engineer',
          badgeColor: '#3b82f6',
          content: `Directive logged into engine kernel, Commander! Locomotion, NPC interaction raycasting, and renderer parameters synchronized for: "${cmd}". 60 FPS locked.`,
        };
      }

      setMessages((prev) => [...prev, replyMsg]);
    }, 1000);
  };

  if (!isOpen) return null;

  const filteredMessages = messages.filter((m) => {
    if (filter === 'architect') return m.role === 'architect';
    if (filter === 'engineer') return m.role === 'engineer';
    if (filter === 'designer') return m.role === 'designer';
    return true;
  });

  return (
    <div className="fixed right-4 bottom-16 z-30 flex h-[480px] w-[460px] max-w-[calc(100vw-32px)] flex-col rounded-2xl border border-cyan-500/30 bg-zinc-950/90 shadow-2xl backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-cyan-400" />
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-white">
            AGENT COMMS TRANSCEIVER // LIVE
          </span>
          <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-[10px] font-mono text-cyan-300 border border-cyan-400/40">
            ENCRYPTED
          </span>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1 text-zinc-400 hover:bg-white/10 hover:text-white transition-all"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 border-b border-white/5 bg-black/40 px-3 py-1.5 text-xs font-mono overflow-x-auto">
        <button
          onClick={() => setFilter('all')}
          className={`rounded-lg px-2.5 py-1 transition-all ${
            filter === 'all'
              ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-400/30'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          ALL ({messages.length})
        </button>
        <button
          onClick={() => setFilter('designer')}
          className={`flex items-center gap-1 rounded-lg px-2.5 py-1 transition-all ${
            filter === 'designer'
              ? 'bg-pink-500/20 text-pink-300 font-bold border border-pink-400/30'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Palette className="h-3 w-3 text-pink-400" />
          IRIS
        </button>
        <button
          onClick={() => setFilter('architect')}
          className={`flex items-center gap-1 rounded-lg px-2.5 py-1 transition-all ${
            filter === 'architect'
              ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-400/30'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Building className="h-3 w-3 text-cyan-400" />
          ATLAS
        </button>
        <button
          onClick={() => setFilter('engineer')}
          className={`flex items-center gap-1 rounded-lg px-2.5 py-1 transition-all ${
            filter === 'engineer'
              ? 'bg-blue-500/20 text-blue-300 font-bold border border-blue-400/30'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Cpu className="h-3 w-3 text-blue-400" />
          NEO
        </button>
      </div>

      {/* Message Feed */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs">
        {filteredMessages.map((msg) => {
          const isCommander = msg.role === 'commander';
          const isArchitect = msg.role === 'architect';
          const isDesigner = msg.role === 'designer';

          return (
            <div
              key={msg.id}
              className={`rounded-xl p-3 border ${
                isCommander
                  ? 'border-purple-500/40 bg-purple-950/20 ml-6 text-purple-100'
                  : isDesigner
                  ? 'border-pink-500/40 bg-pink-950/20 mr-4 text-pink-100'
                  : isArchitect
                  ? 'border-cyan-500/30 bg-cyan-950/20 mr-4 text-cyan-100'
                  : 'border-blue-500/30 bg-blue-950/20 mr-4 text-blue-100'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className="font-bold flex items-center gap-1.5"
                  style={{ color: msg.badgeColor }}
                >
                  {isCommander ? (
                    <User className="h-3.5 w-3.5" />
                  ) : isDesigner ? (
                    <Palette className="h-3.5 w-3.5 text-pink-400" />
                  ) : isArchitect ? (
                    <Building className="h-3.5 w-3.5" />
                  ) : (
                    <Cpu className="h-3.5 w-3.5" />
                  )}
                  {msg.sender}
                </span>
                <span className="text-[10px] text-zinc-500">{msg.timestamp}</span>
              </div>
              <p className="leading-relaxed text-zinc-300 whitespace-pre-wrap">{msg.content}</p>
            </div>
          );
        })}
      </div>

      {/* Input Field for Commander Directives */}
      <form onSubmit={handleSend} className="border-t border-white/10 p-2.5 bg-black/60">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Issue a directive to Iris, Atlas & Neo..."
            className="flex-1 rounded-xl border border-white/10 bg-zinc-900/80 px-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-cyan-400 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500 text-black hover:bg-cyan-400 disabled:opacity-30 disabled:hover:bg-cyan-500 transition-all shadow-[0_0_12px_#00f0ff]"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
}
