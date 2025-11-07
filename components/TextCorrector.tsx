
import React, { useState } from 'react';
import ToolContainer from './ToolContainer';
import { correctText, correctSpellingOnly, analyzeCorrections, correctTextWithCustomRules } from '../services/geminiService';

interface TextCorrectorProps {
  onBack: () => void;
}

const TextCorrector: React.FC<TextCorrectorProps> = ({ onBack }) => {
  const [inputText, setInputText] = useState('');
  const [customInstructions, setCustomInstructions] = useState('');
  const [correctedText, setCorrectedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeCorrectionType, setActiveCorrectionType] = useState<'full' | 'spelling' | 'custom' | null>(null);

  const [analysis, setAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState('');


  const handleCorrection = async (type: 'full' | 'spelling' | 'custom') => {
    if (!inputText.trim()) {
      setError('تکایە دەقێک بنووسە بۆ راستکردنەوە.');
      return;
    }
    if (type === 'custom' && !customInstructions.trim()) {
      setError('تکایە ڕێسای تایبەتی خۆت بنووسە پێش ئەوەی ئەم دوگمەیە بەکاربێنیت.');
      return;
    }
    setIsLoading(true);
    setActiveCorrectionType(type);
    setError('');
    setCorrectedText('');
    setAnalysis('');
    setAnalysisError('');

    try {
      let result;
      if (type === 'full') {
        result = await correctText(inputText, customInstructions);
      } else if (type === 'spelling') {
        result = await correctSpellingOnly(inputText, customInstructions);
      } else { // 'custom'
        result = await correctTextWithCustomRules(inputText, customInstructions);
      }
      setCorrectedText(result);
    } catch (err) {
      console.error(err);
      setError('هەڵەیەک روویدا لە کاتی راستکردنەوەی دەق.');
    } finally {
      setIsLoading(false);
      setActiveCorrectionType(null);
    }
  };

  const handleAnalysis = async () => {
    if (!inputText || !correctedText) return;
    setIsAnalyzing(true);
    setAnalysisError('');
    setAnalysis('');
    try {
      const result = await analyzeCorrections(inputText, correctedText);
      setAnalysis(result);
    } catch (err) {
      console.error(err);
      setAnalysisError('هەڵەیەک ڕوویدا لە کاتی شیکردنەوەی هەڵەکان.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <ToolContainer title="راستكردنەوەی دەق" onBack={onBack}>
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="inputText" className="block text-sm font-medium text-gray-300 mb-2">دەقی تۆ</label>
            <textarea
              id="inputText"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={10}
              className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 focus:ring-teal-500 focus:border-teal-500"
              placeholder="لێرە دەقەکەت بنووسە..."
            />
            <label htmlFor="customInstructions" className="block text-sm font-medium text-gray-300 mt-4 mb-2">ڕێسای تایبەتیی ڕێنووس (ئارەزوومەندانە)</label>
            <textarea
              id="customInstructions"
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              rows={3}
              className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 focus:ring-teal-500 focus:border-teal-500"
              placeholder="لێرە ڕێساکانی ڕێنووسی خۆت بنووسە. بۆ نموونە: پێم وایە دەبێت 'وو' بە 'و' بنووسرێت."
            />
          </div>
          <div>
            <label htmlFor="correctedText" className="block text-sm font-medium text-gray-300 mb-2">دەقی راستکراوە</label>
            <div
              id="correctedText"
              className="w-full h-full min-h-[200px] bg-gray-900 border border-gray-600 rounded-lg p-3"
            >
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-400"></div>
                </div>
              ) : (
                <p className="text-gray-300 whitespace-pre-wrap">{correctedText}</p>
              )}
            </div>
          </div>
        </div>
        <div className="text-center flex justify-center gap-4 flex-wrap">
          <button
            onClick={() => handleCorrection('full')}
            disabled={isLoading}
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {isLoading && activeCorrectionType === 'full' ? '...' : 'راستی بکەرەوە (گشتی)'}
          </button>
          <button
            onClick={() => handleCorrection('spelling')}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {isLoading && activeCorrectionType === 'spelling' ? '...' : 'راستکردنەوەی رێنووس'}
          </button>
          <button
            onClick={() => handleCorrection('custom')}
            disabled={isLoading}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {isLoading && activeCorrectionType === 'custom' ? '...' : 'جێبەجێکردنی ڕێسای من'}
          </button>
        </div>
        {error && <p className="mt-4 text-center text-red-400">{error}</p>}
        
        {correctedText && !isLoading && (
          <div className="mt-4 text-center">
            <button
              onClick={handleAnalysis}
              disabled={isAnalyzing}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? '...شیکردنەوە' : 'لێکدانەوەی هەڵەکان'}
            </button>
          </div>
        )}

        {(isAnalyzing || analysis) && (
          <div className="mt-6">
            <label htmlFor="analysisText" className="block text-sm font-medium text-gray-300 mb-2">لێکدانەوەی هەڵەکان</label>
            <div
              id="analysisText"
              className="w-full min-h-[150px] bg-gray-900 border border-gray-600 rounded-lg p-3"
            >
              {isAnalyzing ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-400"></div>
                </div>
              ) : (
                <p className="text-gray-300 whitespace-pre-wrap">{analysis}</p>
              )}
            </div>
          </div>
        )}
        {analysisError && <p className="mt-4 text-center text-red-400">{analysisError}</p>}
      </div>
    </ToolContainer>
  );
};

export default TextCorrector;