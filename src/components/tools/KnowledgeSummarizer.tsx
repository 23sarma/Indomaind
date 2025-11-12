import React, { useState } from 'react';
import { generateText } from '../../services/geminiService';
import Spinner from '../ui/Spinner';

const KnowledgeSummarizer: React.FC = () => {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setSummary('');

    try {
      const systemInstruction = "You are an expert summarizer. Take the following text and create a concise, clear, and accurate summary. Focus on the key points and main ideas.";
      const prompt = `Please summarize this text:\n\n${text}`;
      const result = await generateText(prompt, systemInstruction);
      setSummary(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-semibold text-gray-300">Text to Summarize</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your long text here..."
            className="w-full h-64 p-4 bg-[#0a0a1a] border border-gray-600 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 text-white resize-none"
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || !text.trim()} className="w-full mt-4 px-6 py-3 bg-cyan-600 rounded-lg font-semibold hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors">
            {isLoading ? 'Summarizing...' : 'Summarize Text'}
          </button>
        </form>
      </div>
      <div>
        <label className="block mb-2 font-semibold text-gray-300">Generated Summary</label>
        <div className="w-full h-64 p-4 bg-[#0a0a1a]/50 border border-gray-700 rounded-lg overflow-y-auto">
          {isLoading && <div className="flex justify-center items-center h-full"><Spinner /></div>}
          {error && <p className="text-red-400">{error}</p>}
          <p className="whitespace-pre-wrap">{summary}</p>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeSummarizer;
