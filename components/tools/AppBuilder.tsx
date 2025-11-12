import React, { useState } from 'react';
import { generateText } from '../../services/geminiService';
import Spinner from '../ui/Spinner';

const AppBuilder: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setResult('');

    try {
      const systemInstruction = `You are a 10x software architect. Based on the user's app idea, generate a concise development plan.
      Include these sections, clearly marked with markdown headings:
      - **Concept:** A brief summary of the app.
      - **Target Audience:** Who is this app for?
      - **Core Features:** A bulleted list of the 3-5 most important features.
      - **Recommended Tech Stack:** Suggestions for frontend, backend, and database.
      - **Example Code Snippet:** A small, relevant code block for one of the core features (e.g., a React component or a Python function).`;
      const fullPrompt = `App Idea: ${prompt}`;
      const response = await generateText(fullPrompt, systemInstruction);
      setResult(response);
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
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A mobile app for local plant identification"
          className="flex-grow px-4 py-2 bg-[#0a0a1a] border border-gray-600 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 text-white"
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !prompt.trim()} className="px-6 py-2 bg-cyan-600 rounded-lg font-semibold hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors">
          {isLoading ? 'Building...' : 'Generate App Plan'}
        </button>
      </form>

      {error && <p className="text-center text-red-400 mb-4">{error}</p>}
      
      <div className="w-full min-h-[50vh] p-4 bg-[#0a0a1a]/50 border border-gray-700 rounded-lg overflow-y-auto">
          {isLoading && <div className="flex justify-center items-center h-full"><Spinner /></div>}
          {!isLoading && !result && <p className="text-gray-400 text-center">Your generated app plan will appear here.</p>}
          {result && <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: result.replace(/\n/g, '<br />') }} />}
      </div>
    </div>
  );
};

export default AppBuilder;
