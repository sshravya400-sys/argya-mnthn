import { Link } from 'react-router-dom';
import { FaHeartbeat, FaPhoneAlt, FaEnvelope, FaGithub, FaShieldAlt } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center">
                <FaHeartbeat className="text-white text-lg" />
              </div>
              <span className="text-xl font-black text-white">{t('appName')}</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">{t('tagline')}</p>
            <div className="flex items-center gap-1 mt-3 text-emerald-400 text-sm font-medium">
              <FaShieldAlt />
              <span>Offline-First & Secure</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Quick Access</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { path: '/', label: t('home') },
                { path: '/symptom-checker', label: t('symptomChecker') },
                { path: '/medicine-reminder', label: t('medicineReminder') },
                { path: '/health-locker', label: t('healthLocker') },
                { path: '/emergency', label: t('emergency') },
                { path: '/about', label: t('about') },
              ].map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  className="text-sm text-gray-400 hover:text-emerald-400 transition-colors duration-200"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Emergency Info */}
          <div>
            <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Emergency</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <FaPhoneAlt className="text-red-400" />
                <span className="text-gray-400">Ambulance:</span>
                <a href="tel:108" className="text-white font-bold hover:text-emerald-400 transition-colors">108</a>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FaPhoneAlt className="text-blue-400" />
                <span className="text-gray-400">Police:</span>
                <a href="tel:100" className="text-white font-bold hover:text-emerald-400 transition-colors">100</a>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FaPhoneAlt className="text-orange-400" />
                <span className="text-gray-400">Fire:</span>
                <a href="tel:101" className="text-white font-bold hover:text-emerald-400 transition-colors">101</a>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FaPhoneAlt className="text-emerald-400" />
                <span className="text-gray-400">Health Helpline:</span>
                <a href="tel:104" className="text-white font-bold hover:text-emerald-400 transition-colors">104</a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">{t('madeWith')}</p>
          <p className="text-xs text-gray-500">{t('version')} • All data stored locally on your device</p>
        </div>
      </div>
    </footer>
  );
}
