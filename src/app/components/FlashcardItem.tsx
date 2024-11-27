interface FlashcardProps {
  question: string;
  answer: string;
  isFlipped: boolean;
  onFlip: () => void;
}

export default function Flashcard({
  question,
  answer,
  isFlipped,
  onFlip,
}: FlashcardProps) {
  return (
    <div
    onClick={onFlip}
    className={`relative w-64 h-96 bg-white shadow-lg rounded-lg cursor-pointer`}
  >
    <div className="absolute inset-0 flex items-center justify-center p-4">
      <p className="text-center text-lg font-semibold">
        {isFlipped ? answer : question}
      </p>
    </div>
  </div>
  );
}
