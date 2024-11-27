'use client';

import { useState } from 'react';
import Sidebar from './components/Sidebar';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [userInput, setUserInput] = useState('');
  const [chatMessages, setChatMessages] = useState<string[]>([]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!userInput.trim()) return; // Don't submit empty input

    setIsLoading(true);

    // Add user's message to the chat
    setChatMessages((prevMessages) => [...prevMessages, `User: ${userInput}`]);

    try {
      const response = await fetch(`/api/claude`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: userInput }), // Sending user input as the body of the request
      });

      if (!response.ok) {
        throw new Error('Error sending request to Claude');
      }

      const data = await response.json();

      // Add Claude's response to the chat
      setChatMessages((prevMessages) => [
        ...prevMessages,
        `Claude: ${data.msg}`,
        ...(data.setId ? [`Link to flashcards: /flashcard-set/${data.setId}`] : []),
      ]);


    } catch (error) {
      setChatMessages((prevMessages) => [...prevMessages, `Claude: ${error}`]);
    } finally {
      setIsLoading(false);
      setUserInput('');
    }
  };

  return (
    <main>
      <Sidebar />
      <section>
        <h2>Chat with Claude</h2>

        {/* Display chat messages */}
        <div className="chat-box">
          {chatMessages.map((msg, idx) => (
            <p key={idx}>{msg}</p>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Enter your message..."
            rows={4}
            className="text-box"
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </section>
    </main>
  );
}
