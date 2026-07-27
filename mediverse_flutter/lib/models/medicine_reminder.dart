class MedicineReminder {
  final String id;
  final String medicineName;
  final String dosage;
  final String date;
  final String time; // required HH:mm
  final String frequency; // daily | weekly | monthly
  final String timeSlot;  // morning | afternoon | evening | night
  final String reason;
  bool taken;
  String? takenAt;

  MedicineReminder({
    required this.id,
    required this.medicineName,
    this.dosage = '',
    this.date = '',
    required this.time,
    this.frequency = 'daily',
    this.timeSlot = 'morning',
    this.reason = '',
    this.taken = false,
    this.takenAt,
  });

  Map<String, dynamic> toMap() => {
    'id': id, 'medicineName': medicineName, 'dosage': dosage, 'date': date,
    'time': time, 'frequency': frequency, 'timeSlot': timeSlot, 'reason': reason,
    'taken': taken, 'takenAt': takenAt,
  };

  factory MedicineReminder.fromMap(Map<String, dynamic> m) => MedicineReminder(
    id: m['id'], medicineName: m['medicineName'], dosage: m['dosage'] ?? '',
    date: m['date'] ?? '', time: m['time'], frequency: m['frequency'] ?? 'daily',
    timeSlot: m['timeSlot'] ?? 'morning', reason: m['reason'] ?? '',
    taken: m['taken'] ?? false, takenAt: m['takenAt'],
  );
}
