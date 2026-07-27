import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/medicine_reminder.dart';
import '../models/health_record.dart';
import '../models/emergency_contact.dart';
import '../models/uploaded_file.dart';

// Key prefix `mv_` keeps all MediVerse keys isolated.
class StorageService {
  static const _remindersKey    = 'mv_reminders';
  static const _healthKey       = 'mv_health_record';
  static const _contactsKey     = 'mv_emergency_contacts';
  static const _filesKey        = 'mv_uploaded_files';
  static const _doctorCacheKey  = 'mv_doctor_cache';
  static const _settingsKey     = 'mv_settings';

  // ── Medicine Reminders ─────────────────────────────────────────────────
  Future<List<MedicineReminder>> getReminders() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getStringList(_remindersKey) ?? [];
    return raw.map((s) => MedicineReminder.fromMap(jsonDecode(s))).toList();
  }

  Future<void> saveReminders(List<MedicineReminder> reminders) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setStringList(
        _remindersKey, reminders.map((r) => jsonEncode(r.toMap())).toList());
  }

  // ── Health Record ──────────────────────────────────────────────────────
  Future<HealthRecord> getHealthRecord() async {
    final prefs = await SharedPreferences.getInstance();
    final s = prefs.getString(_healthKey);
    if (s == null) return HealthRecord();
    return HealthRecord.fromMap(jsonDecode(s));
  }

  Future<void> saveHealthRecord(HealthRecord record) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_healthKey, jsonEncode(record.toMap()));
  }

  // ── Emergency Contacts ─────────────────────────────────────────────────
  Future<List<EmergencyContact>> getEmergencyContacts() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getStringList(_contactsKey) ?? [];
    return raw.map((s) => EmergencyContact.fromMap(jsonDecode(s))).toList();
  }

  Future<void> saveEmergencyContacts(List<EmergencyContact> contacts) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setStringList(
        _contactsKey, contacts.map((c) => jsonEncode(c.toMap())).toList());
  }

  // ── Uploaded Files ─────────────────────────────────────────────────────
  Future<List<UploadedFile>> getUploadedFiles() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getStringList(_filesKey) ?? [];
    return raw.map((s) => UploadedFile.fromMap(jsonDecode(s))).toList();
  }

  Future<void> saveUploadedFiles(List<UploadedFile> files) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setStringList(
        _filesKey, files.map((f) => jsonEncode(f.toMap())).toList());
  }

  // ── Doctor Cache ───────────────────────────────────────────────────────
  Future<void> saveDoctorQuery(String query) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_doctorCacheKey, query);
  }

  Future<String> getDoctorQuery() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_doctorCacheKey) ?? '';
  }

  // ── Settings ───────────────────────────────────────────────────────────
  Future<Map<String, dynamic>> getSettings() async {
    final prefs = await SharedPreferences.getInstance();
    final s = prefs.getString(_settingsKey);
    if (s == null) return {'language': 'en', 'darkMode': false, 'fontScale': 1.0};
    return Map<String, dynamic>.from(jsonDecode(s));
  }

  Future<void> saveSettings(Map<String, dynamic> settings) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_settingsKey, jsonEncode(settings));
  }

  Future<void> clearAll() async {
    final prefs = await SharedPreferences.getInstance();
    final keys = [_remindersKey, _healthKey, _contactsKey, _filesKey, _doctorCacheKey, _settingsKey];
    for (final k in keys) await prefs.remove(k);
  }
}
