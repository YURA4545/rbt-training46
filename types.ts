
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface TrainingDay {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  videoPlatform: 'vk' | 'rutube' | 'other';
  objectives: string[];
  summary: string;
  questions: QuizQuestion[];
}

export interface TestResult {
  id?: string;
  userName: string;
  dayId: number;
  dayTitle: string;
  score: number;
  totalQuestions: number;
  timestamp: number;
}

export interface CompletionRecord {
  id?: string;
  userName: string;
  dayId: number;
  dayTitle: string;
  timestamp: number;
  score?: number;
  totalQuestions?: number;
}

export interface UserProgress {
  completedDays: number[];
  currentDay: number;
  userName: string | null;
  isAdmin: boolean;
  userId?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
