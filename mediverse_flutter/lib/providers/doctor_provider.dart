import 'package:flutter/material.dart';
import '../core/data/mock_doctors.dart';
import '../services/storage_service.dart';

class DoctorProvider extends ChangeNotifier {
  final StorageService _storage = StorageService();
  List<Doctor> _searchResults = [];
  bool _hasSearched = false;
  bool _isLoading = false;
  String _currentQuery = '';
  String _selectedSpec = '';

  List<Doctor> get searchResults => _searchResults;
  bool get hasSearched => _hasSearched;
  bool get isLoading => _isLoading;
  String get currentQuery => _currentQuery;
  String get selectedSpec => _selectedSpec;

  Future<void> search(String query, {String spec = ''}) async {
    _currentQuery = query;
    _selectedSpec = spec;
    _isLoading = true;
    _hasSearched = true;
    notifyListeners();

    await Future.delayed(const Duration(milliseconds: 400));
    _searchResults = searchDoctors(query, spec: spec);
    _isLoading = false;
    await _storage.saveDoctorQuery(query);
    notifyListeners();
  }

  void setSpecializationFilter(String spec) {
    if (_selectedSpec == spec) {
      _selectedSpec = '';
    } else {
      _selectedSpec = spec;
    }
    search(_currentQuery, spec: _selectedSpec);
  }

  void clearSearch() {
    _searchResults = [];
    _hasSearched = false;
    _currentQuery = '';
    _selectedSpec = '';
    notifyListeners();
  }
}
