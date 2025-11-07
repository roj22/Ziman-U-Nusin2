// Fix: Import Modality for use in image generation functions.
import { GoogleGenerativeAI, Modality } from "@google/generative-ai";
const getAiClient = () => {
  return new GoogleGenerativeAI({ apiKey: process.env.API_KEY }});};


const fileToGenerativePart = (base64: string, mimeType: string) => {
  return {
    inlineData: {
      data: base64,
      mimeType,
    },
  };
};

const kurdishOrthographyRule = "CRITICAL ORTHOGRAPHY RULE: You must strictly differentiate between the Kurdish letter 'ە' (ae vowel) and 'ه' (h consonant). The letter 'ە' is a standalone vowel and NEVER connects to the letter before or after it. The letter 'ه' is a consonant that connects to other letters as expected (e.g., in 'هاوار' or 'هەتاو'). Do not confuse them. For example, 'وشە' (word) is correct, not 'وشه'. Enforce this rule in all your responses.";

export const transcribeAudio = async (audioBase64: string, mimeType: string) => {
  const ai = getAiClient();
  const model = 'gemini-2.5-flash';
  const audioPart = fileToGenerativePart(audioBase64, mimeType);
  const prompt = `The audio is in Kurdish (Sorani). Transcribe it precisely into text using the Kurdish-Arabic alphabet. ${kurdishOrthographyRule}`;
  const response = await ai.models.generateContent({
      model,
      contents: { parts: [audioPart, { text: prompt }] },
  });
  return response.text;
};

// Fix: Add the missing transcribeVideo function to fix the import error in VideoToText.tsx.
export const transcribeVideo = async (videoBase64: string, mimeType: string) => {
  const ai = getAiClient();
  const model = 'gemini-2.5-flash';
  const videoPart = fileToGenerativePart(videoBase64, mimeType);
  const prompt = `This video contains speech in Kurdish (Sorani). Transcribe the audio from the video precisely into text using the Kurdish-Arabic alphabet. ${kurdishOrthographyRule}`;
  const response = await ai.models.generateContent({
      model,
      contents: { parts: [videoPart, { text: prompt }] },
  });
  return response.text;
};

export const transcribeForTranslation = async (audioBase64: string, mimeType: string, languageHint: string) => {
  const ai = getAiClient();
  const model = 'gemini-2.5-flash';
  const audioPart = fileToGenerativePart(audioBase64, mimeType);
  
  let promptText = '';
  if (languageHint === 'Auto Detect') {
    promptText = 'The following audio could be in any language. Please detect the language and transcribe it accurately.';
  } else if (languageHint === 'Kurdish (Sorani)') {
    promptText = `The audio is in Kurdish (Sorani). Transcribe it precisely into text using the Kurdish-Arabic alphabet. ${kurdishOrthographyRule}`;
  } else if (languageHint === 'Kurdish (Kurmanji)') {
    promptText = 'The audio is in Kurdish (Kurmanji). Transcribe it precisely into text using the Latin alphabet (Hawar script).';
  } else {
    promptText = `The audio is in ${languageHint}. Transcribe it precisely.`;
  }
  
  const response = await ai.models.generateContent({
      model,
      contents: { parts: [audioPart, { text: promptText }] },
  });
  return response.text;
};


export const correctText = async (text: string, customInstructions: string) => {
  const ai = getAiClient();
  const model = 'gemini-2.5-pro';
  const systemInstruction = `You are an expert in Kurdish (Sorani) grammar and spelling. Correct the user's text with high accuracy.
${kurdishOrthographyRule}
Only return the corrected text. Do not add any explanations, comments, or analysis.
If the user provides custom words or phrasing rules, adhere to them strictly.
${customInstructions ? `Custom rules: ${customInstructions}` : ''}`;

  const response = await ai.models.generateContent({
      model,
      contents: text,
      config: { systemInstruction },
  });
  return response.text;
};

