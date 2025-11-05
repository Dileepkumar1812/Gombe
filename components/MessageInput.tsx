import React, { useState, useRef, useEffect } from 'react';
import { SendIcon, MicrophoneIcon, StopCircleIcon } from './IconComponents';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  placeholder: string;
}

// Check for SpeechRecognition API
// FIX: Cast window to any to access browser-specific SpeechRecognition APIs without TypeScript errors.
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
const isSpeechRecognitionSupported = !!SpeechRecognition;

export const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, isLoading, placeholder }) => {
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!isSpeechRecognitionSupported) {
      console.log("Speech recognition not supported by this browser.");
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setInputValue(finalTranscript + interimTranscript);
    };
    
    recognition.onend = () => {
        setIsRecording(false);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const handleToggleRecording = () => {
    if (!isSpeechRecognitionSupported) return;

    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
    setIsRecording(!isRecording);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    }
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="p-4 md:p-6 bg-white/80 backdrop-blur-sm border-t border-gray-200">
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          disabled={isLoading}
          className="flex-1 w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 transition-shadow disabled:opacity-50"
        />
        {isSpeechRecognitionSupported && (
            <button
                type="button"
                onClick={handleToggleRecording}
                disabled={isLoading}
                className={`p-3 rounded-full transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
                {isRecording ? <StopCircleIcon className="w-6 h-6" /> : <MicrophoneIcon className="w-6 h-6" />}
            </button>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="p-3 bg-amber-600 text-white rounded-full hover:bg-amber-700 disabled:bg-amber-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all transform hover:scale-110"
        >
          <SendIcon className="w-6 h-6" />
        </button>
      </form>
    </div>
  );
};