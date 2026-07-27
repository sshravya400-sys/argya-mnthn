import 'package:flutter_tts/flutter_tts.dart';

// Maps app language codes to BCP-47 TTS locale strings
const Map<String, String> _ttsLocale = {
  'en': 'en-IN', 'hi': 'hi-IN', 'kn': 'kn-IN', 'ta': 'ta-IN',
  'te': 'te-IN', 'ml': 'ml-IN', 'mr': 'mr-IN', 'bn': 'bn-IN',
  'gu': 'gu-IN', 'pa': 'pa-IN', 'ur': 'ur-IN',
};

class TtsService {
  static final TtsService _instance = TtsService._();
  factory TtsService() => _instance;
  TtsService._();

  final FlutterTts _tts = FlutterTts();
  bool _initialized = false;
  String _currentLang = 'en';

  Future<void> _init() async {
    if (_initialized) return;
    await _tts.setVolume(1.0);
    await _tts.setSpeechRate(0.45);
    await _tts.setPitch(1.0);
    _initialized = true;
  }

  Future<void> speak(String text, {String language = 'en'}) async {
    await _init();
    if (language != _currentLang) {
      await _tts.setLanguage(_ttsLocale[language] ?? 'en-IN');
      _currentLang = language;
    }
    await _tts.stop();
    await _tts.speak(text);
  }

  Future<void> stop() async {
    await _tts.stop();
  }

  bool get isInitialized => _initialized;
}
