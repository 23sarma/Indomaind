import React, { useState } from 'react';
import { generateImage } from '../../services/geminiService';
import Spinner from '../ui/Spinner';

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setImages([]);

    try {
      const result = await generateImage(prompt);
      setImages(result);
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
          placeholder="e.g., A futuristic Indian city skyline at sunset"
          className="flex-grow px-4 py-2 bg-[#0a0a1a] border border-gray-600 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 text-white"
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !prompt.trim()} className="px-6 py-2 bg-cyan-600 rounded-lg font-semibold hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors">
          {isLoading ? 'Generating...' : 'Generate'}
        </button>
      </form>

      {error && <p className="text-center text-red-400">{error}</p>}
      
      <div className="flex justify-center items-center min-h-[300px] bg-[#0a0a1a]/50 rounded-lg p-4">
        {isLoading && <Spinner />}
        {!isLoading && images.length === 0 && (
          <p className="text-gray-400">Your generated image will appear here.</p>
        )}
        {images.map((src, index) => (
          <img key={index} src={src} alt={prompt} className="max-w-full max-h-[512px] rounded-lg shadow-lg" />
        ))}
      </div>
    </div>
  );
};

export default ImageGenerator;
