import React, { useState } from 'react';
import { generateText } from '../../services/geminiService';
import Spinner from '../ui/Spinner';

const DreamInterpreter: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [interpretation, setInterpretation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setInterpretation('');

    try {
      const systemInstruction = `You are a creative and insightful dream interpreter.
      Analyze the user's dream based on common symbolism, but present the interpretation in an engaging and narrative way.
      Do not claim to be a psychologist. Frame it as a fun exploration of possibilities.
      Start with "Here's one possible interpretation of your dream:"`;
      const fullPrompt = `My dream was about: ${prompt}`;
      const result = await generateText(fullPrompt, systemInstruction);
      setInterpretation(result);
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
          placeholder="e.g., I was flying over a city made of chocolate"
          className="flex-grow px-4 py-2 bg-[#0a0a1a] border border-gray-600 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 text-white"
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !prompt.trim()} className="px-6 py-2 bg-cyan-600 rounded-lg font-semibold hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors">
          {isLoading ? 'Interpreting...' : 'Interpret Dream'}
        </button>
      </form>

      {error && <p className="text-center text-red-400 mb-4">{error}</p>}

      <div className="w-full min-h-[40vh] p-4 bg-[#0a0a1a]/50 border border-gray-700 rounded-lg overflow-y-auto">
        {isLoading && <div className="flex justify-center items-center h-full"><Spinner /></div>}
        {!isLoading && !interpretation && <p className="text-gray-400 text-center">Your dream interpretation will appear here.</p>}
        {interpretation && <p className="whitespace-pre-wrap">{interpretation}</p>}
      </div>
    </div>
  );
};

export default DreamInterpreter;
