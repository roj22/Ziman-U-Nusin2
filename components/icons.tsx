import React from 'react';

const iconProps = {
  className: "w-5 h-5 mb-1 text-teal-400 group-hover:text-teal-300 transition-colors",
  strokeWidth: 1.5,
};

export const SpeechToTextIcon: React.FC = () => (
  <svg {...iconProps} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5a6 6 0 00-12 0v1.5a6 6 0 006 6z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75V18.75m0 0A3.75 3.75 0 0015.75 15v-1.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75V18.75m0 0A3.75 3.75 0 018.25 15v-1.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5V12.75m0-4.5V5.25A2.25 2.25 0 0114.25 3h.008a2.25 2.25 0 012.242 2.25v.008a2.25 2.25 0 01-2.25 2.25H12z" />
  </svg>
);

export const VideoToTextIcon: React.FC = () => (
  <svg {...iconProps} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

export const TextCorrectionIcon: React.FC = () => (
  <svg {...iconProps} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
  </svg>
);

export const PdfConverterIcon: React.FC = () => (
    <svg {...iconProps} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 21v-4.5a2.25 2.25 0 00-2.25-2.25h-4.5a2.25 2.25 0 00-2.25 2.25V21m3.75-9v-4.5a2.25 2.25 0 012.25-2.25h1.5a2.25 2.25 0 012.25 2.25V12m-6-.75h6" />
    </svg>
);

export const SummarizationIcon: React.FC = () => (
  <svg {...iconProps} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12H12m-8.25 5.25h8.25" />
  </svg>
);

const imageIconProps = {
  className: "w-5 h-5 mb-1 text-red-400 group-hover:text-red-300 transition-colors",
  strokeWidth: 1.5,
};

export const BackgroundRemovalIcon: React.FC = () => (
  <svg {...imageIconProps} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M8.25 21v-1.5m1.875-1.875l-1.25-1.25m1.25 1.25l1.25 1.25m-1.25-1.25l1.25-1.25m-1.25 1.25l-1.25 1.25M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
  </svg>
);

export const ImageExpansionIcon: React.FC = () => (
  <svg {...imageIconProps} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0l6 6m11.25 0v-4.5m0 4.5h-4.5m4.5 0l-6-6m-3 18v-4.5m0 4.5h4.5m-4.5 0l6-6m-12 6h4.5m0 0v-4.5m0 4.5l-6-6" />
  </svg>
);

export const TranslationIcon: React.FC = () => (
  <svg {...iconProps} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C13.18 7.061 14.287 7 15 7a48.483 48.483 0 00-6-.372m-3 0c.621 0 1.242.02 1.864.057L9 5.25M3 18.75l.41-1.39a.75.75 0 011.08.514l.81 2.836a.75.75 0 001.44-.12l.9-5.114a.75.75 0 011.08-.514l.41 1.39" />
  </svg>
);

export const NewsDraftingIcon: React.FC = () => (
  <svg {...iconProps} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

export const FormalLetterIcon: React.FC = () => (
  <svg {...iconProps} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);

export const ArticleWriterIcon: React.FC = () => (
    <svg {...iconProps} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m-1.5 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 19.5l-4.243 1.273 1.273-4.243L16.862 4.487z" />
    </svg>
);

export const QuestionAndAnswerIcon: React.FC = () => (
  <svg {...iconProps} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
  </svg>
);

export const InformationCircleIcon: React.FC = () => (
  <svg className="w-5 h-5 text-teal-400 group-hover:text-teal-300 transition-colors" strokeWidth={1.5} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
  </svg>
);


const directionIconProps = {
  className: "w-6 h-6 text-gray-200",
};

export const ArrowUpIcon: React.FC = () => (
    <svg {...directionIconProps} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    </svg>
);

export const ArrowDownIcon: React.FC = () => (
    <svg {...directionIconProps} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);

export const ArrowLeftIcon: React.FC = () => (
    <svg {...directionIconProps} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
);

export const ArrowRightIcon: React.FC = () => (
    <svg {...directionIconProps} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
);

export const ArrowsExpandIcon: React.FC = () => (
    <svg {...directionIconProps} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4h4m12 4V4h-4M4 16v4h4m12-4v4h-4" />
    </svg>
);
