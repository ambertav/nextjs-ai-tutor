'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export interface FlashcardSet {
  _id: string;
  name: string;
}

export interface Topic {
  topic: string;
  flashcardSets: FlashcardSet[];
}

export interface SetSubject {
  _id: string;
  topics: Topic[];
}

export default function Sidebar() {
  const [flashcardSetsData, setFlashcardSetsData] = useState<
    SetSubject[] | FlashcardSet[] | null
  >(null);

  const [sortBy, setSortBy] = useState<'subject' | 'mostRecent'>('mostRecent');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFlashcardSets = async () => {
      try {
        const response = await fetch(`/api/flashcards?sortBy=${sortBy}`);
        const data = await response.json();
        // data is either:
            // flat array of sorted by most recent flashcard sets
            // grouped by subject and topic (e.g., Mathematics > Calculus > FlashcardSet)
        setFlashcardSetsData(data);
      } catch (error) {
        setError('Error fetching flashcard sets');
        console.error('Error fetching flashcard sets:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFlashcardSets();
  }, [sortBy]);

  return (
    <aside className="w-1/4 mr-4 bg-gray-200 p-2 rounded-lg">
      {isLoading || flashcardSetsData === null ? (
        <p className="ml-4 mt-6">Loading...</p>
      ) : flashcardSetsData?.length === 0 ? (
        <p className="ml-4 mt-6">No flashcard sets available.</p>
      ) : (
        // Sorting Buttons
        <>
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">Sort by:</label>
            <div className="flex items-center mb-3">
              <input
                type="radio"
                name="sortBy"
                value="mostRecent"
                checked={sortBy === 'mostRecent'}
                onChange={() => setSortBy('mostRecent')}
                className="mr-2"
              />
              <span className="text-sm">Most Recent</span>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                name="sortBy"
                value="subject"
                checked={sortBy === 'subject'}
                onChange={() => setSortBy('subject')}
                className="mr-2"
              />
              <span className="text-sm">By Subject</span>
            </div>
          </div>

          <div>
            {/* Flashcard Set Display */}
            {Array.isArray(flashcardSetsData) &&
            flashcardSetsData[0]?.hasOwnProperty('topics') ? (
              // Grouped by subject
              <ul>
                {(flashcardSetsData as SetSubject[])?.map((subject) => (
                  <li key={subject._id}>
                    <details className="mb-4">
                      <summary className="font-semibold cursor-pointer">
                        {subject._id}
                      </summary>
                      <ul className="ml-4 my-2">
                        {subject.topics.map((topic) => (
                          <li key={topic.topic}>
                            <details className="my-2">
                              <summary className="font-medium cursor-pointer">
                                {topic.topic}
                              </summary>
                              <ul className="ml-6 my-2">
                                {topic.flashcardSets.map(
                                  (set: FlashcardSet) => (
                                    <li key={set._id}>
                                      <Link
                                        href={`/flashcard-sets/${set._id}`}
                                        className="cursor-pointer hover:underline"
                                      >
                                        {set.name}
                                      </Link>
                                    </li>
                                  )
                                )}
                              </ul>
                            </details>
                          </li>
                        ))}
                      </ul>
                    </details>
                  </li>
                ))}
              </ul>
            ) : (
              // Flat list of most recent
              <ul className="max-h-80 overflow-y-auto">
                {(flashcardSetsData as FlashcardSet[])?.map((set) => (
                  <li key={set._id} className="ml-2 my-2">
                    <Link
                      href={`/flashcard-sets/${set._id}`}
                      className="cursor-pointer hover:underline"
                    >
                      {set.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </aside>
  );
}
