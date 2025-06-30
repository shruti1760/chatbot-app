export interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  vectorName?: string;
}

export interface UploadedFile {
  name: string;
  size: number;
  uploadDate: Date;
  vectorName: string;
}