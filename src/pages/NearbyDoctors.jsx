/**
 * NearbyDoctors page
 * ─ Search by city, village, pincode, or specialization
 * ─ Shows mock doctor cards (real backend can replace MOCK_DOCTORS later)
 * ─ Stores last results in localStorage for offline access
 * ─ TTS reads a brief summary after each search
 * ─ Each card has a "Listen Again" button to read doctor details aloud
 */
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaUserMd, FaMapMarkerAlt, FaPhone, FaStar, FaDirections,
  FaSearch, FaLocationArrow, FaCheckCircle, FaTimesCircle,
  FaClock, FaBriefcaseMedical, FaWifi,
} from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import { useOffline } from '../context/OfflineContext';
import { getDoctorCache, saveDoctorCache } from '../services/offlineStorage';
import { speak, stopSpeaking } from '../services/textToSpeech';
import ListenButton from '../components/ListenButton';

// ── Mock Doctor Database ───────────────────────────────────────────────────
const MOCK_DOCTORS = [
  { id:1,  name:'Dr. Rajesh Kumar',      spec:'General Physician',     hospital:'City Health Centre',       address:'MG Road, Bangalore',           city:'bangalore', state:'Karnataka',   pincode:'560001', dist:1.2,  avail:true,  phone:'+91 98765 43210', rating:4.8, exp:'15 yrs' },
  { id:2,  name:'Dr. Meena Iyer',        spec:'Gynaecologist',         hospital:'Rainbow Women Clinic',     address:'Jayanagar, Bangalore',          city:'bangalore', state:'Karnataka',   pincode:'560041', dist:2.5,  avail:true,  phone:'+91 97654 32109', rating:4.9, exp:'20 yrs' },
  { id:3,  name:'Dr. Suresh Patil',      spec:'Orthopaedic Surgeon',   hospital:'Spine & Bone Hospital',   address:'Koramangala, Bangalore',         city:'bangalore', state:'Karnataka',   pincode:'560034', dist:3.1,  avail:false, phone:'+91 96543 21098', rating:4.7, exp:'18 yrs' },
  { id:4,  name:'Dr. Anita Sharma',      spec:'Paediatrician',         hospital:'Tiny Tots Clinic',         address:'Indiranagar, Bangalore',         city:'bangalore', state:'Karnataka',   pincode:'560038', dist:4.0,  avail:true,  phone:'+91 95432 10987', rating:4.6, exp:'12 yrs' },
  { id:5,  name:'Dr. Venkatesh Rao',     spec:'Cardiologist',          hospital:'Heart Care Centre',        address:'Whitefield, Bangalore',          city:'bangalore', state:'Karnataka',   pincode:'560066', dist:7.2,  avail:true,  phone:'+91 94321 09876', rating:4.9, exp:'22 yrs' },
  { id:6,  name:'Dr. Priya Nair',        spec:'Dermatologist',         hospital:'Skin Solutions Clinic',    address:'HSR Layout, Bangalore',          city:'bangalore', state:'Karnataka',   pincode:'560102', dist:5.5,  avail:true,  phone:'+91 93210 98765', rating:4.5, exp:'10 yrs' },
  { id:7,  name:'Dr. Ramesh Gupta',      spec:'General Physician',     hospital:'Jan Aushadhi PHC',         address:'Connaught Place, Delhi',         city:'delhi',     state:'Delhi',       pincode:'110001', dist:1.0,  avail:true,  phone:'+91 92109 87654', rating:4.7, exp:'16 yrs' },
  { id:8,  name:'Dr. Sunita Singh',      spec:'ENT Specialist',        hospital:'Ear Nose Throat Clinic',   address:'Karol Bagh, Delhi',              city:'delhi',     state:'Delhi',       pincode:'110005', dist:3.4,  avail:false, phone:'+91 91098 76543', rating:4.4, exp:'14 yrs' },
  { id:9,  name:'Dr. Arvind Mehta',      spec:'Neurologist',           hospital:'Neuro Care Hospital',      address:'Lajpat Nagar, Delhi',            city:'delhi',     state:'Delhi',       pincode:'110024', dist:6.0,  avail:true,  phone:'+91 90987 65432', rating:4.8, exp:'25 yrs' },
  { id:10, name:'Dr. Kavitha Reddy',     spec:'General Physician',     hospital:'Rural Health Sub-Centre', address:'Gachibowli, Hyderabad',          city:'hyderabad', state:'Telangana',   pincode:'500032', dist:2.2,  avail:true,  phone:'+91 89876 54321', rating:4.6, exp:'11 yrs' },
  { id:11, name:'Dr. Srinivas Rao',      spec:'Diabetologist',         hospital:'Diabetes Care Institute',  address:'Banjara Hills, Hyderabad',       city:'hyderabad', state:'Telangana',   pincode:'500034', dist:4.8,  avail:true,  phone:'+91 88765 43210', rating:4.9, exp:'19 yrs' },
  { id:12, name:'Dr. Fatima Shaikh',     spec:'Gynaecologist',         hospital:'Al-Shifa Women Hospital',  address:'Old City, Hyderabad',            city:'hyderabad', state:'Telangana',   pincode:'500002', dist:8.3,  avail:true,  phone:'+91 87654 32109', rating:4.7, exp:'17 yrs' },
  { id:13, name:'Dr. Mohan Das',         spec:'General Physician',     hospital:'ESI Hospital',             address:'Anna Nagar, Chennai',            city:'chennai',   state:'Tamil Nadu',  pincode:'600040', dist:1.8,  avail:true,  phone:'+91 86543 21098', rating:4.5, exp:'13 yrs' },
  { id:14, name:'Dr. Lalitha Kumar',     spec:'Ophthalmologist',       hospital:'Vision Care Eye Hospital', address:'T. Nagar, Chennai',              city:'chennai',   state:'Tamil Nadu',  pincode:'600017', dist:3.7,  avail:false, phone:'+91 85432 10987', rating:4.8, exp:'21 yrs' },
  { id:15, name:'Dr. Anil Pawar',        spec:'General Physician',     hospital:'Navi Mumbai PHC',          address:'Vashi, Navi Mumbai',             city:'mumbai',    state:'Maharashtra', pincode:'400703', dist:2.9,  avail:true,  phone:'+91 84321 09876', rating:4.6, exp:'9 yrs'  },
  { id:16, name:'Dr. Rekha Joshi',       spec:'Psychiatrist',          hospital:'Mind Wellness Clinic',     address:'Dadar, Mumbai',                  city:'mumbai',    state:'Maharashtra', pincode:'400014', dist:5.1,  avail:true,  phone:'+91 83210 98765', rating:4.7, exp:'16 yrs' },
  { id:17, name:'Dr. Subramaniam K.',    spec:'Gastroenterologist',    hospital:'Gut Health Clinic',        address:'Adyar, Chennai',                 city:'chennai',   state:'Tamil Nadu',  pincode:'600020', dist:6.5,  avail:true,  phone:'+91 82109 87654', rating:4.8, exp:'23 yrs' },
  { id:18, name:'Dr. Padma Lakshmi',     spec:'Gynaecologist',         hospital:'Motherhood Clinic',        address:'Jayanagar, Bangalore',           city:'bangalore', state:'Karnataka',   pincode:'560011', dist:2.0,  avail:true,  phone:'+91 81098 76543', rating:4.9, exp:'15 yrs' },
  { id:19, name:'Dr. Birendra Sahu',     spec:'General Physician',     hospital:'PHC Raipur Road',          address:'Civil Lines, Raipur',            city:'raipur',    state:'Chhattisgarh',pincode:'492001', dist:0.8,  avail:true,  phone:'+91 80987 65432', rating:4.4, exp:'8 yrs'  },
  { id:20, name:'Dr. Hema Krishnan',     spec:'Endocrinologist',       hospital:'Hormone Health Centre',    address:'Kochi, Kerala',                  city:'kochi',     state:'Kerala',      pincode:'682001', dist:3.3,  avail:false, phone:'+91 79876 54321', rating:4.7, exp:'20 yrs' },
  { id:21, name:'Dr. Ajay Verma',        spec:'Pulmonologist',         hospital:'Lung Care Hospital',       address:'Lucknow',                        city:'lucknow',   state:'UP',          pincode:'226001', dist:2.6,  avail:true,  phone:'+91 78765 43210', rating:4.6, exp:'14 yrs' },
  { id:22, name:'Dr. Nalini Deshpande',  spec:'Rheumatologist',        hospital:'Joint & Arthritis Clinic', address:'Pune',                           city:'pune',      state:'Maharashtra', pincode:'411001', dist:4.4,  avail:true,  phone:'+91 77654 32109', rating:4.8, exp:'18 yrs' },
  { id:23, name:'Dr. Kishore Babu',      spec:'Urologist',             hospital:'Kidney Stone Centre',      address:'Vijayawada, AP',                 city:'vijayawada',state:'Andhra Pradesh',pincode:'520001',dist:1.5, avail:true,  phone:'+91 76543 21098', rating:4.5, exp:'12 yrs' },
  { id:24, name:'Dr. Geetha Nair',       spec:'Paediatrician',         hospital:'Child Care Hospital',      address:'Thiruvananthapuram',             city:'thiruvananthapuram', state:'Kerala', pincode:'695001', dist:2.1, avail:true, phone:'+91 75432 10987', rating:4.9, exp:'17 yrs' },
  { id:25, name:'Dr. Pradeep Singh',     spec:'Oncologist',            hospital:'Cancer Care Institute',    address:'Amritsar, Punjab',               city:'amritsar',  state:'Punjab',      pincode:'143001', dist:5.8,  avail:false, phone:'+91 74321 09876', rating:4.7, exp:'22 yrs' },
];

