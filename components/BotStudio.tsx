'use client';

import { useRef, useState } from 'react';
import { Settings, MessageSquare } from 'lucide-react';
import { BotConfig, Message } from '@/types';
import { DEFAULT_CONFIG, PRESETS } from '@/lib/presets';
import Navbar from './Navbar';
import ConfigPanel from './ConfigPanel';
import ChatPanel from './ChatPanel';
import { buildSystemPrompt, slugify } from '@/lib/presets';

export default function BotStudio() {
  const [config, setConfig] = useState<BotConfig>(DEFAULT_CONFIG);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>('it');
  const [configApplied, setConfigApplied] = useState(false);
  const [shareToast, setShareToast] = useState(false);
  const [mobileTab, setMobileTab] = useState<'config' | 'chat'>('config');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const applyConfig = () => {
    const welcome: Message = {
      id: `welcome-${Date.now()}`,
      role: 'assistant',
      content: config.welcomeMessage,
      timestamp: new Date(),
      isWelcome: true,
    };
    setMessages([welcome]);
    setConfigApplied(true);
    setMobileTab('chat');
    scrollToBottom();
  };

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || isLoading || !configApplied) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputText('');
    setIsLoading(true);
    scrollToBottom();

    // Build conversation history for API — exclude welcome message, cap at 20
    const history = updatedMessages
      .filter((m) => !m.isWelcome)
      .slice(-20)
      .map((m) => ({ role: m.role, content: m.content }));

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: config.model ?? 'gpt-4o',
          max_tokens: 1000,
          messages: [
            { role: 'system', content: buildSystemPrompt(config) },
            ...history,
          ],
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.choices?.[0]?.message?.content) {
        throw new Error(data.error?.message || 'API error');
      }

      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.choices[0].message.content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errorMsg: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  };

  const handleShare = async () => {
    const url = `https://botstudio.app/demo/${slugify(config.name)}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // fallback — still show toast
    }
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2000);
  };

  const handlePresetSelect = (presetId: string) => {
    const preset = PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setConfig({ ...preset.config, model: config.model });
      setActivePreset(presetId);
      setConfigApplied(false);
      setMessages([]);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 overflow-hidden safe-area-pt">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Config Panel — full-width on mobile when config tab active, fixed sidebar on desktop */}
        <aside className={`
          w-full md:w-95 md:shrink-0
          bg-slate-900 border-r border-slate-800 flex-col overflow-hidden
          ${mobileTab === 'config' ? 'flex' : 'hidden'} md:flex
        `}>
          <div className="config-panel flex-1 overflow-y-auto">
            <ConfigPanel
              config={config}
              setConfig={setConfig}
              activePreset={activePreset}
              onPresetSelect={handlePresetSelect}
              onApply={applyConfig}
              configApplied={configApplied}
            />
          </div>
        </aside>

        {/* Chat Panel — full-width on mobile when chat tab active, fills remaining space on desktop */}
        <main className={`
          flex-1 flex-col bg-slate-950 overflow-hidden
          ${mobileTab === 'chat' ? 'flex' : 'hidden'} md:flex
        `}>
          <ChatPanel
            config={config}
            messages={messages}
            inputText={inputText}
            setInputText={setInputText}
            isLoading={isLoading}
            configApplied={configApplied}
            onSend={handleSend}
            onShare={handleShare}
            shareToast={shareToast}
            messagesEndRef={messagesEndRef}
          />
        </main>
      </div>

      {/* Mobile-only bottom tab bar */}
      <nav className="md:hidden shrink-0 flex bg-slate-900 border-t border-slate-800 safe-area-pb">
        <button
          type="button"
          onClick={() => setMobileTab('config')}
          className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors cursor-pointer
            ${mobileTab === 'config' ? 'text-indigo-400' : 'text-slate-500'}`}
        >
          <Settings size={20} />
          Configure
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('chat')}
          className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors cursor-pointer
            ${mobileTab === 'chat' ? 'text-indigo-400' : 'text-slate-500'}`}
        >
          <div className="relative">
            <MessageSquare size={20} />
            {configApplied && mobileTab !== 'chat' && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400" />
            )}
          </div>
          Chat
        </button>
      </nav>
    </div>
  );
}
