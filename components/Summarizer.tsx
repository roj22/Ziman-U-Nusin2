
import React, { useState } from 'react';
import ToolContainer from './ToolContainer';
import { summarizeText } from '../services/geminiService';

interface SummarizerProps {
  onBack: () => void;
}

type SummaryLevel = 'short' | 'medium' | 'long';

const Summarizer: React.FC<SummarizerProps> = ({ onBack }) => {
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeLevel, setActiveLevel] = useState<SummaryLevel | null>(null);

  const handleSummarize = async (level: SummaryLevel) => {
    if (!inputText.trim()) {
      setError('تکایە بابەتێک بنووسە بۆ کورتکردنەوە.');
      return;
    }
    setIsLoading(true);
    setActiveLevel(level);
    setError('');
    setSummary('');
    try {
      const result = await summarizeText(inputText, level);
      setSummary(result);
    } catch (err) {
      console.error(err);
      setError('هەڵەیەک روویدا لە کاتی کورتکردنەوەی بابەت.');
    } finally {
      setIsLoading(false);
      setActiveLevel(null);
    }
  };

  return (
    <ToolContainer title="كورتكردنەوەی بابەت" onBack={onBack}>
      <div className="flex flex-col gap-6">
        <div>
          <label htmlFor="inputText" className="block text-sm font-medium text-gray-300 mb-2">بابەتە درێژەکە</label>
          <textarea
            id="inputText"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={12}
            className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 focus:ring-teal-500 focus:border-teal-500"
            placeholder="بابەتە درێژەکەت لێرە دابنێ..."
          />
        </div>

        <div className="flex justify-center items-center gap-4">
          <button
            onClick={() => handleSummarize('short')}
            disabled={isLoading}
            className={`font-bold py-2 px-4 rounded-lg transition-colors ${isLoading && activeLevel === 'short' ? 'bg-yellow-500' : 'bg-yellow-600 hover:bg-yellow-700'} disabled:bg-gray-500`}
          >
            {isLoading && activeLevel === 'short' ? '...' : 'کورت'}
          </button>
          <button
            onClick={() => handleSummarize('medium')}
            disabled={isLoading}
            className={`font-bold py-2 px-4 rounded-lg transition-colors ${isLoading && activeLevel === 'medium' ? 'bg-blue-500' : 'bg-blue-600 hover:bg-blue-700'} disabled:bg-gray-500`}
          >
            {isLoading && activeLevel === 'medium' ? '...' : 'ناوەند'}
          </button>
          <button
            onClick={() => handleSummarize('long')}
            disabled={isLoading}
            className={`font-bold py-2 px-4 rounded-lg transition-colors ${isLoading && activeLevel === 'long' ? 'bg-green-500' : 'bg-green-600 hover:bg-green-700'} disabled:bg-gray-500`}
          >
            {isLoading && activeLevel === 'long' ? '...' : 'درێژ'}
          </button>
        </div>
        
        {error && <p className="text-center text-red-400">{error}</p>}

        {summary && (
          <div className="bg-gray-900 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-gray-200">پوختە:</h3>
            <p className="text-gray-300 whitespace-pre-wrap">{summary}</p>
          </div>
        )}
      </div>
    </ToolContainer>
  );
};

export default Summarizer;
