import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleGenAI, Chat, Modality } from '@google/genai';
import type { Message } from './types';
import { ChatWindow } from './components/ChatWindow';
import { MessageInput } from './components/MessageInput';
import { BotIcon, ResetIcon } from './components/IconComponents';

const API_KEY = process.env.API_KEY;

// Audio decoding utilities
function decode(base64: string) {
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


const translations = {
  en: {
    title: 'Gombe',
    subtitle: 'Karnataka Puppet Theatre Guide',
    resetChat: 'Start New Chat',
    inputPlaceholder: 'Ask about Gombeata...',
    initialMessage: 'Hello! I am Gombe, your guide to the puppet theatre traditions of Karnataka. How can I help you today?',
    switchTo: 'ಕನ್ನಡ'
  },
  kn: {
    title: 'ಗೊಂಬೆ',
    subtitle: 'ಕರ್ನಾಟಕದ ಗೊಂಬೆಯಾಟ ಮಾರ್ಗದರ್ಶಿ',
    resetChat: 'ಹೊಸ ಚಾಟ್ ಪ್ರಾರಂಭಿಸಿ',
    inputPlaceholder: 'ಗೊಂಬೆಯಾಟದ ಬಗ್ಗೆ ಕೇಳಿ...',
    initialMessage: 'ನಮಸ್ಕಾರ! ನಾನು ಗೊಂಬೆ, ಕರ್ನಾಟಕದ ಗೊಂಬೆಯಾಟ ಸಂಪ್ರದಾಯಗಳಿಗೆ ನಿಮ್ಮ ಮಾರ್ಗದರ್ಶಿ. ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?',
    switchTo: 'English'
  },
};

const SYSTEM_INSTRUCTION = `You are 'Gombe,' a friendly and knowledgeable cultural guide chatbot. Your sole purpose is to educate users about the rich Puppet Theatre traditions (Gombeata) of Karnataka, India.

**Your Core Directives:**
1.  **Bilingual by Default:** ALWAYS provide your answers in **both English and Kannada**. Structure your response clearly with labels, like this:
    English: [Your English text here]
    Kannada: [ನಿಮ್ಮ ಕನ್ನಡ ಪಠ್ಯ ಇಲ್ಲಿ]
2.  **Multilingual on Request:** If the user explicitly asks for "Hindi," "Tamil," or "Telugu," provide the translation in that language in addition to English and Kannada.
3.  **Multimedia Integration:** When relevant, embed images or YouTube videos to enhance your explanations. Use the following specific formats ONLY:
    - For images: IMAGE[image_url]
    - For YouTube videos: VIDEO[youtube_watch_url]
    Example: IMAGE[https://upload.wikimedia.org/wikipedia/commons/9/9b/Togalu_Gombeyaata_puppets.jpg]
    Example Video: VIDEO[https://www.youtube.com/watch?v=R4sZpDqgqgI]
4.  **Content Focus:** Your knowledge base is strictly limited to Karnataka's puppetry. This includes:
    - History, origins, and evolution.
    - Main types: Togalu Gombeyaata (Leather Shadow Puppets), Sutrada Gombe (String Puppets), Rod & Glove Puppets.
    - Puppet making process, materials used.
    - Famous artists, troupes, and performance contexts (festivals, rituals).
5.  **Persona:** Be engaging, clear, and encouraging. Keep your answers concise and well-structured with headers.
6.  **Decline Off-Topic Questions:** If a user asks about anything unrelated to Karnataka's puppetry, politely decline and steer the conversation back to your area of expertise. For example: "I am a guide for Karnataka's puppet theatre. I can tell you all about Togalu Gombeyaata if you'd like!"`;

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<'en' | 'kn'>('en');
  const [speakingMessage, setSpeakingMessage] = useState<{ id: string; lang: 'en' | 'kn' } | null>(null);
  
  const chatRef = useRef<Chat | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  
  const currentTranslations = translations[language];

  // This effect runs only once on mount to initialize the chat and audio context.
  useEffect(() => {
    // FIX: Cast window to any to access browser-specific webkitAudioContext without TypeScript errors.
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

    if (!API_KEY) {
      console.error("API_KEY is not set. Please set it in your environment variables.");
      setMessages([
        { id: 'init-error', sender: 'bot', content: 'Error: API key is missing. Please configure your API key to use this application.' }
      ]);
      return;
    }
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    chatRef.current = ai.chats.create({
      // FIX: Updated model name to 'gemini-flash-lite-latest' as per guidelines.
      model: 'gemini-flash-lite-latest',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    const initialMessage: Message = {
        id: 'init',
        sender: 'bot',
        content: translations.en.initialMessage, // Default to English for the very first message
    };
    setMessages([initialMessage]);
  }, []);

  // When the language changes, update the initial message if it's the only one.
  useEffect(() => {
    setMessages(currentMessages => {
      if (
        currentMessages.length === 1 &&
        (currentMessages[0].content === translations.en.initialMessage ||
          currentMessages[0].content === translations.kn.initialMessage)
      ) {
        const updatedInitialMessage: Message = {
          ...currentMessages[0],
          content: translations[language].initialMessage,
        };
        // Avoid a state update if the message is already in the correct language
        if (currentMessages[0].content === updatedInitialMessage.content) {
            return currentMessages;
        }
        return [updatedInitialMessage];
      }
      return currentMessages;
    });
  }, [language]);
  
  const handleClearChat = () => {
    if (isLoading) return;

    if (audioSourceRef.current) {
      audioSourceRef.current.stop();
      setSpeakingMessage(null);
    }

    if (API_KEY) {
      const ai = new GoogleGenAI({ apiKey: API_KEY });
      chatRef.current = ai.chats.create({
        model: 'gemini-flash-lite-latest',
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      });
    }

    const initialMessage: Message = {
        id: 'init-reset',
        sender: 'bot',
        content: translations[language].initialMessage,
    };
    setMessages([initialMessage]);
  };

  const handleLanguageToggle = () => {
    setLanguage(prev => (prev === 'en' ? 'kn' : 'en'));
  };

  const handleSpeak = useCallback(async (messageId: string, text: string, lang: 'en' | 'kn') => {
    if (!API_KEY || !text.trim()) return;
    if (speakingMessage?.id === messageId && speakingMessage?.lang === lang) {
        if (audioSourceRef.current) {
            audioSourceRef.current.stop();
        }
        setSpeakingMessage(null);
        return;
    }

    if (audioSourceRef.current) {
        audioSourceRef.current.stop();
    }
    
    setSpeakingMessage({ id: messageId, lang });

    try {
        const ai = new GoogleGenAI({ apiKey: API_KEY });
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
            },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Audio && audioContextRef.current) {
            const audioBuffer = await decodeAudioData(
                decode(base64Audio),
                audioContextRef.current,
                24000,
                1,
            );
            const source = audioContextRef.current.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContextRef.current.destination);
            source.onended = () => {
                setSpeakingMessage(null);
                audioSourceRef.current = null;
            };
            source.start();
            audioSourceRef.current = source;
        }
    } catch (error) {
        console.error("Error generating speech:", error);
        setSpeakingMessage(null);
    }
  }, [speakingMessage]);

  const handleSendMessage = useCallback(async (messageText: string) => {
    if (!chatRef.current) return;
    
    setIsLoading(true);
    const userMessage: Message = { id: Date.now().toString(), sender: 'user', content: messageText };
    setMessages(prev => [...prev, userMessage]);

    const botMessageId = (Date.now() + 1).toString();
    let tempBotMessage: Message = { id: botMessageId, sender: 'bot', content: '' };
    setMessages(prev => [...prev, tempBotMessage]);

    try {
      const responseStream = await chatRef.current.sendMessageStream({ message: messageText });
      let accumulatedText = '';
      for await (const chunk of responseStream) {
        accumulatedText += chunk.text;
        setMessages(prev => prev.map(msg => 
          msg.id === botMessageId ? { ...msg, content: accumulatedText } : msg
        ));
      }
    } catch (error) {
      console.error("Error sending message:", error);
       setMessages(prev => prev.map(msg => 
          msg.id === botMessageId ? { ...msg, content: "Sorry, I encountered an error. Please try again." } : msg
        ));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
     <div className="h-full w-full flex items-center justify-center p-2 sm:p-4 bg-gradient-to-b from-[#fcdb03] from-50% to-[#c8102e] to-50%">
      <div className="w-full max-w-3xl h-full flex flex-col bg-white/60 rounded-2xl shadow-2xl border border-amber-200 overflow-hidden backdrop-blur-lg">
        <header className="p-4 bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm flex items-center justify-between gap-4 flex-shrink-0">
          <div className="flex items-center gap-4">
              <div className="p-2 bg-amber-600 rounded-full">
                  <BotIcon className="w-8 h-8 text-white"/>
              </div>
              <div>
                  <h1 className={`text-xl font-bold text-orange-900 ${language === 'kn' ? 'font-kannada' : ''}`}>{currentTranslations.title}</h1>
                  <p className={`text-sm text-gray-600 ${language === 'kn' ? 'font-kannada' : ''}`}>{currentTranslations.subtitle}</p>
              </div>
          </div>
          <div className="flex items-center gap-2">
              <button
                  onClick={handleClearChat}
                  disabled={isLoading}
                  className="p-2 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                  title={currentTranslations.resetChat}
                  aria-label={currentTranslations.resetChat}
              >
                  <ResetIcon className="w-6 h-6 text-gray-600" />
              </button>
              <button
                  onClick={handleLanguageToggle}
                  className={`px-3 py-1.5 text-sm font-semibold text-gray-700 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 ${language === 'en' ? 'font-kannada' : ''}`}
                  aria-label={`Switch to ${currentTranslations.switchTo}`}
              >
                  {currentTranslations.switchTo}
              </button>
          </div>
        </header>
        <ChatWindow messages={messages} isLoading={isLoading} onSpeak={handleSpeak} speakingMessage={speakingMessage} />
        <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} placeholder={currentTranslations.inputPlaceholder} />
      </div>
    </div>
  );
};

export default App;
