/**
 * MedicineReminder page — enhanced with:
 *  • Date field
 *  • Time field (REQUIRED — shows validation error if missing)
 *  • Reason for Reminder field + voice mic button
 *  • TTS reads each card summary; "Listen Again" button on each card
 */
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaPills, FaPlus, FaTrash, FaEdit, FaCheck, FaClock,
  FaCalendarAlt, FaMicrophone, FaMicrophoneSlash, FaTimes,
} from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import { getReminders, saveReminder, deleteReminder, markReminderTaken } from '../services/offlineStorage';
import { isSpeechRecognitionSupported, createSpeechRecognition } from '../services/speechRecognition';
import ListenButton from '../components/ListenButton';

const FREQUENCIES = ['daily', 'weekly', 'monthly'];
const TIME_SLOTS   = ['morning', 'afternoon', 'evening', 'night'];

const EMPTY_FORM = {
  medicineName: '', dosage: '', date: '', time: '',
  frequency: 'daily', timeSlot: 'morning', reason: '', taken: false,
};

// ── Time-slot group label ──────────────────────────────────────────────────
function SlotLabel({ slot, t }) {
  const colors = {
    morning:   'bg-amber-100   dark:bg-amber-900/30  text-amber-700   dark:text-amber-400',
    afternoon: 'bg-orange-100  dark:bg-orange-900/30 text-orange-700  dark:text-orange-400',
    evening:   'bg-purple-100  dark:bg-purple-900/30 text-purple-700  dark:text-purple-400',
    night:     'bg-indigo-100  dark:bg-indigo-900/30 text-indigo-700  dark:text-indigo-400',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${colors[slot] || ''}`}>
      <FaClock className="text-xs" /> {t(slot)}
    </span>
  );
}

// ── Single Reminder Card ───────────────────────────────────────────────────
function ReminderCard({ reminder, onEdit, onDelete, onToggleTaken, index }) {
  const { t } = useLanguage();

  const ttsText = [
    reminder.medicineName,
    reminder.dosage && `Dosage: ${reminder.dosage}`,
    reminder.time && `Time: ${reminder.time}`,
    reminder.date && `Date: ${reminder.date}`,
    `Frequency: ${reminder.frequency}`,
    reminder.reason && `Reason: ${reminder.reason}`,
    reminder.taken ? 'Already taken.' : 'Not taken yet.',
  ].filter(Boolean).join('. ');

  return (
    <motion.div
      key={reminder.id}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.04 }}
      className={`bg-white dark:bg-gray-800 rounded-2xl border p-5 shadow-sm hover:shadow-md transition-all ${
        reminder.taken
          ? 'border-emerald-200 dark:border-emerald-800 opacity-70'
          : 'border-gray-200 dark:border-gray-700'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
          reminder.taken ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-blue-100 dark:bg-blue-900/30'
        }`}>
          <FaPills className={`text-xl ${reminder.taken ? 'text-emerald-500' : 'text-blue-500'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className={`font-bold text-base truncate ${reminder.taken ? 'line-through text-gray-400' : 'text-gray-900 dark:text-white'}`}>
              {reminder.medicineName}
            </h3>
            {reminder.taken && (
              <span className="text-xs font-bold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full">
                {t('takenStatus')}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-600 dark:text-gray-400">
            {reminder.dosage && <span>💊 {reminder.dosage}</span>}
            {reminder.time  && <span className="flex items-center gap-1"><FaClock className="text-xs text-blue-400" /> {reminder.time}</span>}
            {reminder.date  && <span className="flex items-center gap-1"><FaCalendarAlt className="text-xs text-purple-400" /> {reminder.date}</span>}
            <span className="font-medium text-indigo-600 dark:text-indigo-400">{t(reminder.frequency)}</span>
          </div>
          {reminder.reason && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">📝 {reminder.reason}</p>
          )}
          <div className="flex flex-wrap gap-2 mt-3">
            <SlotLabel slot={reminder.timeSlot} t={t} />
            <ListenButton text={ttsText} />
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
        <button onClick={() => onToggleTaken(reminder.id)}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            reminder.taken
              ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
              : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm'
          }`}
        >
          <FaCheck /> {reminder.taken ? 'Undo' : t('taken')}
        </button>
        <button onClick={() => onEdit(reminder)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 text-sm font-semibold transition-all"
        >
          <FaEdit />
        </button>
        <button onClick={() => onDelete(reminder.id)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-500 hover:bg-red-100 text-sm font-semibold transition-all"
        >
          <FaTrash />
        </button>
      </div>
    </motion.div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function MedicineReminder() {
  const { t, language } = useLanguage();
  const [reminders, setReminders]   = useState([]);
  const [showForm, setShowForm]     = useState(false);
  const [form, setForm]             = useState(EMPTY_FORM);
  const [editId, setEditId]         = useState(null);
  const [timeError, setTimeError]   = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => { setReminders(getReminders()); }, []);

  // ── Form helpers ───────────────────────────────────────────────────────
  const setField = (k, v) => {
    setForm(prev => ({ ...prev, [k]: v }));
    if (k === 'time' && v) setTimeError('');
  };

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setEditId(null);
    setTimeError('');
    setShowForm(true);
  };

  const openEdit = (r) => {
    setForm({ medicineName: r.medicineName, dosage: r.dosage, date: r.date || '', time: r.time || '', frequency: r.frequency, timeSlot: r.timeSlot, reason: r.reason || '', taken: r.taken });
    setEditId(r.id);
    setTimeError('');
    setShowForm(true);
  };

  const handleSave = () => {
    // Validate required time
    if (!form.time.trim()) {
      setTimeError(t('timeRequired'));
      return;
    }
    const payload = {
      ...form,
      id: editId || Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setReminders(saveReminder(payload));
    setShowForm(false);
    setForm(EMPTY_FORM);
    setEditId(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this reminder?')) setReminders(deleteReminder(id));
  };

  const handleToggle = (id) => setReminders(markReminderTaken(id));

  // ── Voice input for Reason field ─────────────────────────────────────
  const startVoiceReason = () => {
    if (!isSpeechRecognitionSupported()) {
      alert('Speech recognition not supported in this browser.');
      return;
    }
    if (recognitionRef.current) recognitionRef.current.stop();

    const rec = createSpeechRecognition({
      language,
      onStart:  () => setIsListening(true),
      onEnd:    () => setIsListening(false),
      onResult: ({ final, interim }) => {
        if (final) setField('reason', final.trim());
        else if (interim) setField('reason', interim.trim());
      },
      onError: (e) => { console.error('ASR error:', e); setIsListening(false); },
    });
    recognitionRef.current = rec;
    rec?.start();
  };

  const stopVoice = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  // ── Group reminders by time slot ─────────────────────────────────────
  const grouped = TIME_SLOTS.reduce((acc, slot) => {
    acc[slot] = reminders.filter(r => r.timeSlot === slot);
    return acc;
  }, {});

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-full text-sm font-semibold mb-2">
              <FaPills /> {t('medicineReminder')}
            </div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white">{t('medicineReminderTitle')}</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{t('medicineReminderDesc')}</p>
          </div>
          <button onClick={openAdd}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-3 rounded-2xl font-bold shadow-lg hover:shadow-blue-300 hover:scale-105 transition-all text-sm"
          >
            <FaPlus /> {t('addMedicine')}
          </button>
        </motion.div>

        {/* Add / Edit Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl p-6 mb-6"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-black text-gray-900 dark:text-white">
                  {editId ? t('edit') : t('add')} {t('medicineReminder')}
                </h2>
                <button onClick={() => { setShowForm(false); setTimeError(''); }} className="text-gray-400 hover:text-gray-600 p-1">
                  <FaTimes />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Medicine Name */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    {t('medicineName')} *
                  </label>
                  <input
                    type="text"
                    value={form.medicineName}
                    onChange={e => setField('medicineName', e.target.value)}
                    placeholder="e.g. Paracetamol 500mg"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-300 text-sm"
                  />
                </div>

                {/* Dosage */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    {t('dosage')}
                  </label>
                  <input
                    type="text"
                    value={form.dosage}
                    onChange={e => setField('dosage', e.target.value)}
                    placeholder="e.g. 1 tablet"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-300 text-sm"
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    {t('date')}
                  </label>
                  <div className="relative">
                    <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <input
                      type="date"
                      value={form.date}
                      onChange={e => setField('date', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-300 text-sm"
                    />
                  </div>
                </div>

                {/* Time — REQUIRED */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    {t('time')} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaClock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <input
                      type="time"
                      value={form.time}
                      onChange={e => setField('time', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-4 text-sm ${
                        timeError
                          ? 'border-red-400 focus:ring-red-300'
                          : 'border-gray-200 dark:border-gray-600 focus:ring-blue-300'
                      }`}
                    />
                  </div>
                  {timeError && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      ⚠️ {timeError}
                    </p>
                  )}
                </div>

                {/* Frequency */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    {t('frequency')}
                  </label>
                  <select
                    value={form.frequency}
                    onChange={e => setField('frequency', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-300 text-sm"
                  >
                    {FREQUENCIES.map(f => <option key={f} value={f}>{t(f)}</option>)}
                  </select>
                </div>

                {/* Time Slot */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {t('time')} Slot
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {TIME_SLOTS.map(slot => (
                      <button
                        key={slot} type="button"
                        onClick={() => setField('timeSlot', slot)}
                        className={`py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                          form.timeSlot === slot
                            ? 'bg-blue-500 border-blue-500 text-white shadow-md'
                            : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-blue-400'
                        }`}
                      >
                        {t(slot)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reason for Reminder + Voice Mic */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    {t('reasonForReminder')}
                  </label>
                  <div className="relative">
                    <textarea
                      rows={2}
                      value={form.reason}
                      onChange={e => setField('reason', e.target.value)}
                      placeholder={t('tapMicForReason')}
                      className="w-full px-4 py-3 pr-14 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-300 text-sm resize-none"
                    />
                    {/* Voice mic button */}
                    <button
                      type="button"
                      onClick={isListening ? stopVoice : startVoiceReason}
                      title={isListening ? 'Stop listening' : 'Record reason by voice'}
                      className={`absolute right-3 top-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        isListening
                          ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-300'
                          : 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 hover:bg-blue-200'
                      }`}
                    >
                      {isListening ? <FaMicrophoneSlash className="text-sm" /> : <FaMicrophone className="text-sm" />}
                    </button>
                  </div>
                  {isListening && (
                    <p className="text-xs text-red-500 font-medium mt-1 animate-pulse">
                      🔴 {t('listening')} — speak your reason…
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={handleSave}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-blue-300 transition-all"
                >
                  {t('save')}
                </button>
                <button onClick={() => { setShowForm(false); setTimeError(''); }}
                  className="px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  {t('cancel')}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reminder Cards — grouped by time slot */}
        {reminders.length === 0 ? (
          <div className="text-center py-20">
            <FaPills className="text-6xl text-gray-200 dark:text-gray-700 mx-auto mb-4" />
            <p className="text-gray-400 dark:text-gray-500 font-medium">{t('noReminders')}</p>
            <button onClick={openAdd}
              className="mt-4 inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-all"
            >
              <FaPlus /> {t('addMedicine')}
            </button>
          </div>
        ) : (
          TIME_SLOTS.map(slot =>
            grouped[slot].length > 0 ? (
              <div key={slot} className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <SlotLabel slot={slot} t={t} />
                  <span className="text-xs text-gray-400">({grouped[slot].length})</span>
                </div>
                <div className="space-y-4">
                  <AnimatePresence>
                    {grouped[slot].map((r, i) => (
                      <ReminderCard key={r.id} reminder={r} index={i}
                        onEdit={openEdit} onDelete={handleDelete} onToggleTaken={handleToggle}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            ) : null
          )
        )}
      </div>
    </div>
  );
}
