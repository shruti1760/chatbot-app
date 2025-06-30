import React from 'react';
import { Clock, FileText, MessageCircle, Trash2 } from 'lucide-react';
import type { Message, UploadedFile } from '../types';

interface ConversationTimelineProps {
  messages: Message[];
  uploadedFiles: UploadedFile[];
  onClearHistory: () => void;
}

export default function ConversationTimeline({ 
  messages, 
  uploadedFiles, 
  onClearHistory 
}: ConversationTimelineProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const allEvents = [
    ...uploadedFiles.map(file => ({
      type: 'upload' as const,
      timestamp: file.uploadDate,
      content: file.name,
      vectorName: file.vectorName,
    })),
    ...messages.map(msg => ({
      type: msg.type as const,
      timestamp: msg.timestamp,
      content: msg.content,
      vectorName: msg.vectorName,
    }))
  ].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  if (allEvents.length === 0) {
    return (
      <div className="sticky-note p-6 rounded-lg text-center">
        <Clock className="w-8 h-8 text-amber-600 mx-auto mb-3" />
        <p className="text-amber-800 handwritten text-lg">
          Your conversation timeline will appear here
        </p>
        <p className="text-amber-600 text-sm mt-2">
          Start by uploading a document! 📄
        </p>
      </div>
    );
  }

  return (
    <div className="sticky-note p-6 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-amber-800 handwritten text-xl font-medium flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          Timeline
        </h3>
        <button
          onClick={onClearHistory}
          className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
          title="Clear history"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4 max-h-80 overflow-y-auto">
        {allEvents.map((event, index) => (
          <div key={index} className="flex items-start space-x-3 pb-4 border-b border-dashed border-amber-200 last:border-b-0">
            <div className="flex-shrink-0 mt-1">
              {event.type === 'upload' ? (
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
              ) : (
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  event.type === 'user' ? 'bg-sky-100' : 'bg-green-100'
                }`}>
                  <MessageCircle className={`w-4 h-4 ${
                    event.type === 'user' ? 'text-sky-600' : 'text-green-600'
                  }`} />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-xs text-gray-500 handwritten">
                  {formatDate(event.timestamp)}
                </span>
                {event.vectorName && (
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs">
                    📁 {event.vectorName}
                  </span>
                )}
              </div>
              
              <p className="text-sm text-gray-700 line-clamp-2">
                {event.type === 'upload' 
                  ? `📄 Uploaded: ${event.content}`
                  : event.content
                }
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}