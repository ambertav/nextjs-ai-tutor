interface FlashcardProps {
  question: string;
  answer: string;
  example?: string; // Optional example text
  isFlipped: boolean;
  onFlip: () => void;
}

export default function Flashcard({
  question,
  answer,
  example,
  isFlipped,
  onFlip,
}: FlashcardProps) {
  return (
    <div
      onClick={onFlip}
      aria-label={isFlipped ? 'Flashcard answer' : 'Flashcard question'}
      className="relative w-3/4 h-96 bg-white shadow-xl rounded-lg cursor-pointer"
    >
      <div className="absolute top-2 left-4 text-sm text-gray-600">
        {isFlipped ? 'Answer' : 'Question'}
      </div>

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="text-center">
          {/* display question or answer */}
          <p className="text-2xl font-semibold mb-2">
            {isFlipped ? answer : question}
          </p>

          {/* display example if available */}
          {isFlipped && example && (
            <p className="text-lg italic text-gray-600 mt-4">{`Example: ${example}`}</p>
          )}
        </div>
      </div>
    </div>
  );
}
