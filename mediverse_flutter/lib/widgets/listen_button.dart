import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../core/l10n/app_localizations.dart';
import '../providers/language_provider.dart';
import '../services/tts_service.dart';

class ListenButton extends StatefulWidget {
  final String text;
  final bool compact;

  const ListenButton({
    super.key,
    required this.text,
    this.compact = false,
  });

  @override
  State<ListenButton> createState() => _ListenButtonState();
}

class _ListenButtonState extends State<ListenButton> {
  bool _isSpeaking = false;

  void _handleListen() async {
    final lang = context.read<LanguageProvider>().currentLanguage;
    setState(() => _isSpeaking = true);
    await TtsService().speak(widget.text, language: lang);
    if (mounted) {
      setState(() => _isSpeaking = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final loc = AppLocalizations.of(context);

    if (widget.compact) {
      return IconButton(
        icon: Icon(
          _isSpeaking ? Icons.volume_up : Icons.volume_up_outlined,
          color: Theme.of(context).colorScheme.primary,
        ),
        onPressed: _handleListen,
        tooltip: loc.t('listenAgain'),
      );
    }

    return OutlinedButton.icon(
      style: OutlinedButton.styleFrom(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        side: BorderSide(color: Theme.of(context).colorScheme.primary.withOpacity(0.5)),
      ),
      icon: _isSpeaking
          ? const SizedBox(
              width: 14,
              height: 14,
              child: CircularProgressIndicator(strokeWidth: 2),
            )
          : Icon(Icons.volume_up, size: 16, color: Theme.of(context).colorScheme.primary),
      label: Text(
        loc.t('listenAgain'),
        style: TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.w600,
          color: Theme.of(context).colorScheme.primary,
        ),
      ),
      onPressed: _isSpeaking ? null : _handleListen,
    );
  }
}
