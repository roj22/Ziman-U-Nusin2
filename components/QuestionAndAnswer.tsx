import React, { useState, useCallback } from 'react';
import ToolContainer from './ToolContainer';
import { getAnswer } from '../services/geminiService';

interface QuestionAndAnswerProps {
  onBack: () => void;
}

const QuestionAndAnswer: React.FC<QuestionAndAnswerProps> = ({ onBack }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGetAnswer = async () => {
    if (!question.trim()) {
      setError('تکایە پرسیارەکەت بنووسە.');
      return;
    }
    setIsLoading(true);
    setError('');
    setAnswer('');
    try {
      const result = await getAnswer(question);
      setAnswer(result);
    } catch (err) {
      console.error(err);
      setError('هەڵەیەک ڕوویدا لە کاتی وەرگرتنی وەڵام.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = useCallback(() => {
    if (answer) {
      navigator.clipboard.writeText(answer);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [answer]);

  return (
    <ToolContainer title="پرسیار و زانیاری" onBack={onBack}>
      <div className="flex flex-col gap-6">
        <div>
          <label htmlFor="question" className="block text-sm font-medium text-gray-300 mb-2">پرسیار</label>
          <textarea
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={5}
            className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 focus:ring-teal-500 focus:border-teal-500"
            placeholder="پرسیارەکەت لێرە بنووسە..."
          />
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleGetAnswer}
            disabled={isLoading}
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-500"
          >
            {isLoading ? '...وەڵامدانەوە' : 'وەڵام وەربگرە'}
          </button>
        </div>
        
        {error && <p className="text-center text-red-400">{error}</p>}

        {(isLoading || answer) && (
          <div className="relative mt-2 bg-gray-900 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-gray-200">وەڵام:</h3>
              {answer && !isLoading && (
                <button onClick={handleCopy} className="p-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg" aria-label="Copy text">
                  {copied ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  )}
                </button>
              )}
            </div>
            <div className="w-full min-h-[250px] bg-gray-800 border border-gray-600 rounded-lg p-3">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-400"></div>
                </div>
              ) : (
                <p className="text-gray-300 whitespace-pre-wrap">{answer}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </ToolContainer>
  );
};

export default QuestionAndAnswer;
