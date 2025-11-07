
import React, { useState } from 'react';
import ToolContainer from './ToolContainer';
import { removeBackground } from '../services/geminiService';
import { fileToBase64 } from '../utils/fileUtils';

interface BackgroundRemoverProps {
  onBack: () => void;
}

const BackgroundRemover: React.FC<BackgroundRemoverProps> = ({ onBack }) => {
  const [originalImage, setOriginalImage] = useState<{ src: string, file: File } | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setOriginalImage({ src: URL.createObjectURL(file), file });
      setResultImage(null);
      setError('');
    }
  };

  const handleRemoveBackground = async () => {
    if (!originalImage) {
      setError('تکایە وێنەیەک هەڵبژێرە.');
      return;
    }
    setIsLoading(true);
    setError('');
    setResultImage(null);
    try {
      const base64 = await fileToBase64(originalImage.file);
      const resultBase64 = await removeBackground(base64, originalImage.file.type);
      setResultImage(`data:image/png;base64,${resultBase64}`);
    } catch (err) {
      console.error(err);
      setError('هەڵەیەک روویدا لە کاتی لابردنی باکگراوند.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ToolContainer title="لابردنی باكگراوندی وێنە" onBack={onBack}>
      <div className="flex flex-col items-center gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          <div className="flex flex-col items-center p-4 bg-gray-900 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">وێنەی سەرەکی</h3>
            {originalImage ? (
              <img src={originalImage.src} alt="Original" className="rounded-lg shadow-md max-h-80 w-auto" />
            ) : (
              <div className="w-full h-64 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">لێرە وێنە هەڵبژێرە</p>
              </div>
            )}
            <label className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg cursor-pointer transition-colors">
              <span>هەڵبژاردنی وێنە</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
            </label>
          </div>
          <div className="flex flex-col items-center p-4 bg-gray-900 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">ئەنجام</h3>
            <div className="w-full h-64 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center bg-repeat" style={{backgroundImage: `linear-gradient(45deg, #4a5568 25%, transparent 25%), linear-gradient(-45deg, #4a5568 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #4a5568 75%), linear-gradient(-45deg, transparent 75%, #4a5568 75%)`, backgroundSize: '20px 20px', backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px`'}}>
              {isLoading && <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-400"></div>}
              {resultImage && <img src={resultImage} alt="Result" className="max-h-64 w-auto" />}
            </div>
            {resultImage && (
                <a href={resultImage} download="background-removed.png" className="mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                داگرتن
                </a>
            )}
          </div>
        </div>

        <button
          onClick={handleRemoveBackground}
          disabled={isLoading || !originalImage}
          className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          {isLoading ? '...لابردن' : 'باکگراوندەکە لابە'}
        </button>
        {error && <p className="mt-4 text-red-400">{error}</p>}
      </div>
    </ToolContainer>
  );
};

export default BackgroundRemover;