import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:provider/provider.dart';
import 'core/l10n/app_localizations.dart';
import 'core/theme/app_theme.dart';
import 'providers/connectivity_provider.dart';
import 'providers/doctor_provider.dart';
import 'providers/health_record_provider.dart';
import 'providers/language_provider.dart';
import 'providers/reminder_provider.dart';
import 'providers/theme_provider.dart';
import 'router.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => ThemeProvider()),
        ChangeNotifierProvider(create: (_) => LanguageProvider()),
        ChangeNotifierProvider(create: (_) => ReminderProvider()),
        ChangeNotifierProvider(create: (_) => HealthRecordProvider()),
        ChangeNotifierProvider(create: (_) => DoctorProvider()),
        ChangeNotifierProvider(create: (_) => ConnectivityProvider()),
      ],
      child: const MediVerseApp(),
    ),
  );
}

class MediVerseApp extends StatelessWidget {
  const MediVerseApp({super.key});

  @override
  Widget build(BuildContext context) {
    final themeProv = context.watch<ThemeProvider>();
    final langProv = context.watch<LanguageProvider>();

    return MaterialApp.router(
      title: 'MediVerse',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light(fontScale: themeProv.fontScale),
      darkTheme: AppTheme.dark(fontScale: themeProv.fontScale),
      themeMode: themeProv.isDarkMode ? ThemeMode.dark : ThemeMode.light,
      locale: langProv.currentLocale,
      supportedLocales: const [
        Locale('en'), Locale('hi'), Locale('kn'), Locale('ta'),
        Locale('te'), Locale('ml'), Locale('mr'), Locale('bn'),
        Locale('gu'), Locale('pa'), Locale('ur'),
      ],
      localizationsDelegates: const [
        AppLocalizations.delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      routerConfig: appRouter,
    );
  }
}