export const correctSpellingOnly = async (text: string, customInstructions: string) => {
  const ai = getAiClient();
  const model = 'gemini-2.5-pro';
  const systemInstruction = `You are an expert in Kurdish (Sorani) spelling. Correct ONLY the spelling and typographical errors in the user's text. DO NOT change the grammar, sentence structure, or word choices. Preserve the original meaning and structure.
${kurdishOrthographyRule}
Only return the corrected text. Do not add any explanations, comments, or analysis.
${customInstructions ? `Custom rules: ${customInstructions}` : ''}`;

  const response = await ai.models.generateContent({
      model,
      contents: text,
      config: { systemInstruction },
  });
  return response.text;
};

export const correctTextWithCustomRules = async (text: string, rules: string) => {
  const ai = getAiClient();
  const model = 'gemini-2.5-pro';
  const systemInstruction = `You are a highly intelligent text editor specializing in Kurdish (Sorani).
A user has provided a text and a set of personal, custom rules for spelling and grammar.
Your task is to correct the user's text strictly and exclusively based on the custom rules they provide.
CRITICAL INSTRUCTION: You MUST prioritize the user's rules over any standard or conventional Kurdish spelling and grammar rules. If a user's rule contradicts standard orthography, you MUST follow the user's rule. However, you should still correctly apply the fundamental difference between 'ە' and 'ه' unless the user explicitly overrides it.
Do not make any other corrections that are not explicitly mentioned in the user's rules.
Only return the corrected text. Do not add any explanations, comments, or analysis.
${kurdishOrthographyRule}

User's custom rules:
---
${rules}
---`;

  const response = await ai.models.generateContent({
      model,
      contents: text,
      config: { systemInstruction },
  });
  return response.text;
};

export const analyzeCorrections = async (originalText: string, correctedText: string) => {
  const ai = getAiClient();
  const model = 'gemini-2.5-pro';
  const prompt = `You are a Kurdish (Sorani) language teacher. Your primary language of communication is Kurdish (Sorani) written in the Arabic script.
A user has provided an original text and a corrected version of it.
Your task is to provide a clear, helpful analysis of the corrections made.
CRITICAL INSTRUCTION: Your entire analysis MUST be written in Kurdish (Sorani) using the Arabic script. Do not use the Latin alphabet (Kurmanji).
Explain the grammatical errors, spelling mistakes, and stylistic improvements in a numbered list format.
${kurdishOrthographyRule} When explaining, if there are corrections related to 'ە' and 'ه', clearly explain why the change was necessary based on this rule.
Keep the explanation simple, easy to understand, and write it in Sorani.

**Original Text:**
---
${originalText}
---

**Corrected Text:**
---
${correctedText}
---

**Analysis of Corrections (in Kurdish Sorani):**/`;
  
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
  });
  return response.text;
};

export const extractTextFromImage = async (imageBase64: string, mimeType: string) => {
  const ai = getAiClient();
  const model = 'gemini-2.5-flash';
  const imagePart = fileToGenerativePart(imageBase64, mimeType);
  const prompt = { text: `Extract all text from this image. The text is in Kurdish (Sorani) using the Arabic script. Ensure all specific Kurdish characters (like ێ, ۆ, ڕ, ڵ, ڤ) are correctly identified and preserved. ${kurdishOrthographyRule}` };

  const response = await ai.models.generateContent({
      model,
      contents: { parts: [imagePart, prompt] },
  });
  return response.text;
};

export const extractTextFromPdfPages = async (pageImages: string[]) => {
  const ai = getAiClient();
  const model = 'gemini-2.5-flash';
  const imageParts = pageImages.map(base64 => fileToGenerativePart(base64, 'image/jpeg'));
  const prompt = { text: `These are sequential pages from a document written in Kurdish (Sorani) using the Arabic script. Extract all text from them with high precision, ensuring that all specific Kurdish characters (like ێ, ۆ, ڕ, ڵ, ڤ) are correctly identified and preserved. Combine the extracted text into a single, continuous block, maintaining the original order. ${kurdishOrthographyRule}` };
  
  const response = await ai.models.generateContent({
    model,
    contents: { parts: [...imageParts, prompt] },
  });
  return response.text;
};

export const summarizeText = async (text: string, level: 'short' | 'medium' | 'long') => {
  const ai = getAiClient();
  const model = 'gemini-2.5-flash';
  const lengthInstruction = {
    short: 'Provide a very brief, one-paragraph summary.',
    medium: 'Provide a detailed, multi-paragraph summary.',
    long: 'Provide a comprehensive summary, capturing all key points and nuances.'
  }[level];

  const systemInstruction = `You are an expert text summarizer. Your task is to summarize the user's text.
CRITICAL INSTRUCTION: The summary MUST be in the same language as the original text provided by the user. Do not translate it.
If the language is Kurdish (Sorani), you must follow this rule: ${kurdishOrthographyRule}
Based on the user's request, ${lengthInstruction}`;

  const response = await ai.models.generateContent({
    model,
    contents: text,
    config: {
      systemInstruction,
    },
  });
  return response.text;
};

export const draftNewsArticle = async (notes: string) => {
  const ai = getAiClient();
  const model = 'gemini-2.5-pro';
  const systemInstruction = `You are a professional Kurdish (Sorani) journalist.
Your task is to take the user's notes and draft a complete, well-structured news article.
The article must be in Kurdish (Sorani).
${kurdishOrthographyRule}
Ensure the article includes the following:
1.  A compelling and concise headline (ناونیشان).
2.  A strong lead paragraph (پێشەکی) that summarizes the most important information (who, what, when, where, why).
3.  A detailed body (ناوەڕۆک) that expands on the lead, providing more details, context, and background information.
4.  Maintain a neutral, objective, and professional tone throughout the article.

Only return the drafted news article. Do not add any extra comments, explanations, or titles like "News Article:".`;

  const response = await ai.models.generateContent({
      model,
      contents: notes,
      config: { systemInstruction },
  });
  return response.text;
};

export const draftLetter = async (recipient: string, body: string, tone: 'official' | 'friendly') => {
  const ai = getAiClient();
  const model = 'gemini-2.5-pro';

  const toneInstruction = tone === 'official'
    ? 'Draft a formal, official letter. It should include a proper salutation, a clear body explaining the request, and a formal closing. Ensure the language is respectful and professional.'
    : 'Draft a friendly, informal letter. It should have a warm and friendly tone, with a suitable greeting and closing.';

  const systemInstruction = `You are an expert secretary skilled in writing professional and friendly letters in Kurdish (Sorani).
Your task is to draft a letter based on the user's input. The letter must be well-structured, polite, and appropriate for the selected tone.
The entire letter must be in Kurdish (Sorani).
${kurdishOrthographyRule}
${toneInstruction}
Only return the drafted letter. Do not add any extra comments, explanations, or titles.`;
  
  const userContent = `Recipient: ${recipient}\n\nSubject/Request: ${body}`;

  const response = await ai.models.generateContent({
      model,
      contents: userContent,
      config: { systemInstruction },
  });
  return response.text;
};


export const removeBackground = async (imageBase64: string, mimeType: string) => {
  const ai = getAiClient();
  const model = 'gemini-2.5-flash-image';
  const imagePart = fileToGenerativePart(imageBase64, mimeType);

  const response = await ai.models.generateContent({
    model,
    contents: { parts: [{text: "Remove the background from this image. The new background should be transparent."}, imagePart] },
    config: {
        // Fix: Use Modality.IMAGE enum as per guidelines.
        responseModalities: [Modality.IMAGE],
    },
  });
  
  // Fix: Iterate over parts to find inlineData, as the response may contain multiple parts.
  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
        return part.inlineData.data;
    }
  }
  throw new Error("Could not remove background from the image.");
};

export const expandImage = async (imageBase64: string, mimeType: string, direction: string) => {
  const ai = getAiClient();
  const model = 'gemini-2.5-flash-image';
  const imagePart = fileToGenerativePart(imageBase64, mimeType);
  const prompt = `Expand this image to the ${direction}, continuing the scene naturally. This is also called outpainting.`;

  const response = await ai.models.generateContent({
    model,
    contents: { parts: [{text: prompt}, imagePart] },
    config: {
        // Fix: Use Modality.IMAGE enum as per guidelines.
        responseModalities: [Modality.IMAGE],
    },
  });
  
  // Fix: Iterate over parts to find inlineData, as the response may contain multiple parts.
  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
        return part.inlineData.data;
    }
  }
  throw new Error("Could not expand the image.");
};

export const translateText = async (text: string, sourceLang: string, targetLang: string) => {
  const ai = getAiClient();
  const model = 'gemini-2.5-pro';
  
  let rules = '';
  if (targetLang === 'Kurdish (Sorani)') {
    rules = `If the target language is Kurdish (Sorani), apply this rule: ${kurdishOrthographyRule}.`;
  } else if (targetLang === 'Kurdish (Kurmanji)') {
    rules = 'If the target language is Kurdish (Kurmanji), the translation MUST be in the Latin alphabet (Hawar script).';
  }

  const prompt = sourceLang === 'Auto Detect'
    ? `Detect the language of the following text and translate it to ${targetLang}. ${rules} Only return the translated text, without any additional explanation or the detected language name.\n\nTEXT:\n${text}`
    : `Translate the following text from ${sourceLang} to ${targetLang}. ${rules} Only return the translated text, without any additional explanation.\n\nTEXT:\n${text}`;

  const response = await ai.models.generateContent({
      model,
      contents: prompt,
  });
  return response.text;
};

export const draftArticle = async (title: string, type: 'essay' | 'literary' | 'research') => {
  const ai = getAiClient();
  const model = 'gemini-2.5-pro';

  let typeInstruction = '';
  switch (type) {
    case 'essay':
      typeInstruction = 'You are an expert columnist. Write a compelling essay (وتار). The topic could be political, economic, or social. The tone should be formal and analytical.';
      break;
    case 'literary':
      typeInstruction = 'You are a master of Kurdish literature. Write a beautiful and eloquent literary piece (بابەتی ئەدەبی). Use rich vocabulary, metaphors, and a poetic style. You can draw inspiration from classic and modern Kurdish literature.';
      break;
    case 'research':
      typeInstruction = 'You are a meticulous researcher and analyst. Write a well-structured research and analysis piece (توێژینەوە و لێکۆڵینەوە). It should be objective, data-driven (if applicable), and present a clear, logical argument. Structure it with an introduction, body, and conclusion.';
      break;
  }

  const systemInstruction = `Your task is to write an article in Kurdish (Sorani) based on the user's title and requested type.
${kurdishOrthographyRule}
${typeInstruction}
The final output should be only the article itself, starting with the title provided by the user as a headline. Do not add any extra comments, introductions, or explanations.`;
  
  const userContent = `Title: ${title}`;

  const response = await ai.models.generateContent({
      model,
      contents: userContent,
      config: { systemInstruction },
  });
  return response.text;
};

export const getAnswer = async (question: string) => {
  const ai = getAiClient();
  const model = 'gemini-2.5-pro';
  
  const systemInstruction = `You are a knowledgeable and helpful assistant. Your main language for responding is Kurdish (Sorani) unless the user asks in another language.
  ${kurdishOrthographyRule}
  Provide a clear, detailed, and accurate answer to the user's question. Format the response for readability using markdown where appropriate (e.g., headings, lists, bold text).`;

  const response = await ai.models.generateContent({
      model,
      contents: question,
      config: { systemInstruction },
  });
  return response.text;
};
