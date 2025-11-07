import React, { useState, useCallback } from 'react';
import ToolContainer from './ToolContainer';
import { transcribeVideo } from '../services/geminiService';
import { fileToBase64 } from '../utils/fileUtils';

interface VideoToTextProps {
  onBack: () => void;
}

const VideoToText: React.FC<VideoToTextProps> = ({ onBack }) => {
  const [video, setVideo] = useState<{ src: string, file: File } | null>(null);
  const [transcription, setTranscription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('video/')) {
        setVideo({ src: URL.createObjectURL(file), file });
        setTranscription('');
        setError('');
      } else {
        setError('تکایە تەنها فایلی ڤیدیۆیی هەڵبژێرە.');
        setVideo(null);
      }
    }
  };

  const handleTranscription = async () => {
    if (!video) {
      setError('تکایە ڤیدیۆیەک هەڵبژێرە.');
      return;
    }
    setIsLoading(true);
    setError('');
    setTranscription('');
    try {
      const base64 = await fileToBase64(video.file);
      const result = await transcribeVideo(base64, video.file.type);
      setTranscription(result);
    } catch (err) {
      console.error(err);
      setError('هەڵەیەک روویدا لە کاتی گۆڕینی ڤیدیۆ بە دەق.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCopy = useCallback(() => {
    if (transcription) {
      navigator.clipboard.writeText(transcription);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [transcription]);

  return (
    <ToolContainer title="گۆڕینی ڤیدیۆ بەدەق" onBack={onBack}>
      <div className="flex flex-col items-center gap-6">
        {!video && (
          <label className="w-full max-w-md h-64 border-2 border-dashed border-gray-600 rounded-lg flex flex-col justify-center items-center cursor-pointer hover:bg-gray-700/50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span className="mt-2 font-semibold text-gray-300">ڤیدیۆیەک هەڵبژێرە</span>
            <input type="file" className="hidden" accept="video/*" onChange={handleFileUpload} />
          </label>
        )}
        {video && (
          <div className="w-full max-w-md">
            <video src={video.src} controls className="rounded-lg shadow-lg max-h-80 w-auto mx-auto" />
          </div>
        )}
         <div className="flex items-center gap-4">
            <label className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg cursor-pointer transition-colors">
                <span>{video ? 'گۆڕینی ڤیدیۆ' : 'هەڵبژاردنی ڤیدیۆ'}</span>
                <input type="file" className="hidden" accept="video/*" onChange={handleFileUpload} />
            </label>
            <button 
                onClick={handleTranscription} 
                disabled={isLoading || !video} 
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">
                {isLoading ? '...گۆڕین' : 'بیکە بە دەق'}
            </button>
        </div>

        {error && <p className="mt-4 text-red-400 text-center">{error}</p>}

        {isLoading && (
          <div className="mt-6 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-400"></div>
            <p className="mt-2 text-gray-300">...لە حالەتی پرۆسەکردندایە، تکایە چاوەڕێ بکە</p>
          </div>
        )}

        {transcription && (
          <div className="relative mt-6 w-full max-w-2xl bg-gray-900 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-gray-200">دەقی گۆڕاو:</h3>
            <p className="text-gray-300 whitespace-pre-wrap pr-10">{transcription}</p>
            <button onClick={handleCopy} className="absolute top-3 right-3 p-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg" aria-label="Copy text">
              {copied ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              )}
            </button>
          </div>
        )}
      </div>
    </ToolContainer>
  );
};

export default VideoToText;