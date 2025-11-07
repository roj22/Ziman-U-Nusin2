import React from 'react';

interface IntroductionProps {
  onClose: () => void;
}

const tools = [
  {
    name: "گۆڕینی دەنگ بەدەق",
    description: "ئەم ئامرازە یارمەتیت دەدات بۆ ئەوەی قسە و گفتوگۆکانت بگۆڕیت بە دەقی نووسراو. دەتوانیت دەنگی خۆت تۆمار بکەیت یان فایلێکی دەنگیی ئامادەکراو بەکاربهێنیت.",
  },
  {
    name: "گۆڕینی ڤیدیۆ بەدەق",
    description: "دەتوانیت هەر ڤیدیۆیەک کە قسەی تێدایە، دەقەکەی دەربهێنیت و بیکەیت بە نووسین.",
  },
  {
    name: "راستكردنەوەی دەق",
    description: "ئەم ئامرازە هەڵەکانی ڕێنووس و ڕێزمانی ناو دەقەکانت بۆ ڕاست دەکاتەوە. هەروەها دەتوانیت ڕێسای تایبەت بە خۆت دابنێیت بۆ پشکنین.",
  },
  {
    name: "وەرگێڕانی زمان",
    description: "دەق لە زمانێکەوە وەربگێڕە بۆ زمانێکی تر. پشتگیری لە چەندین زمانی جیاواز دەکات.",
  },
  {
    name: "كورتكردنەوەی بابەت",
    description: "بابەت و وتارە درێژەکانت بۆ کورت دەکاتەوە بەپێی ئارەزووی خۆت (کورت، ناوەند، یان درێژ) بەبێ ئەوەی مانا سەرەکییەکەی لەدەست بدات.",
  },
  {
    name: "پرسیار و زانیاری",
    description: "لێرە دەتوانیت هەر پرسیارێکت هەبێت بیکەیت و وەڵامێکی ورد و زانستی وەربگریتەوە لەسەر بابەتە جۆراوجۆرەکان.",
  },
  {
    name: "ئامادەكردنی هەواڵ",
    description: "تەنها چەند خاڵێک یان کورتەیەکی هەواڵەکەت بنووسە، ئەم ئامرازە بۆت دەکات بە هەواڵێکی کامل و ستانداردی ڕۆژنامەوانی.",
  },
  {
    name: "نووسینی نامە",
    description: "یارمەتیت دەدات بۆ نووسینی نامەی فەرمی یان دۆستانە بە شێوازێکی پرۆفیشناڵ و ڕێکوپێک.",
  },
  {
    name: "نووسینی بابەت",
    description: "ناونیشانی بابەتێک بنووسە، ئەم ئامرازە وتارێکی ئەدەبی، زانستی یان شیکاریی تەواوت بۆ دەنووسێت.",
  },
  {
    name: "گۆڕینی فایلی PDF",
    description: "دەقەکانی ناو فایلی PDF دەردەهێنێت و دەیکات بە فایلێکی Word کە بتوانیت دەستکاری بکەیت. هەروەها دەق لەناو وێنەش دەردەهێنێت.",
  },
  {
    name: "لابردنی باکگراوند",
    description: "باکگراوندی وێنەکانت بە شێوەیەکی خێرا و ئاسان لادەبات و وێنەیەکی بێ باکگراوندت دەداتێ.",
  },
  {
    name: "فراوانکردنی وێنە",
    description: "دەتوانیت قەبارەی وێنەکانت گەورەتر بکەیت و بە شێوەیەکی زیرەکانە بەشە بەتاڵەکان پڕ بکاتەوە.",
  },
];

const Introduction: React.FC<IntroductionProps> = ({ onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 md:p-8"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-teal-400">دەربارەی ئامرازی زمانەوانی</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="text-gray-300 space-y-6">
          <p className="leading-relaxed">
            ئەم پرۆگرامە کۆمەڵێک ئامرازی بەهێز و زیرەک لەخۆدەگرێت کە بە پشت بەستن بە ژیریی دەستکرد (AI) کاردەکەن بۆ یارمەتیدانی بەکارهێنەران لە بوارە جیاجیاکانی زمان و نووسین و مامەڵەکردن لەگەڵ میدیادا. ئامانج لەم پرۆگرامە ئاسانکردنی کارەکان و بەرزکردنەوەی کوالێتیی بەرهەمە نووسراو و بینراوەکانە.
          </p>

          <div className="border-t border-gray-700 pt-6">
            <h3 className="text-2xl font-semibold text-teal-300 mb-4">ناساندنی ئامرازەکان:</h3>
            <ul className="space-y-4">
              {tools.map((tool) => (
                <li key={tool.name} className="bg-gray-900/50 p-4 rounded-lg">
                  <h4 className="font-bold text-lg text-white mb-1">{tool.name}</h4>
                  <p className="text-gray-400">{tool.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Introduction;
