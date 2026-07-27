class UploadedFile {
  final String id;
  final String name;
  final String path; // local file path
  final String ext;
  final int size;
  final String uploadDate;

  const UploadedFile({
    required this.id, required this.name, required this.path,
    required this.ext, required this.size, required this.uploadDate,
  });

  Map<String, dynamic> toMap() => {
    'id': id, 'name': name, 'path': path, 'ext': ext,
    'size': size, 'uploadDate': uploadDate,
  };

  factory UploadedFile.fromMap(Map<String, dynamic> m) => UploadedFile(
    id: m['id'], name: m['name'], path: m['path'] ?? '', ext: m['ext'] ?? '',
    size: m['size'] ?? 0, uploadDate: m['uploadDate'] ?? '',
  );

  String get formattedSize {
    if (size < 1024) return '$size B';
    if (size < 1024 * 1024) return '${(size / 1024).toStringAsFixed(1)} KB';
    return '${(size / (1024 * 1024)).toStringAsFixed(2)} MB';
  }
}
