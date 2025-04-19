interface AnswerCardProp {
  answer: QuestionAnswer;
}

export default function AnswerCard({ answer }: AnswerCardProp) {
  return (
    <div>
      <h1>item</h1>
      <p>{answer.type}</p>
      <p>{answer.question}</p>
      <p>{answer.answer}</p>
      <p>{answer.id}</p>
    </div>
  );
}
