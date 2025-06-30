import React, { useState, useRef, useEffect } from 'react';
import { BookOpen, Sparkles } from 'lucide-react';
import FileUpload from './components/FileUpload';
import VectorNameInput from './components/VectorNameInput';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import ConversationTimeline from './components/ConversationTimeline';
import type { Message, UploadedFile } from './types';

function App() {
  const [vectorName, setVectorName] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleFileUpload = (file: UploadedFile) => {
    setUploadedFiles(prev => [...prev, file]);
  };

  const handleSendMessage = async (messageContent: string) => {
    if (!vectorName.trim()) {
      alert('Please set a vector name first!');
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageContent,
      timestamp: new Date(),
      vectorName: vectorName,
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/v1/chat?vector_name=${encodeURIComponent(vectorName)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: messageContent }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      // Simulate typing delay for better UX
      setTimeout(() => {
        setIsTyping(false);
        
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: data.response || data.answer || 'I received your message, but I\'m having trouble processing it right now.',
          timestamp: new Date(),
          vectorName: vectorName,
        };

        setMessages(prev => [...prev, aiMessage]);
      }, 1000);

    } catch (error) {
      console.error('Chat error:', error);
      setIsTyping(false);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'I apologize, but I\'m having trouble connecting right now. Please check your internet connection and try again.',
        timestamp: new Date(),
        vectorName: vectorName,
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear all conversation history?')) {
      setMessages([]);
      setUploadedFiles([]);
    }
  };

  const canChat = vectorName.trim().length > 0 && uploadedFiles.length > 0;

  return (
    <div className="min-h-screen paper-texture">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b-2 border-dashed border-amber-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-200 to-amber-300 rounded-full 
                          flex items-center justify-center transform rotate-3">
              <BookOpen className="w-6 h-6 text-amber-800" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-amber-900 handwritten">
                AI Journal Assistant
              </h1>
              <p className="text-amber-700 text-sm">
                Your smart notebook companion
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-amber-600">
            <Sparkles className="w-5 h-5 animate-bounce-gentle" />
            <span className="handwritten text-lg">Ready to help!</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Setup */}
          <div className="space-y-6">
            <VectorNameInput 
              value={vectorName}
              onChange={setVectorName}
            />
            
            <FileUpload 
              onFileUpload={handleFileUpload}
              vectorName={vectorName}
            />

            {/* Timeline - Hidden on mobile, shown on desktop */}
            <div className="hidden lg:block">
              <ConversationTimeline 
                messages={messages}
                uploadedFiles={uploadedFiles}
                onClearHistory={handleClearHistory}
              />
            </div>
          </div>

          {/* Center Column - Chat */}
          <div className="lg:col-span-2 flex flex-col h-[600px]">
            <div className="bg-white/80 backdrop-blur-sm rounded-t-lg border-2 border-dashed border-amber-200 p-6">
              <h2 className="text-xl font-semibold text-amber-900 handwritten mb-2">
                📖 Chat with your document
              </h2>
              <p className="text-amber-700 text-sm">
                {canChat 
                  ? "Ask questions about your uploaded document!" 
                  : "Upload a document and set a vector name to start chatting"}
              </p>
            </div>

            {/* Messages Area */}
            <div className="flex-1 bg-white/60 lined-paper overflow-y-auto p-6 space-y-6">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="w-8 h-8 text-amber-600" />
                    </div>
                    <p className="text-amber-700 handwritten text-lg">
                      Start a conversation with your document!
                    </p>
                    <p className="text-amber-600 text-sm mt-2">
                      Upload a .txt file and ask your first question
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                  ))}
                  
                  {isTyping && (
                    <ChatMessage 
                      message={{
                        id: 'typing',
                        type: 'ai',
                        content: '',
                        timestamp: new Date(),
                      }}
                      isTyping={true}
                    />
                  )}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <ChatInput 
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              disabled={!canChat}
            />
          </div>
        </div>

        {/* Mobile Timeline - Shown only on mobile */}
        <div className="lg:hidden mt-8">
          <ConversationTimeline 
            messages={messages}
            uploadedFiles={uploadedFiles}
            onClearHistory={handleClearHistory}
          />
        </div>
      </div>
    </div>
  );
}

export default App;