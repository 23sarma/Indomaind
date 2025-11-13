import React, { useState } from 'react';
import { generateText } from '@/services/geminiService';
import Spinner from '@/components/ui/Spinner';

const SeoOptimizer: React.FC = () => {
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setAnalysis('');

    try {
      const systemInstruction = `You are an SEO expert. Analyze the provided text and give actionable advice.
      Structure the response with the following markdown headings:
      - **Suggested Keywords:** A comma-separated list of 5-7 relevant keywords.
      - **Suggested Title Tag (under 60 chars):** A compelling title for search engines.
      - **Suggested Meta Description (under 160 chars):** An engaging summary for search results.
      - **Content Improvement Tips:** One or two brief suggestions to improve the text's SEO.`;
      const result = await generateText(text, systemInstruction);
      setAnalysis(result);
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
          <label className="block mb-2 font-semibold text-gray-300">Content to Optimize</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your blog post, product description, or other text here..."
            className="w-full h-64 p-4 bg-[#0a0a1a] border border-gray-600 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 text-white resize-none"
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || !text.trim()} className="w-full mt-4 px-6 py-3 bg-cyan-600 rounded-lg font-semibold hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors">
            {isLoading ? 'Analyzing...' : 'Optimize for SEO'}
          </button>
        </form>
      </div>
      <div>
        <label className="block mb-2 font-semibold text-gray-300">SEO Analysis & Suggestions</label>
        <div className="w-full h-64 p-4 bg-[#0a0a1a]/50 border border-gray-700 rounded-lg overflow-y-auto">
          {isLoading && <div className="flex justify-center items-center h-full"><Spinner /></div>}
          {error && <p className="text-red-400">{error}</p>}
          <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: analysis.replace(/\n/g, '<br />') }} />
        </div>
      </div>
    </div>
  );
};

export default SeoOptimizer;