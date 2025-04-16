interface QuestionCardProps {
  question: Question;
  submitAnswer: (arg: QuestionAnswer) => void;
  skipQuestion: (arg: Question) => void;
}

export default function QuestionCard({
  question,
  submitAnswer,
  skipQuestion,
}: QuestionCardProps) {
  function handleSubmit(formData: FormData) {
    const answer = formData.get("answer")?.toString();
    if (!answer) return;

    submitAnswer({
      ...question,
      answer,
    });
  }

  function handleReset() {
    skipQuestion(question);
  }

  return (
    <form action={handleSubmit} onReset={handleReset}>
      <h1>{question.type} question:</h1>
      <p>{question.question}</p>
      <input type="text" placeholder="answer" name="answer" required />
      <div>
        <button type="reset">Skip Question</button>
        <button type="submit">Submit Answer</button>
      </div>
    </form>
  );
}
