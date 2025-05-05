type TrainingAttribute = "identity" | "career" | "connection";

interface Question {
  created_at?: string;
  id?: string;
  type: TrainingAttribute;
  question: string;
  address?: string;
}

interface AskedQuestion extends Question {
  from?: string;
  read?: string;
}

interface QuestionAnswer extends Question {
  answer: string;
}

interface UserData {
  last_modified: number;
  answers: QuestionAnswer[];
  skipped: Question[];
}
