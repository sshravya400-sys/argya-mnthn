import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/l10n/app_localizations.dart';
import '../../models/uploaded_file.dart';
import '../../providers/health_record_provider.dart';
import '../../widgets/listen_button.dart';
import '../../widgets/tag_input_field.dart';

class HealthLockerScreen extends StatelessWidget {
  const HealthLockerScreen({super.key});

  void _pickAndUploadFile(BuildContext context) async {
    final loc = AppLocalizations.of(context);
    final result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['pdf', 'png', 'jpg', 'jpeg', 'doc', 'docx', 'txt'],
    );

    if (result != null && result.files.isNotEmpty) {
      final file = result.files.first;
      if (file.size > 2 * 1024 * 1024) {
        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(loc.t('fileTooLarge'))),
          );
        }
        return;
      }

      final newFile = UploadedFile(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        name: file.name,
        path: file.path ?? '',
        ext: file.extension ?? 'file',
        size: file.size,
        uploadDate: DateTime.now().toString().split(' ')[0],
      );

      if (context.mounted) {
        context.read<HealthRecordProvider>().addUploadedFile(newFile);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final loc = AppLocalizations.of(context);
    final hrProv = context.watch<HealthRecordProvider>();
    final record = hrProv.record;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Blood Group Card
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.water_drop, color: Colors.red),
                      const SizedBox(width: 8),
                      Text(
                        loc.t('bloodGroup'),
                        style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Wrap(
                    spacing: 8,
                    children: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) {
                      final isSelected = record.bloodGroup == bg;
                      return ChoiceChip(
                        label: Text(bg),
                        selected: isSelected,
                        onSelected: (val) {
                          if (val) hrProv.updateBloodGroup(bg);
                        },
                      );
                    }).toList(),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          // Allergies Card
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.warning_amber, color: Colors.orange),
                      const SizedBox(width: 8),
                      Text(
                        loc.t('allergies'),
                        style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  TagInputField(
                    tags: record.allergies,
                    onAdd: (item) => hrProv.addAllergy(item),
                    onRemove: (idx) => hrProv.removeAllergy(idx),
                    placeholder: 'e.g. Penicillin',
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          // Diseases / Conditions
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.healing, color: Colors.purple),
                      const SizedBox(width: 8),
                      Text(
                        loc.t('diseases'),
                        style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  TagInputField(
                    tags: record.diseases,
                    onAdd: (item) => hrProv.addDisease(item),
                    onRemove: (idx) => hrProv.removeDisease(idx),
                    placeholder: 'e.g. Diabetes',
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 24),
          // Uploaded Files Header
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                loc.t('uploadedFiles'),
                style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
              ),
              FilledButton.icon(
                onPressed: () => _pickAndUploadFile(context),
                icon: const Icon(Icons.upload_file, size: 18),
                label: Text(loc.t('uploadFile')),
              ),
            ],
          ),
          const SizedBox(height: 12),
          if (hrProv.files.isEmpty)
            Card(
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.all(32),
                child: Column(
                  children: [
                    Icon(Icons.folder_open, size: 48, color: Colors.grey.shade400),
                    const SizedBox(height: 8),
                    Text(loc.t('noFilesUploaded')),
                  ],
                ),
              ),
            )
          else
            ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: hrProv.files.length,
              itemBuilder: (context, index) {
                final file = hrProv.files[index];
                final speakText = 'Uploaded File: ${file.name}. Size: ${file.formattedSize}. Date: ${file.uploadDate}';

                return Card(
                  margin: const EdgeInsets.only(bottom: 8),
                  child: ListTile(
                    leading: const CircleAvatar(
                      child: Icon(Icons.insert_drive_file),
                    ),
                    title: Text(file.name, maxLines: 1, overflow: TextOverflow.ellipsis),
                    subtitle: Text('${file.formattedSize} • ${file.uploadDate}'),
                    trailing: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        ListenButton(text: speakText, compact: true),
                        IconButton(
                          icon: const Icon(Icons.delete_outline, color: Colors.red),
                          onPressed: () => hrProv.deleteUploadedFile(file.id),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
        ],
      ),
    );
  }
}
