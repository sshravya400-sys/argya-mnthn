class HealthRecord {
  String bloodGroup;
  List<String> allergies;
  List<String> diseases;
  List<String> vaccinations;

  HealthRecord({
    this.bloodGroup = '',
    List<String>? allergies,
    List<String>? diseases,
    List<String>? vaccinations,
  })  : allergies = allergies ?? [],
        diseases = diseases ?? [],
        vaccinations = vaccinations ?? [];

  Map<String, dynamic> toMap() => {
    'bloodGroup': bloodGroup,
    'allergies': allergies,
    'diseases': diseases,
    'vaccinations': vaccinations,
  };

  factory HealthRecord.fromMap(Map<String, dynamic> m) => HealthRecord(
    bloodGroup: m['bloodGroup'] ?? '',
    allergies: List<String>.from(m['allergies'] ?? []),
    diseases: List<String>.from(m['diseases'] ?? []),
    vaccinations: List<String>.from(m['vaccinations'] ?? []),
  );
}
