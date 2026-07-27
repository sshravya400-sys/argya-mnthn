// Mock doctor data — mirrors the React NearbyDoctors mock dataset
class Doctor {
  final int id;
  final String name;
  final String spec;
  final String hospital;
  final String address;
  final String city;
  final String state;
  final String pincode;
  final double dist;
  final bool available;
  final String phone;
  final double rating;
  final String experience;

  const Doctor({
    required this.id, required this.name, required this.spec,
    required this.hospital, required this.address, required this.city,
    required this.state, required this.pincode, required this.dist,
    required this.available, required this.phone, required this.rating,
    required this.experience,
  });

  String get mapsQuery => Uri.encodeComponent('$hospital $address');
  String get mapsUrl   => 'https://www.google.com/maps/search/?api=1&query=$mapsQuery';
}

const List<Doctor> mockDoctors = [
  Doctor(id:1,  name:'Dr. Rajesh Kumar',      spec:'General Physician',   hospital:'City Health Centre',       address:'MG Road, Bangalore',       city:'bangalore', state:'Karnataka',    pincode:'560001', dist:1.2,  available:true,  phone:'+91 98765 43210', rating:4.8, experience:'15 yrs'),
  Doctor(id:2,  name:'Dr. Meena Iyer',        spec:'Gynaecologist',       hospital:'Rainbow Women Clinic',     address:'Jayanagar, Bangalore',      city:'bangalore', state:'Karnataka',    pincode:'560041', dist:2.5,  available:true,  phone:'+91 97654 32109', rating:4.9, experience:'20 yrs'),
  Doctor(id:3,  name:'Dr. Suresh Patil',      spec:'Orthopaedic',         hospital:'Spine & Bone Hospital',   address:'Koramangala, Bangalore',    city:'bangalore', state:'Karnataka',    pincode:'560034', dist:3.1,  available:false, phone:'+91 96543 21098', rating:4.7, experience:'18 yrs'),
  Doctor(id:4,  name:'Dr. Anita Sharma',      spec:'Paediatrician',       hospital:'Tiny Tots Clinic',         address:'Indiranagar, Bangalore',    city:'bangalore', state:'Karnataka',    pincode:'560038', dist:4.0,  available:true,  phone:'+91 95432 10987', rating:4.6, experience:'12 yrs'),
  Doctor(id:5,  name:'Dr. Venkatesh Rao',     spec:'Cardiologist',        hospital:'Heart Care Centre',        address:'Whitefield, Bangalore',     city:'bangalore', state:'Karnataka',    pincode:'560066', dist:7.2,  available:true,  phone:'+91 94321 09876', rating:4.9, experience:'22 yrs'),
  Doctor(id:6,  name:'Dr. Priya Nair',        spec:'Dermatologist',       hospital:'Skin Solutions Clinic',    address:'HSR Layout, Bangalore',     city:'bangalore', state:'Karnataka',    pincode:'560102', dist:5.5,  available:true,  phone:'+91 93210 98765', rating:4.5, experience:'10 yrs'),
  Doctor(id:7,  name:'Dr. Ramesh Gupta',      spec:'General Physician',   hospital:'Jan Aushadhi PHC',         address:'Connaught Place, Delhi',    city:'delhi',     state:'Delhi',        pincode:'110001', dist:1.0,  available:true,  phone:'+91 92109 87654', rating:4.7, experience:'16 yrs'),
  Doctor(id:8,  name:'Dr. Sunita Singh',      spec:'ENT Specialist',      hospital:'ENT Clinic',               address:'Karol Bagh, Delhi',         city:'delhi',     state:'Delhi',        pincode:'110005', dist:3.4,  available:false, phone:'+91 91098 76543', rating:4.4, experience:'14 yrs'),
  Doctor(id:9,  name:'Dr. Arvind Mehta',      spec:'Neurologist',         hospital:'Neuro Care Hospital',      address:'Lajpat Nagar, Delhi',       city:'delhi',     state:'Delhi',        pincode:'110024', dist:6.0,  available:true,  phone:'+91 90987 65432', rating:4.8, experience:'25 yrs'),
  Doctor(id:10, name:'Dr. Kavitha Reddy',     spec:'General Physician',   hospital:'Rural Health Centre',     address:'Gachibowli, Hyderabad',     city:'hyderabad', state:'Telangana',    pincode:'500032', dist:2.2,  available:true,  phone:'+91 89876 54321', rating:4.6, experience:'11 yrs'),
  Doctor(id:11, name:'Dr. Srinivas Rao',      spec:'Diabetologist',       hospital:'Diabetes Care Institute',  address:'Banjara Hills, Hyderabad',  city:'hyderabad', state:'Telangana',    pincode:'500034', dist:4.8,  available:true,  phone:'+91 88765 43210', rating:4.9, experience:'19 yrs'),
  Doctor(id:12, name:'Dr. Fatima Shaikh',     spec:'Gynaecologist',       hospital:'Al-Shifa Hospital',        address:'Old City, Hyderabad',       city:'hyderabad', state:'Telangana',    pincode:'500002', dist:8.3,  available:true,  phone:'+91 87654 32109', rating:4.7, experience:'17 yrs'),
  Doctor(id:13, name:'Dr. Mohan Das',         spec:'General Physician',   hospital:'ESI Hospital',             address:'Anna Nagar, Chennai',       city:'chennai',   state:'Tamil Nadu',   pincode:'600040', dist:1.8,  available:true,  phone:'+91 86543 21098', rating:4.5, experience:'13 yrs'),
  Doctor(id:14, name:'Dr. Lalitha Kumar',     spec:'Ophthalmologist',     hospital:'Vision Care Hospital',     address:'T. Nagar, Chennai',         city:'chennai',   state:'Tamil Nadu',   pincode:'600017', dist:3.7,  available:false, phone:'+91 85432 10987', rating:4.8, experience:'21 yrs'),
  Doctor(id:15, name:'Dr. Anil Pawar',        spec:'General Physician',   hospital:'Navi Mumbai PHC',          address:'Vashi, Navi Mumbai',        city:'mumbai',    state:'Maharashtra',  pincode:'400703', dist:2.9,  available:true,  phone:'+91 84321 09876', rating:4.6, experience:'9 yrs'),
  Doctor(id:16, name:'Dr. Rekha Joshi',       spec:'Psychiatrist',        hospital:'Mind Wellness Clinic',     address:'Dadar, Mumbai',             city:'mumbai',    state:'Maharashtra',  pincode:'400014', dist:5.1,  available:true,  phone:'+91 83210 98765', rating:4.7, experience:'16 yrs'),
  Doctor(id:17, name:'Dr. Hema Krishnan',     spec:'Endocrinologist',     hospital:'Hormone Health Centre',    address:'Kochi, Kerala',             city:'kochi',     state:'Kerala',       pincode:'682001', dist:3.3,  available:false, phone:'+91 79876 54321', rating:4.7, experience:'20 yrs'),
  Doctor(id:18, name:'Dr. Ajay Verma',        spec:'Pulmonologist',       hospital:'Lung Care Hospital',       address:'Lucknow',                   city:'lucknow',   state:'UP',           pincode:'226001', dist:2.6,  available:true,  phone:'+91 78765 43210', rating:4.6, experience:'14 yrs'),
  Doctor(id:19, name:'Dr. Nalini Deshpande',  spec:'Rheumatologist',      hospital:'Joint & Arthritis Clinic', address:'Pune',                      city:'pune',      state:'Maharashtra',  pincode:'411001', dist:4.4,  available:true,  phone:'+91 77654 32109', rating:4.8, experience:'18 yrs'),
  Doctor(id:20, name:'Dr. Kishore Babu',      spec:'Urologist',           hospital:'Kidney Stone Centre',      address:'Vijayawada, AP',            city:'vijayawada',state:'Andhra Pradesh',pincode:'520001',dist:1.5, available:true,  phone:'+91 76543 21098', rating:4.5, experience:'12 yrs'),
  Doctor(id:21, name:'Dr. Geetha Nair',       spec:'Paediatrician',       hospital:'Child Care Hospital',      address:'Thiruvananthapuram',        city:'thiruvananthapuram', state:'Kerala', pincode:'695001', dist:2.1, available:true, phone:'+91 75432 10987', rating:4.9, experience:'17 yrs'),
  Doctor(id:22, name:'Dr. Pradeep Singh',     spec:'Oncologist',          hospital:'Cancer Care Institute',    address:'Amritsar, Punjab',          city:'amritsar',  state:'Punjab',       pincode:'143001', dist:5.8,  available:false, phone:'+91 74321 09876', rating:4.7, experience:'22 yrs'),
  Doctor(id:23, name:'Dr. Birendra Sahu',     spec:'General Physician',   hospital:'PHC Civil Lines',          address:'Civil Lines, Raipur',       city:'raipur',    state:'Chhattisgarh', pincode:'492001', dist:0.8,  available:true,  phone:'+91 80987 65432', rating:4.4, experience:'8 yrs'),
  Doctor(id:24, name:'Dr. Padma Lakshmi',     spec:'Gynaecologist',       hospital:'Motherhood Clinic',        address:'Jayanagar, Bangalore',      city:'bangalore', state:'Karnataka',    pincode:'560011', dist:2.0,  available:true,  phone:'+91 81098 76543', rating:4.9, experience:'15 yrs'),
  Doctor(id:25, name:'Dr. Subramaniam K.',    spec:'Gastroenterologist',  hospital:'Gut Health Clinic',        address:'Adyar, Chennai',            city:'chennai',   state:'Tamil Nadu',   pincode:'600020', dist:6.5,  available:true,  phone:'+91 82109 87654', rating:4.8, experience:'23 yrs'),
];

List<Doctor> searchDoctors(String query, {String spec = ''}) {
  final q = query.toLowerCase().trim();
  final s = spec.toLowerCase().trim();
  var results = mockDoctors.where((d) {
    final matchQ = q.isEmpty || (
      d.city.toLowerCase().contains(q) ||
      d.address.toLowerCase().contains(q) ||
      d.pincode.contains(q) ||
      d.name.toLowerCase().contains(q) ||
      d.hospital.toLowerCase().contains(q) ||
      d.spec.toLowerCase().contains(q) ||
      d.state.toLowerCase().contains(q)
    );
    final matchS = s.isEmpty || d.spec.toLowerCase().contains(s);
    return matchQ && matchS;
  }).toList();
  // Sort: available first, then by distance
  results.sort((a, b) {
    if (a.available != b.available) return b.available ? 1 : -1;
    return a.dist.compareTo(b.dist);
  });
  return results;
}

List<String> get allSpecializations =>
    mockDoctors.map((d) => d.spec).toSet().toList()..sort();
