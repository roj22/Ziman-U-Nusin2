
import React, { useState } from 'react';
import ToolContainer from './ToolContainer';
import { draftLetter } from '../services/geminiService';

interface FormalLetterWriterProps {
  onBack: () => void;
}

type LetterTone = 'official' | 'friendly';

const FormalLetterWriter: React.FC<FormalLetterWriterProps> = ({ onBack }) => {
  const [recipient, setRecipient] = useState('');
  const [body, setBody] = useState('');
  const [tone, setTone] = useState<LetterTone>('official');
  const [letter, setLetter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleDrafting = async () => {
    if (!recipient.trim() || !body.trim()) {
      setError('تکایە هەردوو خانەی "بۆ" و "داواکاری" پڕ بکەرەوە.');
      return;
    }
    setIsLoading(true);
    setError('');
    setLetter('');
    try {
      const result = await draftLetter(recipient, body, tone);
      setLetter(result);
    } catch (err) {
      console.error(err);
      setError('هەڵەیەک ڕوویدا لە کاتی داڕشتنی نامەکە.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (letter) {
      navigator.clipboard.writeText(letter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <ToolContainer title="نووسینی نامە" onBack={onBack}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="recipient" className="block text-sm font-medium text-gray-300 mb-2">بۆ:</label>
              <input
                id="recipient"
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 focus:ring-teal-500 focus:border-teal-500"
                placeholder="بۆ بەڕێز..."
              />
            </div>
            <div>
              <label htmlFor="body" className="block text-sm font-medium text-gray-300 mb-2">داواکاری و پێشنیار:</label>
              <textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={5}
                className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 focus:ring-teal-500 focus:border-teal-500"
                placeholder="داواکارییەکەت لێرە بنووسە..."
              />
            </div>
        </div>
        
        <div className="flex justify-center items-center gap-4">
            <span className="text-gray-300">جۆری نامە:</span>
            <button 
                onClick={() => setTone('official')}
                className={`px-4 py-2 rounded-lg transition-colors ${tone === 'official' ? 'bg-teal-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
                فەرمی
            </button>
            <button 
                onClick={() => setTone('friendly')}
                className={`px-4 py-2 rounded-lg transition-colors ${tone === 'friendly' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
                دۆستانە
            </button>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleDrafting}
            disabled={isLoading}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-500"
          >
            {isLoading ? '...داڕشتنەوە' : 'داڕشتنی نامە'}
          </button>
        </div>
        
        {error && <p className="text-center text-red-400">{error}</p>}

        {(isLoading || letter) && (
          <div className="relative mt-2 bg-gray-900 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-gray-200">نامە داڕێژراوەکە:</h3>
            <div className="w-full min-h-[200px] bg-gray-800 border border-gray-600 rounded-lg p-3">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-400"></div>
                </div>
              ) : (
                <>
                  <p className="text-gray-300 whitespace-pre-wrap">{letter}</p>
                  {letter && (
                    <button onClick={handleCopy} className="absolute top-3 right-3 p-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg" aria-label="Copy text">
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
        )}
      </div>
    </ToolContainer>
  );
};

export default FormalLetterWriter;