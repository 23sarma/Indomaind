import React, { useState } from 'react';
import { generateText } from '../../services/geminiService';
import Spinner from '../ui/Spinner';

const FitnessPlanner: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [plan, setPlan] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setPlan('');

    try {
      const systemInstruction = `You are a certified fitness coach. Create a sample 7-day workout plan based on the user's goals.
      Structure the response with markdown headings for each day (e.g., **Day 1: Upper Body Strength**).
      For each day, list 3-5 exercises with sets and reps. Include rest days.
      Add a disclaimer at the end: "Disclaimer: Consult with a healthcare professional before starting any new fitness program."`;
      const result = await generateText(prompt, systemInstruction);
      setPlan(result);
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
          placeholder="e.g., A beginner plan for building muscle, 3 days a week"
          className="flex-grow px-4 py-2 bg-[#0a0a1a] border border-gray-600 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 text-white"
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !prompt.trim()} className="px-6 py-2 bg-cyan-600 rounded-lg font-semibold hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors">
          {isLoading ? 'Generating...' : 'Generate Fitness Plan'}
        </button>
      </form>

      {error && <p className="text-center text-red-400 mb-4">{error}</p>}
      
      <div className="w-full min-h-[50vh] p-4 bg-[#0a0a1a]/50 border border-gray-700 rounded-lg overflow-y-auto">
        {isLoading && <div className="flex justify-center items-center h-full"><Spinner /></div>}
        {!isLoading && !plan && <p className="text-gray-400 text-center">Your fitness plan will appear here.</p>}
        {plan && <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: plan.replace(/\n/g, '<br />') }} />}
      </div>
    </div>
  );
};

export default FitnessPlanner;
