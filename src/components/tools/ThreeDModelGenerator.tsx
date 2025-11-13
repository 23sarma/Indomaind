import React, { useState } from 'react';
import { generateImage, generateText } from '@/services/geminiService';
import Spinner from '@/components/ui/Spinner';

const ThreeDModelGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [specs, setSpecs] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setImage(null);
    setSpecs(null);

    try {
      // Generate the concept image
      const imagePrompt = `A photorealistic, cinematic render of a 3D model of: ${prompt}. Clean background.`;
      const images = await generateImage(imagePrompt);
      if (images.length > 0) {
        setImage(images[0]);
      }

      // Generate the technical specs
      const specsPrompt = `Create a technical specification sheet for a 3D model of "${prompt}". Include suggested polycount, texture resolution, materials (like PBR Metallic/Roughness), and potential rigging notes. Format it as a simple list.`;
      const textResult = await generateText(specsPrompt, "You are a 3D modeling technical artist.");
      setSpecs(textResult);

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
          placeholder="e.g., A detailed fantasy sword with glowing runes"
          className="flex-grow px-4 py-2 bg-[#0a0a1a] border border-gray-600 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 text-white"
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !prompt.trim()} className="px-6 py-2 bg-cyan-600 rounded-lg font-semibold hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors">
          {isLoading ? 'Generating...' : 'Generate 3D Concept'}
        </button>
      </form>

      {error && <p className="text-center text-red-400 mb-4">{error}</p>}
      
      {isLoading && <div className="flex justify-center items-center h-full"><Spinner /></div>}
      
      {!isLoading && (image || specs) && (
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Concept Render</h3>
            <div className="flex justify-center items-center min-h-[300px] bg-[#0a0a1a]/50 rounded-lg p-4">
              {image ? <img src={image} alt={prompt} className="max-w-full max-h-[512px] rounded-lg shadow-lg" /> : <p className="text-gray-400">Image failed to generate.</p>}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Technical Specifications</h3>
            <div className="w-full min-h-[300px] p-4 bg-[#0a0a1a]/50 border border-gray-700 rounded-lg overflow-y-auto">
              {specs ? <p className="whitespace-pre-wrap font-mono text-sm">{specs}</p> : <p className="text-gray-400">Specs failed to generate.</p>}
            </div>
          </div>
        </div>
      )}

      {!isLoading && !image && !specs && !error && (
        <p className="text-gray-400 text-center">Your 3D model concept will appear here.</p>
      )}

    </div>
  );
};

export default ThreeDModelGenerator;