export type QuestionDifficulty = 'easy' | 'medium' | 'hard';
export type AssignmentStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface QuestionType {
  type: string;
  count: number;
  marks: number;
}

export interface Question {
  question: string;
  difficulty: QuestionDifficulty;
  marks: number;
}

export interface Section {
  title: string;
  instruction: string;
  questions: Question[];
}

export interface GeneratedPaper {
  sections: Section[];
}

export interface Assignment {
  _id: string;
  title: string;
  dueDate: string;
  instructions: string;
  sourceFileName?: string;
  sourceText?: string;
  questionTypes: QuestionType[];
  status: AssignmentStatus;
  generatedPaper?: GeneratedPaper;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssignmentFormData {
  title: string;
  dueDate: string;
  instructions: string;
  questionTypes: QuestionType[];
  file?: File | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface SocketEvent {
  assignmentId: string;
  status: AssignmentStatus;
  data?: Assignment;
  error?: string;
}
