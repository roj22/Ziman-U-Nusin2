// @ts-nocheck
import React, { useState, useRef, useCallback } from 'react';
import ToolContainer from './ToolContainer';
import { transcribeAudio } from '../services/geminiService';
import { fileToBase64 } from '../utils/fileUtils';

// For lamejs MP3 encoder loaded from script tag
declare const lamejs: any;

interface SpeechToTextProps {
  onBack: () => void;
}

const SpeechToText: React.FC<SpeechToTextProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'record' | 'upload'>('record');
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<{ url: string; blob: Blob } | null>(null);

  // Refs for MP3 recording
  const audioContextRef = useRef<AudioContext | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mp3EncoderRef = useRef<any>(null);
  const mp3DataRef = useRef<Int8Array[]>([]);
  const mp3DataRef = useRef<any>([]);
  const handleStopRecording = useCallback(() => {
    if (!scriptProcessorRef.current) return; // Already stopped or not started

    setIsRecording(false);

    // Disconnect nodes to stop audio processing
    scriptProcessorRef.current.disconnect();
    scriptProcessorRef.current = null;

    // Stop microphone access
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
    
    // Close audio context
    audioContextRef.current?.close();
    audioContextRef.current = null;

    // Finalize the MP3 file
    if (mp3EncoderRef.current) {
        const mp3buf = mp3EncoderRef.current.flush();
        if (mp3buf.length > 0) {
            mp3DataRef.current.push(mp3buf);
        }

        const audioBlob = new Blob(mp3DataRef.current as BlobPart[].current, { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudio({ url: audioUrl, blob: audioBlob });
        
        mp3EncoderRef.current = null;
    }
  }, []);

  const handleTabChange = (tab: 'record' | 'upload') => {
    setActiveTab(tab);
    setTranscription('');
    setError('');
    setIsLoading(false);

    if (isRecording) {
      handleStopRecording();
    } else {
      setRecordedAudio(null);
    }
  };

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      
      const bufferSize = 4096;
      const scriptProcessor = audioContext.createScriptProcessor(bufferSize, 1, 1);
      scriptProcessorRef.current = scriptProcessor;

      const sampleRate = audioContext.sampleRate;
      mp3EncoderRef.current = new lamejs.Mp3Encoder(1, sampleRate, 128); // Mono, 128kbps
      mp3DataRef.current = [];
      
      scriptProcessor.onaudioprocess = (e: AudioProcessingEvent) => {
        const inputData = e.inputBuffer.getChannelData(0);
        const samples = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
            samples[i] = inputData[i] * 32767.5; // Convert to 16-bit PCM
        }
        const mp3buf = mp3EncoderRef.current.encodeBuffer(samples);
        if (mp3buf.length > 0) {
            mp3DataRef.current.push(mp3buf);
        }
      };

      source.connect(scriptProcessor);
      scriptProcessor.connect(audioContext.destination);

      setIsRecording(true);
      setTranscription('');
      setError('');
      setRecordedAudio(null);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setError('ناتوانین دەستمان بە مایکرۆفۆنەکەت بگات. تکایە رێگەپێدان بدە.');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleTranscription(file);
    }
  };

  const handleTranscribeRecording = () => {
    if (recordedAudio) {
      handleTranscription(recordedAudio.blob);
      setRecordedAudio(null);
    }
  };

  const handleTranscription = async (blob: Blob) => {
    setIsLoading(true);
    setError('');
    setTranscription('');
    try {
      const base64 = await fileToBase64(blob as File);
      const result = await transcribeAudio(base64, blob.type);
      setTranscription(result);
    } catch (err) {
      console.error(err);
      setError('هەڵەیەک روویدا لە کاتی گۆڕینی دەنگ بە دەق.');
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
    <ToolContainer title="گۆڕینی دەنگ بەدەق" onBack={onBack}>
      <div className="flex mb-4 border-b border-gray-600">
        <button onClick={() => handleTabChange('record')} className={`py-2 px-4 text-lg ${activeTab === 'record' ? 'border-b-2 border-teal-400 text-teal-400' : 'text-gray-400'}`}>تۆمارکردنی دەنگ</button>
        <button onClick={() => handleTabChange('upload')} className={`py-2 px-4 text-lg ${activeTab === 'upload' ? 'border-b-2 border-teal-400 text-teal-400' : 'text-gray-400'}`}>هێنانی فایل</button>
      </div>

      {activeTab === 'record' && (
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={isRecording ? handleStopRecording : handleStartRecording}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-colors text-white ${isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-teal-500 hover:bg-teal-600'}`}
          >
            {isRecording ? 
              <span className="w-8 h-8 bg-white rounded-sm animate-pulse"></span> : 
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
            }
          </button>
          <p className="text-gray-300">{isRecording ? 'تۆمارکردن لە کاردایە...' : 'پەنجە بنێ بۆ تۆمارکردن'}</p>

          {recordedAudio && (
            <div className="mt-4 w-full max-w-lg flex flex-col sm:flex-row gap-4 items-center bg-gray-700/50 p-4 rounded-lg animate-fade-in">
                <audio src={recordedAudio.url} controls className="outline-none rounded-full w-full sm:w-auto" />
                <div className="flex gap-4 flex-shrink-0">
                    <button onClick={handleTranscribeRecording} className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                        بیکە بە دەق
                    </button>
                    <a href={recordedAudio.url} download="recording.mp3" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center">
                        داگرتن
                    </a>
                </div>
            </div>
           )}

        </div>
      )}
      
      {activeTab === 'upload' && (
        <div className="flex justify-center">
          <label className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg cursor-pointer transition-colors">
            <span>فایلێکی دەنگی هەڵبژێرە</span>
            <input type="file" className="hidden" accept="audio/*" onChange={handleFileUpload} />
          </label>
        </div>
      )}

      {error && <p className="mt-4 text-red-400 text-center">{error}</p>}

      {isLoading && (
        <div className="mt-6 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-400"></div>
          <p className="mt-2 text-gray-300">...لە حالەتی پرۆسەکردندایە</p>
        </div>
      )}

      {transcription && (
        <div className="relative mt-6 bg-gray-900 p-4 rounded-lg">
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
    </ToolContainer>
  );
};

export default SpeechToText;
