import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaHome, FaStethoscope, FaPills, FaFolder, FaExclamationTriangle,
  FaCog, FaInfoCircle, FaBars, FaTimes, FaMoon, FaSun, FaHeartbeat,
  FaUserMd,
} from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import OfflineStatus from './OfflineStatus';

const navItems = [
  { path: '/',                  key: 'home',            icon: FaHome               },
  { path: '/symptom-checker',   key: 'symptomChecker',  icon: FaStethoscope        },
  { path: '/nearby-doctors',    key: 'nearbyDoctors',   icon: FaUserMd             },
  { path: '/medicine-reminder', key: 'medicineReminder',icon: FaPills              },
  { path: '/health-locker',     key: 'healthLocker',    icon: FaFolder             },
  { path: '/emergency',         key: 'emergency',       icon: FaExclamationTriangle},
  { path: '/settings',          key: 'settings',        icon: FaCog                },
  { path: '/about',             key: 'about',           icon: FaInfoCircle         },
];

// First 5 items shown in desktop nav bar (rest accessible via menu)
const DESKTOP_MAIN = navItems.slice(0, 5);

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" aria-label="MediVerse Home">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-md group-hover:shadow-emerald-300 transition-shadow">
              <FaHeartbeat className="text-white text-lg" />
            </div>
            <span className="text-xl font-black text-gradient hidden sm:block">{t('appName')}</span>
          </Link>

          {/* Desktop Nav — first 5 items */}
          <div className="hidden lg:flex items-center gap-1">
            {DESKTOP_MAIN.map(({ path, key, icon: Icon }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="text-base" />
                  <span>{t(key)}</span>
                </Link>
              );
            })}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <OfflineStatus compact />
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <FaSun className="text-amber-400" /> : <FaMoon className="text-indigo-600" />}
            </button>
            <Link
              to="/settings"
              className="hidden lg:flex p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Settings"
            >
              <FaCog />
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              aria-label="Menu"
            >
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu — all items */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden"
          >
            <div className="px-4 py-3 grid grid-cols-2 gap-2">
              {navItems.map(({ path, key, icon: Icon }) => {
                const isActive = location.pathname === path;
                return (
                  <Link
                    key={path}
                    to={path}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="text-base" />
                    <span>{t(key)}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
