export type Tone = 'formal' | 'balanced' | 'friendly';

export type AvatarColor =
  | 'indigo'
  | 'emerald'
  | 'amber'
  | 'rose'
  | 'purple'
  | 'teal';

export interface BotConfig {
  name: string;
  department: string;
  tone: Tone;
  avatarColor: AvatarColor;
  topicScope: string;
  welcomeMessage: string;
  model?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isError?: boolean;
  isWelcome?: boolean;
}

export interface Preset {
  id: string;
  label: string;
  icon: string;
  config: BotConfig;
}
