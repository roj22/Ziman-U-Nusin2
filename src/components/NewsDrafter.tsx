
import React, { useState } from 'react';
import ToolContainer from './ToolContainer';
import { draftNewsArticle } from '../services/geminiService';

interface NewsDrafterProps {
  onBack: () => void;
}

const NewsDrafter: React.FC<NewsDrafterProps> = ({ onBack }) => {
  const [notes, setNotes] = useState('');
  const [article, setArticle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDrafting = async () => {
    if (!notes.trim()) {
      setError('تکایە کورتەی هەواڵەکە یان چەند زانیارییەک بنووسە.');
      return;
    }
    setIsLoading(true);
    setError('');
    setArticle('');
    try {
      const result = await draftNewsArticle(notes);
      setArticle(result);
    } catch (err) {
      console.error(err);
      setError('هەڵەیەک ڕوویدا لە کاتی داڕشتنەوەی هەواڵەکە.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ToolContainer title="داڕشتنەوەی هەواڵ" onBack={onBack}>
      <div className="flex flex-col gap-6">
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-2">کورتەی هەواڵ یان خاڵە سەرەکییەکان</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={8}
            className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 focus:ring-teal-500 focus:border-teal-500"
            placeholder="لێرە زانیارییەکانت دەربارەی هەواڵەکە بنووسە..."
          />
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleDrafting}
            disabled={isLoading}
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-500"
          >
            {isLoading ? '...داڕشتنەوە' : 'داڕشتنەوەی بۆ بکە'}
          </button>
        </div>
        
        {error && <p className="text-center text-red-400">{error}</p>}

        {isLoading && (
            <div className="mt-6 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-400"></div>
              <p className="mt-2 text-gray-300">...لە حالەتی پرۆسەکردندایە</p>
            </div>
        )}

        {article && !isLoading && (
          <div className="bg-gray-900 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-gray-200">هەواڵە داڕێژراوەکە:</h3>
            <div className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3">
              <p className="text-gray-300 whitespace-pre-wrap">{article}</p>
            </div>
          </div>
        )}
      </div>
    </ToolContainer>
  );
};

export default NewsDrafter;