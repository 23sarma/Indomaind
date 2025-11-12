import React, { useState } from 'react';
import { generateText } from '../../services/geminiService';
import Spinner from '../ui/Spinner';

const AutoResearcher: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [report, setReport] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setReport('');

    try {
      const systemInstruction = `You are an AI research assistant. Provide a brief research report on the given topic.
      Structure your response with the following markdown headings:
      - **Overview:** A short summary of the topic.
      - **Key Points:** A bulleted list of 3-5 important facts or concepts.
      - **Further Questions:** A bulleted list of 3 interesting questions to guide further research.`;
      const result = await generateText(topic, systemInstruction);
      setReport(result);
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
          placeholder="Enter a research topic, e.g., The history of artificial intelligence"
          className="flex-grow px-4 py-2 bg-[#0a0a1a] border border-gray-600 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 text-white"
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !topic.trim()} className="px-6 py-2 bg-cyan-600 rounded-lg font-semibold hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors">
          {isLoading ? 'Researching...' : 'Research Topic'}
        </button>
      </form>

      {error && <p className="text-center text-red-400 mb-4">{error}</p>}

      <div className="w-full min-h-[50vh] p-4 bg-[#0a0a1a]/50 border border-gray-700 rounded-lg overflow-y-auto">
        {isLoading && <div className="flex justify-center items-center h-full"><Spinner /></div>}
        {!isLoading && !report && <p className="text-gray-400 text-center">Your research report will appear here.</p>}
        {report && <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: report.replace(/\n/g, '<br />') }} />}
      </div>
    </div>
  );
};

export default AutoResearcher;
