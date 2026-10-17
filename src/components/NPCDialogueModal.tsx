'use client';

import React, { useState } from 'react';
import { NPCData } from '../game/types';
import { X, MessageSquare, Bot, User, ChevronRight, BookOpen, Sparkles } from 'lucide-react';

interface NPCDialogueModalProps {
  npc: NPCData | null;
  isOpen: boolean;
  onClose: () => void;
}

export function NPCDialogueModal({ npc, isOpen, onClose }: NPCDialogueModalProps) {
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [showLore, setShowLore] = useState(false);

  if (!isOpen || !npc) return null;

  const currentLine = npc.dialogue[dialogueIndex] || npc.dialogue[0];
  const isLastLine = dialogueIndex >= npc.dialogue.length - 1;

  const handleNext = () => {
    if (isLastLine) {
      setDialogueIndex(0);
      onClose();
    } else {
      setDialogueIndex((prev) => prev + 1);
    }
  };

  const handleReset = () => {
    setDialogueIndex(0);
    setShowLore(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-cyan-500/40 bg-zinc-950/90 shadow-[0_0_50px_rgba(0,240,255,0.2)] backdrop-blur-2xl">
        {/* Glow Header Accent Bar */}
        <div
          className="h-1.5 w-full"
          style={{
            background: `linear-gradient(90deg, ${npc.avatarColor}, #00f0ff, ${npc.avatarColor})`,
          }}
        />

        {/* Close Button */}
        <button
          onClick={handleReset}
          className="absolute right-4 top-4 rounded-xl p-1.5 text-zinc-400 hover:bg-white/10 hover:text-white transition-all"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6">
          {/* NPC Header Section */}
          <div className="flex items-center gap-4 border-b border-white/10 pb-5 mb-5">
            {/* Avatar Portrait */}
            <div
              className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border shadow-lg"
              style={{
                backgroundColor: `${npc.avatarColor}20`,
                borderColor: npc.avatarColor,
                boxShadow: `0 0 20px ${npc.avatarColor}40`,
              }}
            >
              {npc.type === 'robot' ? (
                <Bot className="h-9 w-9" style={{ color: npc.avatarColor }} />
              ) : (
                <User className="h-9 w-9" style={{ color: npc.avatarColor }} />
              )}
              <span
                className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-black border"
                style={{ borderColor: npc.avatarColor }}
              >
                <span
                  className="h-2 w-2 rounded-full animate-ping"
                  style={{ backgroundColor: npc.avatarColor }}
                />
              </span>
            </div>

            {/* Name & Titles */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-black"
                  style={{ backgroundColor: npc.avatarColor }}
                >
                  {npc.badge}
                </span>
                <span className="text-[11px] font-mono text-zinc-400">
                  STORY {npc.floor} RESIDENT
                </span>
              </div>
              <h2 className="text-xl font-bold font-mono text-white mt-1">{npc.name}</h2>
              <p className="text-xs text-zinc-300">{npc.role}</p>
            </div>
          </div>

          {/* Dialogue Content Bubble */}
          <div className="min-h-[100px] rounded-2xl border border-white/10 bg-black/60 p-4 font-mono text-sm leading-relaxed text-zinc-100 shadow-inner">
            <div className="flex items-start gap-2.5">
              <MessageSquare className="h-4 w-4 shrink-0 text-cyan-400 mt-0.5" />
              <p className="flex-1">{currentLine}</p>
            </div>

            {/* Pagination indicator */}
            <div className="mt-4 flex items-center justify-between text-xs text-zinc-500 border-t border-white/5 pt-2">
              <span>
                Transmission {dialogueIndex + 1} of {npc.dialogue.length}
              </span>
              <div className="flex gap-1">
                {npc.dialogue.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all ${
                      i === dialogueIndex ? 'w-6 bg-cyan-400' : 'w-1.5 bg-zinc-700'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Optional Lore Collapsible */}
          {showLore && (
            <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-950/20 p-3.5 text-xs font-mono text-amber-200">
              <div className="flex items-center gap-2 font-bold mb-1 text-amber-400">
                <BookOpen className="h-3.5 w-3.5" />
                <span>PERSONNEL ARCHIVE DOSSIER:</span>
              </div>
              <p className="leading-relaxed text-amber-100/90">{npc.lore}</p>
            </div>
          )}

          {/* Footer Actions */}
          <div className="mt-6 flex items-center justify-between gap-3">
            <button
              onClick={() => setShowLore((prev) => !prev)}
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-mono text-zinc-300 hover:bg-white/10 transition-all"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>{showLore ? 'Hide Dossier' : 'View Lore Dossier'}</span>
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 rounded-xl border border-cyan-400/50 bg-cyan-500/20 px-5 py-2 text-xs font-mono font-bold text-cyan-200 hover:bg-cyan-500/30 transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)]"
            >
              <span>{isLastLine ? 'Conclude Dialogue [E]' : 'Continue Dialogue [E]'}</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