const SPECIALIZATIONS = [...new Set(MOCK_DOCTORS.map(d => d.spec))].sort();

// ── Doctor Card ────────────────────────────────────────────────────────────
function DoctorCard({ doc, index }) {
  const { t, language } = useLanguage();

  const speakText = `${doc.name}, ${doc.spec} at ${doc.hospital}. ${doc.address}. ${doc.dist} km away. ${doc.avail ? 'Available now' : 'Not available right now'}. Contact: ${doc.phone}. Rating: ${doc.rating} out of 5.`;

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${doc.hospital} ${doc.address}`)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all p-5"
    >
      {/* Header row */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md">
          <FaUserMd className="text-white text-2xl" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 dark:text-white text-base truncate">{doc.name}</h3>
          <p className="text-emerald-600 dark:text-emerald-400 text-sm font-semibold flex items-center gap-1">
            <FaBriefcaseMedical className="text-xs" /> {doc.spec}
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">{doc.hospital}</p>
        </div>
        {/* Availability badge */}
        <span className={`flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
          doc.avail
            ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400'
            : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
        }`}>
          {doc.avail ? <FaCheckCircle /> : <FaTimesCircle />}
          {doc.avail ? t('availableNow') : t('unavailable')}
        </span>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-2 gap-2 mb-4 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-1.5">
          <FaMapMarkerAlt className="text-red-400 flex-shrink-0" />
          <span className="truncate">{doc.address}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <FaClock className="text-blue-400 flex-shrink-0" />
          <span>{doc.dist} {t('kmAway')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <FaPhone className="text-green-400 flex-shrink-0" />
          <span>{doc.phone}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <FaStar className="text-amber-400 flex-shrink-0" />
          <span className="font-semibold text-gray-900 dark:text-white">{doc.rating}</span>
          <span className="text-xs text-gray-400">/ 5 · {doc.exp}</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        <a
          href={`tel:${doc.phone}`}
          className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm"
          aria-label={`Call ${doc.name}`}
        >
          <FaPhone /> {t('callDoctor')}
        </a>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm"
          aria-label={`Directions to ${doc.hospital}`}
        >
          <FaDirections /> {t('getDirections')}
        </a>
        <ListenButton text={speakText} />
      </div>
    </motion.div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function NearbyDoctors() {
  const { t, language } = useLanguage();
  const { isOnline } = useOffline();

  const [query, setQuery]             = useState('');
  const [specFilter, setSpecFilter]   = useState('');
  const [results, setResults]         = useState([]);
  const [searched, setSearched]       = useState(false);
  const [loading, setLoading]         = useState(false);
  const [fromCache, setFromCache]     = useState(false);
  const inputRef = useRef(null);

  // On mount: if offline, show cached results immediately
  useEffect(() => {
    if (!isOnline) {
      const cache = getDoctorCache();
      if (cache.length > 0) { setResults(cache); setSearched(true); setFromCache(true); }
    }
  }, [isOnline]);

  const runSearch = (q, spec) => {
    const term = (q || '').trim().toLowerCase();
    const sFilter = (spec || '').toLowerCase();

    if (!term && !sFilter) {
      setResults([]);
      setSearched(false);
      return;
    }

    setLoading(true);
    // Simulate async (replace with real API call in production)
    setTimeout(() => {
      let filtered = MOCK_DOCTORS.filter(doc => {
        const matchTerm = !term || (
          doc.city.toLowerCase().includes(term) ||
          doc.address.toLowerCase().includes(term) ||
          doc.pincode.includes(term) ||
          doc.name.toLowerCase().includes(term) ||
          doc.hospital.toLowerCase().includes(term) ||
          doc.spec.toLowerCase().includes(term) ||
          doc.state.toLowerCase().includes(term)
        );
        const matchSpec = !sFilter || doc.spec.toLowerCase().includes(sFilter);
        return matchTerm && matchSpec;
      });

      // Sort: available first, then by distance
      filtered.sort((a, b) => (b.avail - a.avail) || (a.dist - b.dist));

      setResults(filtered);
      setSearched(true);
      setFromCache(false);
      setLoading(false);

      // Cache for offline use
      if (filtered.length > 0) saveDoctorCache(filtered);

      // TTS summary
      const summary = filtered.length > 0
        ? `Found ${filtered.length} doctor${filtered.length > 1 ? 's' : ''} near ${term || spec}. Top result: ${filtered[0].name}, ${filtered[0].spec}.`
        : `No doctors found for ${term || spec}. Please try a different search.`;
      stopSpeaking();
      speak(summary, { language });
    }, 600);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    runSearch(query, specFilter);
  };

  const handleLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      () => {
        // In production, pass lat/lng to a backend API.
        // Here, we show all doctors sorted by distance as a demo.
        setQuery('bangalore');
        runSearch('bangalore', specFilter);
      },
      () => {
        setQuery('bangalore');
        runSearch('bangalore', specFilter);
      },
      { timeout: 5000 }
    );
  };

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-full text-sm font-semibold mb-3">
            <FaUserMd /> {t('nearbyDoctors')}
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">{t('nearbyDoctorsTitle')}</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{t('nearbyDoctorsDesc')}</p>
        </motion.div>

        {/* Offline banner */}
        {!isOnline && (
          <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 px-4 py-3 rounded-xl mb-5 text-sm font-medium">
            <FaWifi className="text-base" /> {t('offlineDoctors')}
          </div>
        )}

        {/* Search form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          onSubmit={handleSearch}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 mb-6"
        >
          <div className="flex flex-col sm:flex-row gap-3 mb-3">
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-300 text-sm"
              />
            </div>
            <button type="submit"
              className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-md transition-all"
            >
              <FaSearch /> {t('searchDoctors')}
            </button>
          </div>

          {/* Specialization filter */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-gray-500 font-medium">{t('specialization') || 'Specialization'}:</span>
            <button type="button" onClick={() => setSpecFilter('')}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${!specFilter ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-blue-400'}`}
            >All</button>
            {SPECIALIZATIONS.map(s => (
              <button key={s} type="button" onClick={() => setSpecFilter(s === specFilter ? '' : s)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${specFilter === s ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-blue-400'}`}
              >{s}</button>
            ))}
          </div>

          {/* Use My Location */}
          <button type="button" onClick={handleLocation}
            className="mt-3 flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 font-semibold hover:underline"
          >
            <FaLocationArrow className="text-xs" /> {t('useMyLocation')}
          </button>
        </motion.form>

        {/* Results */}
        {loading ? (
          <div className="text-center py-16 text-gray-500 dark:text-gray-400">
            <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-500 animate-spin mx-auto mb-4" />
            <p className="font-medium">{t('loading')}</p>
          </div>
        ) : (
          <AnimatePresence>
            {searched && (
              <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {results.length === 0 ? (
                  <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                    <FaUserMd className="text-5xl text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 font-medium">{t('noResults')}</p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                        {results.length} doctor{results.length !== 1 ? 's' : ''} found
                        {fromCache && <span className="ml-2 text-amber-500">(cached)</span>}
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {results.map((doc, i) => (
                        <DoctorCard key={doc.id} doc={doc} index={i} />
                      ))}
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Default state prompt */}
        {!searched && !loading && (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-5">
              <FaUserMd className="text-4xl text-blue-400" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-medium text-lg mb-2">Search for doctors nearby</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm">Type a city, village, pincode or tap "Use My Location"</p>
          </div>
        )}
      </div>
    </div>
  );
}
