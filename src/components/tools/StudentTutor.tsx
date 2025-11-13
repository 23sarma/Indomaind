import React, { useState } from 'react';
import { generateText } from '@/services/geminiService';
import Spinner from '@/components/ui/Spinner';

const StudentTutor: React.FC = () => {
  const [subject, setSubject] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !question.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setAnswer('');

    try {
      const systemInstruction = `You are a helpful and patient AI tutor. The user is asking a question about '${subject}'.
      Explain the concept clearly and concisely, as if you were teaching it to a student.
      If it's a problem, break down the steps to solve it.`;
      const result = await generateText(question, systemInstruction);
      setAnswer(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <label className="block mb-2 font-semibold text-gray-300">Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g., Physics, World History, JavaScript"
            className="w-full px-4 py-2 bg-[#0a0a1a] border border-gray-600 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 text-white"
            disabled={isLoading}
          />
        </div>
        <div>
          <label className="block mb-2 font-semibold text-gray-300">Question</label>
           <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask your question here..."
            className="w-full h-24 p-4 bg-[#0a0a1a] border border-gray-600 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 text-white resize-none"
            disabled={isLoading}
          />
        </div>
        <button type="submit" disabled={isLoading || !subject.trim() || !question.trim()} className="w-full px-6 py-3 bg-cyan-600 rounded-lg font-semibold hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors">
          {isLoading ? 'Thinking...' : 'Ask Tutor'}
        </button>
      </form>

      {error && <p className="text-center text-red-400 mb-4">{error}</p>}

      <div className="w-full min-h-[30vh] p-4 bg-[#0a0a1a]/50 border border-gray-700 rounded-lg overflow-y-auto">
        {isLoading && <div className="flex justify-center items-center h-full"><Spinner /></div>}
        {!isLoading && !answer && <p className="text-gray-400 text-center">The tutor's explanation will appear here.</p>}
        {answer && <p className="whitespace-pre-wrap">{answer}</p>}
      </div>
    </div>
  );
};

export default StudentTutor;