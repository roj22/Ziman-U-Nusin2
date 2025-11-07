
// @ts-nocheck
import React, { useState, useRef, useCallback } from 'react';
import ToolContainer from './ToolContainer';
import { translateText, transcribeForTranslation } from '../services/geminiService';
import { fileToBase64 } from '../utils/fileUtils';

// For lamejs MP3 encoder loaded from script tag
declare const lamejs: any;

interface TranslatorProps {
  onBack: () => void;
}

const languages = [
  { code: 'Auto Detect', name: 'خۆکارانە دیاریبکە' },
  { code: 'Kurdish (Sorani)', name: 'کوردی (سۆرانی)' },
  { code: 'Kurdish (Kurmanji)', name: 'کوردی (کرمانجی)' },
  { code: 'English', name: 'ئینگلیزی' },
  { code: 'Arabic', name: 'عەرەبی' },
  { code: 'Persian', name: 'فارسی' },
  { code: 'Turkish', name: 'تورکی' },
  { code: 'German', name: 'ئەڵمانی' },
  { code: 'French', name: 'فەرەنسی' },
  { code: 'Italian', name: 'ئیتالی' },
  { code: 'Swedish', name: 'سویدی' },
  { code: 'Norwegian', name: 'نەرویجی' },
  { code: 'Danish', name: 'دانیمارکی' },
  { code: 'Finnish', name: 'فینلەندی' },
  { code: 'Icelandic', name: 'ئایسلەندی' },
];

