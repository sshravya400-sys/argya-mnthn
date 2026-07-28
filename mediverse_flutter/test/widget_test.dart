import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:mediverse/main.dart';
import 'package:mediverse/providers/theme_provider.dart';
import 'package:mediverse/providers/language_provider.dart';
import 'package:mediverse/providers/reminder_provider.dart';
import 'package:mediverse/providers/health_record_provider.dart';
import 'package:mediverse/providers/doctor_provider.dart';
import 'package:mediverse/providers/connectivity_provider.dart';

void main() {
  testWidgets('MediVerse App smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(
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

    // Verify app title renders on Home Screen
    expect(find.text('MediVerse'), findsWidgets);
  });
}
