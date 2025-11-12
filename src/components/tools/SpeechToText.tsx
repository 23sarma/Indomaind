import React, { useState, useEffect, useRef } from 'react';

// Browser SpeechRecognition might be prefixed
// FIX: Cast window to `any` to access non-standard `SpeechRecognition` property.
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

const SpeechToText: React.FC = () => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!SpeechRecognition) {
      setError("Speech Recognition is not supported by your browser. Please try Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      setTranscript(prev => prev + finalTranscript);
    };

    recognition.onerror = (event: any) => {
      setError(`Speech recognition error: ${event.error}`);
      setIsListening(false);
    };
    
    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, []);
  
   useEffect(() => {
    if (!recognitionRef.current) {
        return;
    }
    
    // This effect handles the start/stop logic and ensures `onend` has the latest `isListening` state.
    if (isListening) {
      recognitionRef.current.start();
    } else {
      recognitionRef.current.stop();
    }

    recognitionRef.current.onend = () => {
        if (isListening) {
             recognitionRef.current.start(); // Keep listening if it was not manually stopped
        }
    };
  }, [isListening]);


  const handleToggleListen = () => {
    if (!isListening) {
      setTranscript(''); // Clear previous transcript only when starting a new session
    }
    setIsListening(prevState => !prevState);
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center gap-6 mb-6">
        <button 
          onClick={handleToggleListen} 
          className={`px-8 py-4 rounded-full font-semibold text-white transition-all duration-300 transform hover:scale-105 ${isListening ? 'bg-red-600 hover:bg-red-700' : 'bg-cyan-600 hover:bg-cyan-700'}`}
          disabled={!!error}
        >
          {isListening ? 'Stop Listening' : 'Start Transcribing'}
        </button>
        {isListening && <p className="text-cyan-400 animate-pulse">Listening...</p>}
      </div>

      {error && <p className="text-center text-red-400 mb-4">{error}</p>}

      <div className="w-full min-h-[40vh] p-4 bg-[#0a0a1a]/50 border border-gray-700 rounded-lg overflow-y-auto">
        <p className="whitespace-pre-wrap">{transcript || 'Your transcribed text will appear here...'}</p>
      </div>
       <button
        onClick={() => navigator.clipboard.writeText(transcript)}
        className="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-sm rounded-lg"
        disabled={!transcript}
      >
        Copy Transcript
      </button>
    </div>
  );
};

export default SpeechToText;