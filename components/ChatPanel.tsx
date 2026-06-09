'use client';

import { RefObject } from 'react';
import { Send, Share2, Bot, AlertCircle, MessageSquare } from 'lucide-react';
import { BotConfig, Message } from '@/types';
import { AVATAR_COLORS, slugify } from '@/lib/presets';

interface ChatPanelProps {
  config: BotConfig;
  messages: Message[];
  inputText: string;
  setInputText: (v: string) => void;
  isLoading: boolean;
  configApplied: boolean;
  onSend: () => void;
  onShare: () => void;
  shareToast: boolean;
  messagesEndRef: RefObject<HTMLDivElement | null>;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
}

function BotAvatar({ name, avatarColor, size = 'sm' }: { name: string; avatarColor: BotConfig['avatarColor']; size?: 'sm' | 'lg' }) {
  const color = AVATAR_COLORS[avatarColor];
  const dim = size === 'lg' ? 'w-10 h-10 text-base' : 'w-7 h-7 text-xs';
  return (
    <div className={`${dim} shrink-0 rounded-full ${color.bg} flex items-center justify-center font-bold text-white`}>
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

function TypingIndicator({ config }: { config: BotConfig }) {
  return (
    <div className="flex items-end gap-2 animate-fade-in-up">
      <BotAvatar name={config.name} avatarColor={config.avatarColor} />
      <div className="bg-slate-800 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 typing-dot animate-typing-dot" />
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 typing-dot animate-typing-dot" />
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 typing-dot animate-typing-dot" />
      </div>
    </div>
  );
}

function MessageBubble({ message, config }: { message: Message; config: BotConfig }) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="flex flex-col items-end gap-1 animate-fade-in-up">
        <div className="bg-indigo-600 text-white text-sm rounded-2xl rounded-br-none px-4 py-2.5 max-w-[85%] sm:max-w-[75%] leading-relaxed">
          {message.content}
        </div>
        <span className="text-[10px] text-slate-500 pr-1">{formatTime(message.timestamp)}</span>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-2 animate-fade-in-up">
      <BotAvatar name={config.name} avatarColor={config.avatarColor} />
      <div className="flex flex-col gap-1 max-w-[85%] sm:max-w-[75%]">
        <div
          className={`text-sm text-white rounded-2xl rounded-bl-none px-4 py-2.5 leading-relaxed
            ${message.isError
              ? 'bg-slate-800 border-l-2 border-rose-500'
              : 'bg-slate-800'
            }`}
        >
          {message.isError && (
            <div className="flex items-center gap-1.5 text-rose-400 text-xs font-medium mb-1">
              <AlertCircle size={12} />
              Error
            </div>
          )}
          {message.content}
        </div>
        <span className="text-[10px] text-slate-500 pl-1">{formatTime(message.timestamp)}</span>
      </div>
    </div>
  );
}

export default function ChatPanel({
  config,
  messages,
  inputText,
  setInputText,
  isLoading,
  configApplied,
  onSend,
  onShare,
  shareToast,
  messagesEndRef,
}: ChatPanelProps) {
  const color = AVATAR_COLORS[config.avatarColor];
  const canSend = configApplied && inputText.trim().length > 0 && !isLoading;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (canSend) onSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="h-16 shrink-0 flex items-center justify-between px-4 sm:px-5 bg-slate-900 border-b border-slate-800 gap-3">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className={`w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-full ${color.bg} flex items-center justify-center font-bold text-white text-base sm:text-lg`}>
            {config.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-white font-semibold text-sm leading-tight truncate">{config.name}</p>
            <p className="text-slate-400 text-xs truncate">{config.department}</p>
          </div>
          {configApplied && (
            <div className="shrink-0 ml-1 flex items-center gap-1.5 bg-emerald-950 border border-emerald-800 rounded-full px-2 sm:px-2.5 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
              <span className="text-emerald-400 text-[10px] font-medium">Online</span>
            </div>
          )}
        </div>

        {/* Share button */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={onShare}
            className="flex items-center gap-1.5 sm:gap-2 bg-slate-800 border border-slate-700 hover:border-slate-500
              text-slate-300 hover:text-white text-xs font-medium rounded-lg px-2.5 sm:px-3 py-2
              transition-all duration-200 cursor-pointer"
          >
            <Share2 size={13} />
            <span className="hidden sm:inline">Share</span>
          </button>
          {shareToast && (
            <div className="absolute right-0 top-10 bg-slate-700 border border-slate-600 text-white text-xs font-medium
              rounded-lg px-3 py-2 whitespace-nowrap shadow-xl animate-toast z-20">
              🔗 Link copied!
            </div>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 sm:py-5 space-y-4 scrollbar-thin">
        {!configApplied ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center">
              <MessageSquare size={28} className="text-slate-600" />
            </div>
            <div>
              <p className="text-slate-400 font-medium text-sm">Your assistant is ready to configure</p>
              <p className="text-slate-600 text-xs mt-1">Set up your bot and tap <span className="text-indigo-400">Apply Configuration</span> to start chatting</p>
            </div>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              {['IT Helpdesk', 'HR', 'Sales', 'Legal', 'DevOps'].map((dept) => (
                <span key={dept} className="text-[10px] text-slate-600 bg-slate-800/50 border border-slate-800 rounded-full px-2.5 py-1">
                  {dept}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} config={config} />
            ))}
            {isLoading && <TypingIndicator config={config} />}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Chat Input */}
      <div className="shrink-0 px-4 sm:px-5 py-3 sm:py-4 bg-slate-900 border-t border-slate-800 safe-area-pb">
        <div className={`flex gap-3 items-center bg-slate-800 border rounded-xl px-4 py-2.5 transition-all duration-200
          ${configApplied ? 'border-slate-700 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500/20' : 'border-slate-800 opacity-50'}
        `}>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!configApplied || isLoading}
            placeholder={
              !configApplied
                ? 'Apply a configuration to start chatting...'
                : `Message ${config.name}...`
            }
            className="flex-1 bg-transparent text-white text-base sm:text-sm placeholder:text-slate-500
              focus:outline-none disabled:cursor-not-allowed"
          />
          <button
            type="button"
            aria-label="Send message"
            onClick={onSend}
            disabled={!canSend}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 shrink-0 cursor-pointer
              ${canSend
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-900/40 active:scale-95'
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
              }`}
          >
            <Send size={14} />
          </button>
        </div>
        <p className="text-[10px] text-slate-600 text-center mt-2">
          {configApplied
            ? `${config.name} is powered by OpenAI · Responses are AI-generated`
            : 'Configure your assistant to enable the chat interface'}
        </p>
      </div>
    </div>
  );
}
