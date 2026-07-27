import { motion } from 'framer-motion';
import { FaExclamationTriangle, FaPhoneAlt } from 'react-icons/fa';

export default function EmergencyCard({ title, number, color = 'red', icon: Icon = FaExclamationTriangle, description }) {
  const colorMap = {
    red: { bg: 'from-red-400 to-rose-600', ring: 'focus:ring-red-300', hover: 'hover:shadow-red-200' },
    blue: { bg: 'from-blue-400 to-indigo-600', ring: 'focus:ring-blue-300', hover: 'hover:shadow-blue-200' },
    orange: { bg: 'from-orange-400 to-amber-600', ring: 'focus:ring-orange-300', hover: 'hover:shadow-orange-200' },
    emerald: { bg: 'from-emerald-400 to-teal-600', ring: 'focus:ring-emerald-300', hover: 'hover:shadow-emerald-200' },
  };
  const c = colorMap[color] || colorMap.red;

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${c.bg} shadow-xl ${c.hover} transition-all duration-300 p-5`}
    >
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10" />
      <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-white/5" />

      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
            <Icon className="text-white text-xl" />
          </div>
          {number && (
            <span className="text-white/80 text-sm font-bold">{number}</span>
          )}
        </div>
        <h3 className="text-white font-bold text-lg mb-1">{title}</h3>
        {description && <p className="text-white/70 text-sm">{description}</p>}
        {number && (
          <a
            href={`tel:${number}`}
            className={`mt-3 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-lg transition-all focus:outline-none ${c.ring} focus:ring-4`}
            aria-label={`Call ${title}: ${number}`}
          >
            <FaPhoneAlt />
            Call {number}
          </a>
        )}
      </div>
    </motion.div>
  );
}
