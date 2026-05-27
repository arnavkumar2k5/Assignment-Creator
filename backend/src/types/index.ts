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

export interface IAssignment {
  _id?: string;
  title: string;
  dueDate: Date;
  instructions: string;
  questionTypes: QuestionType[];
  status: AssignmentStatus;
  generatedPaper?: GeneratedPaper;
  error?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateAssignmentDTO {
  title: string;
  dueDate: string;
  instructions: string;
  questionTypes: QuestionType[];
}

export interface JobData {
  assignmentId: string;
}
