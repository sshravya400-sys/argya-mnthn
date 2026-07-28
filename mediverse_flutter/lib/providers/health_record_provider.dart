import 'package:flutter/material.dart';
import '../models/health_record.dart';
import '../models/uploaded_file.dart';
import '../services/storage_service.dart';

class HealthRecordProvider extends ChangeNotifier {
  final StorageService _storage = StorageService();
  HealthRecord _record = HealthRecord();
  List<UploadedFile> _files = [];
  bool _isLoading = true;

  HealthRecord get record => _record;
  List<UploadedFile> get files => _files;
  bool get isLoading => _isLoading;

  HealthRecordProvider() {
    loadData();
  }

  Future<void> loadData() async {
    _isLoading = true;
    notifyListeners();
    _record = await _storage.getHealthRecord();
    _files = await _storage.getUploadedFiles();
    _isLoading = false;
    notifyListeners();
  }

  Future<void> updateBloodGroup(String bg) async {
    _record.bloodGroup = bg;
    await _storage.saveHealthRecord(_record);
    notifyListeners();
  }

  Future<void> addAllergy(String item) async {
    if (!_record.allergies.contains(item)) {
      _record.allergies.add(item);
      await _storage.saveHealthRecord(_record);
      notifyListeners();
    }
  }

  Future<void> removeAllergy(int index) async {
    if (index >= 0 && index < _record.allergies.length) {
      _record.allergies.removeAt(index);
      await _storage.saveHealthRecord(_record);
      notifyListeners();
    }
  }

  Future<void> addDisease(String item) async {
    if (!_record.diseases.contains(item)) {
      _record.diseases.add(item);
      await _storage.saveHealthRecord(_record);
      notifyListeners();
    }
  }

  Future<void> removeDisease(int index) async {
    if (index >= 0 && index < _record.diseases.length) {
      _record.diseases.removeAt(index);
      await _storage.saveHealthRecord(_record);
      notifyListeners();
    }
  }

  Future<void> addVaccination(String item) async {
    if (!_record.vaccinations.contains(item)) {
      _record.vaccinations.add(item);
      await _storage.saveHealthRecord(_record);
      notifyListeners();
    }
  }

  Future<void> removeVaccination(int index) async {
    if (index >= 0 && index < _record.vaccinations.length) {
      _record.vaccinations.removeAt(index);
      await _storage.saveHealthRecord(_record);
      notifyListeners();
    }
  }

  Future<void> addUploadedFile(UploadedFile file) async {
    _files.insert(0, file);
    await _storage.saveUploadedFiles(_files);
    notifyListeners();
  }

  Future<void> deleteUploadedFile(String id) async {
    _files.removeWhere((f) => f.id == id);
    await _storage.saveUploadedFiles(_files);
    notifyListeners();
  }
}
