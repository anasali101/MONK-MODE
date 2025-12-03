
export type Profession = 'Software Engineer' | 'Designer' | 'Writer' | 'Marketer' | 'Student' | 'Executive' | 'Other';

export type Mood = 'Bored' | 'Anxious' | 'Procrastinating' | 'Tired' | 'Overwhelmed';

export type Tab = 'dashboard' | 'vault' | 'quests' | 'stats';

export type ActivityType = 'TRIVIA' | 'BREATHING' | 'REACTION' | 'SHREDDER';

export interface ActivityConfig {
  type: ActivityType;
  title: string;
  description: string;
  durationSeconds: number; // 0 for untimed/game
}

export interface UserProfile {
  name: string;
  profession: Profession;
  streak: number;
  minutesSaved: number;
  xp: number;
  level: number;
}

export interface InterventionResponse {
  realityCheck: string;
  microTask: string;
  mindfulnessTrigger: string;
  estimatedTimeMinutes: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  baseReward: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  isActive: boolean;
  isCompleted: boolean;
  options?: number[]; // Duration options in hours
  selectedOption?: number;
  startTime?: number;
}

export interface BlockedApp {
  id: string;
  name: string;
  icon: string; 
  brandColor: string;
  usageMinutes: number;
  limitMinutes: number;
  isLocked: boolean;
}

export interface UnlockJudgment {
  allowed: boolean;
  message: string;
  durationGranted?: number;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface AuthState {
  isLoggedIn: boolean;
  userEmail?: string;
  method?: 'google' | 'apple' | 'email';
}
