type TrainingAttribute = "identity" | "career" | "connection";

interface Question {
  type: TrainingAttribute;
  question: string;
}

interface QuestionAnswer extends Question {
  answer: string;
}

interface UserData {
  last_modified: number;
  answers: QuestionAnswer[];
  skipped: Question[];
}
