import React, { useState } from 'react';
import { generateText } from '../../services/geminiService';
import Spinner from '../ui/Spinner';

const OcrScanner: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setExtractedText('');

    try {
      const systemInstruction = `You are an OCR (Optical Character Recognition) tool. The user will describe text they see in an image.
      Your task is to extract, clean, and format that text as accurately as possible. Correct any obvious typos or formatting errors based on the description.
      Only return the cleaned text, with no extra explanations.`;
      const result = await generateText(prompt, systemInstruction);
      setExtractedText(result);
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
          <label className="block mb-2 font-semibold text-gray-300">Describe the Text in the Image</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A blurry photo of a street sign that says 'Welcme to Indomind'"
            className="w-full h-64 p-4 bg-[#0a0a1a] border border-gray-600 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 text-white resize-none"
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || !prompt.trim()} className="w-full mt-4 px-6 py-3 bg-cyan-600 rounded-lg font-semibold hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors">
            {isLoading ? 'Scanning...' : 'Extract Text'}
          </button>
        </form>
      </div>
      <div>
        <label className="block mb-2 font-semibold text-gray-300">Extracted Text</label>
        <div className="w-full h-64 p-4 bg-[#0a0a1a]/50 border border-gray-700 rounded-lg overflow-y-auto">
          {isLoading && <div className="flex justify-center items-center h-full"><Spinner /></div>}
          {error && <p className="text-red-400">{error}</p>}
          <p className="whitespace-pre-wrap">{extractedText}</p>
        </div>
      </div>
    </div>
  );
};

export default OcrScanner;
