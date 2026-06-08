'use client';

import { Monitor, Users, TrendingUp, Shield, Terminal, Settings, ChevronRight, Cpu } from 'lucide-react';
import { AvatarColor, BotConfig, Tone } from '@/types';
import { AVATAR_COLORS, OPENAI_MODELS, PRESETS } from '@/lib/presets';

const PRESET_ICONS: Record<string, React.ElementType> = {
  Monitor,
  Users,
  TrendingUp,
  Shield,
  Terminal,
};

const AVATAR_COLOR_KEYS = Object.keys(AVATAR_COLORS) as AvatarColor[];

interface ConfigPanelProps {
  config: BotConfig;
  setConfig: (config: BotConfig) => void;
  activePreset: string | null;
  onPresetSelect: (id: string) => void;
  onApply: () => void;
  configApplied: boolean;
}

export default function ConfigPanel({
  config,
  setConfig,
  activePreset,
  onPresetSelect,
  onApply,
  configApplied,
}: ConfigPanelProps) {
  const update = <K extends keyof BotConfig>(key: K, value: BotConfig[K]) => {
    setConfig({ ...config, [key]: value });
  };

  return (
    <div className="p-5 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Settings size={16} className="text-indigo-400" />
        <h2 className="text-sm font-semibold text-white tracking-wide uppercase">Bot Configuration</h2>
      </div>

      {/* Department Presets */}
      <div className="space-y-3">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Quick Presets</p>
        <div className="grid grid-cols-2 gap-2">
          {PRESETS.map((preset) => {
            const Icon = PRESET_ICONS[preset.icon];
            const isActive = activePreset === preset.id;
            const color = AVATAR_COLORS[preset.config.avatarColor];
            return (
              <button
                key={preset.id}
                onClick={() => onPresetSelect(preset.id)}
                className={`
                  relative flex flex-col items-start gap-2 p-3 rounded-xl border text-left
                  transition-all duration-200 cursor-pointer group
                  ${isActive
                    ? 'bg-indigo-950 border-indigo-500 shadow-lg shadow-indigo-900/20'
                    : 'bg-slate-800 border-slate-700 hover:border-slate-500 hover:bg-slate-750'
                  }
                `}
              >
                <div className={`w-7 h-7 rounded-lg ${color.bg} flex items-center justify-center`}>
                  <Icon size={14} className="text-white" />
                </div>
                <span className={`text-xs font-medium leading-tight ${isActive ? 'text-indigo-200' : 'text-slate-300'}`}>
                  {preset.label}
                </span>
                {isActive && (
                  <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-indigo-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-800" />

      {/* Form Fields */}
      <div className="space-y-5">
        {/* Bot Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-400">What should your assistant be called?</label>
          <input
            type="text"
            value={config.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="e.g. Aria, Nova, Rex..."
            className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2.5
              placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30
              transition-all duration-200"
          />
        </div>

        {/* Department */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-400">Which department does this serve?</label>
          <input
            type="text"
            value={config.department}
            onChange={(e) => update('department', e.target.value)}
            placeholder="e.g. IT Helpdesk, Human Resources..."
            className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2.5
              placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30
              transition-all duration-200"
          />
        </div>

        {/* Tone Toggle */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-400">Conversation Tone</label>
          <div className="flex gap-2">
            {(['formal', 'balanced', 'friendly'] as Tone[]).map((tone) => (
              <button
                key={tone}
                onClick={() => update('tone', tone)}
                className={`flex-1 py-2 rounded-lg text-xs font-medium capitalize transition-all duration-200 cursor-pointer
                  ${config.tone === tone
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/30'
                    : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-500 hover:text-slate-300'
                  }`}
              >
                {tone}
              </button>
            ))}
          </div>
        </div>

        {/* Avatar Color */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-400">Avatar Color</label>
          <div className="flex gap-2.5">
            {AVATAR_COLOR_KEYS.map((colorKey) => {
              const color = AVATAR_COLORS[colorKey];
              const isSelected = config.avatarColor === colorKey;
              return (
                <button
                  key={colorKey}
                  onClick={() => update('avatarColor', colorKey)}
                  title={color.label}
                  className={`w-8 h-8 rounded-full ${color.bg} transition-all duration-200 cursor-pointer
                    ${isSelected ? `ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110` : 'hover:scale-105 opacity-75 hover:opacity-100'}
                  `}
                />
              );
            })}
          </div>
        </div>

        {/* Topic Scope */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-400">What topics should this assistant cover?</label>
          <textarea
            rows={3}
            value={config.topicScope}
            onChange={(e) => update('topicScope', e.target.value)}
            placeholder="Describe the knowledge domain and responsibilities of this assistant..."
            className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2.5
              placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30
              transition-all duration-200 resize-none leading-relaxed"
          />
        </div>

        {/* Welcome Message */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-400">First message the bot sends when chat starts</label>
          <textarea
            rows={2}
            value={config.welcomeMessage}
            onChange={(e) => update('welcomeMessage', e.target.value)}
            placeholder="e.g. Hello! I'm here to help with..."
            className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2.5
              placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30
              transition-all duration-200 resize-none leading-relaxed"
          />
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-800" />

      {/* Model Selector */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Cpu size={14} className="text-indigo-400" />
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">AI Model</p>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="model-select" className="text-xs font-medium text-slate-400">Model</label>
          <select
            id="model-select"
            value={config.model ?? 'gpt-4o'}
            onChange={(e) => update('model', e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2.5
              focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30
              transition-all duration-200 cursor-pointer"
          >
            {OPENAI_MODELS.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Apply Button */}
      <button
        type="button"
        onClick={onApply}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm
          bg-linear-to-r from-indigo-600 to-indigo-500 text-white
          hover:from-indigo-500 hover:to-indigo-400
          active:scale-[0.98] transition-all duration-200
          shadow-lg shadow-indigo-900/40 cursor-pointer"
      >
        Apply Configuration
        <ChevronRight size={16} />
      </button>

      {configApplied && (
        <p className="text-center text-xs text-emerald-400 flex items-center justify-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
          Configuration active — chat is live
        </p>
      )}

      {/* Bottom padding */}
      <div className="h-4" />
    </div>
  );
}
