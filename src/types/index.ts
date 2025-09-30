export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface QuizResult {
  id?: string;
  username: string;
  score: number;
  totalQuestions: number;
  timeTaken: number; // thời gian thực tế làm bài (giây)
  quizDuration: number; // tổng thời gian cho phép (giây)
  timestamp: Date;
  quizType?: string; // 'standard', 'ai-easy', 'ai-medium', 'ai-hard'
  difficulty?: string; // for AI quizzes
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
type LessonItem =  
  | { title: string; content: (string | LessonItem)[] };

export interface LessonContent {
  title: string;
  summary: string[];
  images: string[];
  videos?: VideoContent[];
  interactiveElements?: InteractiveElement[];
  timeline?: TimelineItem[];
  keyQuotes?: Quote[];
  cards: {
    color: string;
    title: string;
    items: LessonItem[];
  }[];
}

export interface VideoContent {
  id: string;
  title: string;
  description: string;
  embedUrl: string;
  duration?: string;
  category: 'documentary' | 'lecture' | 'historical' | 'educational';
}

export interface InteractiveElement {
  id: string;
  type: 'poll' | 'reflection' | 'discussion' | 'mindmap';
  title: string;
  content: string;
  options?: string[];
}

export interface TimelineItem {
  year: string;
  event: string;
  description: string;
  significance: string;
}

export interface Quote {
  text: string;
  context: string;
  significance: string;
}
