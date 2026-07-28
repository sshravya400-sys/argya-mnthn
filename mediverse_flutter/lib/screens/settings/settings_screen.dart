import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../core/l10n/app_localizations.dart';
import '../../core/l10n/translations.dart';
import '../../providers/language_provider.dart';
import '../../providers/theme_provider.dart';
import '../../services/storage_service.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final loc = AppLocalizations.of(context);
    final themeProv = context.watch<ThemeProvider>();
    final langProv = context.watch<LanguageProvider>();

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Theme Settings Card
          Card(
            child: Column(
              children: [
                SwitchListTile(
                  secondary: const Icon(Icons.dark_mode),
                  title: Text(loc.t('darkMode')),
                  value: themeProv.isDarkMode,
                  onChanged: (_) => themeProv.toggleTheme(),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          // Language Selection Card
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.language),
                      const SizedBox(width: 8),
                      Text(
                        loc.t('language'),
                        style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: availableLanguages.map((langMap) {
                      final code = langMap['code']!;
                      final native = langMap['native']!;
                      final isSelected = langProv.currentLanguage == code;

                      return ChoiceChip(
                        label: Text(native),
                        selected: isSelected,
                        onSelected: (val) {
                          if (val) langProv.setLanguage(code);
                        },
                      );
                    }).toList(),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          // Font Scaling Card
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.text_fields),
                      const SizedBox(width: 8),
                      Text(
                        loc.t('fontSize'),
                        style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Slider(
                    value: themeProv.fontScale,
                    min: 0.8,
                    max: 1.4,
                    divisions: 3,
                    label: '${(themeProv.fontScale * 100).toInt()}%',
                    onChanged: (val) => themeProv.setFontScale(val),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          // Actions Card
          Card(
            child: Column(
              children: [
                ListTile(
                  leading: const Icon(Icons.info_outline),
                  title: Text(loc.t('about')),
                  trailing: const Icon(Icons.chevron_right),
                  onTap: () => context.go('/about'),
                ),
                const Divider(height: 1),
                ListTile(
                  leading: const Icon(Icons.delete_forever, color: Colors.red),
                  title: Text(loc.t('clearData'), style: const TextStyle(color: Colors.red)),
                  onTap: () async {
                    final confirm = await showDialog<bool>(
                      context: context,
                      builder: (ctx) => AlertDialog(
                        title: const Text('Clear All Data?'),
                        content: const Text('This will delete all saved reminders, health records, and preferences.'),
                        actions: [
                          TextButton(onPressed: () => Navigator.pop(ctx, false), child: Text(loc.t('cancel'))),
                          TextButton(onPressed: () => Navigator.pop(ctx, true), child: Text(loc.t('delete'), style: const TextStyle(color: Colors.red))),
                        ],
                      ),
                    );

                    if (confirm == true) {
                      await StorageService().clearAll();
                      if (context.mounted) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('All local data cleared.')),
                        );
                      }
                    }
                  },
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
