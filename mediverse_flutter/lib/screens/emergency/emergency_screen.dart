import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../core/l10n/app_localizations.dart';

class EmergencyScreen extends StatelessWidget {
  const EmergencyScreen({super.key});

  void _callNumber(String number) async {
    final uri = Uri.parse('tel:$number');
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    }
  }

  @override
  Widget build(BuildContext context) {
    final loc = AppLocalizations.of(context);

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Big SOS Call Button
          Card(
            color: Colors.red.shade600,
            child: InkWell(
              onTap: () => _callNumber('108'),
              borderRadius: BorderRadius.circular(16),
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(vertical: 32, horizontal: 24),
                child: Column(
                  children: [
                    const Icon(Icons.sos, size: 64, color: Colors.white),
                    const SizedBox(height: 12),
                    Text(
                      loc.t('sosButton'),
                      style: const TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.black,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 4),
                    const Text(
                      'Tap to call 108 Emergency Helpline immediately',
                      style: TextStyle(color: Colors.white70, fontSize: 13),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),
            ),
          ),
          const SizedBox(height: 24),
          Text(
            'National Emergency Services',
            style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),
          // Helpline cards
          _buildHelplineCard(
            context,
            title: loc.t('ambulance'),
            number: '108',
            icon: Icons.airport_shuttle,
            color: Colors.red,
          ),
          const SizedBox(height: 8),
          _buildHelplineCard(
            context,
            title: loc.t('police'),
            number: '100',
            icon: Icons.local_police,
            color: Colors.blue,
          ),
          const SizedBox(height: 8),
          _buildHelplineCard(
            context,
            title: loc.t('fire'),
            number: '101',
            icon: Icons.local_fire_department,
            color: Colors.orange,
          ),
          const SizedBox(height: 24),
          Text(
            loc.t('firstAid'),
            style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),
          Card(
            child: ExpansionTile(
              leading: const Icon(Icons.healing, color: Colors.green),
              title: const Text('Bleeding First Aid'),
              children: const [
                Padding(
                  padding: EdgeInsets.all(16.0),
                  child: Text(
                    '1. Apply direct pressure to the wound with a clean cloth.\n'
                    '2. Keep the injured limb elevated if possible.\n'
                    '3. Do not remove saturated bandages; layer new ones on top.\n'
                    '4. Seek emergency medical attention if bleeding does not stop.',
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 8),
          Card(
            child: ExpansionTile(
              leading: const Icon(Icons.wb_sunny, color: Colors.orange),
              title: const Text('Heat Stroke / Dehydration'),
              children: const [
                Padding(
                  padding: EdgeInsets.all(16.0),
                  child: Text(
                    '1. Move the person to a cool, shaded area.\n'
                    '2. Offer cool water or ORS solution in small sips.\n'
                    '3. Apply cool damp cloths to skin.\n'
                    '4. Call emergency services if fever is high or unconscious.',
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHelplineCard(
    BuildContext context, {
    required String title,
    required String number,
    required IconData icon,
    required Color color,
  }) {
    return Card(
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: color.withOpacity(0.15),
          child: Icon(icon, color: color),
        ),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
        subtitle: Text('Call $number'),
        trailing: FilledButton.icon(
          style: FilledButton.styleFrom(backgroundColor: color),
          onPressed: () => _callNumber(number),
          icon: const Icon(Icons.phone, size: 16),
          label: const Text('Call'),
        ),
      ),
    );
  }
}
