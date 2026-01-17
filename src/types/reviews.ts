export type ReviewPriority = 'Baixa' | 'Média' | 'Alta';
export type ReviewSuggestion = 'Teoria' | 'Anki' | 'Exercícios';

export interface ReviewCycle {
  cycle: number; // 1 for R1, 2 for R2, etc.
  plannedDate: string; // ISO date string
  isCompleted: boolean;
  performance?: number; // e.g., 0-100
}

export interface Review {
  id: string;
  subjectId: string;
  topic: string;
  priority: ReviewPriority;
  suggestion: ReviewSuggestion;
  generalNotes?: string;
  createdAt: string; // ISO date string
  cycles: ReviewCycle[];
}

export type NewReviewData = Omit<Review, 'id' | 'createdAt' | 'cycles'>;
