import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaStethoscope, FaMicrophone, FaStop, FaRedo,
  FaCheckCircle, FaTimesCircle, FaArrowRight, FaHome, FaHospital, FaAmbulance
} from 'react-icons/fa';
import { createSpeechRecognition, isSpeechRecognitionSupported } from '../services/speechRecognition';
import { speak } from '../services/textToSpeech';
import { useLanguage } from '../context/LanguageContext';

const SYMPTOMS = [
  { id: 'fever', key: 'fever', weight: { emergency: 1, hospital: 2, phc: 3, home: 2 } },
  { id: 'cough', key: 'cough', weight: { emergency: 0, hospital: 1, phc: 2, home: 4 } },
  { id: 'breathingDifficulty', key: 'breathingDifficulty', weight: { emergency: 4, hospital: 3, phc: 1, home: 0 } },
  { id: 'chestPain', key: 'chestPain', weight: { emergency: 5, hospital: 3, phc: 1, home: 0 } },
  { id: 'headache', key: 'headache', weight: { emergency: 0, hospital: 1, phc: 2, home: 4 } },
  { id: 'vomiting', key: 'vomiting', weight: { emergency: 1, hospital: 2, phc: 3, home: 2 } },
  { id: 'diarrhea', key: 'diarrhea', weight: { emergency: 1, hospital: 2, phc: 3, home: 2 } },
  { id: 'bodyPain', key: 'bodyPain', weight: { emergency: 0, hospital: 1, phc: 2, home: 3 } },
  { id: 'soreThroat', key: 'soreThroat', weight: { emergency: 0, hospital: 0, phc: 2, home: 4 } },
  { id: 'rash', key: 'rash', weight: { emergency: 1, hospital: 2, phc: 3, home: 2 } },
];

function analyzeSymptoms(answers) {
  let scores = { emergency: 0, hospital: 0, phc: 0, home: 0 };
  SYMPTOMS.forEach((s, i) => {
    if (answers[i] === 'yes') {
      Object.entries(s.weight).forEach(([k, v]) => { scores[k] += v; });
    }
  });
  const max = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
  return max;
}

const RESULT_CONFIG = {
  home: {
    label: 'Home Care',
    labelKn: 'ಮನೆ ಆರೈಕೆ',
    color: 'from-emerald-400 to-green-600',
    border: 'border-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    icon: FaHome,
    advice: 'Your symptoms appear mild. Rest well, drink fluids, and monitor. Visit a doctor if condition worsens or continues for more than 3 days.',
    adviceKn: 'ನಿಮ್ಮ ರೋಗಲಕ್ಷಣಗಳು ಸಾಮಾನ್ಯವಾಗಿ ಕಾಣಿಸುತ್ತವೆ. ಚೆನ್ನಾಗಿ ಮಲಗಿ, ಸಾಕಷ್ಟು ನೀರು ಕುಡಿಯಿರಿ. ೩ ದಿನಗಳಲ್ಲಿ ಸುಧಾರಣೆ ಕಾಣದಿದ್ದರೆ ವೈದ್ಯರನ್ನು ಭೇಟಿ ಮಾಡಿ.',
  },
  phc: {
    label: 'Visit Primary Health Centre',
    labelKn: 'ಪ್ರಾಥಮಿಕ ಆರೋಗ್ಯ ಕೇಂದ್ರಕ್ಕೆ ಭೇಟಿ ಕೊಡಿ',
    color: 'from-yellow-400 to-amber-500',
    border: 'border-yellow-400',
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    icon: FaStethoscope,
    advice: 'Please visit your nearest Primary Health Centre. A doctor should examine your symptoms.',
    adviceKn: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಹತ್ತಿರದ ಪ್ರಾಥಮಿಕ ಆರೋಗ್ಯ ಕೇಂದ್ರಕ್ಕೆ ಭೇಟಿ ಕೊಡಿ.',
  },
  hospital: {
    label: 'Visit District Hospital',
    labelKn: 'ಜಿಲ್ಲಾ ಆಸ್ಪತ್ರೆಗೆ ಭೇಟಿ ಕೊಡಿ',
    color: 'from-orange-400 to-red-400',
    border: 'border-orange-400',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    icon: FaHospital,
    advice: 'Your symptoms require proper medical attention. Please visit the nearest District Hospital soon.',
    adviceKn: 'ನಿಮ್ಮ ರೋಗಲಕ್ಷಣಗಳಿಗೆ ತಕ್ಷಣ ವೈದ್ಯಕೀಯ ಗಮನ ಬೇಕು. ಜಿಲ್ಲಾ ಆಸ್ಪತ್ರೆಗೆ ಹೋಗಿ.',
  },
  emergency: {
    label: 'Seek Emergency Medical Attention',
    labelKn: 'ತಕ್ಷಣ ತುರ್ತು ಸಹಾಯ ಪಡೆಯಿರಿ',
    color: 'from-red-500 to-rose-700',
    border: 'border-red-500',
    bg: 'bg-red-50 dark:bg-red-900/20',
    icon: FaAmbulance,
    advice: 'URGENT: Call 108 immediately for an ambulance. Your symptoms require emergency care.',
    adviceKn: 'ತಕ್ಷಣ 108 ಕರೆ ಮಾಡಿ. ನಿಮ್ಮ ರೋಗಲಕ್ಷಣಗಳಿಗೆ ತುರ್ತು ಚಿಕಿತ್ಸೆ ಬೇಕು.',
  },
};

