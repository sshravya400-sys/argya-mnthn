import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/l10n/app_localizations.dart';
import '../../models/medicine_reminder.dart';
import '../../providers/language_provider.dart';
import '../../providers/reminder_provider.dart';
import '../../services/speech_service.dart';
import '../../widgets/listen_button.dart';

class MedicineReminderScreen extends StatefulWidget {
  const MedicineReminderScreen({super.key});

  @override
  State<MedicineReminderScreen> createState() => _MedicineReminderScreenState();
}

class _MedicineReminderScreenState extends State<MedicineReminderScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _dosageController = TextEditingController();
  final _timeController = TextEditingController();
  final _dateController = TextEditingController();
  final _reasonController = TextEditingController();

  String _frequency = 'daily';
  String _timeSlot = 'morning';
  String? _editingId;
  bool _isListeningReason = false;
  final SpeechService _speechService = SpeechService();

  void _showAddEditModal([MedicineReminder? reminder]) {
    final loc = AppLocalizations.of(context);
    if (reminder != null) {
      _editingId = reminder.id;
      _nameController.text = reminder.medicineName;
      _dosageController.text = reminder.dosage;
      _timeController.text = reminder.time;
      _dateController.text = reminder.date;
      _reasonController.text = reminder.reason;
      _frequency = reminder.frequency;
      _timeSlot = reminder.timeSlot;
    } else {
      _editingId = null;
      _nameController.clear();
      _dosageController.clear();
      _timeController.clear();
      _dateController.clear();
      _reasonController.clear();
      _frequency = 'daily';
      _timeSlot = 'morning';
    }

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return Padding(
              padding: EdgeInsets.only(
                bottom: MediaQuery.of(context).viewInsets.bottom,
                top: 24,
                left: 24,
                right: 24,
              ),
              child: SingleChildScrollView(
                child: Form(
                  key: _formKey,
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        _editingId == null ? loc.t('addMedicine') : loc.t('edit'),
                        style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        controller: _nameController,
                        decoration: InputDecoration(
                          labelText: loc.t('medicineName'),
                          prefixIcon: const Icon(Icons.medication),
                        ),
                        validator: (val) => val == null || val.trim().isEmpty ? 'Required' : null,
                      ),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          Expanded(
                            child: TextFormField(
                              controller: _dosageController,
                              decoration: InputDecoration(
                                labelText: loc.t('dosage'),
                              ),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: TextFormField(
                              controller: _timeController,
                              decoration: InputDecoration(
                                labelText: loc.t('time'),
                                prefixIcon: const Icon(Icons.access_time),
                              ),
                              validator: (val) => val == null || val.trim().isEmpty ? loc.t('timeRequired') : null,
                              onTap: () async {
                                FocusScope.of(context).requestFocus(FocusNode());
                                final tod = await showTimePicker(
                                  context: context,
                                  initialTime: TimeOfDay.now(),
                                );
                                if (tod != null) {
                                  _timeController.text = tod.format(context);
                                }
                              },
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          Expanded(
                            child: DropdownButtonFormField<String>(
                              value: _frequency,
                              decoration: InputDecoration(labelText: loc.t('frequency')),
                              items: ['daily', 'weekly', 'monthly']
                                  .map((f) => DropdownMenuItem(value: f, child: Text(loc.t(f))))
                                  .toList(),
                              onChanged: (val) => setModalState(() => _frequency = val!),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: DropdownButtonFormField<String>(
                              value: _timeSlot,
                              decoration: const InputDecoration(labelText: 'Slot'),
                              items: ['morning', 'afternoon', 'evening', 'night']
                                  .map((s) => DropdownMenuItem(value: s, child: Text(loc.t(s))))
                                  .toList(),
                              onChanged: (val) => setModalState(() => _timeSlot = val!),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      TextFormField(
                        controller: _reasonController,
                        decoration: InputDecoration(
                          labelText: loc.t('reasonForReminder'),
                          suffixIcon: IconButton(
                            icon: Icon(
                              _isListeningReason ? Icons.mic : Icons.mic_none,
                              color: _isListeningReason ? Colors.red : Theme.of(context).colorScheme.primary,
                            ),
                            onPressed: () async {
                              final lang = context.read<LanguageProvider>().currentLanguage;
                              setModalState(() => _isListeningReason = true);
                              await _speechService.startListening(
                                language: lang,
                                onResult: (text) {
                                  setModalState(() => _reasonController.text = text);
                                },
                                onDone: () {
                                  setModalState(() => _isListeningReason = false);
                                },
                              );
                            },
                          ),
                        ),
                      ),
                      const SizedBox(height: 24),
                      SizedBox(
                        width: double.infinity,
                        child: FilledButton(
                          onPressed: () {
                            if (_formKey.currentState!.validate()) {
                              final reminder = MedicineReminder(
                                id: _editingId ?? DateTime.now().millisecondsSinceEpoch.toString(),
                                medicineName: _nameController.text.trim(),
                                dosage: _dosageController.text.trim(),
                                time: _timeController.text.trim(),
                                date: _dateController.text.trim(),
                                frequency: _frequency,
                                timeSlot: _timeSlot,
                                reason: _reasonController.text.trim(),
                              );
                              context.read<ReminderProvider>().saveReminder(reminder);
                              Navigator.pop(context);
                            }
                          },
                          child: Text(loc.t('save')),
                        ),
                      ),
                      const SizedBox(height: 24),
                    ],
                  ),
                ),
              ),
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final loc = AppLocalizations.of(context);
    final reminderProv = context.watch<ReminderProvider>();

    return Scaffold(
      body: reminderProv.isLoading
          ? const Center(child: CircularProgressIndicator())
          : reminderProv.reminders.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.medication, size: 64, color: Colors.grey.shade400),
                      const SizedBox(height: 12),
                      Text(loc.t('noReminders')),
                    ],
                  ),
                )
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: reminderProv.reminders.length,
                  itemBuilder: (context, index) {
                    final item = reminderProv.reminders[index];
                    final speakText =
                        'Medicine: ${item.medicineName}. Dosage: ${item.dosage}. Time: ${item.time}. ${item.reason.isNotEmpty ? "Reason: ${item.reason}" : ""}';

                    return Card(
                      margin: const EdgeInsets.only(bottom: 12),
                      child: ListTile(
                        leading: CircleAvatar(
                          backgroundColor: item.taken ? Colors.green.shade100 : Theme.of(context).colorScheme.primaryContainer,
                          child: Icon(
                            Icons.medication,
                            color: item.taken ? Colors.green : Theme.of(context).colorScheme.primary,
                          ),
                        ),
                        title: Text(
                          item.medicineName,
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            decoration: item.taken ? TextDecoration.lineThrough : null,
                          ),
                        ),
                        subtitle: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('${item.dosage} • ${item.time} (${loc.t(item.timeSlot)})'),
                            if (item.reason.isNotEmpty) Text('Reason: ${item.reason}', style: const TextStyle(fontSize: 12)),
                          ],
                        ),
                        trailing: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Checkbox(
                              value: item.taken,
                              onChanged: (_) {
                                reminderProv.toggleTaken(item.id);
                              },
                            ),
                            ListenButton(text: speakText, compact: true),
                            IconButton(
                              icon: const Icon(Icons.delete_outline, size: 20, color: Colors.red),
                              onPressed: () => reminderProv.deleteReminder(item.id),
                            ),
                          ],
                        ),
                        onTap: () => _showAddEditModal(item),
                      ),
                    );
                  },
                ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _showAddEditModal(),
        icon: const Icon(Icons.add),
        label: Text(loc.t('addMedicine')),
      ),
    );
  }
}
