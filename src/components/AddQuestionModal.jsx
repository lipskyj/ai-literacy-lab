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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName.trim() || !school.trim() || !email.trim()) return;
    
    if (selectedQuestion) {
      // Submitting for an existing question
      if (!idea.trim() || !submissionType) return;
      onSubmit({
        selectedQuestion,
        fullName,
        email,
        school,
        idea,
        submissionType,
      });
    } else {
      // Submitting a new topic
      if (!topicText.trim() || !idea.trim()) return;
      onSubmit({
        topicText,
        fullName,
        email,
        school,
        idea,
        submissionType: 'new_topic',
      });
    }
    
    setTopicText('');
    setFullName('');
    setSchool('');
    setEmail('');
    setIdea('');
    setSubmissionType('');
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
            <button onClick={onClose} className="absolute top-4 left-4 w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
              <X className="w-4 h-4" />
            </button>
            {selectedQuestion ? (
              <div className="mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                    <Plus className="w-5 h-5 text-orange-500" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-gray-900 leading-tight italic">
                    "{selectedQuestion.text}"
                  </h3>
                </div>
              </div>
            ) : (
              <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-6 italic">
                שתפו נושא חדש והצטרפו!
              </h3>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
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
              
              {!selectedQuestion && (
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest block mr-2">הנושא שלכם</label>
                  <textarea
                    required
                    autoFocus
                    value={topicText}
                    onChange={(e) => setTopicText(e.target.value)}
                    placeholder="איזה נושא באוריינות AI הייתם רוצים לחקור?"
                    className="w-full h-32 resize-none p-4 text-base rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none"
                  />
                </div>
              )}

              {selectedQuestion && submissionType !== 'solution' && submissionType !== 'interest' && (
                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest block mr-2">בחרו את סוג ההגשה</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSubmissionType('solution')}
                      className="p-4 rounded-xl border-2 border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all"
                    >
                      <div className="text-2xl mb-1">✅</div>
                      <div className="text-sm font-bold text-gray-900">יש לי פתרון</div>
                      <div className="text-xs text-gray-600 mt-1">בניתי כלי/ניסוי</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSubmissionType('interest')}
                      className="p-4 rounded-xl border-2 border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all"
                    >
                      <div className="text-2xl mb-1">💡</div>
                      <div className="text-sm font-bold text-gray-900">מעוניין לפתח</div>
                      <div className="text-xs text-gray-600 mt-1">רוצה לעבוד על זה</div>
                    </button>
                  </div>
                </div>
              )}

              {submissionType === 'interest' && (
                <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-6 text-center space-y-3">
                  <div className="text-4xl">🚀</div>
                  <h4 className="text-lg font-black text-gray-900">מרתון פיתוח Unboxing School</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    אנחנו מארגנים מרתון פיתוח קהילתי! נשמח לראות אתכם ולפתח ביחד פתרונות יצירתיים להוראת אוריינות AI.
                  </p>
                  <p className="text-xs text-gray-600">
                    פרטים נוספים יישלחו למייל שלכם בקרוב 📧
                  </p>
                </div>
              )}

              {submissionType !== 'solution' && (
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest block mr-2">
                    {selectedQuestion 
                      ? (submissionType === 'interest' ? 'ספרו על הרעיון שלכם (אופציונלי)' : 'הרעיון / הפתרון שלכם')
                      : 'הרעיון / הפתרון שלכם'}
                  </label>
                  <textarea
                    required={!selectedQuestion || submissionType !== 'interest'}
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    placeholder={
                      selectedQuestion
                        ? submissionType === 'interest'
                        ? "ספרו מה אתם רוצים לפתח (אופציונלי)..."
                        : "שתפו אותנו ברעיון..."
                        : "מה בניתם או מתכננים לבנות?"
                    }
                    className="w-full h-32 resize-none p-4 text-base rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none"
                  />
                </div>
              )}
              <div className="flex gap-4 pt-2">
                <button type="submit" className="flex-1 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold text-lg hover:from-orange-600 hover:to-orange-700">
                  שליחה 🚀
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-8 py-4 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all"
                >
                  ביטול
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddQuestionModal;