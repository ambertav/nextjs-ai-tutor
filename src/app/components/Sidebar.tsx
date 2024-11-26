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
    SetSubject[] | FlashcardSet[]
  >([]);
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <aside>
      <div>
        <label>
          <input
            type="radio"
            name="sortBy"
            value="mostRecent"
            checked={sortBy === 'mostRecent'}
            onChange={() => setSortBy('mostRecent')}
          />
          Sort by Most Recent
        </label>
        <br />
        <label>
          <input
            type="radio"
            name="sortBy"
            value="subject"
            checked={sortBy === 'subject'}
            onChange={() => setSortBy('subject')}
          />
          Sort by Subject
        </label>
      </div>

      {flashcardSetsData.length === 0 ? (
        <p>No flashcard sets available.</p>
      ) : Array.isArray(flashcardSetsData) &&
        flashcardSetsData[0]?.hasOwnProperty('topics') ? (
        // grouped by subject
        <ul>
          {(flashcardSetsData as SetSubject[]).map((subject) => (
            <li key={subject._id}>
              <details>
                <summary>{subject._id}</summary>
                <ul>
                  {subject.topics.map((topic) => (
                    <li key={topic.topic}>
                      <details>
                        <summary>{topic.topic}</summary>
                        <ul>
                          {topic.flashcardSets.map((set: FlashcardSet) => (
                            <li key={set._id}>
                              <Link href={`/flashcard-sets/${set._id}`}>
                                {set.name}
                              </Link>
                            </li>
                          ))}
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
        // flat list of most recent
        <ul>
          {(flashcardSetsData as FlashcardSet[]).map((set) => (
            <li key={set._id}>
              <Link href={`/flashcard-sets/${set._id}`}>{set.name}</Link>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
