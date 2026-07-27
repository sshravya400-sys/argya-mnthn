/**
 * HealthLocker page — enhanced with:
 *  • File upload: PDF, PNG, JPG, JPEG, DOC, DOCX, TXT (max 2 MB)
 *  • File stored as base64 data URL in localStorage for offline viewing/downloading
 *  • Each file card: icon, name, type, size, upload date, View, Download, Delete
 *  • ListenButton on each uploaded file card
 */
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaFolder, FaTint, FaAllergies, FaHeartbeat, FaSyringe,
  FaFilePdf, FaFileImage, FaFileWord, FaFileAlt, FaFile,
  FaUpload, FaEye, FaDownload, FaTrash, FaPlus, FaTimes,
  FaCheckCircle,
} from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import { getHealthRecords, saveHealthRecords, getUploadedFiles, saveUploadedFile, deleteUploadedFile } from '../services/offlineStorage';
import ListenButton from '../components/ListenButton';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const MAX_FILE_BYTES = 2 * 1024 * 1024; // 2 MB
const ACCEPTED = '.pdf,.png,.jpg,.jpeg,.doc,.docx,.txt';

// ── File type → icon / color ──────────────────────────────────────────────
function fileIcon(ext) {
  const e = ext.toLowerCase();
  if (e === 'pdf')                   return { Icon: FaFilePdf,   color: 'text-red-500',    bg: 'bg-red-50   dark:bg-red-900/20'   };
  if (['png','jpg','jpeg'].includes(e)) return { Icon: FaFileImage, color: 'text-blue-500',   bg: 'bg-blue-50  dark:bg-blue-900/20'  };
  if (['doc','docx'].includes(e))    return { Icon: FaFileWord,  color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/20'};
  if (e === 'txt')                   return { Icon: FaFileAlt,   color: 'text-gray-500',   bg: 'bg-gray-50  dark:bg-gray-900/20'  };
  return                                    { Icon: FaFile,      color: 'text-gray-400',   bg: 'bg-gray-50  dark:bg-gray-900/20'  };
}

function formatBytes(bytes) {
  if (bytes < 1024)        return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

// ── Uploaded File Card ─────────────────────────────────────────────────────
function FileCard({ file, onDelete, index }) {
  const { t } = useLanguage();
  const { Icon, color, bg } = fileIcon(file.ext);

  const ttsText = `File: ${file.name}. Type: ${file.ext.toUpperCase()}. Size: ${formatBytes(file.size)}. Uploaded on ${file.uploadDate}.`;

  const handleView = () => {
    if (file.dataUrl) {
      const win = window.open('', '_blank');
      win.document.write(`<html><body style="margin:0"><iframe src="${file.dataUrl}" style="width:100vw;height:100vh;border:none"></iframe></body></html>`);
    } else {
      alert('File preview not available (file was not stored locally).');
    }
  };

  const handleDownload = () => {
    if (!file.dataUrl) { alert('File data not available for download.'); return; }
    const a = document.createElement('a');
    a.href = file.dataUrl;
    a.download = file.name;
    a.click();
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.04 }}
      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all p-4"
    >
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`text-2xl ${color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 dark:text-white text-sm truncate" title={file.name}>{file.name}</p>
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            <span className={`font-semibold uppercase ${color}`}>{file.ext}</span>
            <span>{formatBytes(file.size)}</span>
            <span>📅 {file.uploadDate}</span>
          </div>
          <div className="mt-2">
            <ListenButton text={ttsText} />
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
        <button onClick={handleView}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 text-xs font-semibold transition-all"
        >
          <FaEye /> {t('view')}
        </button>
        <button onClick={handleDownload}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 text-xs font-semibold transition-all"
        >
          <FaDownload /> {t('download')}
        </button>
        <button onClick={() => onDelete(file.id)}
          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-500 hover:bg-red-100 text-xs font-semibold transition-all"
        >
          <FaTrash />
        </button>
      </div>
    </motion.div>
  );
}

// ── Tag Input helper (allergies, diseases, vaccinations) ───────────────────
function TagInput({ items, onAdd, onRemove, placeholder }) {
  const [val, setVal] = useState('');
  const submit = (e) => {
    e.preventDefault();
    if (val.trim()) { onAdd(val.trim()); setVal(''); }
  };
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {items.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full">
            {item}
            <button onClick={() => onRemove(i)} className="ml-1 text-emerald-500 hover:text-red-500 leading-none" aria-label={`Remove ${item}`}>
              <FaTimes className="text-[10px]" />
            </button>
          </span>
        ))}
      </div>
      <form onSubmit={submit} className="flex gap-2">
        <input
          type="text" value={val} onChange={e => setVal(e.target.value)} placeholder={placeholder}
          className="flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-4 focus:ring-emerald-300"
        />
        <button type="submit" className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-semibold hover:bg-emerald-600 transition-all">
          <FaPlus />
        </button>
      </form>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function HealthLocker() {
  const { t } = useLanguage();
  const fileInputRef = useRef(null);

  const [records, setRecords] = useState(() => getHealthRecords());
  const [files, setFiles]     = useState(() => getUploadedFiles());
  const [uploadError, setUploadError] = useState('');
  const [uploading, setUploading]     = useState(false);
  const [saved, setSaved]             = useState(false);

  const updateRecords = (patch) => {
    const updated = { ...records, ...patch };
    setRecords(updated);
    saveHealthRecords(updated);
  };

  const handleSave = () => {
    saveHealthRecords(records);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // ── File Upload ─────────────────────────────────────────────────────
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadError('');

    if (file.size > MAX_FILE_BYTES) {
      setUploadError(t('fileTooLarge'));
      e.target.value = '';
      return;
    }

    setUploading(true);
    const ext = file.name.split('.').pop() || 'bin';
    const reader = new FileReader();

    reader.onload = (ev) => {
      const record = {
        id:         Date.now().toString(),
        name:       file.name,
        ext:        ext,
        size:       file.size,
        type:       file.type,
        uploadDate: new Date().toLocaleDateString('en-IN'),
        dataUrl:    ev.target.result,
      };
      const updated = saveUploadedFile(record);
      setFiles(updated);
      setUploading(false);
      e.target.value = '';
    };
    reader.onerror = () => { setUploadError('Failed to read file. Please try again.'); setUploading(false); };
    reader.readAsDataURL(file);
  };

  const handleDeleteFile = (id) => {
    if (window.confirm('Delete this file?')) setFiles(deleteUploadedFile(id));
  };

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-full text-sm font-semibold mb-2">
            <FaFolder /> {t('healthLocker')}
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">{t('healthLockerTitle')}</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{t('healthLockerDesc')}</p>
        </motion.div>

        <div className="space-y-6">
          {/* Blood Group */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm"
          >
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FaTint className="text-red-500" /> {t('bloodGroup')}
            </h2>
            <div className="flex flex-wrap gap-2">
              {BLOOD_GROUPS.map(bg => (
                <button key={bg} onClick={() => updateRecords({ bloodGroup: bg })}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${
                    records.bloodGroup === bg
                      ? 'bg-red-500 border-red-500 text-white shadow-md shadow-red-200'
                      : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-red-400'
                  }`}
                >{bg}</button>
              ))}
            </div>
          </motion.div>

          {/* Allergies */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm"
          >
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FaAllergies className="text-orange-500" /> {t('allergies')}
            </h2>
            <TagInput
              items={records.allergies}
              onAdd={a => updateRecords({ allergies: [...records.allergies, a] })}
              onRemove={i => updateRecords({ allergies: records.allergies.filter((_, idx) => idx !== i) })}
              placeholder="e.g. Penicillin"
            />
          </motion.div>

          {/* Medical Conditions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm"
          >
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FaHeartbeat className="text-pink-500" /> {t('diseases')}
            </h2>
            <TagInput
              items={records.diseases}
              onAdd={d => updateRecords({ diseases: [...records.diseases, d] })}
              onRemove={i => updateRecords({ diseases: records.diseases.filter((_, idx) => idx !== i) })}
              placeholder="e.g. Diabetes"
            />
          </motion.div>

          {/* Vaccinations */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm"
          >
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FaSyringe className="text-blue-500" /> {t('vaccinations')}
            </h2>
            <TagInput
              items={records.vaccinations}
              onAdd={v => updateRecords({ vaccinations: [...records.vaccinations, v] })}
              onRemove={i => updateRecords({ vaccinations: records.vaccinations.filter((_, idx) => idx !== i) })}
              placeholder="e.g. COVID-19, Polio"
            />
          </motion.div>

          {/* Save Health Records Button */}
          <button onClick={handleSave}
            className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-lg shadow-xl transition-all ${
              saved
                ? 'bg-emerald-500 text-white'
                : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-emerald-300 hover:scale-[1.02]'
            }`}
          >
            {saved ? <><FaCheckCircle /> Saved!</> : `${t('save')} ${t('healthLocker')}`}
          </button>

          {/* ── Upload Files Section ─────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FaUpload className="text-purple-500" /> {t('uploadedFiles')}
              </h2>
              <span className="text-xs text-gray-400">{files.length} file{files.length !== 1 ? 's' : ''}</span>
            </div>

            {/* Upload drop zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500 rounded-2xl p-8 text-center cursor-pointer transition-all bg-white dark:bg-gray-800 hover:bg-purple-50 dark:hover:bg-purple-900/10 mb-4"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED}
                onChange={handleFileChange}
                className="hidden"
              />
              {uploading ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">Reading file…</p>
                </div>
              ) : (
                <>
                  <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-3">
                    <FaUpload className="text-purple-500 text-2xl" />
                  </div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{t('uploadFile')}</p>
                  <p className="text-xs text-gray-400">PDF, PNG, JPG, JPEG, DOC, DOCX, TXT — max 2 MB</p>
                </>
              )}
            </div>

            {/* Upload error */}
            {uploadError && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 px-4 py-3 rounded-xl text-sm font-medium mb-4">
                ⚠️ {uploadError}
              </div>
            )}

            {/* File Cards */}
            {files.length === 0 ? (
              <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                <FaFile className="text-4xl text-gray-200 dark:text-gray-700 mx-auto mb-3" />
                <p className="text-gray-400 dark:text-gray-500 text-sm">{t('noFilesUploaded')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                <AnimatePresence>
                  {files.map((f, i) => (
                    <FileCard key={f.id} file={f} onDelete={handleDeleteFile} index={i} />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
