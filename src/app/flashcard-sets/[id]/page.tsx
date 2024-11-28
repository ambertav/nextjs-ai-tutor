'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { IFlashcard } from '@/lib/models/flashcard';
import { IFlashcardSet } from '@/lib/models/flashcard-set';
import Flashcard from '@/app/components/FlashcardItem';

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
      setFlipState(false);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setFlipState(false);
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (isLoading) {
    return <main className="flex flex-col p-4 h-screen">Loading...</main>;
  }

  const currentFlashcard = flashcards[currentIndex];

  return (
    <main className="flex flex-col p-4 h-screen">
      <Link href={'/'} className="text-blue-500 hover:underline mb-4">
        Back to main page
      </Link>
      <section className="flex flex-col flex-1 p-4 bg-gray-100 rounded-lg">
        <div className="mb-10">
          <h1 className="text-3xl font-bold">{flashcardSet?.name}</h1>
          <p className="ml-2">
            {flashcardSet?.subject} - {flashcardSet?.topic}
          </p>
          <p className="ml-4 text-sm">{flashcardSet?.description}</p>
        </div>
        {currentFlashcard && (
          <div className="flex flex-col items-center justify-center space-y-6 w-full max-w-4xl mx-auto">
            <Flashcard
              question={currentFlashcard.question}
              answer={currentFlashcard.answer}
              example={currentFlashcard.example}
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
      </section>
    </main>
  );
}
