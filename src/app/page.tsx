'use client';

import { useState } from 'react';
import Link from 'next/link';
import Sidebar from './components/Sidebar';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [chatMessages, setChatMessages] = useState<
    { type: 'user' | 'claude'; text: string }[]
  >([]);

  const handleKeyPress = (evt: React.KeyboardEvent) => {
    if (evt.key === 'Enter' && !evt.shiftKey) {
      evt.preventDefault();
      handleSubmit(evt as React.FormEvent);
    }
  };

  const handleSubmit = async (evt: React.FormEvent) => {
    evt.preventDefault();
    if (!userInput.trim()) return;

    setIsLoading(true);

    try {
      const response = await fetch(`/api/claude`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // send user input so route can interact with API
        body: JSON.stringify({ input: userInput }),
      });

      if (!response.ok) {
        throw new Error('Error sending request to Claude');
      }

      const data = await response.json();

      // add input and response to messages
      setChatMessages((prevMessages: any) => {
        const newMessages = [
          ...prevMessages,
          { type: 'user', text: userInput },
          { type: 'claude', text: data.msg },
        ];

        if (data.setId) {
          (newMessages).push({
            type: 'claude',
            text: (
              <>
                <Link
                  href={`/flashcard-sets/${data.setId}`}
                  className="text-blue-800 hover:underline mb-4"
                >
                  View Flashcards
                </Link>
              </>
            ),
          });
        }

        return newMessages;
      });
    } catch (error : any) {
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { type: 'claude', text: `Error: ${error.message}` },
      ]);
    } finally {
      setIsLoading(false);
      setUserInput('');
    }
  };

  return (
    <main className="flex p-4 h-screen">
      <Sidebar />

      {/* Chatbox */}
      <section className="flex flex-col flex-1 p-4 bg-gray-100 rounded-lg">
        <h1 className="text-center text-2xl font-semibold text-gray-800">
          Chat with Claude
        </h1>

        <div className="flex-1 overflow-y-auto mb-4">
          {chatMessages.map((msg, idx) => (
            <div
              key={idx}
              className={`${
                msg.type === 'user' ? 'flex justify-end' : 'flex justify-start'
              }`}
            >
              <div className="message-text p-2 max-w-xs bg-gray-300 rounded-lg mb-2">
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input form */}
        <form onSubmit={handleSubmit} className="flex mt-auto">
          <textarea
            value={userInput}
            onChange={(evt) => setUserInput(evt.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Enter your message..."
            rows={3}
            className="text-box p-2 mb-2 border rounded w-full"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 p-4 bg-gray-100 rounded-lg"
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </section>
    </main>
  );
}
