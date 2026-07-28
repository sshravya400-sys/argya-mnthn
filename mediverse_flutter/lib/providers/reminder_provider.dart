import 'package:flutter/material.dart';
import '../models/medicine_reminder.dart';
import '../services/storage_service.dart';

class ReminderProvider extends ChangeNotifier {
  final StorageService _storage = StorageService();
  List<MedicineReminder> _reminders = [];
  bool _isLoading = true;

  List<MedicineReminder> get reminders => _reminders;
  bool get isLoading => _isLoading;

  ReminderProvider() {
    loadReminders();
  }

  Future<void> loadReminders() async {
    _isLoading = true;
    notifyListeners();
    _reminders = await _storage.getReminders();
    _isLoading = false;
    notifyListeners();
  }

  Future<void> saveReminder(MedicineReminder reminder) async {
    final idx = _reminders.indexWhere((r) => r.id == reminder.id);
    if (idx >= 0) {
      _reminders[idx] = reminder;
    } else {
      _reminders.add(reminder);
    }
    await _storage.saveReminders(_reminders);
    notifyListeners();
  }

  Future<void> deleteReminder(String id) async {
    _reminders.removeWhere((r) => r.id == id);
    await _storage.saveReminders(_reminders);
    notifyListeners();
  }

  Future<void> toggleTaken(String id) async {
    final idx = _reminders.indexWhere((r) => r.id == id);
    if (idx >= 0) {
      _reminders[idx].taken = !_reminders[idx].taken;
      if (_reminders[idx].taken) {
        _reminders[idx].takenAt = DateTime.now().toIso8601String();
      } else {
        _reminders[idx].takenAt = null;
      }
      await _storage.saveReminders(_reminders);
      notifyListeners();
    }
  }
}
