// Offline Storage Service — all app data stored in localStorage
// Key prefix "mv_" keeps MediVerse data isolated.

const KEYS = {
  REMINDERS:          'mv_reminders',
  HEALTH_RECORDS:     'mv_health_records',
  EMERGENCY_CONTACTS: 'mv_emergency_contacts',
  SETTINGS:           'mv_settings',
  THEME:              'mv_theme',
  LANGUAGE:           'mv_language',
  FONT_SIZE:          'mv_fontSize',
  SYNC_PENDING:       'mv_syncPending',
  DOCTOR_CACHE:       'mv_doctor_cache',
  UPLOADED_FILES:     'mv_uploaded_files',
};

// ── Helpers ────────────────────────────────────────────────────────────────
function get(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch { return defaultValue; }
}
function set(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; }
  catch { return false; }
}

// ── Medicine Reminders ─────────────────────────────────────────────────────
export function getReminders() { return get(KEYS.REMINDERS, []); }

export function saveReminder(reminder) {
  const reminders = getReminders();
  const idx = reminders.findIndex(r => r.id === reminder.id);
  if (idx >= 0) reminders[idx] = reminder;
  else reminders.push({ ...reminder, id: reminder.id || Date.now().toString() });
  set(KEYS.REMINDERS, reminders);
  return reminders;
}

export function deleteReminder(id) {
  const reminders = getReminders().filter(r => r.id !== id);
  set(KEYS.REMINDERS, reminders);
  return reminders;
}

export function markReminderTaken(id) {
  const reminders = getReminders().map(r =>
    r.id === id ? { ...r, taken: !r.taken, takenAt: new Date().toISOString() } : r
  );
  set(KEYS.REMINDERS, reminders);
  return reminders;
}

// ── Health Records ─────────────────────────────────────────────────────────
export function getHealthRecords() {
  return get(KEYS.HEALTH_RECORDS, {
    bloodGroup: '', allergies: [], diseases: [], vaccinations: [], reports: [],
  });
}
export function saveHealthRecords(records) { set(KEYS.HEALTH_RECORDS, records); }

// ── Emergency Contacts ─────────────────────────────────────────────────────
export function getEmergencyContacts() { return get(KEYS.EMERGENCY_CONTACTS, []); }

export function saveEmergencyContact(contact) {
  const contacts = getEmergencyContacts();
  const idx = contacts.findIndex(c => c.id === contact.id);
  if (idx >= 0) contacts[idx] = contact;
  else contacts.push({ ...contact, id: contact.id || Date.now().toString() });
  set(KEYS.EMERGENCY_CONTACTS, contacts);
  return contacts;
}

export function deleteEmergencyContact(id) {
  const contacts = getEmergencyContacts().filter(c => c.id !== id);
  set(KEYS.EMERGENCY_CONTACTS, contacts);
  return contacts;
}

// ── Settings ───────────────────────────────────────────────────────────────
export function getSettings() {
  return get(KEYS.SETTINGS, { voiceGuidance: true, notifications: true });
}
export function saveSettings(settings) { set(KEYS.SETTINGS, settings); }

// ── Nearby Doctor Cache (offline support) ──────────────────────────────────
export function getDoctorCache() { return get(KEYS.DOCTOR_CACHE, []); }

export function saveDoctorCache(doctors) {
  set(KEYS.DOCTOR_CACHE, doctors);
}

// ── Uploaded File Metadata ─────────────────────────────────────────────────
export function getUploadedFiles() { return get(KEYS.UPLOADED_FILES, []); }

export function saveUploadedFile(fileRecord) {
  const files = getUploadedFiles();
  files.unshift({ ...fileRecord, id: fileRecord.id || Date.now().toString() });
  set(KEYS.UPLOADED_FILES, files);
  return files;
}

export function deleteUploadedFile(id) {
  const files = getUploadedFiles().filter(f => f.id !== id);
  set(KEYS.UPLOADED_FILES, files);
  return files;
}

export { KEYS };
