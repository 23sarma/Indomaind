import React, { useState } from 'react';
import { generateText } from '@/services/geminiService';
import Spinner from '@/components/ui/Spinner';

const MathSolver: React.FC = () => {
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!problem.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setSolution('');

    try {
      const systemInstruction = `You are a math tutor AI. Solve the user's math problem and provide a clear, step-by-step explanation of how you arrived at the answer.
      Structure the response with a "Solution:" section followed by the final answer, and then a "Step-by-step Explanation:" section.`;
      const result = await generateText(problem, systemInstruction);
      setSolution(result);
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
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          placeholder="e.g., If a train travels at 60 mph for 3.5 hours, how far does it go?"
          className="flex-grow px-4 py-2 bg-[#0a0a1a] border border-gray-600 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 text-white"
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !problem.trim()} className="px-6 py-2 bg-cyan-600 rounded-lg font-semibold hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors">
          {isLoading ? 'Calculating...' : 'Solve Problem'}
        </button>
      </form>

      {error && <p className="text-center text-red-400 mb-4">{error}</p>}
      
      <div className="w-full min-h-[40vh] p-4 bg-[#0a0a1a]/50 border border-gray-700 rounded-lg overflow-y-auto">
        {isLoading && <div className="flex justify-center items-center h-full"><Spinner /></div>}
        {!isLoading && !solution && <p className="text-gray-400 text-center">The solution and explanation will appear here.</p>}
        {solution && <p className="whitespace-pre-wrap">{solution}</p>}
      </div>
    </div>
  );
};

export default MathSolver;