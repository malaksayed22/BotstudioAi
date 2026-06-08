'use client';

import { Bot } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="h-14 shrink-0 flex items-center justify-between px-5 bg-slate-900 border-b border-slate-800 z-10">
      {/* Left: Brand */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
          <Bot size={16} className="text-white" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-white font-bold text-lg tracking-tight">BotStudio</span>
          <span className="text-slate-500 text-xs hidden sm:block">Enterprise Chatbot Configurator</span>
        </div>
      </div>

      {/* Right: Live badge */}
      <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-full px-3 py-1.5">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-dot" />
        <span className="text-xs font-medium text-slate-300">Live Preview</span>
      </div>
    </header>
  );
}
