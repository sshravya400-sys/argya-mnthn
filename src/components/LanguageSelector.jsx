/**
 * LanguageSelector — displays all supported languages in a scrollable grid.
 * Selecting a language persists the choice and re-renders the entire UI.
 */
import { useLanguage } from '../context/LanguageContext';
import { getAvailableLanguages } from '../services/translationService';

const LANGUAGES = getAvailableLanguages();

export default function LanguageSelector({ showLabel = true, size = 'normal' }) {
  const { language, changeLanguage, t } = useLanguage();

  const btnBase = size === 'large'
    ? 'flex flex-col items-center gap-0.5 px-4 py-3 rounded-xl text-sm font-semibold border-2 transition-all focus:outline-none focus:ring-4 focus:ring-emerald-300'
    : 'flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg text-xs font-semibold border-2 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-300';

  return (
    <div>
      {showLabel && (
        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
          {t('language')}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        {LANGUAGES.map(({ code, nativeLabel, label }) => (
          <button
            key={code}
            onClick={() => changeLanguage(code)}
            aria-label={`Switch to ${label}`}
            className={`${btnBase} ${
              language === code
                ? 'bg-emerald-500 border-emerald-500 text-white shadow-md scale-105'
                : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 hover:border-emerald-400 hover:text-emerald-600'
            }`}
          >
            <span className="text-base leading-none">{nativeLabel}</span>
            <span className={`text-[10px] font-normal ${language === code ? 'text-emerald-100' : 'text-gray-400'}`}>
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
