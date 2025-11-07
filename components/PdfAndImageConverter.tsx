
import React, { useState } from 'react';
// import { Document, Packer, Paragraph, TextRun } from 'docx';
import ToolContainer from './ToolContainer';
import { extractTextFromImage, extractTextFromPdfPages } from '../services/geminiService';
import { fileToBase64 } from '../utils/fileUtils';

declare const pdfjsLib: any;

interface PdfAndImageConverterProps {
  onBack: () => void;
}

const PdfAndImageConverter: React.FC<PdfAndImageConverterProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'pdf' | 'image'>('pdf');
  
  // PDF State
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageRange, setPageRange] = useState('');
  const [extractedText, setExtractedText] = useState('');

  // Image State
  const [image, setImage] = useState<{ src: string, file: File } | null>(null);

  // Common State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const clearState = () => {
    setError('');
    setExtractedText('');
    setIsLoading(false);
  };

  const handlePdfUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      clearState();
      setPdfFile(file);
      setNumPages(null);
      setIsLoading(true);

      try {
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument(arrayBuffer);
        const pdf = await loadingTask.promise;
        setNumPages(pdf.numPages);
        setPageRange(`1-${pdf.numPages}`);
      } catch (err) {
        console.error("Error loading PDF:", err);
        setError("فایلە PDFکە ناتوانرێت بخوێنرێتەوە.");
        setPdfFile(null);
      } finally {
        setIsLoading(false);
      }
    } else if (file) {
      setError("تکایە تەنها فایلی PDF هەڵبژێرە.");
    }
  };

  const parsePageRange = (rangeStr: string, maxPages: number): number[] | null => {
    const trimmed = rangeStr.trim();
    if (!/^\d+-\d+$/.test(trimmed)) return null;

    const [start, end] = trimmed.split('-').map(s => parseInt(s, 10));
    if (isNaN(start) || isNaN(end) || start < 1 || end > maxPages || start > end) {
      return null;
    }
    const pages: number[] = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const handleExtractFromPdf = async () => {
    if (!pdfFile || !numPages) return;
    
    const pagesToProcess = parsePageRange(pageRange, numPages);
    if (!pagesToProcess) {
      setError(`لاپەڕەی نادروست. تکایە ژمارەیەک لەنێوان 1 و ${numPages} بەم شێوەیە بنووسە: 1-10`);
      return;
    }
    
    setIsLoading(true);
    setError('');
    setExtractedText('');

    try {
      const pageImages: string[] = [];
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;

      for (const pageNum of pagesToProcess) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 2.0 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) throw new Error('Could not get canvas context');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        await page.render({ canvasContext: context, viewport: viewport }).promise;
        pageImages.push(canvas.toDataURL('image/jpeg').split(',')[1]);
      }

      const result = await extractTextFromPdfPages(pageImages);
      setExtractedText(result);
    } catch (err) {
      console.error("Error processing PDF:", err);
      setError("هەڵەیەک ڕوویدا لەکاتی پرۆسێسکردنی PDF.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      clearState();
      setImage({ src: URL.createObjectURL(file), file });
    }
  };

  const handleExtractFromImage = async () => {
    if (!image) {
      setError('تکایە وێنەیەک هەڵبژێرە.');
      return;
    }
    setIsLoading(true);
    setError('');
    setExtractedText('');
    try {
      const base64 = await fileToBase64(image.file);
      const result = await extractTextFromImage(base64, image.file.type);
      setExtractedText(result);
    } catch (err) {
      console.error(err);
      setError('هەڵەیەک روویدا لە کاتی دەرھێنانی دەق.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadAsWord = () => {
    if (!extractedText) return;
  
    const paragraphs = extractedText.split('\n').map(line =>
      new Paragraph({
        children: [
          new TextRun({
            text: line,
            rightToLeft: true,
          }),
        ],
        bidirectional: true,
      })
    );
  
    const doc = new Document({
      sections: [{
        properties: {},
        children: paragraphs,
      }],
    });
  
// @ts-ignore
        Packer.toBlob(doc).then(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${pdfFile?.name.replace('.pdf', '') || 'document'}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  };

  return (
    <ToolContainer title="گۆڕینی فایل" onBack={onBack}>
      <div className="flex mb-4 border-b border-gray-600">
        <button onClick={() => setActiveTab('pdf')} className={`py-2 px-4 text-lg ${activeTab === 'pdf' ? 'border-b-2 border-teal-400 text-teal-400' : 'text-gray-400'}`}>گۆڕینی PDF</button>
        <button onClick={() => setActiveTab('image')} className={`py-2 px-4 text-lg ${activeTab === 'image' ? 'border-b-2 border-teal-400 text-teal-400' : 'text-gray-400'}`}>دەرهێنانی دەق لە وێنە</button>
      </div>
      
      {activeTab === 'pdf' && (
        <div className="flex flex-col items-center gap-6">
          <label className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg cursor-pointer transition-colors">
            <span>فایلێکی PDF هەڵبژێرە</span>
            <input type="file" className="hidden" accept="application/pdf" onChange={handlePdfUpload} />
          </label>
          
          {pdfFile && numPages && (
            <div className="text-center bg-gray-700/50 p-4 rounded-lg">
              <p>ناوی فایل: <span className="font-semibold">{pdfFile.name}</span></p>
              <p>کۆی لاپەڕەکان: <span className="font-semibold">{numPages}</span></p>
              <div className="mt-4">
                <label htmlFor="pageRange" className="block text-sm font-medium text-gray-300 mb-1">لاپەڕەکان دیاری بکە</label>
                <input
                  type="text"
                  id="pageRange"
                  value={pageRange}
                  onChange={(e) => setPageRange(e.target.value)}
                  className="bg-gray-900 border border-gray-600 rounded-lg p-2 text-center w-48 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="بۆ نموونە: 1-10"
                />
              </div>
            </div>
          )}

          <button onClick={handleExtractFromPdf} disabled={isLoading || !pdfFile} className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">
            {isLoading ? '...دەرهێنان' : 'دەقەکە لە PDF دەربهێنە'}
          </button>
        </div>
      )}

      {activeTab === 'image' && (
        <div className="flex flex-col items-center gap-6">
          {!image && (
            <label className="w-full max-w-md h-64 border-2 border-dashed border-gray-600 rounded-lg flex flex-col justify-center items-center cursor-pointer hover:bg-gray-700/50 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <span className="mt-2 font-semibold text-gray-300">وێنەیەک هەڵبژێرە</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
            </label>
          )}
          {image && (
            <div className="w-full max-w-md">
              <img src={image.src} alt="Uploaded" className="rounded-lg shadow-lg max-h-80 w-auto mx-auto" />
            </div>
          )}
          <button onClick={handleExtractFromImage} disabled={isLoading || !image} className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">
            {isLoading ? '...دەرھێنان' : 'دەقەکە لە وێنە دەربهێنە'}
          </button>
        </div>
      )}

      {error && <p className="mt-6 text-red-400 text-center">{error}</p>}
      {isLoading && (activeTab === 'pdf' || (activeTab === 'image' && isLoading)) && (
        <div className="mt-6 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-400"></div>
            <p className="mt-2 text-gray-300">
              {activeTab === 'pdf' ? '...پرۆسێسکردنی لاپەڕەکان، تکایە چاوەڕێ بکە' : '...لە حالەتی پرۆسەکردندایە'}
            </p>
        </div>
      )}

      {extractedText && (
        <div className="mt-6 bg-gray-900 p-4 rounded-lg w-full max-w-4xl">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-gray-200">دەقی دەرھێنراو:</h3>
            {activeTab === 'pdf' && (
              <button 
                onClick={handleDownloadAsWord}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                داگرتن وەک Word
              </button>
            )}
          </div>
          <textarea readOnly value={extractedText} className="w-full h-64 bg-gray-800 border border-gray-600 rounded-lg p-3 text-gray-300 whitespace-pre-wrap focus:outline-none" />
        </div>
      )}
    </ToolContainer>
  );
};

export default PdfAndImageConverter;
