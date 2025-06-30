import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import VoiceInput from './VoiceInput';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  disabled: boolean;
}

export default function ChatInput({ onSendMessage, isLoading, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleVoiceInput = (text: string) => {
    setMessage(text);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="paper-texture bg-white/80 backdrop-blur-sm border-t-2 border-dashed border-amber-200 p-6">
      <form onSubmit={handleSubmit} className="flex items-end space-x-4">
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={disabled 
              ? "Please upload a document and set a vector name first..." 
              : "Ask me anything about your document..."
            }
            disabled={disabled || isLoading}
            className="w-full px-4 py-3 pr-12 bg-white/90 border-2 border-dashed border-amber-300 
                     rounded-lg resize-none lined-paper min-h-[60px] max-h-32
                     focus:outline-none focus:border-amber-500 focus:bg-white
                     disabled:opacity-50 disabled:cursor-not-allowed
                     handwritten text-lg text-gray-800 placeholder-gray-500"
            rows={1}
          />
          
          {/* Voice Input Button (positioned inside textarea) */}
          <div className="absolute right-3 bottom-3">
            <VoiceInput 
              onVoiceInput={handleVoiceInput}
              isListening={isListening}
              setIsListening={setIsListening}
            />
          </div>
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!message.trim() || isLoading || disabled}
          className="p-3 bg-amber-200 text-amber-800 rounded-full hover:bg-amber-300 
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-all duration-300 transform hover:scale-105 active:scale-95"
        >
          {isLoading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <Send className="w-6 h-6" />
          )}
        </button>
      </form>
      
      <div className="mt-3 text-center">
        <p className="text-xs text-gray-500 handwritten">
          💭 Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}