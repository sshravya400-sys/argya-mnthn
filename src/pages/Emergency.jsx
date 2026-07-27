import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaExclamationTriangle, FaPhoneAlt, FaFire, FaShieldAlt, FaTint,
  FaPlus, FaTrash, FaEdit, FaTimes, FaFirstAid, FaAmbulance, FaUserFriends
} from 'react-icons/fa';
import EmergencyCard from '../components/EmergencyCard';
import {
  getEmergencyContacts, saveEmergencyContact, deleteEmergencyContact, getHealthRecords
} from '../services/offlineStorage';
import { useLanguage } from '../context/LanguageContext';

const FIRST_AID_STEPS = [
  {
    title: 'CPR (Cardiac Arrest)',
    icon: '❤️',
    steps: [
      'Call 108 immediately.',
      'Lay the person flat on their back on a hard surface.',
      'Place heel of hand on center of chest between nipples.',
      'Press down hard and fast – 100-120 compressions per minute.',
      'Tilt head back, lift chin, give 2 rescue breaths every 30 compressions.',
      'Continue until help arrives or person recovers.',
    ],
  },
  {
    title: 'Choking',
    icon: '🫁',
    steps: [
      'Encourage the person to cough forcefully.',
      'Give up to 5 sharp blows between shoulder blades.',
      'If not cleared, perform Heimlich maneuver: stand behind, make fist, push inward-upward above navel.',
      'Alternate 5 back blows and 5 abdominal thrusts.',
      'If person becomes unconscious, call 108 and start CPR.',
    ],
  },
  {
    title: 'Burns',
    icon: '🔥',
    steps: [
      'Remove from heat source safely.',
      'Cool the burn under cool (not cold) running water for 20 minutes.',
      'Do NOT use ice, butter, or toothpaste.',
      'Cover loosely with a clean bandage.',
      'For severe burns, call 108 immediately.',
    ],
  },
  {
    title: 'Snake Bite',
    icon: '🐍',
    steps: [
      'Keep the patient calm and still.',
      'Remove watches, rings, tight clothing near the bite.',
      'Keep the bitten limb below heart level.',
      'Do NOT cut, suck, or tourniquet the wound.',
      'Immobilize and rush to hospital immediately.',
      'Note the snake appearance if safe to do so.',
    ],
  },
  {
    title: 'Stroke (FAST)',
    icon: '🧠',
    steps: [
      'F - Face: Ask to smile. Is one side drooping?',
      'A - Arms: Can they raise both arms? Does one drift down?',
      'S - Speech: Is speech slurred or strange?',
      'T - Time: Call 108 immediately if any signs appear.',
      'Do NOT give food or water.',
      'Keep person calm and comfortable until help arrives.',
    ],
  },
];

