import React, { useState } from 'react';
import { generateText } from '../../services/geminiService';
import Spinner from '../ui/Spinner';

const NewsSummarizer: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setSummary('');

    try {
      const systemInstruction = `You are an AI news anchor. Provide a summary of the most recent, important news about the given topic.
      Present the information as 3-5 clear bullet points.
      Since you don't have real-time access, frame the response as a general summary of recent developments.`;
      const fullPrompt = `Summarize the latest news about: ${topic}`;
      const result = await generateText(fullPrompt, systemInstruction);
      setSummary(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., a summary of recent space exploration news"
          className="flex-grow px-4 py-2 bg-[#0a0a1a] border border-gray-600 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 text-white"
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !topic.trim()} className="px-6 py-2 bg-cyan-600 rounded-lg font-semibold hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors">
          {isLoading ? 'Summarizing...' : 'Get News Summary'}
        </button>
      </form>

      {error && <p className="text-center text-red-400 mb-4">{error}</p>}

      <div className="w-full min-h-[40vh] p-4 bg-[#0a0a1a]/50 border border-gray-700 rounded-lg overflow-y-auto">
        {isLoading && <div className="flex justify-center items-center h-full"><Spinner /></div>}
        {!isLoading && !summary && <p className="text-gray-400 text-center">Your news summary will appear here.</p>}
        {summary && <p className="whitespace-pre-wrap">{summary}</p>}
      </div>
    </div>
  );
};

export default NewsSummarizer;
