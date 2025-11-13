import React, { useState } from 'react';
import { generateText } from '@/services/geminiService';
import Spinner from '@/components/ui/Spinner';

const CodeOptimizer: React.FC = () => {
  const [code, setCode] = useState('');
  const [optimizedCode, setOptimizedCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setOptimizedCode('');

    try {
      const systemInstruction = "You are an expert code optimizer. Analyze the given code snippet and provide an optimized version. Explain the improvements made in comments within the code. The output should be only the code block.";
      const prompt = `Please optimize the following code:\n\n\`\`\`\n${code}\n\`\`\``;
      let result = await generateText(prompt, systemInstruction);
      // Clean up markdown code block fences if they exist
      result = result.replace(/^```(?:\w+)?\n|```$/g, '');
      setOptimizedCode(result);
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
          <label className="block mb-2 font-semibold text-gray-300">Your Code</label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste your code here..."
            className="w-full h-80 p-4 bg-[#0a0a1a] border border-gray-600 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 text-white resize-none font-mono text-sm"
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || !code.trim()} className="w-full mt-4 px-6 py-3 bg-cyan-600 rounded-lg font-semibold hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors">
            {isLoading ? 'Optimizing...' : 'Optimize Code'}
          </button>
        </form>
      </div>
      <div>
        <label className="block mb-2 font-semibold text-gray-300">Optimized Code</label>
        <div className="w-full h-80 p-4 bg-[#0a0a1a]/50 border border-gray-700 rounded-lg overflow-y-auto">
          {isLoading && <div className="flex justify-center items-center h-full"><Spinner /></div>}
          {error && <p className="text-red-400">{error}</p>}
          <pre><code className="font-mono text-sm whitespace-pre-wrap">{optimizedCode}</code></pre>
        </div>
      </div>
    </div>
  );
};

export default CodeOptimizer;