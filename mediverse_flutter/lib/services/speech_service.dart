import 'package:flutter/foundation.dart';
import 'package:speech_to_text/speech_to_text.dart';

const Map<String, String> _sttLocale = {
  'en': 'en_IN',
  'hi': 'hi_IN',
  'kn': 'kn_IN',
  'ta': 'ta_IN',
  'te': 'te_IN',
  'ml': 'ml_IN',
  'mr': 'mr_IN',
  'bn': 'bn_IN',
  'gu': 'gu_IN',
  'pa': 'pa_IN',
  'ur': 'ur_IN',
};

class SpeechService {
  final SpeechToText _speech = SpeechToText();
  bool _isAvailable = false;
  bool get isAvailable => _isAvailable;
  bool get isListening => _speech.isListening;

  Future<bool> init() async {
    if (_isAvailable) return true;
    try {
      _isAvailable = await _speech.initialize(
        onError: (val) => debugPrint('STT Error: $val'),
        onStatus: (val) => debugPrint('STT Status: $val'),
      );
    } catch (e) {
      _isAvailable = false;
    }
    return _isAvailable;
  }

  Future<void> startListening({
    required Function(String text) onResult,
    required VoidCallback onDone,
    String language = 'en',
  }) async {
    final available = await init();
    if (!available) {
      onDone();
      return;
    }

    final localeId = _sttLocale[language] ?? 'en_IN';

    await _speech.listen(
      localeId: localeId,
      onResult: (result) {
        onResult(result.recognizedWords);
        if (result.finalResult) {
          onDone();
        }
      },
      listenFor: const Duration(seconds: 15),
      pauseFor: const Duration(seconds: 3),
    );
  }

  Future<void> stopListening() async {
    if (_speech.isListening) {
      await _speech.stop();
    }
  }
}
