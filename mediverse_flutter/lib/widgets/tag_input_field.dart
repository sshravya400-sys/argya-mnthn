import 'package:flutter/material.dart';

class TagInputField extends StatefulWidget {
  final List<String> tags;
  final Function(String) onAdd;
  final Function(int) onRemove;
  final String placeholder;

  const TagInputField({
    super.key,
    required this.tags,
    required this.onAdd,
    required this.onRemove,
    required this.placeholder,
  });

  @override
  State<TagInputField> createState() => _TagInputFieldState();
}

class _TagInputFieldState extends State<TagInputField> {
  final TextEditingController _controller = TextEditingController();

  void _submit() {
    final text = _controller.text.trim();
    if (text.isNotEmpty) {
      widget.onAdd(text);
      _controller.clear();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (widget.tags.isNotEmpty)
          Wrap(
            spacing: 8,
            runSpacing: 4,
            children: widget.tags.asMap().entries.map((entry) {
              final idx = entry.key;
              final tag = entry.value;
              return Chip(
                label: Text(tag),
                onDeleted: () => widget.onRemove(idx),
                deleteIcon: const Icon(Icons.close, size: 14),
                materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
              );
            }).toList(),
          ),
        if (widget.tags.isNotEmpty) const SizedBox(height: 8),
        Row(
          children: [
            Expanded(
              child: TextField(
                controller: _controller,
                onSubmitted: (_) => _submit(),
                decoration: InputDecoration(
                  hintText: widget.placeholder,
                  isDense: true,
                ),
              ),
            ),
            const SizedBox(width: 8),
            IconButton.filled(
              onPressed: _submit,
              icon: const Icon(Icons.add),
            ),
          ],
        ),
      ],
    );
  }
}
