import React from 'react';
import { Tag } from 'lucide-react';

interface VectorNameInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function VectorNameInput({ value, onChange }: VectorNameInputProps) {
  return (
    <div className="sticky-note p-6 rounded-lg">
      <div className="flex items-center space-x-3">
        <Tag className="w-6 h-6 text-amber-700" />
        <div className="flex-1">
          <label className="block text-amber-800 handwritten text-lg font-medium mb-2">
            Name your document collection
          </label>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="e.g., my-resume, john-doe-cv..."
            className="w-full px-4 py-3 bg-white/70 border-2 border-dashed border-amber-300 
                     rounded-lg handwritten text-lg text-amber-900 placeholder-amber-500
                     focus:outline-none focus:border-amber-500 focus:bg-white
                     transition-all duration-300"
          />
          <p className="mt-2 text-xs text-amber-600 handwritten">
            🏷️ This helps organize your documents for future chats
          </p>
        </div>
      </div>
    </div>
  );
}