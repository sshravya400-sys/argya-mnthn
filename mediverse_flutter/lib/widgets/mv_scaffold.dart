import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../core/l10n/app_localizations.dart';
import '../providers/connectivity_provider.dart';
import '../providers/theme_provider.dart';

class MvScaffold extends StatelessWidget {
  final StatefulNavigationShell navigationShell;

  const MvScaffold({
    super.key,
    required this.navigationShell,
  });

  void _onDestinationSelected(int index) {
    navigationShell.goBranch(
      index,
      initialLocation: index == navigationShell.currentIndex,
    );
  }

  @override
  Widget build(BuildContext context) {
    final loc = AppLocalizations.of(context);
    final isOnline = context.watch<ConnectivityProvider>().isOnline;
    final themeProv = context.watch<ThemeProvider>();

    return LayoutBuilder(
      builder: (context, constraints) {
        final isWideScreen = constraints.maxWidth >= 640;

        return Scaffold(
          appBar: AppBar(
            title: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(6),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFF10B981), Color(0xFF0D9488)],
                    ),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Icon(Icons.favorite, color: Colors.white, size: 20),
                ),
                const SizedBox(width: 8),
                Text(
                  loc.t('appName'),
                  style: const TextStyle(fontWeight: FontWeight.black, fontSize: 20),
                ),
              ],
            ),
            actions: [
              IconButton(
                icon: Icon(
                  themeProv.isDarkMode ? Icons.light_mode : Icons.dark_mode,
                ),
                onPressed: () => themeProv.toggleTheme(),
                tooltip: 'Toggle Theme',
              ),
            ],
          ),
          body: Column(
            children: [
              if (!isOnline)
                Container(
                  color: Colors.amber.shade700,
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(vertical: 4, horizontal: 12),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.wifi_off, color: Colors.white, size: 16),
                      const SizedBox(width: 6),
                      Text(
                        loc.t('offlineMessage'),
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),
              Expanded(
                child: isWideScreen
                    ? Row(
                        children: [
                          NavigationRail(
                            selectedIndex: navigationShell.currentIndex,
                            onDestinationSelected: _onDestinationSelected,
                            labelType: NavigationRailLabelType.all,
                            destinations: [
                              NavigationRailDestination(
                                icon: const Icon(Icons.home_outlined),
                                selectedIcon: const Icon(Icons.home),
                                label: Text(loc.t('home')),
                              ),
                              NavigationRailDestination(
                                icon: const Icon(Icons.health_and_safety_outlined),
                                selectedIcon: const Icon(Icons.health_and_safety),
                                label: Text(loc.t('symptomChecker')),
                              ),
                              NavigationRailDestination(
                                icon: const Icon(Icons.medical_services_outlined),
                                selectedIcon: const Icon(Icons.medical_services),
                                label: Text(loc.t('nearbyDoctors')),
                              ),
                              NavigationRailDestination(
                                icon: const Icon(Icons.medication_outlined),
                                selectedIcon: const Icon(Icons.medication),
                                label: Text(loc.t('medicineReminder')),
                              ),
                              NavigationRailDestination(
                                icon: const Icon(Icons.folder_outlined),
                                selectedIcon: const Icon(Icons.folder),
                                label: Text(loc.t('healthLocker')),
                              ),
                              NavigationRailDestination(
                                icon: const Icon(Icons.emergency_outlined),
                                selectedIcon: const Icon(Icons.emergency),
                                label: Text(loc.t('emergency')),
                              ),
                              NavigationRailDestination(
                                icon: const Icon(Icons.settings_outlined),
                                selectedIcon: const Icon(Icons.settings),
                                label: Text(loc.t('settings')),
                              ),
                            ],
                          ),
                          const VerticalDivider(thickness: 1, width: 1),
                          Expanded(child: navigationShell),
                        ],
                      )
                    : navigationShell,
              ),
            ],
          ),
          bottomNavigationBar: isWideScreen
              ? null
              : NavigationBar(
                  selectedIndex: navigationShell.currentIndex,
                  onDestinationSelected: _onDestinationSelected,
                  destinations: [
                    NavigationDestination(
                      icon: const Icon(Icons.home_outlined),
                      selectedIcon: const Icon(Icons.home),
                      label: loc.t('home'),
                    ),
                    NavigationDestination(
                      icon: const Icon(Icons.health_and_safety_outlined),
                      selectedIcon: const Icon(Icons.health_and_safety),
                      label: loc.t('symptomChecker'),
                    ),
                    NavigationDestination(
                      icon: const Icon(Icons.medical_services_outlined),
                      selectedIcon: const Icon(Icons.medical_services),
                      label: loc.t('nearbyDoctors'),
                    ),
                    NavigationDestination(
                      icon: const Icon(Icons.medication_outlined),
                      selectedIcon: const Icon(Icons.medication),
                      label: loc.t('medicineReminder'),
                    ),
                    NavigationDestination(
                      icon: const Icon(Icons.folder_outlined),
                      selectedIcon: const Icon(Icons.folder),
                      label: loc.t('healthLocker'),
                    ),
                    NavigationDestination(
                      icon: const Icon(Icons.emergency_outlined),
                      selectedIcon: const Icon(Icons.emergency),
                      label: loc.t('emergency'),
                    ),
                    NavigationDestination(
                      icon: const Icon(Icons.settings_outlined),
                      selectedIcon: const Icon(Icons.settings),
                      label: loc.t('settings'),
                    ),
                  ],
                ),
        );
      },
    );
  }
}
