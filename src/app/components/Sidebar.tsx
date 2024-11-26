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
  const [flashcardSetsData, setFlashcardSetsData] = useState<SetSubject[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFlashcardSets = async () => {
      try {
        const response = await fetch('/api/flashcards');
        const data = await response.json();
        // data is grouped by subject and topic (e.g., Mathematics > Calculus > FlashcardSet), 
        setFlashcardSetsData(data);
      } catch (error) {
        setError('Error fetching flashcard sets');
        console.error('Error fetching flashcard sets:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFlashcardSets();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <aside>
      {flashcardSetsData.length === 0 ? (
        <p>No flashcard sets available.</p>
      ) : (
        <ul>
          {flashcardSetsData.map((subject) => (
            <li key={subject._id}>
              <details>
                <summary>{subject._id}</summary>
                <ul>
                  {subject.topics.map((topic) => (
                    <li key={topic.topic}>
                      <details>
                        <summary>{topic.topic}</summary>
                        <ul>
                          {topic.flashcardSets.map((set) => (
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
      )}
    </aside>
  );
}
