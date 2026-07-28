import 'package:flutter/material.dart';
import '../services/storage_service.dart';

class ThemeProvider extends ChangeNotifier {
  final StorageService _storage = StorageService();
  bool _isDarkMode = false;
  double _fontScale = 1.0;

  bool get isDarkMode => _isDarkMode;
  double get fontScale => _fontScale;

  ThemeProvider() {
    _load();
  }

  Future<void> _load() async {
    final settings = await _storage.getSettings();
    _isDarkMode = settings['darkMode'] ?? false;
    _fontScale = (settings['fontScale'] ?? 1.0).toDouble();
    notifyListeners();
  }

  void toggleTheme() {
    _isDarkMode = !_isDarkMode;
    _save();
    notifyListeners();
  }

  void setFontScale(double scale) {
    _fontScale = scale;
    _save();
    notifyListeners();
  }

  Future<void> _save() async {
    final settings = await _storage.getSettings();
    settings['darkMode'] = _isDarkMode;
    settings['fontScale'] = _fontScale;
    await _storage.saveSettings(settings);
  }
}
