import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function DashboardCard({ title, description, icon: Icon, to, color = 'emerald', buttonLabel = 'Open', delay = 0 }) {
  const colorMap = {
    emerald: {
      bg: 'from-emerald-400 to-teal-500',
      badge: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300',
      btn: 'bg-emerald-500 hover:bg-emerald-600 focus:ring-emerald-300',
      glow: 'hover:shadow-emerald-200 dark:hover:shadow-emerald-900/30',
    },
    blue: {
      bg: 'from-blue-400 to-indigo-500',
      badge: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
      btn: 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-300',
      glow: 'hover:shadow-blue-200 dark:hover:shadow-blue-900/30',
    },
    red: {
      bg: 'from-red-400 to-rose-500',
      badge: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300',
      btn: 'bg-red-500 hover:bg-red-600 focus:ring-red-300',
      glow: 'hover:shadow-red-200 dark:hover:shadow-red-900/30',
    },
    purple: {
      bg: 'from-purple-400 to-violet-500',
      badge: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300',
      btn: 'bg-purple-500 hover:bg-purple-600 focus:ring-purple-300',
      glow: 'hover:shadow-purple-200 dark:hover:shadow-purple-900/30',
    },
    orange: {
      bg: 'from-orange-400 to-amber-500',
      badge: 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300',
      btn: 'bg-orange-500 hover:bg-orange-600 focus:ring-orange-300',
      glow: 'hover:shadow-orange-200 dark:hover:shadow-orange-900/30',
    },
    cyan: {
      bg: 'from-cyan-400 to-sky-500',
      badge: 'bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300',
      btn: 'bg-cyan-500 hover:bg-cyan-600 focus:ring-cyan-300',
      glow: 'hover:shadow-cyan-200 dark:hover:shadow-cyan-900/30',
    },
  };
  const c = colorMap[color] || colorMap.emerald;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className={`glass-card p-6 flex flex-col gap-4 hover:shadow-2xl ${c.glow} transition-all duration-300 group dark:bg-gray-800/80`}
    >
      {/* Icon badge */}
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${c.bg} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="text-white text-2xl" />
      </div>

      {/* Content */}
      <div className="flex-1">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{description}</p>
      </div>

      {/* Button */}
      <Link
        to={to}
        className={`inline-flex items-center justify-center gap-2 ${c.btn} text-white font-semibold py-3 px-5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 text-sm`}
      >
        {buttonLabel}
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </motion.div>
  );
}
