export interface ExtractedPdfText {
  text: string;
  pageCount: number;
  fileName: string;
}

export interface Flashcard {
  question: string;
  answer: string;
}

export interface QuizQuestion {
  question: string;
  answer: string;
}

export interface StudyPlanDay {
  day: number;
  title: string;
  tasks: string[];
}

export interface StudyKit {
  summary: string;
  flashcards: Flashcard[];
  quizQuestions: QuizQuestion[];
  studyPlan: StudyPlanDay[];
  fileName?: string | null;
}
