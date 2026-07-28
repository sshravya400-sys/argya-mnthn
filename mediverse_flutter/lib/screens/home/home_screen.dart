import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/l10n/app_localizations.dart';
import '../../widgets/dashboard_card.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final loc = AppLocalizations.of(context);

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Banner
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF10B981), Color(0xFF0D9488)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(24),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFF10B981).withOpacity(0.3),
                  blurRadius: 16,
                  offset: const Offset(0, 8),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  loc.t('welcome'),
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 24,
                    fontWeight: FontWeight.black,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  loc.t('welcomeSubtitle'),
                  style: const TextStyle(
                    color: Colors.white70,
                    fontSize: 14,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          Text(
            'Quick Actions',
            style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
          ),
          const SizedBox(height: 16),
          // Responsive Grid
          LayoutBuilder(
            builder: (context, constraints) {
              final crossAxisCount = constraints.maxWidth > 600 ? 3 : 2;
              return GridView.count(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                crossAxisCount: crossAxisCount,
                crossAxisSpacing: 12,
                mainAxisSpacing: 12,
                childAspectRatio: 1.1,
                children: [
                  DashboardCard(
                    title: loc.t('symptomChecker'),
                    subtitle: loc.t('checkSymptoms'),
                    icon: Icons.health_and_safety,
                    gradientStart: const Color(0xFF10B981),
                    gradientEnd: const Color(0xFF059669),
                    onTap: () => context.go('/symptom-checker'),
                  ),
                  DashboardCard(
                    title: loc.t('nearbyDoctors'),
                    subtitle: loc.t('searchDoctors'),
                    icon: Icons.medical_services,
                    gradientStart: const Color(0xFF3B82F6),
                    gradientEnd: const Color(0xFF1D4ED8),
                    onTap: () => context.go('/nearby-doctors'),
                  ),
                  DashboardCard(
                    title: loc.t('medicineReminder'),
                    subtitle: loc.t('addReminder'),
                    icon: Icons.medication,
                    gradientStart: const Color(0xFF8B5CF6),
                    gradientEnd: const Color(0xFF6D28D9),
                    onTap: () => context.go('/medicine-reminder'),
                  ),
                  DashboardCard(
                    title: loc.t('healthLocker'),
                    subtitle: loc.t('viewRecords'),
                    icon: Icons.folder,
                    gradientStart: const Color(0xFFF59E0B),
                    gradientEnd: const Color(0xFFD97706),
                    onTap: () => context.go('/health-locker'),
                  ),
                  DashboardCard(
                    title: loc.t('emergency'),
                    subtitle: loc.t('callHelp'),
                    icon: Icons.emergency,
                    gradientStart: const Color(0xFFEF4444),
                    gradientEnd: const Color(0xFFDC2626),
                    onTap: () => context.go('/emergency'),
                  ),
                  DashboardCard(
                    title: loc.t('settings'),
                    subtitle: loc.t('settingsDesc'),
                    icon: Icons.settings,
                    gradientStart: const Color(0xFF6B7280),
                    gradientEnd: const Color(0xFF4B5563),
                    onTap: () => context.go('/settings'),
                  ),
                ],
              );
            },
          ),
        ],
      ),
    );
  }
}
