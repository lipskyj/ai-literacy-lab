import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus } from 'lucide-react';

const AddQuestionModal = ({ isOpen, onClose, onSubmit, selectedQuestion }) => {
  const [topicText, setTopicText] = useState('');
  const [fullName, setFullName] = useState('');
  const [school, setSchool] = useState('');
  const [email, setEmail] = useState('');
  const [idea, setIdea] = useState('');
  const [submissionType, setSubmissionType] = useState(''); // 'solution' or 'interest'

  const resetForm = () => {
    setTopicText('');
    setFullName('');
    setSchool('');
    setEmail('');
    setIdea('');
    setSubmissionType('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!submissionType) return;
    
    if (submissionType === 'interest') {
      if (!fullName.trim() || !school.trim() || !email.trim() || !idea.trim()) return;
    }
    
    onSubmit({
      selectedQuestion,
      fullName,
      email,
      school,
      idea,
      submissionType,
    });
    
    resetForm();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="max-w-xl w-full bg-white rounded-3xl p-8 md:p-12 shadow-2xl text-right"
            dir="rtl"
          >
            <button onClick={handleClose} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 z-10">
              <X className="w-5 h-5" />
            </button>
            <div className="mb-6 text-center">
              <h3 className="text-xl md:text-2xl font-black text-gray-900 leading-tight">
                "{selectedQuestion.text}"
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {!submissionType && (
                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest block mr-2">בחרו אפשרות</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        onSubmit({
                          selectedQuestion,
                          submissionType: 'solution',
                        });
                        resetForm();
                      }}
                      className="p-5 rounded-2xl border-2 border-gray-200 hover:border-orange-400 hover:bg-orange-50 transition-all group"
                    >
                      <div className="text-4xl mb-2">🚀</div>
                      <div className="text-base font-black text-gray-900 mb-1">יש לי פתרון מוכן</div>
                      <div className="text-xs text-gray-600">בניתי כלי או ניסוי שאפשר לשתף</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSubmissionType('interest')}
                      className="p-5 rounded-2xl border-2 border-gray-200 hover:border-orange-400 hover:bg-orange-50 transition-all group"
                    >
                      <div className="text-4xl mb-2">💭</div>
                      <div className="text-base font-black text-gray-900 mb-1">רוצה לפתח פתרון</div>
                      <div className="text-xs text-gray-600">מעוניין להשתתף במרתון הפיתוח</div>
                    </button>
                  </div>
                </div>
              )}

              {submissionType === 'interest' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-500 uppercase tracking-widest block mr-2">שם מלא</label>
                      <input
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="השם שלך..."
                        className="w-full p-4 text-base rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-500 uppercase tracking-widest block mr-2">מייל</label>
                      <input
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full p-4 text-base rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none"
                        dir="ltr"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest block mr-2">בית ספר / קהילה</label>
                    <input
                      required
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                      placeholder="איפה אתם מלמדים?"
                      className="w-full p-4 text-base rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest block mr-2">הרעיון שלכם לפתרון</label>
                    <textarea
                      required
                      value={idea}
                      onChange={(e) => setIdea(e.target.value)}
                      placeholder="שתפו אותנו איך הייתם רוצים לגשת לנושא..."
                      className="w-full h-32 resize-none p-4 text-base rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-300 rounded-2xl p-6 text-center space-y-3">
                    <div className="text-5xl">🎯</div>
                    <h4 className="text-lg font-black text-gray-900">הרשמה למרתון פיתוח Unboxing</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      נשמח לראות אתכם ולפתח ביחד פתרונות יצירתיים להוראת אוריינות AI
                    </p>
                    <p className="text-xs text-orange-700 font-bold">
                      📧 פרטים נוספים יישלחו למייל
                    </p>
                  </div>
                  <div className="flex gap-4 pt-2">
                    <button type="submit" className="flex-1 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold text-lg hover:from-orange-600 hover:to-orange-700">
                      שליחה והרשמה 🚀
                    </button>
                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-8 py-4 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all"
                    >
                      ביטול
                    </button>
                  </div>
                </>
              )}
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddQuestionModal;