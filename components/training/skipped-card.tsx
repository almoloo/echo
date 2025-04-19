interface SkippedCardProp {
  question: Question;
}

export default function SkippedCard({ question }: SkippedCardProp) {
  return (
    <div>
      <h1>item</h1>
      <p>{question.type}</p>
      <p>{question.question}</p>
      <p>{question.id}</p>
    </div>
  );
}
