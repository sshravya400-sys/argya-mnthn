// Text-to-Speech service — supports all 11 Indian language locales
import { langToLocale } from '../context/LanguageContext';

export function isTTSSupported() {
  return 'speechSynthesis' in window;
}

/**
 * Speak text aloud.
 * @param {string} text  - Text to speak
 * @param {object} opts  - { language, rate, pitch, volume, onEnd }
 */
export function speak(text, { language = 'en', rate = 0.9, pitch = 1, volume = 1, onEnd } = {}) {
  if (!isTTSSupported() || !text) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang   = langToLocale[language] || 'en-IN';
  utterance.rate   = rate;
  utterance.pitch  = pitch;
  utterance.volume = volume;
  if (onEnd) utterance.onend = onEnd;
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if (isTTSSupported()) window.speechSynthesis.cancel();
}

export function isSpeaking() {
  return isTTSSupported() && window.speechSynthesis.speaking;
}
