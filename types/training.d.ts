type TrainingAttribute = "identity" | "career" | "connection";

interface Question {
  id?: string;
  type: TrainingAttribute;
  question: string;
  address?: string;
}

interface AskedQuestion extends Question {
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
