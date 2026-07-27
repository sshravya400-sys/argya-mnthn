import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaCog, FaMoon, FaSun, FaFont, FaBell, FaGlobe, FaMicrophone,
  FaTrash, FaDownload, FaSave, FaShieldAlt
} from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from '../components/LanguageSelector';
import { getSettings, saveSettings } from '../services/offlineStorage';

const FONT_SIZES = [
  { key: 'small', label: 'Small', px: '14px' },
  { key: 'medium', label: 'Medium', px: '16px' },
  { key: 'large', label: 'Large', px: '18px' },
  { key: 'xlarge', label: 'X-Large', px: '20px' },
];

function SettingRow({ icon: Icon, title, description, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 py-4 border-b border-gray-100 dark:border-gray-700 last:border-0">
      <div className="flex items-start gap-3 flex-1">
        <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Icon className="text-gray-600 dark:text-gray-400" />
        </div>
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">{title}</p>
          {description && <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>}
        </div>
      </div>
      <div className="sm:flex-shrink-0">{children}</div>
    </div>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-300 ${
        checked ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
      }`}
    >
      <motion.div
        animate={{ x: checked ? 28 : 4 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-md"
      />
    </button>
  );
}

export default function Settings() {
  const { theme, setTheme, fontSize, setFontSize } = useTheme();
  const { t } = useLanguage();
  const [settings, setSettings] = useState({ voiceGuidance: true, notifications: true });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClearData = () => {
    if (window.confirm('This will clear ALL your saved data including health records, medicine reminders, and contacts. Are you sure?')) {
      const keysToKeep = ['mv_theme', 'mv_language', 'mv_fontSize'];
      const allKeys = Object.keys(localStorage).filter(k => k.startsWith('mv_') && !keysToKeep.includes(k));
      allKeys.forEach(k => localStorage.removeItem(k));
      alert('Data cleared. Your preferences have been kept.');
    }
  };

  const handleExport = () => {
    const data = {};
    Object.keys(localStorage).filter(k => k.startsWith('mv_')).forEach(k => {
      try { data[k] = JSON.parse(localStorage.getItem(k)); } catch { data[k] = localStorage.getItem(k); }
    });
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mediverse-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-3 py-1.5 rounded-full text-sm font-semibold mb-3">
            <FaCog /> {t('settings')}
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">{t('settingsTitle')}</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{t('settingsDesc')}</p>
        </motion.div>

        <div className="space-y-5">
          {/* Appearance */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card dark:bg-gray-800/80 p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FaMoon className="text-indigo-500" /> Appearance
            </h2>
            <SettingRow
              icon={theme === 'dark' ? FaMoon : FaSun}
              title={theme === 'dark' ? t('darkMode') : t('lightMode')}
              description="Choose how MediVerse looks on your device"
            >
              <div className="flex gap-2">
                {['light', 'dark'].map(mode => (
                  <button
                    key={mode}
                    onClick={() => setTheme(mode)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                      theme === mode
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-emerald-400'
                    }`}
                  >
                    {mode === 'light' ? <FaSun /> : <FaMoon />}
                    {mode === 'light' ? 'Light' : 'Dark'}
                  </button>
                ))}
              </div>
            </SettingRow>

            <SettingRow
              icon={FaFont}
              title={t('fontSize')}
              description="Adjust text size for better readability"
            >
              <div className="flex gap-2 flex-wrap">
                {FONT_SIZES.map(fs => (
                  <button
                    key={fs.key}
                    onClick={() => setFontSize(fs.key)}
                    className={`px-3 py-2 rounded-xl text-sm font-semibold border-2 transition-all focus:outline-none focus:ring-4 focus:ring-emerald-300 ${
                      fontSize === fs.key
                        ? 'bg-emerald-500 border-emerald-500 text-white shadow-md'
                        : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-emerald-400 bg-white dark:bg-gray-800'
                    }`}
                    style={{ fontSize: fs.px }}
                  >
                    {fs.label}
                  </button>
                ))}
              </div>
            </SettingRow>
          </motion.div>

          {/* Language */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card dark:bg-gray-800/80 p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FaGlobe className="text-blue-500" /> {t('language')}
            </h2>
            <LanguageSelector showLabel={false} size="large" />
            <p className="text-xs text-gray-400 mt-3">More languages (Hindi, Tamil, Telugu) coming soon.</p>
          </motion.div>

          {/* Accessibility & Features */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card dark:bg-gray-800/80 p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FaMicrophone className="text-emerald-500" /> Accessibility & Features
            </h2>
            <SettingRow
              icon={FaMicrophone}
              title={t('voiceGuidance')}
              description="Enable voice read-aloud for better accessibility"
            >
              <Toggle
                checked={settings.voiceGuidance}
                onChange={v => updateSetting('voiceGuidance', v)}
                label="Toggle voice guidance"
              />
            </SettingRow>
            <SettingRow
              icon={FaBell}
              title="Medicine Notifications"
              description="Remind you when it's time to take medicine"
            >
              <Toggle
                checked={settings.notifications}
                onChange={v => updateSetting('notifications', v)}
                label="Toggle notifications"
              />
            </SettingRow>
          </motion.div>

          {/* Data Management */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card dark:bg-gray-800/80 p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FaShieldAlt className="text-purple-500" /> Data & Privacy
            </h2>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-4">
              <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">🔒 All your data is stored only on this device. Nothing is sent to any server.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleExport}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-xl font-semibold text-sm transition-all shadow-md"
              >
                <FaDownload /> Export Data
              </button>
              <button
                onClick={handleClearData}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-xl font-semibold text-sm transition-all shadow-md"
              >
                <FaTrash /> Clear All Data
              </button>
            </div>
          </motion.div>

          {/* Save Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            onClick={handleSave}
            className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-lg shadow-xl transition-all ${
              saved
                ? 'bg-emerald-500 text-white'
                : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-emerald-300 hover:scale-[1.02]'
            }`}
          >
            <FaSave /> {saved ? '✓ Settings Saved!' : `${t('save')} Settings`}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
