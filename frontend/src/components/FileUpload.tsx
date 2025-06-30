import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle } from 'lucide-react';
import type { UploadedFile } from '../types';

interface FileUploadProps {
  onFileUpload: (file: UploadedFile) => void;
  vectorName: string;
}

export default function FileUpload({ onFileUpload, vectorName }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const txtFile = files.find(file => file.name.endsWith('.txt'));
    
    if (txtFile) {
      uploadFile(txtFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith('.txt')) {
      uploadFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    if (!vectorName.trim()) {
      alert('Please enter a vector name first!');
      return;
    }

    setIsUploading(true);
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('vector_name', vectorName);

      const response = await fetch('http://127.0.0.1:8000/api/v1/ingest', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const uploadedFile: UploadedFile = {
          name: file.name,
          size: file.size,
          uploadDate: new Date(),
          vectorName: vectorName,
        };
        
        onFileUpload(uploadedFile);
        setUploadSuccess(true);
        
        setTimeout(() => setUploadSuccess(false), 3000);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="sticky-note p-6 rounded-lg">
      <div
        className={`file-drop-zone ${isDragging ? 'drag-over' : ''} 
                   p-8 rounded-lg text-center cursor-pointer transition-all duration-300`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="flex flex-col items-center space-y-4">
          {isUploading ? (
            <>
              <div className="animate-spin">
                <Upload className="w-12 h-12 text-amber-600" />
              </div>
              <p className="text-amber-800 handwritten text-lg">
                Uploading your document...
              </p>
            </>
          ) : uploadSuccess ? (
            <>
              <CheckCircle className="w-12 h-12 text-green-600 animate-bounce-gentle" />
              <p className="text-green-800 handwritten text-lg">
                Successfully uploaded! ✨
              </p>
            </>
          ) : (
            <>
              <FileText className="w-12 h-12 text-amber-600" />
              <div className="space-y-2">
                <p className="text-amber-800 handwritten text-lg font-medium">
                  Drop your resume here
                </p>
                <p className="text-amber-700 text-sm">
                  or click to browse (.txt files only)
                </p>
              </div>
            </>
          )}
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-xs text-amber-700 handwritten">
          📝 Your document will be processed and ready for questions
        </p>
      </div>
    </div>
  );
}