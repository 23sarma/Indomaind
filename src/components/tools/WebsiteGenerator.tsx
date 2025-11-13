import React, { useState } from 'react';
import { generateText } from '@/services/geminiService';
import Spinner from '@/components/ui/Spinner';

const WebsiteGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [websiteCode, setWebsiteCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setWebsiteCode('');

    try {
      const systemInstruction = `You are an expert web developer specializing in Tailwind CSS.
      Generate a complete, single-file HTML response for a website based on the user's prompt.
      The HTML file must include a <head> with a title and the Tailwind CSS CDN script ('<script src="https://cdn.tailwindcss.com"></script>').
      The <body> should contain the website content, fully styled with Tailwind CSS classes. Use placeholder images from picsum.photos if needed.
      Do not include any explanations, just the raw HTML code.`;
      
      const fullPrompt = `Create a website for: ${prompt}`;
      let result = await generateText(fullPrompt, systemInstruction);
      
      // Clean up markdown code block fences if they exist
      result = result.replace(/^```(?:html)?\n|```$/g, '');
      
      setWebsiteCode(result);
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
          placeholder="e.g., A portfolio for a landscape photographer"
          className="flex-grow px-4 py-2 bg-[#0a0a1a] border border-gray-600 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 text-white"
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !prompt.trim()} className="px-6 py-2 bg-cyan-600 rounded-lg font-semibold hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors">
          {isLoading ? 'Generating...' : 'Generate Website'}
        </button>
      </form>

      {error && <p className="text-center text-red-400 mb-4">{error}</p>}

      <div className="grid md:grid-cols-2 gap-6 h-[70vh]">
        <div>
          <h3 className="text-lg font-semibold mb-2">Live Preview</h3>
          <iframe
            srcDoc={websiteCode}
            title="Website Preview"
            className="w-full h-full border border-gray-700 rounded-lg bg-white"
            sandbox="allow-scripts"
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">HTML Code</h3>
          <div className="relative w-full h-full">
            <textarea
              readOnly
              value={websiteCode}
              className="w-full h-full p-4 bg-[#0a0a1a] border border-gray-600 rounded-lg text-white font-mono text-sm resize-none"
            />
            {isLoading && <div className="absolute inset-0 bg-black/50 flex justify-center items-center"><Spinner /></div>}
             <button
              onClick={() => navigator.clipboard.writeText(websiteCode)}
              className="absolute top-2 right-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-xs rounded"
              disabled={!websiteCode}
            >
              Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebsiteGenerator;