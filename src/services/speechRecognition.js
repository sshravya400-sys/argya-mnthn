// Speech Recognition Service — supports all 11 Indian language locales
import { langToLocale } from '../context/LanguageContext';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export function isSpeechRecognitionSupported() {
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export function createSpeechRecognition({ language = 'en', onResult, onError, onStart, onEnd }) {
  if (!isSpeechRecognitionSupported()) {
    console.warn('Speech Recognition not supported in this browser.');
    return null;
  }

  const recognition = new SpeechRecognition();
  // Map app language code → BCP-47 locale supported by the Web Speech API
  recognition.lang = langToLocale[language] || 'en-IN';
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;
  recognition.continuous = false;

  recognition.onstart  = () => { if (onStart) onStart(); };
  recognition.onend    = () => { if (onEnd)   onEnd();   };
  recognition.onerror  = (e) => { if (onError) onError(e.error); };

  recognition.onresult = (event) => {
    let finalTranscript = '';
    let interimTranscript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const text = event.results[i][0].transcript;
      if (event.results[i].isFinal) finalTranscript += text;
      else interimTranscript += text;
    }
    if (onResult) onResult({ final: finalTranscript, interim: interimTranscript });
  };

  return recognition;
}
