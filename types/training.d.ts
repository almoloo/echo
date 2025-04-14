type TrainingAttribute = "identity" | "career" | "connection";

interface Question {
  type: TrainingAttribute;
  question: string;
}

interface QuestionAnswer extends Question {
  answer: string;
}
