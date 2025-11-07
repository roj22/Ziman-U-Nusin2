import React, { useState } from 'react';
import ToolContainer from './ToolContainer';
import { expandImage } from '../services/geminiService';
import { fileToBase64 } from '../utils/fileUtils';
import { 
  ArrowUpIcon, 
  ArrowDownIcon, 
  ArrowLeftIcon, 
  ArrowRightIcon, 
  ArrowsExpandIcon 
} from './icons';

interface ImageExpanderProps {
  onBack: () => void;
}

const ImageExpander: React.FC<ImageExpanderProps> = ({ onBack }) => {
  const [image, setImage] = useState<{ src: string, file: File } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeDirection, setActiveDirection] = useState<string | null>(null);
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage({ src: URL.createObjectURL(file), file });
      setError('');
    }
  };

  const handleExpandImage = async (direction: string) => {
    if (!image) {
      setError('تکایە وێنەیەک هەڵبژێرە.');
      return;
    }
    setIsLoading(true);
    setActiveDirection(direction);
    setError('');
    try {
      const base64 = await fileToBase64(image.file);
      const resultBase64 = await expandImage(base64, image.file.type, direction);
      const newSrc = `data:image/png;base64,${resultBase64}`;
      const newFile = await (await fetch(newSrc)).blob();
      setImage({ src: newSrc, file: new File([newFile], "expanded.png", { type: "image/png" }) });

    } catch (err) {
      console.error(err);
      setError('هەڵەیەک روویدا لە کاتی فراوانکردنی وێنە.');
    } finally {
      setIsLoading(false);
      setActiveDirection(null);
    }
  };

  const renderButton = (direction: string, icon: React.ReactNode, isTeal = false) => (
    <button
      onClick={() => handleExpandImage(direction)}
      disabled={isLoading || !image}
      className={`col-span-1 p-3 rounded flex justify-center items-center transition-colors ${
        isTeal
          ? 'bg-teal-600 hover:bg-teal-700'
          : 'bg-gray-700 hover:bg-gray-600'
      } disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed`}
      aria-label={`Expand to the ${direction}`}
    >
      {isLoading && activeDirection === direction ? (
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
      ) : (
        icon
      )}
    </button>
  );

  return (
    <ToolContainer title="فراوانكردنی وێنە" onBack={onBack}>
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-4">
          <label className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg cursor-pointer transition-colors">
            <span>{image ? 'گۆڕینی وێنە' : 'هەڵبژاردنی وێنە'}</span>
            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
          </label>
          {image && !isLoading && (
            <a 
              href={image.src} 
              download="expanded-image.png" 
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              داگرتن
            </a>
          )}
        </div>

        <div className="w-full max-w-2xl min-h-[30rem] bg-gray-900 rounded-lg p-4 flex flex-col justify-center items-center">
            {image ? (
                <img src={image.src} alt="Current" className="rounded-lg shadow-lg max-h-96 w-auto" />
            ) : (
                <div className="w-full h-80 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">وێنەکەت لێرە پیشان دەدرێت</p>
                </div>
            )}
        </div>
        
        <div className="grid grid-cols-3 gap-2 w-48">
            <div/>
            {renderButton('top', <ArrowUpIcon />)}
            <div/>
            
            {renderButton('right', <ArrowRightIcon />)}
            {renderButton('all sides', <ArrowsExpandIcon />, true)}
            {renderButton('left', <ArrowLeftIcon />)}
            
            <div/>
            {renderButton('bottom', <ArrowDownIcon />)}
            <div/>
        </div>

        {error && <p className="mt-4 text-red-400">{error}</p>}
      </div>
    </ToolContainer>
  );
};

export default ImageExpander;