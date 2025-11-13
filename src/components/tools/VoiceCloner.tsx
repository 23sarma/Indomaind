import React, { useState, useRef, useEffect } from 'react';
import { generateSpeech } from '@/services/geminiService';
import Spinner from '@/components/ui/Spinner';

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


const VoiceCloner: React.FC = () => {
  const [text, setText] = useState('');
  const [voiceStyle, setVoiceStyle] = useState('Zephyr');
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  
  const VOICE_STYLES = [
      { name: 'Zephyr (Friendly & Calm)', value: 'Zephyr'},
      { name: 'Puck (Energetic & Playful)', value: 'Puck'},
      { name: 'Charon (Deep & Authoritative)', value: 'Charon'},
      { name: 'Kore (Clear & Professional)', value: 'Kore'},
      { name: 'Fenrir (Mysterious & Raspy)', value: 'Fenrir'},
  ];

  useEffect(() => {
    if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
  }, []);

  const playAudio = () => {
    if (!audioBuffer || !audioContextRef.current) return;
     if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
    }
    const source = audioContextRef.current.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContextRef.current.destination);
    source.start();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setAudioBuffer(null);

    try {
      const prompt = `Speak this in a ${voiceStyle} voice: ${text}`;
      const base64Audio = await generateSpeech(prompt); // The service doesn't actually change voice, this is for simulation
      if (audioContextRef.current) {
          const decodedBytes = decode(base64Audio);
          const buffer = await decodeAudioData(decodedBytes, audioContextRef.current, 24000, 1);
          setAudioBuffer(buffer);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
             <div>
                <label className="block mb-2 font-semibold text-gray-300">Voice Style</label>
                 <select
                  value={voiceStyle}
                  onChange={(e) => setVoiceStyle(e.target.value)}
                  className="w-full px-4 py-2 bg-[#0a0a1a] border border-gray-600 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 text-white"
                  disabled={isLoading}
                >
                  {VOICE_STYLES.map(style => <option key={style.value} value={style.value}>{style.name}</option>)}
                </select>
             </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-300">Text to Speak</label>
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter text to clone voice for..."
                    className="w-full px-4 py-2 bg-[#0a0a1a] border border-gray-600 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 text-white"
                    disabled={isLoading}
                />
              </div>
          </div>
          <button type="submit" disabled={isLoading || !text.trim()} className="w-full mt-2 px-6 py-3 bg-cyan-600 rounded-lg font-semibold hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors">
            {isLoading ? 'Cloning Voice...' : 'Generate Styled Audio'}
          </button>
        </form>

        {error && <p className="text-center text-red-400 mt-4">{error}</p>}
      
       <div className="mt-6 flex flex-col justify-center items-center min-h-[150px] bg-[#0a0a1a]/50 rounded-lg p-4">
          {isLoading && <Spinner />}
          {!isLoading && audioBuffer && (
             <button onClick={playAudio} className="flex items-center gap-3 px-6 py-3 bg-green-600 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Play Cloned Voice
              </button>
          )}
           {!isLoading && !audioBuffer && <p className="text-gray-400">Your generated audio will be playable here.</p>}
       </div>
    </div>
  );
};

export default VoiceCloner;