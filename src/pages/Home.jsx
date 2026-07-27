import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FaStethoscope, FaMicrophone, FaPills, FaFolder,
  FaExclamationTriangle, FaCog, FaHeartbeat, FaShieldAlt,
  FaWifi, FaUserMd, FaArrowRight
} from 'react-icons/fa';
import DashboardCard from '../components/DashboardCard';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

const cards = [
  {
    key: 'symptomChecker',
    descKey: 'medicineCheckerDesc',
    icon: FaStethoscope,
    to: '/symptom-checker',
    color: 'blue',
    btnKey: 'checkSymptoms',
    delay: 0.1,
  },
  {
    key: 'voiceAssistantTitle',
    descKey: 'voiceAssistantDesc',
    icon: FaMicrophone,
    to: '/',
    color: 'emerald',
    btnKey: 'startVoice',
    delay: 0.15,
  },
  {
    key: 'medicineReminderTitle',
    descKey: 'medicineReminderDesc',
    icon: FaPills,
    to: '/medicine-reminder',
    color: 'purple',
    btnKey: 'addReminder',
    delay: 0.2,
  },
  {
    key: 'healthLockerTitle',
    descKey: 'healthLockerDesc',
    icon: FaFolder,
    to: '/health-locker',
    color: 'cyan',
    btnKey: 'viewRecords',
    delay: 0.25,
  },
  {
    key: 'emergencyTitle',
    descKey: 'emergencyDesc',
    icon: FaExclamationTriangle,
    to: '/emergency',
    color: 'red',
    btnKey: 'callHelp',
    delay: 0.3,
  },
  {
    key: 'settingsTitle',
    descKey: 'settingsDesc',
    icon: FaCog,
    to: '/settings',
    color: 'orange',
    btnKey: 'settings',
    delay: 0.35,
  },
];

const stats = [
  { icon: FaUserMd, value: '24/7', label: 'AI Health Support' },
  { icon: FaShieldAlt, value: '100%', label: 'Data Privacy' },
  { icon: FaWifi, value: 'Offline', label: 'First Ready' },
  { icon: FaHeartbeat, value: '∞', label: 'Health Tracking' },
];

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-16">
        {/* Background decorations */}
        <div className="absolute top-20 -left-20 w-72 h-72 rounded-full bg-emerald-200/40 dark:bg-emerald-900/20 blur-3xl" />
        <div className="absolute top-40 -right-20 w-96 h-96 rounded-full bg-blue-200/40 dark:bg-blue-900/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-50" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="space-y-6"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                AI-Powered Healthcare — Offline Ready
              </motion.div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight text-gray-900 dark:text-white">
                {t('welcome')}<br />
                <span className="text-gradient">{t('appName')}</span>
              </h1>

              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-lg leading-relaxed">
                {t('welcomeSubtitle')}. Voice-guided, multilingual, and built for communities where internet access is limited.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/symptom-checker" className="btn-primary flex items-center gap-2 text-base">
                  <FaStethoscope /> {t('checkSymptoms')}
                </Link>
                <Link to="/emergency" className="btn-danger flex items-center gap-2 text-base">
                  <FaExclamationTriangle /> {t('emergency')}
                </Link>
              </div>

              {/* Features pills */}
              <div className="flex flex-wrap gap-2 pt-2">
                {['🎤 Voice Guided', '🌐 Multilingual', '📶 Works Offline', '🔒 Private'].map(feat => (
                  <span key={feat} className="text-xs font-medium bg-white/60 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-full text-gray-600 dark:text-gray-400">
                    {feat}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Illustration */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative flex justify-center"
            >
              <div className="relative w-72 h-72 md:w-96 md:h-96">
                {/* Central circle */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
                  className="absolute inset-0 rounded-full border-2 border-dashed border-emerald-300 dark:border-emerald-700"
                />
                <div className="absolute inset-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 shadow-2xl flex items-center justify-center">
                  <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                    <FaHeartbeat className="text-white text-8xl md:text-9xl opacity-90" />
                  </motion.div>
                </div>
                {/* Orbiting icons */}
                {[
                  { icon: FaStethoscope, top: '5%', left: '50%', color: 'bg-blue-500' },
                  { icon: FaPills, top: '50%', right: '5%', color: 'bg-purple-500' },
                  { icon: FaFolder, bottom: '5%', left: '50%', color: 'bg-cyan-500' },
                  { icon: FaExclamationTriangle, top: '50%', left: '5%', color: 'bg-red-500' },
                ].map(({ icon: Icon, color, ...pos }, i) => (
                  <motion.div
                    key={i}
                    style={pos}
                    animate={{ y: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 2, delay: i * 0.5 }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-xl ${color} shadow-lg flex items-center justify-center`}
                  >
                    <Icon className="text-white text-lg" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map(({ icon: Icon, value, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center gap-2"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <Icon className="text-emerald-600 dark:text-emerald-400 text-xl" />
                </div>
                <div className="text-2xl font-black text-gray-900 dark:text-white">{value}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Cards */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="section-title mb-3">Healthcare Services</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            All essential healthcare tools available right here, even without internet connectivity.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map(card => (
            <DashboardCard
              key={card.key}
              title={t(card.key)}
              description={t(card.descKey)}
              icon={card.icon}
              to={card.to}
              color={card.color}
              buttonLabel={t(card.btnKey)}
              delay={card.delay}
            />
          ))}
        </div>
      </section>

      {/* Welcome Banner */}
      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-600 to-blue-600 p-8 md:p-12 text-white shadow-2xl"
          >
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10" />
            <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-white/5" />
            <div className="relative">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black mb-2">🏥 MediVerse for Everyone</h2>
                  <p className="text-white/80 max-w-lg">
                    Designed for rural communities with low internet connectivity. Works completely offline using your device's local storage.
                  </p>
                  <div className="flex flex-wrap gap-3 mt-4">
                    {['✅ Free Forever', '✅ No Login Required', '✅ Works Offline', '✅ Voice Friendly'].map(f => (
                      <span key={f} className="text-sm bg-white/20 px-3 py-1 rounded-full">{f}</span>
                    ))}
                  </div>
                </div>
                <Link
                  to="/about"
                  className="flex-shrink-0 flex items-center gap-2 bg-white text-emerald-700 font-bold px-6 py-3 rounded-2xl hover:shadow-xl hover:scale-105 transition-all"
                >
                  Learn More <FaArrowRight />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
