import React from 'react';
import { User, Bot } from 'lucide-react';
import type { Message } from '../types';

interface ChatMessageProps {
  message: Message;
  isTyping?: boolean;
}

export default function ChatMessage({ message, isTyping = false }: ChatMessageProps) {
  const isUser = message.type === 'user';
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center 
                        ${isUser ? 'avatar-user ml-2' : 'avatar-ai mr-2'}`}>
          {isUser ? (
            <User className="w-5 h-5 text-amber-700" />
          ) : (
            <Bot className="w-5 h-5 text-green-700" />
          )}
        </div>

        {/* Message Bubble */}
        <div className="flex flex-col">
          <div className={`px-4 py-3 rounded-2xl ${
            isUser ? 'chat-bubble-user' : 'chat-bubble-ai'
          } torn-edge`}>
            {isTyping ? (
              <div className="typing-indicator">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            ) : (
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
            )}
          </div>
          
          {/* Timestamp */}
          <div className={`mt-1 text-xs text-gray-500 handwritten ${
            isUser ? 'text-right' : 'text-left'
          }`}>
            {formatTime(message.timestamp)}
            {message.vectorName && (
              <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs">
                📁 {message.vectorName}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}