// Translation service — local dictionary lookup with English fallback.
// To add a new language: add its translation object to LanguageContext.jsx
// then add it to the list below.

import { translations } from '../context/LanguageContext';

export function translate(key, language = 'en') {
  return translations[language]?.[key] || translations.en?.[key] || key;
}

/** Returns all supported languages. Add a new entry here to expose it in the UI. */
export function getAvailableLanguages() {
  return [
    { code: 'en',  label: 'English',   nativeLabel: 'English'    },
    { code: 'hi',  label: 'Hindi',     nativeLabel: 'हिन्दी'       },
    { code: 'kn',  label: 'Kannada',   nativeLabel: 'ಕನ್ನಡ'       },
    { code: 'ta',  label: 'Tamil',     nativeLabel: 'தமிழ்'       },
    { code: 'te',  label: 'Telugu',    nativeLabel: 'తెలుగు'      },
    { code: 'ml',  label: 'Malayalam', nativeLabel: 'മലയാളം'     },
    { code: 'mr',  label: 'Marathi',   nativeLabel: 'मराठी'       },
    { code: 'bn',  label: 'Bengali',   nativeLabel: 'বাংলা'       },
    { code: 'gu',  label: 'Gujarati',  nativeLabel: 'ગુજરાતી'     },
    { code: 'pa',  label: 'Punjabi',   nativeLabel: 'ਪੰਜਾਬੀ'      },
    { code: 'ur',  label: 'Urdu',      nativeLabel: 'اردو'        },
  ];
}
