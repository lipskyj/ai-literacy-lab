import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const BubbleChoiceModal = ({ isOpen, onClose, selectedQuestion, onOpenToolSubmit }) => {
  const [step, setStep] = useState('choice'); // 'choice' or 'interest'
  const [fullName, setFullName] = useState('');
  const [school, setSchool] = useState('');
  const [email, setEmail] = useState('');
  const [idea, setIdea] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const resetForm = () => {
    setStep('choice');
    setFullName('');
    setSchool('');
    setEmail('');
    setIdea('');
    setIsSubmitted(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleInterestSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || !school.trim() || !email.trim() || !idea.trim()) return;
    
    setIsSubmitting(true);
    try {
      await base44.entities.Participant.create({
        topic_id: selectedQuestion.id,
        topic_text: selectedQuestion.text,
        full_name: fullName,
        email: email,
        school: school,
        idea: idea,
        submission_type: 'interest',
      });
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedQuestion) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl relative text-right"
            dir="rtl"
          >
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 z-10"
            >
              <X className="w-4 h-4" />
            </button>

            {isSubmitted ? (
              <div className="text-center py-6 space-y-3">
                <div className="text-5xl">🎉</div>
                <h3 className="text-xl font-black text-gray-900">תודה על ההרשמה!</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  נשלח אליכם פרטים נוספים על מרתון הפיתוח במייל
                </p>
                <button onClick={handleClose} className="px-6 py-3 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800">
                  סגירה
                </button>
              </div>
            ) : (
              <>
                <div className="mb-5 text-center">
                  <h3 className="text-lg font-black text-gray-900 leading-tight">
                    "{selectedQuestion.text}"
                  </h3>
                </div>
                
                {step === 'choice' && (
                  <div className="space-y-3">
                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest block">בחרו אפשרות</label>
                    <div className="grid grid-cols-1 gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          handleClose();
                          onOpenToolSubmit();
                        }}
                        className="p-4 rounded-2xl border-2 border-gray-200 hover:border-orange-400 hover:bg-orange-50 transition-all"
                      >
                        <div className="text-3xl mb-1">🚀</div>
                        <div className="text-sm font-black text-gray-900 mb-1">יש לי פתרון מוכן</div>
                        <div className="text-xs text-gray-600">בניתי כלי או ניסוי שאפשר לשתף</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep('interest')}
                        className="p-4 rounded-2xl border-2 border-gray-200 hover:border-orange-400 hover:bg-orange-50 transition-all"
                      >
                        <div className="text-3xl mb-1">💭</div>
                        <div className="text-sm font-black text-gray-900 mb-1">רוצה לפתח פתרון</div>
                        <div className="text-xs text-gray-600">מעוניין להשתתף במרתון הפיתוח</div>
                      </button>
                    </div>
                  </div>
                )}

                {step === 'interest' && (
                  <form onSubmit={handleInterestSubmit} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">שם מלא</label>
                        <input
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="השם שלך..."
                          className="w-full p-2.5 text-sm rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">מייל</label>
                        <input
                          required
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="email@example.com"
                          className="w-full p-2.5 text-sm rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none"
                          dir="ltr"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">בית ספר</label>
                      <input
                        required
                        value={school}
                        onChange={(e) => setSchool(e.target.value)}
                        placeholder="איפה אתם מלמדים?"
                        className="w-full p-2.5 text-sm rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">הרעיון שלכם</label>
                      <textarea
                        required
                        value={idea}
                        onChange={(e) => setIdea(e.target.value)}
                        placeholder="שתפו איך הייתם רוצים לגשת לנושא..."
                        className="w-full h-24 resize-none p-2.5 text-sm rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-300 rounded-2xl p-4 text-center">
                      <div className="text-4xl mb-2">🎯</div>
                      <h4 className="text-sm font-black text-gray-900">הרשמה למרתון פיתוח</h4>
                      <p className="text-xs text-gray-700 mt-1">
                        נשמח לראות אתכם ולפתח ביחד פתרונות יצירתיים
                      </p>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold text-sm hover:from-orange-600 hover:to-orange-700 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                            שולח...
                          </>
                        ) : (
                          'שליחה והרשמה 🚀'
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep('choice')}
                        className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 text-sm"
                      >
                        חזרה
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BubbleChoiceModal;