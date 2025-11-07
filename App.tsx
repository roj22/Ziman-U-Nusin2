import React, { useState, useCallback } from 'react';
import { Tool } from './types';
import MainMenu from './components/MainMenu';
import SpeechToText from './components/SpeechToText';
import TextCorrector from './components/TextCorrector';
import PdfAndImageConverter from './components/PdfAndImageConverter';
import Summarizer from './components/Summarizer';
import BackgroundRemover from './components/BackgroundRemover';
import ImageExpander from './components/ImageExpander';
import Translator from './components/Translator';
import NewsDrafter from './components/NewsDrafter';
import FormalLetterWriter from './components/FormalLetterWriter';
import ArticleWriter from './components/ArticleWriter';
import QuestionAndAnswer from './components/QuestionAndAnswer';
import VideoToText from './components/VideoToText';

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<Tool | null>(null);

  const handleSelectTool = useCallback((tool: Tool) => {
    setActiveTool(tool);
  }, []);

  const handleBack = useCallback(() => {
    setActiveTool(null);
  }, []);

  const renderActiveTool = () => {
    switch (activeTool) {
      case Tool.SpeechToText:
        return <SpeechToText onBack={handleBack} />;
      case Tool.VideoToText:
        return <VideoToText onBack={handleBack} />;
      case Tool.TextCorrection:
        return <TextCorrector onBack={handleBack} />;
      case Tool.Translation:
        return <Translator onBack={handleBack} />;
      case Tool.PdfConverter:
        return <PdfAndImageConverter onBack={handleBack} />;
      case Tool.Summarization:
        return <Summarizer onBack={handleBack} />;
      case Tool.BackgroundRemoval:
        return <BackgroundRemover onBack={handleBack} />;
      case Tool.ImageExpansion:
        return <ImageExpander onBack={handleBack} />;
      case Tool.NewsDrafting:
        return <NewsDrafter onBack={handleBack} />;
      case Tool.FormalLetterWriter:
        return <FormalLetterWriter onBack={handleBack} />;
      case Tool.ArticleWriter:
        return <ArticleWriter onBack={handleBack} />;
      case Tool.QuestionAndAnswer:
        return <QuestionAndAnswer onBack={handleBack} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-6 md:p-8">
      <main className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="font-katibeh text-6xl sm:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 pb-2 [-webkit-text-stroke:1px_white]">
            ئامرازی زمانەوانی
          </h1>
          <p className="text-gray-400 mt-4 text-lg">
            ئامرازێكە <strong className="font-bold text-gray-300">سەنگەر شنۆیی</strong> بە پاڵپشتی ژیریی دەستكرد بەرهەمی هێناوە
          </p>
          <div className="mt-6 max-w-xs mx-auto">
            <div className="h-px bg-gray-700"></div>
            <div className="h-px bg-gray-700 mt-1"></div>
          </div>
        </header>
        
        <MainMenu onSelectTool={handleSelectTool} />

        <div className="mt-8">
          {activeTool !== null && renderActiveTool()}
        </div>
      </main>
    </div>
  );
};

export default App;