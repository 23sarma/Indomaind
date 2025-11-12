import React, { useState } from 'react';
import { generateText } from '../../services/geminiService';
import Spinner from '../ui/Spinner';

const BusinessPlan: React.FC = () => {
  const [idea, setIdea] = useState('');
  const [plan, setPlan] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setPlan('');

    try {
      const systemInstruction = `You are a strategic business consultant. Create a concise, one-page business plan for the user's idea.
      Use the following markdown structure:
      - **Executive Summary:** A powerful opening paragraph.
      - **Problem Statement:** What problem does this solve?
      - **Solution / Value Proposition:** How does it solve the problem uniquely?
      - **Target Market:** Who are the primary customers?
      - **Marketing & Sales Strategy:** A brief outline of how to reach customers.
      - **Revenue Streams:** How will it make money?`;
      const result = await generateText(idea, systemInstruction);
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
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="e.g., An online marketplace for handmade artisan goods"
          className="flex-grow px-4 py-2 bg-[#0a0a1a] border border-gray-600 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 text-white"
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !idea.trim()} className="px-6 py-2 bg-cyan-600 rounded-lg font-semibold hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors">
          {isLoading ? 'Generating...' : 'Generate Business Plan'}
        </button>
      </form>

      {error && <p className="text-center text-red-400 mb-4">{error}</p>}
      
      <div className="w-full min-h-[50vh] p-4 bg-[#0a0a1a]/50 border border-gray-700 rounded-lg overflow-y-auto">
        {isLoading && <div className="flex justify-center items-center h-full"><Spinner /></div>}
        {!isLoading && !plan && <p className="text-gray-400 text-center">Your business plan will appear here.</p>}
        {plan && <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: plan.replace(/\n/g, '<br />') }} />}
      </div>
    </div>
  );
};

export default BusinessPlan;