function ContactModal({ initial, onSave, onClose, t }) {
  const [form, setForm] = useState(initial || { name: '', phone: '', relation: '' });
  const handle = (e) => { e.preventDefault(); if (form.name && form.phone) onSave(form); };
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
        className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="bg-gradient-to-r from-red-500 to-rose-600 p-5 flex items-center justify-between">
          <h2 className="text-white font-bold text-lg">{initial?.id ? t('edit') : t('addContact')}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white"><FaTimes /></button>
        </div>
        <form onSubmit={handle} className="p-6 space-y-4">
          <div><label className="label-text">{t('name')} *</label><input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input-field" required /></div>
          <div><label className="label-text">{t('phone')} *</label><input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} type="tel" className="input-field" required /></div>
          <div><label className="label-text">{t('relation')}</label><input value={form.relation} onChange={e => setForm(f => ({ ...f, relation: e.target.value }))} placeholder="e.g., Father, Doctor" className="input-field" /></div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 btn-ghost border border-gray-200 dark:border-gray-600">{t('cancel')}</button>
            <button type="submit" className="flex-1 btn-danger">{t('save')}</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default function Emergency() {
  const [contacts, setContacts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [bloodGroup, setBloodGroup] = useState('');
  const [expandedFirstAid, setExpandedFirstAid] = useState(null);
  const [sosTriggered, setSosTriggered] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    setContacts(getEmergencyContacts());
    const r = getHealthRecords();
    setBloodGroup(r.bloodGroup);
  }, []);

  const handleSave = (form) => {
    const item = editItem ? { ...editItem, ...form } : { ...form, id: Date.now().toString() };
    setContacts(saveEmergencyContact(item));
    setShowModal(false);
    setEditItem(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Remove this emergency contact?')) setContacts(deleteEmergencyContact(id));
  };

  const handleSOS = () => {
    setSosTriggered(true);
    setTimeout(() => setSosTriggered(false), 3000);
  };

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 px-3 py-1.5 rounded-full text-sm font-semibold mb-3">
            <FaExclamationTriangle /> {t('emergency')}
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">{t('emergencyTitle')}</h1>
        </motion.div>

        {/* SOS Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSOS}
            className={`relative w-48 h-48 mx-auto rounded-full flex flex-col items-center justify-center gap-2 text-white font-black text-2xl shadow-2xl transition-all focus:outline-none focus:ring-8 focus:ring-red-300 ${
              sosTriggered ? 'bg-gradient-to-br from-orange-500 to-red-700 animate-pulse' : 'bg-gradient-to-br from-red-500 to-rose-700'
            }`}
            aria-label="SOS Emergency Button"
          >
            <div className="absolute inset-0 rounded-full border-4 border-red-300 animate-ping opacity-40" />
            <FaAmbulance className="text-4xl" />
            {sosTriggered ? '🆘 SOS SENT!' : t('sosButton')}
          </motion.button>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
            {sosTriggered ? 'Calling for help...' : 'Press in case of life-threatening emergency'}
          </p>
        </motion.div>

        {/* Emergency Services */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Emergency Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <EmergencyCard title={t('ambulance')} number="108" color="red" icon={FaAmbulance} description="Medical Emergency" />
            <EmergencyCard title={t('police')} number="100" color="blue" icon={FaShieldAlt} description="Law Enforcement" />
            <EmergencyCard title={t('fire')} number="101" color="orange" icon={FaFire} description="Fire Department" />
            <EmergencyCard title="Health Helpline" number="104" color="emerald" icon={FaFirstAid} description="Health Advice & Support" />
          </div>
        </div>

        {/* Blood Group */}
        {bloodGroup && (
          <div className="glass-card dark:bg-gray-800/80 p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-400 to-rose-600 flex items-center justify-center flex-shrink-0">
              <FaTint className="text-white text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('bloodGroup')}</p>
              <p className="text-3xl font-black text-red-600 dark:text-red-400">{bloodGroup}</p>
            </div>
          </div>
        )}

        {/* Emergency Contacts */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('emergencyContacts')}</h2>
            <button
              onClick={() => { setEditItem(null); setShowModal(true); }}
              className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-xl text-sm font-semibold transition-colors"
            >
              <FaPlus /> {t('addContact')}
            </button>
          </div>
          <div className="space-y-3">
            <AnimatePresence>
              {contacts.map((contact, i) => (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card dark:bg-gray-800/80 p-4 flex items-center gap-4"
                >
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {contact.name[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 dark:text-white">{contact.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{contact.phone} {contact.relation && `• ${contact.relation}`}</p>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={`tel:${contact.phone}`}
                      className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 hover:bg-emerald-200 transition-colors"
                      aria-label={`Call ${contact.name}`}
                    >
                      <FaPhoneAlt />
                    </a>
                    <button onClick={() => { setEditItem(contact); setShowModal(true); }} className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 hover:bg-blue-200 transition-colors"><FaEdit /></button>
                    <button onClick={() => handleDelete(contact.id)} className="p-2 rounded-lg bg-red-100 dark:bg-red-900/40 text-red-500 hover:bg-red-200 transition-colors"><FaTrash /></button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {contacts.length === 0 && (
              <div className="glass-card dark:bg-gray-800/80 p-8 text-center">
                <FaUserFriends className="text-4xl text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">No emergency contacts added yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* First Aid */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            <span className="mr-2">🩺</span>{t('firstAid')} Instructions
          </h2>
          <div className="space-y-3">
            {FIRST_AID_STEPS.map((aid, i) => (
              <motion.div
                key={aid.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card dark:bg-gray-800/80 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFirstAid(expandedFirstAid === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{aid.icon}</span>
                    <span className="font-bold text-gray-900 dark:text-white">{aid.title}</span>
                  </div>
                  <motion.span
                    animate={{ rotate: expandedFirstAid === i ? 180 : 0 }}
                    className="text-gray-400"
                  >
                    ▼
                  </motion.span>
                </button>
                <AnimatePresence>
                  {expandedFirstAid === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <ol className="px-5 pb-5 space-y-2">
                        {aid.steps.map((step, si) => (
                          <li key={si} className="flex gap-3 text-sm text-gray-700 dark:text-gray-300">
                            <span className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                              {si + 1}
                            </span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <ContactModal
            initial={editItem}
            onSave={handleSave}
            onClose={() => { setShowModal(false); setEditItem(null); }}
            t={t}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
