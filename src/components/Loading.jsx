import { motion } from 'framer-motion';
import { FaHeartbeat } from 'react-icons/fa';

export default function Loading({ message = 'Loading...' }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-gray-900">
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 1.2 }}
        className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-2xl mb-6"
      >
        <FaHeartbeat className="text-white text-4xl" />
      </motion.div>
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="text-gray-600 dark:text-gray-400 font-semibold text-lg"
      >
        {message}
      </motion.div>
      <div className="flex gap-2 mt-4">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className="w-3 h-3 rounded-full bg-emerald-500"
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.2 }}
          />
        ))}
      </div>
    </div>
  );
}
