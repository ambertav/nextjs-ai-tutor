'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { IFlashcard } from '@/lib/models/flashcard';
import { IFlashcardSet } from '@/lib/models/flashcard-set';
import Flashcard from '@/app/components/Flashcard';

export interface FlashcardSet extends IFlashcardSet {
  _id: string;
}

export interface Flashcard extends IFlashcard {
  _id: string;
}

export default function FlashcardSet() {
  const { id } = useParams();
  const [flashcardSet, setFlashcardSet] = useState<FlashcardSet | null>(null);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipState, setFlipState] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/flashcards/${id}`);
        const data = await response.json();
        setFlashcardSet(data.flashcardSet);
        setFlashcards(data.flashcards);
      } catch (error) {
        setError('Error fetching flashcard sets');
        console.error('Error fetching flashcard sets:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFlashcards();
  }, []);

  const handleFlip = () => {
    setFlipState((prev) => !prev);
  };

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setFlipState(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setFlipState(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const currentFlashcard = flashcards[currentIndex];

  return (
    <main>
      <Link href={'/'}>Back to main page</Link>
      <div>
        <h1>{flashcardSet?.name}</h1>
        <p className="text-sm text-gray-600">
          {flashcardSet?.subject} - {flashcardSet?.topic}
        </p>
        <p className="text-sm text-gray-600">{flashcardSet?.description}</p>
      </div>
      {currentFlashcard && (
        <div className="flex flex-col items-center justify-center h-screen space-y-6">
          <Flashcard
            question={currentFlashcard.question}
            answer={currentFlashcard.answer}
            isFlipped={flipState}
            onFlip={handleFlip}
          />
          <div className="flex space-x-4">
            <button
              onClick={handlePrev}
              className="px-4 py-2 bg-gray-200 rounded-lg shadow hover:bg-gray-300 disabled:opacity-50"
              disabled={currentIndex === 0}
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 disabled:opacity-50"
              disabled={currentIndex === flashcards.length - 1}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
