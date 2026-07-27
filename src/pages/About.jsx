import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FaHeartbeat, FaShieldAlt, FaWifi, FaVolumeUp, FaUsers,
  FaCode, FaGithub, FaArrowRight, FaCheckCircle
} from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

const features = [
  { icon: FaShieldAlt, title: 'Offline First', desc: 'Works without internet. All data stays on your device.', color: 'from-emerald-400 to-teal-500' },
  { icon: FaVolumeUp, title: 'Voice Guided', desc: 'Speak and listen — perfect for low-literacy users.', color: 'from-blue-400 to-indigo-500' },
  { icon: FaUsers, title: 'Rural Focused', desc: 'Designed for communities with limited healthcare access.', color: 'from-purple-400 to-violet-500' },
  { icon: FaWifi, title: 'Sync Ready', desc: 'When online, data can sync to cloud seamlessly.', color: 'from-cyan-400 to-sky-500' },
];

const techStack = [
  'React 18 + Vite', 'Tailwind CSS', 'Framer Motion', 'React Router DOM',
  'Web Speech API', 'Speech Synthesis API', 'LocalStorage', 'Context API',
];

const milestones = [
  'AI Symptom Checker with voice input',
  'Offline-first architecture with LocalStorage',
  'Multilingual support (English & Kannada)',
  'Emergency services with First Aid guide',
  'Digital Health Locker for medical records',
  'Medicine reminders with smart scheduling',
];

export default function About() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-2xl mb-6 floating">
            <FaHeartbeat className="text-white text-5xl" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
            About <span className="text-gradient">MediVerse</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
            {t('aboutDesc')} Built to bridge the healthcare gap in India's rural communities through technology.
          </p>
        </motion.div>

        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card dark:bg-gray-800/80 p-8 text-center bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800"
        >
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-4">🎯 Our Mission</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed max-w-xl mx-auto">
            To make quality healthcare guidance accessible to every person in rural India, regardless of internet connectivity, literacy level, or language barriers. We believe healthcare is a right, not a privilege.
          </p>
        </motion.div>

        {/* Features */}
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 text-center">Key Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={feat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                  className="glass-card dark:bg-gray-800/80 p-6 flex gap-4"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.color} flex items-center justify-center shadow-md flex-shrink-0`}>
                    <Icon className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">{feat.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{feat.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* What's Included */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card dark:bg-gray-800/80 p-8"
        >
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">✅ What's Included</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {milestones.map((m, i) => (
              <div key={i} className="flex items-start gap-3">
                <FaCheckCircle className="text-emerald-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300 text-sm">{m}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass-card dark:bg-gray-800/80 p-8"
        >
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <FaCode className="text-blue-500" /> Technology Stack
          </h2>
          <div className="flex flex-wrap gap-3">
            {techStack.map(tech => (
              <span
                key={tech}
                className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-xl text-sm font-semibold border border-blue-200 dark:border-blue-800"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-6 py-3 rounded-full font-semibold">
            <FaHeartbeat /> {t('version')}
          </div>
          <p className="text-gray-500 dark:text-gray-400">{t('madeWith')}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/" className="btn-primary flex items-center gap-2">
              Get Started <FaArrowRight />
            </Link>
            <Link to="/emergency" className="btn-danger flex items-center gap-2">
              Emergency <FaArrowRight />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
