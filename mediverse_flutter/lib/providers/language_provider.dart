import 'package:flutter/material.dart';
import '../services/storage_service.dart';

class LanguageProvider extends ChangeNotifier {
  final StorageService _storage = StorageService();
  String _currentLanguage = 'en';

  String get currentLanguage => _currentLanguage;
  Locale get currentLocale => Locale(_currentLanguage);

  LanguageProvider() {
    _load();
  }

  Future<void> _load() async {
    final settings = await _storage.getSettings();
    _currentLanguage = settings['language'] ?? 'en';
    notifyListeners();
  }

  Future<void> setLanguage(String langCode) async {
    _currentLanguage = langCode;
    notifyListeners();
    final settings = await _storage.getSettings();
    settings['language'] = langCode;
    await _storage.saveSettings(settings);
  }
}
