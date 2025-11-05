import React from 'react';
import type { Message } from '../types';
import { BotIcon, UserIcon, SpeakerWaveIcon } from './IconComponents';

interface ChatMessageProps {
  message: Message;
  onSpeak: (messageId: string, text: string, lang: 'en' | 'kn') => void;
  speakingMessage: { id: string; lang: 'en' | 'kn' } | null;
}

const languageLabelStyle = "text-xs font-bold text-amber-600 uppercase tracking-wider mb-1 block";

const renderContent = (content: string) => {
  const parts = content.split(/(\n|IMAGE\[.*?\]|VIDEO\[.*?\])/g).filter(Boolean);

  return parts.map((part, index) => {
    const imageMatch = part.match(/IMAGE\[(.*?)\]/);
    if (imageMatch) {
      return (
        <div key={index} className="my-2">
          <img
            src={imageMatch[1]}
            alt="Puppet theatre"
            className="rounded-lg shadow-md max-w-full h-auto border-4 border-white"
          />
        </div>
      );
    }

    const videoMatch = part.match(/VIDEO\[(.*?)\]/);
    if (videoMatch) {
      const videoUrl = videoMatch[1];
      const videoId = new URL(videoUrl).searchParams.get('v');
      if (videoId) {
        return (
          <div key={index} className="my-2 aspect-video">
            <iframe
              className="w-full h-full rounded-lg shadow-md border-4 border-white"
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        );
      }
    }

    if (part === '\n') {
      return <br key={index} />;
    }

    // Process bilingual text
    const lines = part.split('\n');
    return lines.map((line, lineIndex) => {
        if (line.startsWith('English:')) {
            return <div key={`${index}-${lineIndex}`}><span className={languageLabelStyle}>English</span><p className="mb-2">{line.replace('English:', '').trim()}</p></div>;
        }
        if (line.startsWith('Kannada:')) {
            return <div key={`${index}-${lineIndex}`}><span className={languageLabelStyle}>Kannada</span><p className="font-kannada text-lg mb-2">{line.replace('Kannada:', '').trim()}</p></div>;
        }
        if (line.startsWith('Hindi:')) {
            return <div key={`${index}-${lineIndex}`}><span className={languageLabelStyle}>Hindi</span><p className="mb-2">{line.replace('Hindi:', '').trim()}</p></div>;
        }
        if (line.startsWith('Tamil:')) {
            return <div key={`${index}-${lineIndex}`}><span className={languageLabelStyle}>Tamil</span><p className="mb-2">{line.replace('Tamil:', '').trim()}</p></div>;
        }
        if (line.startsWith('Telugu:')) {
            return <div key={`${index}-${lineIndex}`}><span className={languageLabelStyle}>Telugu</span><p className="mb-2">{line.replace('Telugu:', '').trim()}</p></div>;
        }
        return <p key={`${index}-${lineIndex}`}>{line}</p>;
    });
  });
};

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onSpeak, speakingMessage }) => {
  const isUser = message.sender === 'user';

  const wrapperClass = isUser ? 'flex justify-end' : 'flex justify-start';
  const bubbleClass = isUser
    ? 'bg-amber-600 text-white'
    : 'bg-white text-gray-800 border border-gray-200';
  const iconClass = isUser ? 'text-amber-600' : 'text-orange-900';
  
  // A more robust regex to stop at the next language label or end of string.
  const englishMatch = message.content.match(/English:([\s\S]*?)(?:\n[A-Z][a-z]+:|Kannada:|Hindi:|Tamil:|Telugu:|$)/);
  const englishText = englishMatch ? englishMatch[1].trim() : null;

  const kannadaMatch = message.content.match(/Kannada:([\s\S]*?)(?:\n[A-Z][a-z]+:|English:|Hindi:|Tamil:|Telugu:|$)/);
  const kannadaText = kannadaMatch ? kannadaMatch[1].trim() : null;
  
  const showFallbackSpeaker = !isUser && !englishText && !kannadaText && message.content.trim();

  return (
    <div className={`my-4 ${wrapperClass}`}>
      <div className="flex items-start gap-3 max-w-xl">
        {!isUser && (
          <div className="flex flex-col items-center gap-2 self-start pt-2">
            <div className="bg-amber-200 p-2 rounded-full shadow-sm">
              <BotIcon className={`w-6 h-6 ${iconClass}`} />
            </div>
            <div className="flex flex-col items-center gap-1.5 mt-2">
                {englishText && (
                    <button
                        onClick={() => onSpeak(message.id, englishText, 'en')}
                        className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold transition-colors ${
                            speakingMessage?.id === message.id && speakingMessage?.lang === 'en'
                                ? 'bg-amber-500 text-white animate-pulse'
                                : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                        }`}
                        aria-label="Read English text aloud"
                    >
                        EN
                    </button>
                )}
                {kannadaText && (
                    <button
                        onClick={() => onSpeak(message.id, kannadaText, 'kn')}
                        className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-kannada transition-colors ${
                            speakingMessage?.id === message.id && speakingMessage?.lang === 'kn'
                                ? 'bg-amber-500 text-white animate-pulse'
                                : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                        }`}
                        aria-label="Read Kannada text aloud"
                    >
                        ಕ
                    </button>
                )}
                {showFallbackSpeaker && (
                     <button 
                        onClick={() => onSpeak(message.id, message.content, 'en')} 
                        className={`p-1.5 rounded-full transition-colors ${
                            speakingMessage?.id === message.id 
                                ? 'bg-amber-500 text-white' 
                                : 'hover:bg-gray-200 text-gray-500'
                        }`} 
                        aria-label="Read message aloud"
                    >
                        <SpeakerWaveIcon className={`w-5 h-5 ${speakingMessage?.id === message.id ? 'animate-pulse' : ''}`} />
                     </button>
                )}
            </div>
          </div>
        )}
        <div
          className={`px-5 py-4 rounded-2xl shadow-md ${bubbleClass} ${
            isUser ? 'rounded-br-none' : 'rounded-bl-none'
          }`}
        >
          <div className="prose prose-sm max-w-none leading-relaxed whitespace-pre-wrap">{renderContent(message.content)}</div>
        </div>
         {isUser && (
          <div className="bg-amber-200 p-2 rounded-full shadow-sm">
            <UserIcon className={`w-6 h-6 ${iconClass}`} />
          </div>
        )}
      </div>
    </div>
  );
};