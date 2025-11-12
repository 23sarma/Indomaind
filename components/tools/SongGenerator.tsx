
import React, { useState, useRef, useEffect } from 'react';
import { generateText, generateSpeech } from '../../services/geminiService';
import Spinner from '../ui/Spinner';

// Audio decoding functions from guidelines
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}


const SongGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!audioContextRef.current) {
        // FIX: Cast window to `any` to access the non-standard `webkitAudioContext` property without TypeScript errors, preserving browser compatibility.
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    return () => {
        audioContextRef.current?.close();
    }
  }, []);

  const playAudio = () => {
    if (!audioBuffer || !audioContextRef.current || audioContextRef.current.state === 'closed') return;
    const source = audioContextRef.current.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContextRef.current.destination);
    source.start();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setLyrics('');
    setAudioBuffer(null);
    if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume();
    }

    try {
      setLoadingStep('Generating lyrics...');
      const lyricsPrompt = `Write the lyrics for a short song about "${prompt}". Include verse and chorus sections.`;
      const generatedLyrics = await generateText(lyricsPrompt, 'You are a creative songwriter.');
      setLyrics(generatedLyrics);

      setLoadingStep('Synthesizing vocals...');
      const speechPrompt = `Sing this song in a clear, melodic voice: ${generatedLyrics}`;
      const base64Audio = await generateSpeech(speechPrompt);

      setLoadingStep('Decoding audio...');
      if (audioContextRef.current) {
          const decodedBytes = decode(base64Audio);
          const buffer = await decodeAudioData(decodedBytes, audioContextRef.current, 24000, 1);
          setAudioBuffer(buffer);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A song about space exploration"
          className="flex-grow px-4 py-2 bg-[#0a0a1a] border border-gray-600 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 text-white"
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !prompt.trim()} className="px-6 py-2 bg-cyan-600 rounded-lg font-semibold hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors">
          {isLoading ? 'Generating...' : 'Generate Song'}
        </button>
      </form>

      {error && <p className="text-center text-red-400 mb-4">{error}</p>}

      {isLoading && (
        <div className="text-center">
            <Spinner />
            <p className="mt-4 text-gray-300">{loadingStep}</p>
        </div>
      )}

      {!isLoading && !lyrics && !error && (
         <p className="text-center text-gray-400">Your generated song will appear here.</p>
      )}

      {!isLoading && lyrics && (
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Generated Lyrics</h3>
            <div className="w-full h-80 p-4 bg-[#0a0a1a]/50 border border-gray-700 rounded-lg overflow-y-auto">
              <p className="whitespace-pre-wrap">{lyrics}</p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Generated Vocals</h3>
            <div className="w-full h-80 p-4 bg-[#0a0a1a]/50 border border-gray-700 rounded-lg flex flex-col justify-center items-center">
              {audioBuffer ? (
                <button onClick={playAudio} className="flex items-center gap-3 px-6 py-3 bg-green-600 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Play Song
                </button>
              ) : (
                <p className="text-gray-400">Audio ready to play.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SongGenerator;
