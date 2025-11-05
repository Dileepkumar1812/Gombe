import React, { useRef, useEffect } from 'react';
import type { Message } from '../types';
import { ChatMessage } from './ChatMessage';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  onSpeak: (messageId: string, text: string, lang: 'en' | 'kn') => void;
  speakingMessage: { id: string; lang: 'en' | 'kn' } | null;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading, onSpeak, speakingMessage }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6">
      {messages.map((msg) => (
        <ChatMessage key={msg.id} message={msg} onSpeak={onSpeak} speakingMessage={speakingMessage} />
      ))}
      {isLoading && (
        <div className="flex justify-start my-4">
           <div className="flex items-center gap-3">
              <div className="p-2 rounded-full">
                <div className="w-4 h-4 rounded-full bg-amber-500 animate-pulse"></div>
              </div>
              <div className="px-5 py-4 rounded-2xl shadow-md bg-white border border-gray-200">
                <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-300 animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-300 animate-pulse delay-75"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-300 animate-pulse delay-150"></div>
                </div>
              </div>
          </div>
        </div>
      )}
    </div>
  );
};