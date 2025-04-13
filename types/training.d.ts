type TrainingAttribute = "identity" | "career" | "connection";

interface QuestionAnswer {
  type: TrainingAttribute;
  question: string;
  answer: string;
}
