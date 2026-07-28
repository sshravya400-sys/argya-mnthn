import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/l10n/app_localizations.dart';
import '../../providers/language_provider.dart';
import '../../services/speech_service.dart';
import '../../services/tts_service.dart';
import '../../widgets/listen_button.dart';

class SymptomCheckerScreen extends StatefulWidget {
  const SymptomCheckerScreen({super.key});

  @override
  State<SymptomCheckerScreen> createState() => _SymptomCheckerScreenState();
}

class _SymptomCheckerScreenState extends State<SymptomCheckerScreen> {
  final Map<String, bool> _selectedSymptoms = {
    'fever': false,
    'cough': false,
    'breathingDifficulty': false,
    'chestPain': false,
    'headache': false,
    'vomiting': false,
    'diarrhea': false,
    'bodyPain': false,
    'soreThroat': false,
    'rash': false,
  };

  final SpeechService _speechService = SpeechService();
  bool _isListening = false;
  String? _recommendation;
  final TextEditingController _symptomTextController = TextEditingController();

  void _analyzeSymptoms() {
    final loc = AppLocalizations.of(context);
    final active = _selectedSymptoms.entries.where((e) => e.value).map((e) => e.key).toList();
    final freeText = _symptomTextController.text.trim();

    if (active.isEmpty && freeText.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select or type at least one symptom.')),
      );
      return;
    }

    String recText = '';
    if (active.contains('chestPain') || active.contains('breathingDifficulty')) {
      recText = '${loc.t('seekEmergency')}: High severity symptoms detected. Please visit the nearest hospital or call emergency services immediately.';
    } else if (active.contains('fever') && active.contains('cough')) {
      recText = '${loc.t('visitPHC')}: Moderate symptoms. Consult a doctor at your local primary health center for proper diagnosis and medication.';
    } else {
      recText = '${loc.t('homeCare')}: Mild symptoms. Rest well, stay hydrated, and monitor your symptoms for 24 hours.';
    }

    setState(() {
      _recommendation = recText;
    });

    final lang = context.read<LanguageProvider>().currentLanguage;
    TtsService().speak(recText, language: lang);
  }

  void _startVoiceInput() async {
    final lang = context.read<LanguageProvider>().currentLanguage;
    setState(() => _isListening = true);
    await _speechService.startListening(
      language: lang,
      onResult: (text) {
        setState(() {
          _symptomTextController.text = text;
        });
      },
      onDone: () {
        setState(() => _isListening = false);
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final loc = AppLocalizations.of(context);

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(Icons.health_and_safety, color: Theme.of(context).colorScheme.primary),
                      const SizedBox(width: 8),
                      Text(
                        loc.t('symptomChecker'),
                        style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    loc.t('symptomsPrompt'),
                    style: Theme.of(context).textTheme.bodyMedium,
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          // Free text / Voice Input
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _symptomTextController,
                  decoration: InputDecoration(
                    hintText: loc.t('symptomsPrompt'),
                    suffixIcon: IconButton(
                      icon: Icon(
                        _isListening ? Icons.mic : Icons.mic_none,
                        color: _isListening ? Colors.red : Theme.of(context).colorScheme.primary,
                      ),
                      onPressed: _isListening ? () => _speechService.stopListening() : _startVoiceInput,
                    ),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            'Select Common Symptoms:',
            style: Theme.of(context).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: _selectedSymptoms.keys.map((key) {
              final isSelected = _selectedSymptoms[key]!;
              return FilterChip(
                label: Text(loc.t(key)),
                selected: isSelected,
                onSelected: (val) {
                  setState(() {
                    _selectedSymptoms[key] = val;
                  });
                },
              );
            }).toList(),
          ),
          const SizedBox(height: 20),
          SizedBox(
            width: double.infinity,
            child: FilledButton.icon(
              onPressed: _analyzeSymptoms,
              icon: const Icon(Icons.analytics),
              label: Text(loc.t('checkSymptoms')),
            ),
          ),
          if (_recommendation != null) ...[
            const SizedBox(height: 24),
            Card(
              color: Theme.of(context).colorScheme.primaryContainer.withOpacity(0.3),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          loc.t('resultTitle'),
                          style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
                        ),
                        ListenButton(text: _recommendation!),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      _recommendation!,
                      style: Theme.of(context).textTheme.bodyMedium,
                    ),
                  ],
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }
}
