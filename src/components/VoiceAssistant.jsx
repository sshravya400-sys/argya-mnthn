import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMicrophone, FaStop, FaVolumeUp, FaVolumeMute, FaTimes, FaRobot } from 'react-icons/fa';
import { createSpeechRecognition, isSpeechRecognitionSupported } from '../services/speechRecognition';
import { speak, stopSpeaking } from '../services/textToSpeech';
import { useLanguage } from '../context/LanguageContext';

const healthResponses = {
  fever: "You mentioned fever. Please rest, drink plenty of fluids and take paracetamol. If fever persists more than 3 days or goes above 103 degrees, please visit a doctor.",
  cough: "For cough, inhale steam and drink warm water with honey. Persistent cough for more than 2 weeks should be evaluated by a doctor.",
  headache: "For headache, rest in a quiet dark room and drink water. You may take paracetamol. If severe or sudden, seek emergency care.",
  pain: "For body pain, rest and take paracetamol. Apply warm compress if needed. Persistent pain needs medical attention.",
  default: "I understand you need healthcare help. Please use the Symptom Checker for a detailed assessment, or call 108 for emergencies.",
};

function getResponse(text) {
  const lower = text.toLowerCase();
  if (lower.includes('fever') || lower.includes('temperature')) return healthResponses.fever;
  if (lower.includes('cough') || lower.includes('cold')) return healthResponses.cough;
  if (lower.includes('headache') || lower.includes('head')) return healthResponses.headache;
  if (lower.includes('pain') || lower.includes('ache')) return healthResponses.pain;
  return healthResponses.default;
}

export default function VoiceAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeakingState, setIsSpeakingState] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimText, setInterimText] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const recognitionRef = useRef(null);
  const { t, language } = useLanguage();
  const supported = isSpeechRecognitionSupported();

  useEffect(() => {
    return () => {
      if (recognitionRef.current) recognitionRef.current.abort();
      stopSpeaking();
    };
  }, []);

  const startListening = useCallback(() => {
    setError('');
    setTranscript('');
    setInterimText('');
    setResponse('');
    stopSpeaking();

    const recognition = createSpeechRecognition({
      language,
      onStart: () => setIsListening(true),
      onResult: ({ final, interim }) => {
        if (final) {
          setTranscript(final);
          setInterimText('');
          const resp = getResponse(final);
          setResponse(resp);
          setIsListening(false);
          setIsSpeakingState(true);
          speak(resp, { language, onEnd: () => setIsSpeakingState(false) });
        } else {
          setInterimText(interim);
        }
      },
      onError: (err) => {
        setError(err === 'not-allowed' ? 'Microphone access denied. Please allow microphone.' : 'Could not recognize speech. Please try again.');
        setIsListening(false);
      },
      onEnd: () => {
        setIsListening(false);
      },
    });

    if (recognition) {
      recognitionRef.current = recognition;
      recognition.start();
    }
  }, [language]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, []);

  const handleToggleSpeech = () => {
    if (isSpeakingState) {
      stopSpeaking();
      setIsSpeakingState(false);
    } else if (response) {
      setIsSpeakingState(true);
      speak(response, { language, onEnd: () => setIsSpeakingState(false) });
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 shadow-2xl flex items-center justify-center text-white hover:shadow-emerald-300 transition-shadow focus:outline-none focus:ring-4 focus:ring-emerald-300"
        aria-label="Open Voice Assistant"
      >
        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
          <FaMicrophone className="text-2xl" />
        </motion.div>
      </motion.button>

      {/* Modal Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <FaRobot className="text-white text-xl" />
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-lg">{t('voiceAssistantTitle')}</h2>
                    <p className="text-emerald-100 text-xs">{supported ? 'Ready to help' : 'Text mode only'}</p>
                  </div>
                </div>
                <button
                  onClick={() => { setIsOpen(false); stopSpeaking(); if (recognitionRef.current) recognitionRef.current.abort(); }}
                  className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                  aria-label="Close"
                >
                  <FaTimes />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-5">
                {/* Display area */}
                <div className="min-h-[120px] bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-4 border border-gray-200 dark:border-gray-600">
                  {isListening ? (
                    <div className="flex flex-col items-center justify-center h-full gap-2 py-4">
                      <div className="flex gap-1">
                        {[0, 1, 2, 3, 4].map(i => (
                          <motion.div
                            key={i}
                            className="w-2 bg-emerald-500 rounded-full"
                            animate={{ height: [8, 32, 8] }}
                            transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.1 }}
                          />
                        ))}
                      </div>
                      <p className="text-emerald-600 dark:text-emerald-400 text-sm font-medium">{t('listening')}</p>
                      {interimText && <p className="text-gray-400 text-xs italic text-center">{interimText}</p>}
                    </div>
                  ) : transcript ? (
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">You said:</p>
                        <p className="text-gray-800 dark:text-gray-200 font-medium">{transcript}</p>
                      </div>
                      {response && (
                        <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">MediVerse says:</p>
                          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{response}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full py-6 gap-2 text-gray-400">
                      <FaMicrophone className="text-3xl opacity-30" />
                      <p className="text-sm text-center">{t('tapToSpeak')}</p>
                    </div>
                  )}
                </div>

                {error && (
                  <p className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-xl">{error}</p>
                )}

                {/* Controls */}
                <div className="flex items-center gap-3">
                  {!isListening ? (
                    <button
                      onClick={startListening}
                      disabled={!supported}
                      className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl text-white font-bold text-lg transition-all duration-200 shadow-lg ${
                        supported
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:shadow-emerald-300 hover:scale-[1.02] active:scale-95'
                          : 'bg-gray-400 cursor-not-allowed'
                      }`}
                      aria-label="Start listening"
                    >
                      <FaMicrophone className="text-xl" />
                      {supported ? t('tapToSpeak') : 'Not Supported'}
                    </button>
                  ) : (
                    <button
                      onClick={stopListening}
                      className="flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-bold text-lg transition-all mic-listening shadow-lg"
                      aria-label="Stop listening"
                    >
                      <FaStop className="text-xl" />
                      Stop
                    </button>
                  )}

                  {response && (
                    <button
                      onClick={handleToggleSpeech}
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white transition-all shadow-md ${
                        isSpeakingState ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-500 hover:bg-blue-600'
                      }`}
                      aria-label={isSpeakingState ? 'Stop speaking' : 'Play response'}
                    >
                      {isSpeakingState ? <FaVolumeMute className="text-xl" /> : <FaVolumeUp className="text-xl" />}
                    </button>
                  )}
                </div>

                {!supported && (
                  <p className="text-xs text-center text-gray-400">
                    Voice recognition is not supported in this browser. Please use Chrome or Edge.
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
