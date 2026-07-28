import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../core/data/mock_doctors.dart';
import '../../core/l10n/app_localizations.dart';
import '../../providers/doctor_provider.dart';

import '../../widgets/listen_button.dart';

class NearbyDoctorsScreen extends StatefulWidget {
  const NearbyDoctorsScreen({super.key});

  @override
  State<NearbyDoctorsScreen> createState() => _NearbyDoctorsScreenState();
}

class _NearbyDoctorsScreenState extends State<NearbyDoctorsScreen> {
  final TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    // Default initial search
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final docProv = context.read<DoctorProvider>();
      if (!docProv.hasSearched) {
        docProv.search('bangalore');
      }
    });
  }

  void _makeCall(String phone) async {
    final uri = Uri.parse('tel:${phone.replaceAll(' ', '')}');
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    }
  }

  void _openMaps(String url) async {
    final uri = Uri.parse(url);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }

  @override
  Widget build(BuildContext context) {
    final loc = AppLocalizations.of(context);
    final docProv = context.watch<DoctorProvider>();

    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        children: [
          // Search box
          TextField(
            controller: _searchController,
            decoration: InputDecoration(
              hintText: loc.t('searchPlaceholder'),
              prefixIcon: const Icon(Icons.search),
              suffixIcon: IconButton(
                icon: const Icon(Icons.arrow_forward),
                onPressed: () {
                  docProv.search(_searchController.text);
                },
              ),
            ),
            onSubmitted: (val) => docProv.search(val),
          ),
          const SizedBox(height: 8),
          // Specialization chips
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: allSpecializations.map((spec) {
                final isSelected = docProv.selectedSpec == spec;
                return Padding(
                  padding: const EdgeInsets.only(right: 6.0),
                  child: FilterChip(
                    label: Text(spec),
                    selected: isSelected,
                    onSelected: (_) => docProv.setSpecializationFilter(spec),
                  ),
                );
              }).toList(),
            ),
          ),
          const SizedBox(height: 12),
          // Results
          Expanded(
            child: docProv.isLoading
                ? const Center(child: CircularProgressIndicator())
                : docProv.searchResults.isEmpty
                    ? Center(child: Text(loc.t('noResults')))
                    : ListView.builder(
                        itemCount: docProv.searchResults.length,
                        itemBuilder: (context, index) {
                          final doc = docProv.searchResults[index];
                          final speakText =
                              '${doc.name}, ${doc.spec} at ${doc.hospital}. ${doc.address}. ${doc.dist} km away. ${doc.available ? "Available now" : "Unavailable"}. Phone: ${doc.phone}';

                          return Card(
                            margin: const EdgeInsets.only(bottom: 12),
                            child: Padding(
                              padding: const EdgeInsets.all(16.0),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      CircleAvatar(
                                        backgroundColor: Theme.of(context).colorScheme.primaryContainer,
                                        child: Icon(Icons.person, color: Theme.of(context).colorScheme.primary),
                                      ),
                                      const SizedBox(width: 12),
                                      Expanded(
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Text(
                                              doc.name,
                                              style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
                                            ),
                                            Text(
                                              '${doc.spec} • ${doc.hospital}',
                                              style: Theme.of(context).textTheme.bodySmall?.copyWith(color: Theme.of(context).colorScheme.primary),
                                            ),
                                          ],
                                        ),
                                      ),
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                        decoration: BoxDecoration(
                                          color: doc.available ? Colors.green.shade100 : Colors.red.shade100,
                                          borderRadius: BorderRadius.circular(12),
                                        ),
                                        child: Text(
                                          doc.available ? loc.t('availableNow') : loc.t('unavailable'),
                                          style: TextStyle(
                                            fontSize: 10,
                                            fontWeight: FontWeight.bold,
                                            color: doc.available ? Colors.green.shade800 : Colors.red.shade800,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 12),
                                  Text(doc.address, style: Theme.of(context).textTheme.bodySmall),
                                  const SizedBox(height: 4),
                                  Row(
                                    children: [
                                      const Icon(Icons.location_on, size: 14, color: Colors.grey),
                                      Text('${doc.dist} ${loc.t("kmAway")}', style: const TextStyle(fontSize: 12)),
                                      const SizedBox(width: 12),
                                      const Icon(Icons.star, size: 14, color: Colors.amber),
                                      Text('${doc.rating} / 5 (${doc.experience})', style: const TextStyle(fontSize: 12)),
                                    ],
                                  ),
                                  const SizedBox(height: 12),
                                  Row(
                                    children: [
                                      Expanded(
                                        child: OutlinedButton.icon(
                                          onPressed: () => _makeCall(doc.phone),
                                          icon: const Icon(Icons.phone, size: 16),
                                          label: Text(loc.t('callDoctor')),
                                        ),
                                      ),
                                      const SizedBox(width: 8),
                                      Expanded(
                                        child: FilledButton.icon(
                                          onPressed: () => _openMaps(doc.mapsUrl),
                                          icon: const Icon(Icons.directions, size: 16),
                                          label: Text(loc.t('getDirections')),
                                        ),
                                      ),
                                      const SizedBox(width: 8),
                                      ListenButton(text: speakText, compact: true),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
          ),
        ],
      ),
    );
  }
}
