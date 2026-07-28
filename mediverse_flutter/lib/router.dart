import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'screens/about/about_screen.dart';
import 'screens/emergency/emergency_screen.dart';
import 'screens/health_locker/health_locker_screen.dart';
import 'screens/home/home_screen.dart';
import 'screens/medicine_reminder/medicine_reminder_screen.dart';
import 'screens/nearby_doctors/nearby_doctors_screen.dart';
import 'screens/settings/settings_screen.dart';
import 'screens/symptom_checker/symptom_checker_screen.dart';
import 'widgets/mv_scaffold.dart';

final GlobalKey<NavigatorState> _rootNavigatorKey = GlobalKey<NavigatorState>(debugLabel: 'root');

final GoRouter appRouter = GoRouter(
  navigatorKey: _rootNavigatorKey,
  initialLocation: '/',
  routes: [
    StatefulShellRoute.indexedStack(
      builder: (context, state, navigationShell) {
        return MvScaffold(navigationShell: navigationShell);
      },
      branches: [
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: '/',
              builder: (context, state) => const HomeScreen(),
            ),
          ],
        ),
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: '/symptom-checker',
              builder: (context, state) => const SymptomCheckerScreen(),
            ),
          ],
        ),
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: '/nearby-doctors',
              builder: (context, state) => const NearbyDoctorsScreen(),
            ),
          ],
        ),
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: '/medicine-reminder',
              builder: (context, state) => const MedicineReminderScreen(),
            ),
          ],
        ),
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: '/health-locker',
              builder: (context, state) => const HealthLockerScreen(),
            ),
          ],
        ),
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: '/emergency',
              builder: (context, state) => const EmergencyScreen(),
            ),
          ],
        ),
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: '/settings',
              builder: (context, state) => const SettingsScreen(),
            ),
          ],
        ),
      ],
    ),
    GoRoute(
      path: '/about',
      parentNavigatorKey: _rootNavigatorKey,
      builder: (context, state) => const AboutScreen(),
    ),
  ],
);
