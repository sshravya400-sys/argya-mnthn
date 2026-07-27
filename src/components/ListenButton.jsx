/**
 * ListenButton — reusable "🔊 Listen Again" button.
 * Stops any ongoing TTS, then speaks the provided text using the current language.
 * Only one voice plays at a time (stopSpeaking() before each new utterance).
 */
import { useState } from 'react';
import { FaVolumeUp, FaSpinner } from 'react-icons/fa';
import { speak, stopSpeaking } from '../services/textToSpeech';
import { useLanguage } from '../context/LanguageContext';

export default function ListenButton({ text, className = '' }) {
  const { language, t } = useLanguage();
  const [playing, setPlaying] = useState(false);

  const handleListen = () => {
    stopSpeaking();
    setPlaying(true);
    speak(text, {
      language,
      onEnd: () => setPlaying(false),
    });
  };

  if (!text) return null;

  return (
    <button
      onClick={handleListen}
      disabled={playing}
      aria-label={playing ? 'Speaking…' : t('listenAgain')}
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all
        ${playing
          ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700 cursor-not-allowed'
          : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/60 cursor-pointer'
        } ${className}`}
    >
      {playing
        ? <><FaSpinner className="animate-spin" /> Speaking…</>
        : <><FaVolumeUp /> {t('listenAgain')}</>
      }
    </button>
  );
}
