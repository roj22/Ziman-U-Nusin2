import React from 'react';
import { Tool } from '../types';
import {
  SpeechToTextIcon,
  TextCorrectionIcon,
  PdfConverterIcon,
  SummarizationIcon,
  BackgroundRemovalIcon,
  ImageExpansionIcon,
  TranslationIcon,
  NewsDraftingIcon,
  FormalLetterIcon,
  ArticleWriterIcon,
  QuestionAndAnswerIcon,
  VideoToTextIcon,
} from './icons';

interface MainMenuProps {
  onSelectTool: (tool: Tool) => void;
}

const allTools = [
  { id: Tool.SpeechToText, name: 'گۆڕینی دەنگ بەدەق', icon: <SpeechToTextIcon /> },
  { id: Tool.VideoToText, name: 'گۆڕینی ڤیدیۆ بەدەق', icon: <VideoToTextIcon /> },
  { id: Tool.TextCorrection, name: 'راستكردنەوەی دەق', icon: <TextCorrectionIcon /> },
  { id: Tool.Translation, name: 'وەرگێڕانی زمان', icon: <TranslationIcon /> },
  { id: Tool.Summarization, name: 'كورتكردنەوەی بابەت', icon: <SummarizationIcon /> },
  { id: Tool.QuestionAndAnswer, name: 'پرسیار و زانیاری', icon: <QuestionAndAnswerIcon /> },
  { id: Tool.NewsDrafting, name: 'داڕشتنەوەی هەواڵ', icon: <NewsDraftingIcon /> },
  { id: Tool.FormalLetterWriter, name: 'نووسینی نامە', icon: <FormalLetterIcon /> },
  { id: Tool.ArticleWriter, name: 'نووسینی بابەت', icon: <ArticleWriterIcon /> },
  { id: Tool.PdfConverter, name: 'گۆڕینی فایلی PDF', icon: <PdfConverterIcon /> },
  { id: Tool.BackgroundRemoval, name: 'لابردنی باکگراوند', icon: <BackgroundRemovalIcon /> },
  { id: Tool.ImageExpansion, name: 'فراوانکردنی وێنە', icon: <ImageExpansionIcon /> },
];


const MainMenu: React.FC<MainMenuProps> = ({ onSelectTool }) => {
  return (
    <div className="w-full flex flex-col items-center gap-8">
      <div className="w-full">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {allTools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => onSelectTool(tool.id)}
              className="group bg-gray-800/50 hover:bg-gray-700/60 p-2 rounded-xl shadow-lg hover:shadow-teal-500/10 transition-all duration-300 ease-in-out transform hover:-translate-y-1 flex flex-col items-center text-center"
            >
              {tool.icon}
              <h2 className="text-sm font-semibold text-gray-200 h-10 flex items-center justify-center">{tool.name}</h2>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainMenu;