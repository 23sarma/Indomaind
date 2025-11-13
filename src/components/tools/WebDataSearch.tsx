import React, { useState } from 'react';
import { generateText } from '@/services/geminiService';
import Spinner from '@/components/ui/Spinner';

const WebDataSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setResults('');

    try {
      const systemInstruction = `You are the Indomind Search Engine. Emulate a real-time web search grounded on the latest information.
      For the user's query, provide a response in markdown format with the following structure:
      - A direct, concise answer to the query.
      - A "**Key Facts**" section with 3-4 bullet points.
      - A "**Related Links**" section with 3 mock URLs and titles that look realistic (e.g., [Title](https://www.example.com/article)).`;
      const result = await generateText(query, systemInstruction);
      setResults(result);
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
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the web with Indomind..."
          className="flex-grow px-4 py-2 bg-[#0a0a1a] border border-gray-600 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 text-white"
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !query.trim()} className="px-6 py-2 bg-cyan-600 rounded-lg font-semibold hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors">
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <p className="text-center text-red-400 mb-4">{error}</p>}

      <div className="w-full min-h-[50vh] p-4 bg-[#0a0a1a]/50 border border-gray-700 rounded-lg overflow-y-auto">
        {isLoading && <div className="flex justify-center items-center h-full"><Spinner /></div>}
        {!isLoading && !results && <p className="text-gray-400 text-center">Search results will appear here.</p>}
        {results && <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: results.replace(/\n/g, '<br />') }} />}
      </div>
    </div>
  );
};

export default WebDataSearch;