const Translator: React.FC<TranslatorProps> = ({ onBack }) => {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('Auto Detect');
  const [targetLang, setTargetLang] = useState('English');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);

  // Refs for MP3 recording
  const audioContextRef = useRef<AudioContext | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mp3EncoderRef = useRef<any>(null);
  const mp3DataRef = useRef<any>([]);
  const handleStopRecording = useCallback(async () => {
    if (!scriptProcessorRef.current) return;

    setIsRecording(false);
    setIsTranscribing(true);
    setError('');

    scriptProcessorRef.current.disconnect();
    scriptProcessorRef.current = null;

    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
    
    audioContextRef.current?.close().catch(console.error);
    audioContextRef.current = null;

    if (mp3EncoderRef.current) {
        const mp3buf = mp3EncoderRef.current.flush();
        if (mp3buf.length > 0) {
            mp3DataRef.current.push(mp3buf);
        }

        const audioBlob = new Blob(mp3DataRef.current as BlobPart[].current, { type: 'audio/mpeg' });
        mp3EncoderRef.current = null;
        
        try {
            const base64 = await fileToBase64(audioBlob as File);
            const result = await transcribeForTranslation(base64, audioBlob.type, sourceLang);
            setSourceText(result);
        } catch (err) {
            console.error(err);
            setError('هەڵەیەک ڕوویدا لە کاتی گۆڕینی دەنگ بە دەق.');
        } finally {
            setIsTranscribing(false);
        }
    } else {
      setIsTranscribing(false);
    }
  }, [sourceLang]);

  const handleStartRecording = useCallback(async () => {
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
            samples[i] = inputData[i] * 32767.5;
        }
        const mp3buf = mp3EncoderRef.current.encodeBuffer(samples);
        if (mp3buf.length > 0) {
            mp3DataRef.current.push(mp3buf);
        }
      };

      source.connect(scriptProcessor);
      scriptProcessor.connect(audioContext.destination);

      setIsRecording(true);
      setError('');
      setSourceText('');
      setTranslatedText('');

    } catch (err) {
      console.error("Error accessing microphone:", err);
      setError('ناتوانین دەستمان بە مایکرۆفۆنەکەت بگات. تکایە رێگەپێدان بدە.');
    }
  }, []);

  const handleMicButtonClick = () => {
    if (isRecording) {
      handleStopRecording();
    } else {
      handleStartRecording();
    }
  };


  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      setError('تکایە دەقێک بنووسە بۆ وەرگێڕان.');
      return;
    }
    if (sourceLang === targetLang && sourceLang !== 'Auto Detect') {
        setTranslatedText(sourceText);
        return;
    }
    setIsLoading(true);
    setError('');
    setTranslatedText(''); 
    
    try {
      const result = await translateText(sourceText, sourceLang, targetLang);
      setTranslatedText(result);
    } catch (err) {
      console.error(err);
      setError('هەڵەیەک ڕوویدا لە کاتی وەرگێڕان.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwapLanguages = () => {
    if (sourceLang === 'Auto Detect') return;
    const currentSourceText = sourceText;
    const currentTranslatedText = translatedText;

    setSourceLang(targetLang);
    setTargetLang(sourceLang);

    setSourceText(currentTranslatedText);
    setTranslatedText(currentSourceText);
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolContainer title="وەرگێڕانی زمان" onBack={onBack}>
      <div className="flex items-center justify-center gap-2 md:gap-4 mb-4">
        <select
          value={sourceLang}
          onChange={(e) => setSourceLang(e.target.value)}
          className="bg-gray-700 border border-gray-600 rounded-lg p-2 focus:ring-teal-500 focus:border-teal-500 w-full disabled:opacity-50"
          disabled={isRecording || isTranscribing}
        >
          {languages.map(lang => (
            <option key={lang.code} value={lang.code}>{lang.name}</option>
          ))}
        </select>
        
        <button 
            onClick={handleSwapLanguages} 
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            disabled={sourceLang === 'Auto Detect' || isRecording || isTranscribing}
            aria-label="Swap languages"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
        </button>

        <select
          value={targetLang}
          onChange={(e) => setTargetLang(e.target.value)}
          className="bg-gray-700 border border-gray-600 rounded-lg p-2 focus:ring-teal-500 focus:border-teal-500 w-full disabled:opacity-50"
          disabled={isRecording || isTranscribing}
        >
          {languages.filter(l => l.code !== 'Auto Detect').map(lang => (
            <option key={lang.code} value={lang.code}>{lang.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative">
          <label htmlFor="sourceText" className="block text-sm font-medium text-gray-300 mb-2">{languages.find(l => l.code === sourceLang)?.name}</label>
          <textarea
            id="sourceText"
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            rows={10}
            className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 focus:ring-teal-500 focus:border-teal-500 disabled:bg-gray-800"
            placeholder="لێرە دەقەکەت بنووسە یان مایکرۆفۆنەکە بەکاربێنە..."
            disabled={isRecording || isTranscribing}
          />
          <button 
            onClick={handleMicButtonClick}
            disabled={isTranscribing}
            className={`absolute bottom-3 right-3 p-2 rounded-full transition-colors flex items-center justify-center w-10 h-10 ${isRecording ? 'bg-red-600 hover:bg-red-700 animate-pulse' : 'bg-teal-600 hover:bg-teal-700'} disabled:bg-gray-500 disabled:cursor-not-allowed`}
            aria-label={isRecording ? 'تۆمارکردن بوەستێنە' : 'تۆمارکردن دەستپێبکە'}
          >
            {isTranscribing ? (
              <div className="w-5 h-5 animate-spin rounded-full border-2 border-transparent border-t-white"></div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            )}
          </button>
        </div>
        <div>
           <label htmlFor="translatedText" className="block text-sm font-medium text-gray-300 mb-2">{languages.find(l => l.code === targetLang)?.name}</label>
          <div
            id="translatedText"
            className="relative w-full h-full min-h-[250px] bg-gray-900 border border-gray-600 rounded-lg p-3"
          >
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-400"></div>
              </div>
            ) : (
                <>
                <p className="text-gray-300 whitespace-pre-wrap">{translatedText}</p>
                {translatedText && (
                    <button onClick={handleCopy} className="absolute bottom-2 right-2 p-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg" aria-label="Copy text">
                      {copied ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                      )}
                    </button>
                )}
                </>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <button
          onClick={handleTranslate}
          disabled={isLoading || isRecording || isTranscribing}
          className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          {isLoading ? '...وەرگێڕان' : 'وەریبگێڕە'}
        </button>
        {error && <p className="mt-4 text-red-400">{error}</p>}
      </div>
    </ToolContainer>
  );
};

export default Translator;
