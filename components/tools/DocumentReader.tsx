import React, { useState } from 'react';
import { generateText } from '../../services/geminiService';
import Spinner from '../ui/Spinner';

const DocumentReader: React.FC = () => {
  const [documentText, setDocumentText] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!documentText.trim() || !question.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setAnswer('');

    try {
      const systemInstruction = `You are an AI assistant that answers questions based ONLY on the provided text. If the answer is not in the text, say "The answer is not found in the provided text."`;
      const prompt = `Based on the following document:\n\n---\n${documentText}\n---\n\nPlease answer this question: ${question}`;
      const result = await generateText(prompt, systemInstruction);
      setAnswer(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-2 gap-6 mb-4">
          <div>
            <label className="block mb-2 font-semibold text-gray-300">Document Text</label>
            <textarea
              value={documentText}
              onChange={(e) => setDocumentText(e.target.value)}
              placeholder="Paste the text from your document here..."
              className="w-full h-48 p-4 bg-[#0a0a1a] border border-gray-600 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 text-white resize-none"
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold text-gray-300">Your Question</label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question about the document..."
              className="w-full h-48 p-4 bg-[#0a0a1a] border border-gray-600 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 text-white resize-none"
              disabled={isLoading}
            />
          </div>
        </div>
        <button type="submit" disabled={isLoading || !documentText.trim() || !question.trim()} className="w-full mt-2 px-6 py-3 bg-cyan-600 rounded-lg font-semibold hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors">
          {isLoading ? 'Analyzing...' : 'Get Answer'}
        </button>
      </form>
      
      {(isLoading || error || answer) && (
        <div className="mt-6">
          <label className="block mb-2 font-semibold text-gray-300">AI's Answer</label>
          <div className="w-full min-h-[100px] p-4 bg-[#0a0a1a]/50 border border-gray-700 rounded-lg">
            {isLoading && <div className="flex justify-center items-center h-full"><Spinner /></div>}
            {error && <p className="text-red-400">{error}</p>}
            <p className="whitespace-pre-wrap">{answer}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentReader;
