import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage, generateImage } from '../../services/geminiService';
import { ChatMessage, HistoryEntry, User } from '../../types';
import Spinner from '../ui/Spinner';
import { PaperclipIcon, ImageIcon, TrashIcon } from '../icons/toolIcons';

const MicrophoneIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
  </svg>
);

interface IndomindChatProps {
  addToHistory: (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => void;
  user: User;
}

const IndomindChat: React.FC<IndomindChatProps> = ({ addToHistory, user }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isImageMode, setIsImageMode] = useState(false);
  const [attachment, setAttachment] = useState<{ name: string; data: string; mimeType: string } | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const storageKey = `indomind-chat-history-${user.email}`;

  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(storageKey);
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        if (Array.isArray(parsedHistory)) {
          setMessages(parsedHistory);
        }
      }
    } catch (error) {
      console.error("Failed to load chat history:", error);
    }
  }, [storageKey]);

  useEffect(() => {
    try {
        if (messages.length > 0) {
            localStorage.setItem(storageKey, JSON.stringify(messages));
        } else {
            localStorage.removeItem(storageKey);
        }
    } catch (error) {
        console.error("Failed to save chat history:", error);
    }
  }, [messages, storageKey]);

  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  useEffect(() => {
    if (!SpeechRecognition) {
      console.warn("Speech Recognition is not supported by this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
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
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
    };
    
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    return () => recognition.stop();
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        setAttachment({
          name: file.name,
          data: base64Data,
          mimeType: file.type,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearHistory = () => {
    setMessages([]);
    localStorage.removeItem(storageKey);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!prompt.trim() && !attachment) || isLoading) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    const userMessageText = attachment ? `${prompt} (Attachment: ${attachment.name})` : prompt;
    const userMessage: ChatMessage = { role: 'user', text: userMessageText };
    
    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);
    addToHistory({ role: 'user', text: userMessageText });
    
    setIsLoading(true);
    const currentPrompt = prompt;
    setPrompt('');
    setAttachment(null);
    if(fileInputRef.current) fileInputRef.current.value = "";


    try {
      if (isImageMode) {
        const images = await generateImage(currentPrompt);
        const modelMessage: ChatMessage = { 
          role: 'model', 
          text: `Here's the image I generated for your prompt.`,
          imageUrl: images[0] 
        };
        setMessages(prev => [...prev, modelMessage]);
        addToHistory({ role: 'model', text: `Generated image for prompt: ${currentPrompt}` });
      } else {
        const response = await sendChatMessage(currentPrompt, currentMessages, attachment);
        const modelMessage: ChatMessage = { role: 'model', text: response.text };
        setMessages(prev => [...prev, modelMessage]);
        addToHistory({ role: 'model', text: response.text });
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorText = 'Sorry, I ran into a problem. Please try again.';
      const errorMessage: ChatMessage = { role: 'model', text: errorText };
      setMessages(prev => [...prev, errorMessage]);
      addToHistory({ role: 'system', text: `Chat Error: ${error}` });
    } finally {
      setIsLoading(false);
      setIsImageMode(false);
    }
  };

  return (
    <div className="flex flex-col h-[65vh]">
      <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-[#0a0a1a]/50 rounded-t-lg">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-lg px-4 py-2 rounded-xl ${msg.role === 'user' ? 'bg-cyan-600' : 'bg-gray-700'}`}>
              <p className="whitespace-pre-wrap">{msg.text}</p>
              {msg.imageUrl && (
                <div className="mt-2 p-1 bg-black/20 rounded-lg">
                  <img src={msg.imageUrl} alt="Generated content" className="rounded-lg max-w-full sm:max-w-sm" />
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="px-4 py-2 rounded-xl bg-gray-700"><Spinner /></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-700">
        {attachment && (
            <div className="mb-2 flex items-center justify-between bg-gray-700/50 px-3 py-1 rounded-lg text-sm">
                <span className="text-gray-300 truncate">Attached: {attachment.name}</span>
                <button onClick={() => setAttachment(null)} className="text-red-400 hover:text-red-300 font-bold">&times;</button>
            </div>
        )}
        <form onSubmit={handleSubmit} className="flex gap-2 sm:gap-4">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,application/pdf,.txt,.md,.csv"/>
            <button
                type="button"
                onClick={handleClearHistory}
                disabled={isLoading || messages.length === 0}
                className="p-2 rounded-lg text-gray-400 hover:text-red-400 transition-colors disabled:text-gray-600 disabled:cursor-not-allowed flex-shrink-0"
                aria-label="Clear chat history"
            >
                <TrashIcon className="w-6 h-6" />
            </button>
            <button
                type="button"
                onClick={() => setIsImageMode(prev => !prev)}
                disabled={isLoading || !!attachment}
                className={`p-2 rounded-lg text-gray-400 hover:bg-white/10 transition-colors disabled:text-gray-600 disabled:cursor-not-allowed flex-shrink-0 ${isImageMode ? 'bg-cyan-600/50 text-cyan-300' : ''}`}
                aria-label="Toggle image generation mode"
            >
                <ImageIcon className="w-6 h-6" />
            </button>
            <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading || isImageMode}
                className="p-2 rounded-lg text-gray-400 hover:bg-white/10 transition-colors disabled:text-gray-600 disabled:cursor-not-allowed flex-shrink-0"
                aria-label="Attach file"
            >
                <PaperclipIcon className="w-6 h-6" />
            </button>
            <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={isImageMode ? "Describe an image to generate..." : (isListening ? "Listening..." : "Ask Indomind anything...")}
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
            <button type="submit" disabled={isLoading || (!prompt.trim() && !attachment)} className="px-6 py-2 bg-cyan-600 rounded-lg font-semibold hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors flex-shrink-0">
              {isImageMode ? 'Generate' : 'Send'}
            </button>
        </form>
      </div>
    </div>
  );
};

export default IndomindChat;