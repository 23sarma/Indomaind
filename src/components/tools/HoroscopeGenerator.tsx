import React, { useState } from 'react';
import { generateText } from '@/services/geminiService';
import Spinner from '@/components/ui/Spinner';

const HoroscopeGenerator: React.FC = () => {
  const [sign, setSign] = useState('');
  const [horoscope, setHoroscope] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ZODIAC_SIGNS = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sign.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setHoroscope('');

    try {
      const systemInstruction = `You are a fun and positive astrologer. Write an encouraging and creative daily horoscope for the given zodiac sign.
      Include brief sections for Love, Career, and Wellness. Keep the tone light and uplifting.`;
      const result = await generateText(sign, systemInstruction);
      setHoroscope(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 mb-6">
        <select
          value={sign}
          onChange={(e) => setSign(e.target.value)}
          className="flex-grow px-4 py-2 bg-[#0a0a1a] border border-gray-600 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 text-white"
          disabled={isLoading}
        >
          <option value="">Select Your Zodiac Sign</option>
          {ZODIAC_SIGNS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <button type="submit" disabled={isLoading || !sign.trim()} className="px-6 py-2 bg-cyan-600 rounded-lg font-semibold hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors">
          {isLoading ? 'Consulting Stars...' : 'Get Horoscope'}
        </button>
      </form>

      {error && <p className="text-center text-red-400 mb-4">{error}</p>}
      
      <div className="w-full min-h-[40vh] p-4 bg-[#0a0a1a]/50 border border-gray-700 rounded-lg overflow-y-auto">
        {isLoading && <div className="flex justify-center items-center h-full"><Spinner /></div>}
        {!isLoading && !horoscope && <p className="text-gray-400 text-center">Your daily horoscope will appear here.</p>}
        {horoscope && <p className="whitespace-pre-wrap">{horoscope}</p>}
      </div>
    </div>
  );
};

export default HoroscopeGenerator;