export default function SymptomChecker() {
  const [step, setStep] = useState('input'); // 'input' | 'questions' | 'result'
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [textInput, setTextInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [result, setResult] = useState(null);
  const [inputMode, setInputMode] = useState('questions'); // 'questions' | 'text'
  const { t, language } = useLanguage();
  const supported = isSpeechRecognitionSupported();

  const speakQuestion = useCallback((questionText) => {
    speak(questionText, { language });
  }, [language]);

  const handleAnswer = (answer) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    if (currentQuestion < SYMPTOMS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      const nextQ = `${t('doYouHave')} ${t(SYMPTOMS[currentQuestion + 1].key)}?`;
      speakQuestion(nextQ);
    } else {
      const res = analyzeSymptoms(newAnswers);
      setResult(res);
      setStep('result');
      speak(RESULT_CONFIG[res].advice, { language });
    }
  };

  const startVoiceInput = useCallback(() => {
    const recognition = createSpeechRecognition({
      language,
      onStart: () => setIsListening(true),
      onResult: ({ final }) => {
        if (final) {
          setTranscript(final);
          setTextInput(prev => prev + ' ' + final);
          setIsListening(false);
        }
      },
      onError: () => setIsListening(false),
      onEnd: () => setIsListening(false),
    });
    if (recognition) recognition.start();
  }, [language]);

  const handleTextSubmit = () => {
    if (!textInput.trim()) return;
    const lower = textInput.toLowerCase();
    const quickAnswers = SYMPTOMS.map(s => lower.includes(s.id.toLowerCase()) ? 'yes' : 'no');
    const res = analyzeSymptoms(quickAnswers);
    setResult(res);
    setStep('result');
    speak(RESULT_CONFIG[res].advice, { language });
  };

  const reset = () => {
    setStep('input');
    setCurrentQuestion(0);
    setAnswers([]);
    setTextInput('');
    setTranscript('');
    setResult(null);
  };

  const progress = (currentQuestion / SYMPTOMS.length) * 100;

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <FaStethoscope /> {t('symptomChecker')}
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-2">{t('medicineCheckerTitle')}</h1>
          <p className="text-gray-500 dark:text-gray-400">{t('symptomsPrompt')}</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Input Mode Selection */}
          {step === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Mode Toggle */}
              <div className="glass-card dark:bg-gray-800/80 p-2 flex rounded-2xl">
                {['questions', 'text'].map(mode => (
                  <button
                    key={mode}
                    onClick={() => setInputMode(mode)}
                    className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all ${
                      inputMode === mode
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                    }`}
                  >
                    {mode === 'questions' ? '📋 Step-by-Step Questions' : '✏️ Describe Symptoms'}
                  </button>
                ))}
              </div>

              {inputMode === 'questions' ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-card dark:bg-gray-800/80 p-8 text-center space-y-6"
                >
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center shadow-xl">
                    <FaStethoscope className="text-white text-3xl" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Answer {SYMPTOMS.length} Questions</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">We'll ask about common symptoms one at a time. Your answers help us recommend the right care.</p>
                  </div>
                  <button
                    onClick={() => { setStep('questions'); speakQuestion(`${t('doYouHave')} ${t(SYMPTOMS[0].key)}?`); }}
                    className="btn-secondary w-full flex items-center justify-center gap-2 text-lg py-4"
                  >
                    Start Assessment <FaArrowRight />
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-card dark:bg-gray-800/80 p-6 space-y-4"
                >
                  <div className="relative">
                    <textarea
                      value={textInput}
                      onChange={e => setTextInput(e.target.value)}
                      placeholder="Describe your symptoms here... (e.g., I have fever and headache since 2 days)"
                      rows={4}
                      className="input-field resize-none"
                    />
                    {transcript && (
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 italic">Voice: {transcript}</p>
                    )}
                  </div>
                  <div className="flex gap-3">
                    {supported && (
                      <button
                        onClick={startVoiceInput}
                        disabled={isListening}
                        className={`flex items-center gap-2 py-3 px-5 rounded-xl font-semibold transition-all ${
                          isListening
                            ? 'bg-red-500 text-white animate-pulse'
                            : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                        }`}
                      >
                        {isListening ? <><FaStop /> Listening...</> : <><FaMicrophone /> Voice</>}
                      </button>
                    )}
                    <button
                      onClick={handleTextSubmit}
                      disabled={!textInput.trim()}
                      className="flex-1 btn-secondary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Analyze <FaArrowRight />
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Question Mode */}
          {step === 'questions' && (
            <motion.div
              key={`q-${currentQuestion}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              {/* Progress */}
              <div className="glass-card dark:bg-gray-800/80 p-4">
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <span>Question {currentQuestion + 1} of {SYMPTOMS.length}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-400 to-indigo-600 rounded-full"
                    initial={{ width: `${((currentQuestion) / SYMPTOMS.length) * 100}%` }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </div>

              {/* Question Card */}
              <div className="glass-card dark:bg-gray-800/80 p-8 text-center space-y-8">
                <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                  <FaStethoscope className="text-blue-600 dark:text-blue-400 text-2xl" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  {t('doYouHave')}<br />
                  <span className="text-blue-600 dark:text-blue-400 capitalize">{t(SYMPTOMS[currentQuestion].key)}?</span>
                </h2>

                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAnswer('yes')}
                    className="flex-1 flex items-center justify-center gap-2 py-5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xl shadow-lg hover:shadow-emerald-200 transition-all focus:outline-none focus:ring-4 focus:ring-emerald-300"
                  >
                    <FaCheckCircle className="text-2xl" /> {t('yes')}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAnswer('no')}
                    className="flex-1 flex items-center justify-center gap-2 py-5 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-bold text-xl shadow-lg hover:shadow-red-200 transition-all focus:outline-none focus:ring-4 focus:ring-red-300"
                  >
                    <FaTimesCircle className="text-2xl" /> {t('no')}
                  </motion.button>
                </div>

                <button onClick={reset} className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 underline underline-offset-2">
                  Start Over
                </button>
              </div>
            </motion.div>
          )}

          {/* Result */}
          {step === 'result' && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              {(() => {
                const cfg = RESULT_CONFIG[result];
                const Icon = cfg.icon;
                return (
                  <div className={`glass-card dark:bg-gray-800/80 p-8 border-2 ${cfg.border} space-y-6`}>
                    <div className="text-center">
                      <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${cfg.color} flex items-center justify-center shadow-xl mb-4`}>
                        <Icon className="text-white text-3xl" />
                      </div>
                      <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{t('resultTitle')}</p>
                      <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                        {language === 'kn' ? cfg.labelKn : cfg.label}
                      </h2>
                    </div>

                    <div className={`${cfg.bg} rounded-2xl p-5`}>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-center">
                        {language === 'kn' ? cfg.adviceKn : cfg.advice}
                      </p>
                    </div>

                    {result === 'emergency' && (
                      <a
                        href="tel:108"
                        className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-black text-xl shadow-xl animate-pulse"
                      >
                        📞 Call 108 — Ambulance NOW
                      </a>
                    )}

                    <button
                      onClick={reset}
                      className="btn-ghost w-full flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-600"
                    >
                      <FaRedo /> Check Again
                    </button>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
