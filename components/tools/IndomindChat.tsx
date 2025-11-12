
import React, { useState, useRef, useEffect } from 'react';
import { Chat } from "@google/genai";
import { createChatSession } from '../../services/geminiService';
import { ChatMessage, HistoryEntry } from '../../types';
import Spinner from '../ui/Spinner';

const MicrophoneIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
  </svg>
);

// FIX: Define the props type for the IndomindChat component.
interface IndomindChatProps {
  addToHistory: (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => void;
}

const IndomindChat: React.FC<IndomindChatProps> = ({ addToHistory }) => {
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  useEffect(() => {
    setChatSession(createChatSession('You are Indomind, a powerful and helpful AI assistant.'));
  }, []);

  useEffect(() => {
    if (!SpeechRecognition) {
      console.warn("Speech Recognition is not supported by this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false; // Only process final results
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let newTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          newTranscript += event.results[i][0].transcript.trim() + ' ';
        }
      }
      setPrompt(prev => prev + newTranscript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [SpeechRecognition]);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleToggleListen = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
    setIsListening(!isListening);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || !chatSession || isLoading) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    const userMessage: ChatMessage = { role: 'user', text: prompt };
    setMessages(prev => [...prev, userMessage]);
    addToHistory({ role: 'user', text: prompt });
    setIsLoading(true);
    setPrompt('');

    try {
      const response = await chatSession.sendMessage({ message: prompt });
      const modelMessage: ChatMessage = { role: 'model', text: response.text };
      setMessages(prev => [...prev, modelMessage]);
      addToHistory({ role: 'model', text: response.text });
    } catch (error) {
      console.error("Chat error:", error);
      const errorText = 'Sorry, I ran into a problem. Please try again.';
      const errorMessage: ChatMessage = { role: 'model', text: errorText };
      setMessages(prev => [...prev, errorMessage]);
      addToHistory({ role: 'system', text: `Chat Error: ${error}` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[65vh]">
      <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-[#0a0a1a]/50 rounded-t-lg">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-lg px-4 py-2 rounded-xl ${msg.role === 'user' ? 'bg-cyan-600' : 'bg-gray-700'}`}>
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="px-4 py-2 rounded-xl bg-gray-700">
                <Spinner />
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700 flex gap-2 sm:gap-4">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={isListening ? "Listening..." : "Ask Indomind anything..."}
          className="flex-grow px-4 py-2 bg-[#0a0a1a] border border-gray-600 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 text-white"
          disabled={isLoading}
        />
        <button
            type="button"
            onClick={handleToggleListen}
            disabled={isLoading || !SpeechRecognition}
            className={`p-2 rounded-lg text-gray-400 hover:bg-white/10 transition-colors disabled:text-gray-600 disabled:cursor-not-allowed flex-shrink-0 ${isListening ? 'bg-red-600/50 text-red-300' : ''}`}
            aria-label={isListening ? 'Stop listening' : 'Start listening'}
        >
            <MicrophoneIcon className="w-6 h-6" />
        </button>
        <button type="submit" disabled={isLoading || !prompt.trim()} className="px-6 py-2 bg-cyan-600 rounded-lg font-semibold hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors flex-shrink-0">
          Send
        </button>
      </form>
    </div>
  );
};

export default IndomindChat;
