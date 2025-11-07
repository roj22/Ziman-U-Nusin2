import React, { useState, useCallback } from 'react';
import ToolContainer from './ToolContainer';
import { draftArticle } from '../services/geminiService';

interface ArticleWriterProps {
  onBack: () => void;
}

type ArticleType = 'essay' | 'literary' | 'research';

const ArticleWriter: React.FC<ArticleWriterProps> = ({ onBack }) => {
  const [title, setTitle] = useState('');
  const [article, setArticle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeType, setActiveType] = useState<ArticleType | null>(null);
  const [copied, setCopied] = useState(false);

  const handleDrafting = async (type: ArticleType) => {
    if (!title.trim()) {
      setError('تکایە ناونیشانی بابەتەکە بنووسە.');
      return;
    }
    setIsLoading(true);
    setActiveType(type);
    setError('');
    setArticle('');
    try {
      const result = await draftArticle(title, type);
      setArticle(result);
    } catch (err) {
      console.error(err);
      setError('هەڵەیەک ڕوویدا لە کاتی نووسینی بابەتەکە.');
    } finally {
      setIsLoading(false);
      setActiveType(null);
    }
  };
  
  const handleCopy = useCallback(() => {
    if (article) {
      navigator.clipboard.writeText(article);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [article]);

  return (
    <ToolContainer title="نووسینی بابەت" onBack={onBack}>
      <div className="flex flex-col gap-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">ناونیشانی بابەت</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 focus:ring-teal-500 focus:border-teal-500"
            placeholder="لێرە ناونیشانی بابەتەکەت بنووسە..."
          />
        </div>

        <div className="flex justify-center items-center gap-4 flex-wrap">
          <button
            onClick={() => handleDrafting('essay')}
            disabled={isLoading}
            className="font-bold py-2 px-4 rounded-lg transition-colors bg-teal-600 hover:bg-teal-700 disabled:bg-gray-500"
          >
            {isLoading && activeType === 'essay' ? '...' : 'وتار'}
          </button>
          <button
            onClick={() => handleDrafting('literary')}
            disabled={isLoading}
            className="font-bold py-2 px-4 rounded-lg transition-colors bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500"
          >
            {isLoading && activeType === 'literary' ? '...' : 'ئەدەبی'}
          </button>
          <button
            onClick={() => handleDrafting('research')}
            disabled={isLoading}
            className="font-bold py-2 px-4 rounded-lg transition-colors bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500"
          >
            {isLoading && activeType === 'research' ? '...' : 'توێژینەوە'}
          </button>
        </div>
        
        {error && <p className="text-center text-red-400">{error}</p>}

        {(isLoading || article) && (
          <div className="relative mt-2 bg-gray-900 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-gray-200">بابەتە نووسراوەکە:</h3>
              {article && (
                <button onClick={handleCopy} className="p-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg" aria-label="Copy text">
                  {copied ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  )}
                </button>
              )}
            </div>
            <div className="w-full min-h-[300px] bg-gray-800 border border-gray-600 rounded-lg p-3">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-400"></div>
                </div>
              ) : (
                <p className="text-gray-300 whitespace-pre-wrap">{article}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </ToolContainer>
  );
};

export default ArticleWriter;