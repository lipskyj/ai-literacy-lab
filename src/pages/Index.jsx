import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Send, CheckCircle, Plus, X, ExternalLink, Sparkles, HelpCircle, Lightbulb, Swords, Gauge, Languages, Share2 } from 'lucide-react';
import BubbleField from '../components/BubbleField';
import BackgroundOrbs from '../components/BackgroundOrbs';
import AddQuestionModal from '../components/AddQuestionModal';
import SubmitToolModal from '../components/SubmitToolModal';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const INITIAL_QUESTIONS = [
  { id: 'q1', text: "כוחו של פרומפט", link: "https://gemini.google.com/share/bbce1f8f445c" },
  { id: 'q2', text: "למה המודל תמיד מניח שהרופא הוא גבר?" },
  { id: 'q3', text: "זיהוי הטיות בבינה מלאכותית", link: "https://gemini.google.com/share/59d718dde511" },
  { id: 'q4', text: "האם תלמיד שכותב עם AI הוא עדיין הכותב של היצירה?" },
  { id: 'q5', text: "איך המחשב יודע מה המילה הבאה?", link: "https://gemini.google.com/share/52175e0e7da1" },
  { id: 'q6', text: "מה ה-T ב-GPT? חקירת ארכיטקטורת Transformer", link: "https://transformer-anatomy-explorer-ea037c21.base44.app/" },
  { id: 'q7', text: "איך אני יכול להוכיח לתלמידים שה-AI הרגע המציא עובדה?" },
  { id: 'q8', text: "מה קורה בתוך ה'קופסה השחורה' כשיש שגיאה?" },
  { id: 'q9', text: "האם ה-AI מכיר היסטוריה שלא נכתבה על ידי המנצחים?" },
  { id: 'q10', text: "איך נראית 'הסתברות' כשמסתכלים עליה מקרוב?" },
  { id: 'q11', text: "האם אפשר ללמד AI להרגיש אמפתיה דרך מילים?" },
  { id: 'q12', text: "למה ה-AI עונה אחרת אם אני רק משנה מילה אחת?" },
  { id: 'q13', text: "איך מייצרים 'חיסון' נגד פייק ניוז שנוצר בבינה מלאכותית?", link: "https://truthseekerlab.com" },
  { id: 'q14', text: "למה המודל נוטה להסכים איתי גם כשאני טועה?" },
  { id: 'q15', text: "האם ל-AI יש 'סגנון אישי' או שהוא רק חיקוי של הממוצע?" },
  { id: 'q16', text: "האם המחשב באמת מבין מה הוא אומר?" },
  { id: 'q17', text: "למה ה-AI לא יודע לאיית מילים פשוטות? מה הטוקנים מסתירים?" },
  { id: 'q18', text: "מה ההבדל בין העוזר המנומס לבין ה'מוח הסטטיסטי' שמאחוריו?" },
  { id: 'q19', text: "האם הפלט של ה-AI הוא מראה דיגיטלית של הדעות הקדומות שלנו?" },
  { id: 'q20', text: "איפה ה-AI מפסיק להיות הגיוני ומתחיל להיות מוזר?" },
  { id: 'q21', text: "האם ה-AI מכיר את הסיפורים של הקהילה שלנו, או רק את ויקיפדיה?" },
];

export default function Index() {
  const [questions, setQuestions] = useState(INITIAL_QUESTIONS);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showEmbedModal, setShowEmbedModal] = useState(false);
  const [showTopicsModal, setShowTopicsModal] = useState(false);
  const [showSubmitToolModal, setShowSubmitToolModal] = useState(false);
  const [communityTools, setCommunityTools] = useState([]);
  const [cardPage, setCardPage] = useState(0);
  const [modalTab, setModalTab] = useState('topics');

  useEffect(() => {
    const fetchApproved = async () => {
      const data = await base44.entities.CommunityTool.filter({ status: 'approved' }, '-created_date', 100);
      if (data) {
        const tools = data.map(t => ({
          id: `community-${t.id}`,
          text: t.tool_name,
          link: t.link,
          image: t.image_url,
          communityMeta: { fullName: t.full_name, school: t.school, goal: t.goal },
        }));
        setCommunityTools(tools);
      }
    };
    fetchApproved();
  }, []);

  const allQuestions = [...communityTools, ...questions];

  const handleSelect = async (question) => {
    const sessionId = sessionStorage.getItem('session_id') || (() => {
      const id = crypto.randomUUID();
      sessionStorage.setItem('session_id', id);
      return id;
    })();
    
    await base44.entities.TopicClick.create({
      topic_id: question.id,
      topic_text: question.text,
      has_link: !!question.link,
      session_id: sessionId,
    });

    if (question.link) {
      setSelectedQuestion(question);
      setShowEmbedModal(true);
      return;
    }
    setSelectedQuestion(question);
    setShowQuestionModal(true);
  };

  const handleAddSubmit = async (topicText, fullName, school) => {
    await base44.entities.Participant.create({
      topic_id: `custom-${Date.now()}`,
      topic_text: topicText,
      full_name: fullName,
      school: school,
      idea: topicText,
    });

    const newQ = { id: `custom-${Date.now()}`, text: topicText };
    setQuestions(prev => [newQ, ...prev]);
    setShowAddModal(false);
  };

  const nextCardPage = () => {
    setCardPage(p => (p < 4 ? p + 1 : 0));
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-right" dir="rtl">
        <BackgroundOrbs />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-white p-12 rounded-[4rem] shadow-2xl text-center border-b-8 border-orange-500"
        >
          <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-12 h-12 text-orange-500" />
          </div>
          <h2 className="text-4xl font-black text-gray-900 mb-6 italic tracking-tight">נפלא!</h2>
          <p className="text-gray-600 mb-10 text-lg leading-relaxed font-medium">
            התהייה שלך הופקדה במעבדת ה-Unboxing. אנחנו נרתום את הקהילה כדי להפוך אותה לניסוי ויזואלי שיונגש לכולם.
          </p>
          <button onClick={() => setIsSubmitted(false)} className="w-full py-4 bg-gray-900 text-white rounded-2xl text-lg font-bold hover:bg-gray-800">
            חזרה למרחב
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-orange-200 overflow-x-hidden relative" dir="rtl">
      <BackgroundOrbs />

      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-8">
        <BubbleField items={allQuestions} onSelect={handleSelect} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-30 bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl p-4 md:p-5 max-w-[280px] md:max-w-xs text-center pointer-events-auto shadow-lg overflow-hidden min-h-[220px] md:min-h-[240px] flex flex-col justify-between"
        >
          <div className="flex-1 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {cardPage === 0 && (
                <motion.div key="page0" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }} className="space-y-3">
                  <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-1 bg-orange-500 rounded-full flex items-center justify-center">
                    <Brain className="w-10 h-10 md:w-12 md:h-12 text-white" />
                  </div>
                  <h1 className="text-base md:text-lg font-black text-gray-900 tracking-tight leading-tight">
                    קהילת <span className="text-orange-500">Unboxing School</span>
                  </h1>
                  <p className="text-[11px] md:text-xs text-gray-600 leading-relaxed">
                    נרתמת לאתגר אוריינות בינה מלאכותית
                  </p>
                </motion.div>
              )}
              {cardPage === 1 && (
                <motion.div key="page1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }} className="space-y-3 py-2">
                  <h2 className="text-sm md:text-base font-black text-gray-900 leading-tight">
                    מה זה <span className="text-orange-500">אתגר ה-Unboxing</span>?
                  </h2>
                  <p className="text-[10px] md:text-xs text-gray-600 leading-relaxed">
                    תהליך <strong>Design Thinking</strong> קהילתי בו מורים מפתחים פתרונות להוראת אוריינות בינה מלאכותית.
                  </p>
                </motion.div>
              )}
              {cardPage === 2 && (
                <motion.div key="page2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }} className="space-y-3 py-2">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto">
                    <span className="text-2xl font-black text-orange-500">1</span>
                  </div>
                  <h2 className="text-base font-black text-gray-900">בחרו</h2>
                  <p className="text-[10px] md:text-xs text-gray-600 leading-relaxed">
                    לחצו על בועה שמעניינת אתכם או הוסיפו נושא חדש עם כפתור ה-<span className="text-orange-500 font-black">+</span>
                  </p>
                </motion.div>
              )}
              {cardPage === 3 && (
                <motion.div key="page3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }} className="space-y-3 py-2">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto">
                    <span className="text-2xl font-black text-orange-500">2</span>
                  </div>
                  <h2 className="text-base font-black text-gray-900">חקרו</h2>
                  <p className="text-[10px] md:text-xs text-gray-600 leading-relaxed">
                    בועות כתומות מובילות לניסויים אינטראקטיביים שכבר נבנו בקהילה
                  </p>
                </motion.div>
              )}
              {cardPage === 4 && (
                <motion.div key="page4" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }} className="space-y-3 py-2">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto">
                    <span className="text-2xl font-black text-orange-500">3</span>
                  </div>
                  <h2 className="text-base font-black text-gray-900">בנו</h2>
                  <p className="text-[10px] md:text-xs text-gray-600 leading-relaxed">
                    הפכו שאלה לפרויקט שמנגיש את הנושא לתלמידים שלכם
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={nextCardPage}
            className="flex items-center justify-center gap-2 text-orange-500 text-xs font-bold mt-3 animate-pulse mx-auto"
          >
            <span>{cardPage === 0 ? 'על האתגר' : cardPage < 4 ? 'הבא' : 'חזרה'}</span>
          </button>
          <div className="flex items-center justify-center gap-1.5 mt-2">
            {[0,1,2,3,4].map(i => (
              <button key={i} onClick={() => setCardPage(i)} className={`w-1.5 h-1.5 rounded-full transition-all ${cardPage === i ? 'bg-orange-500 w-3' : 'bg-gray-300'}`} />
            ))}
          </div>
        </motion.div>

        <button
          onClick={() => setShowAddModal(true)}
          className="fixed bottom-8 right-8 z-40 w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
        >
          <Plus className="w-6 h-6" />
        </button>

        <Link
          to={createPageUrl('Admin')}
          className="fixed bottom-8 left-8 z-40 px-4 py-2 bg-gray-900 text-white rounded-full shadow-lg text-xs font-bold hover:bg-gray-800"
        >
          Admin
        </Link>
      </section>

      {/* Question Modal */}
      <AnimatePresence>
        {showQuestionModal && selectedQuestion && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-2xl w-full bg-white border border-gray-200 rounded-3xl p-6 md:p-10 lg:p-14 shadow-2xl relative text-right"
            >
              <button
                onClick={() => setShowQuestionModal(false)}
                className="absolute top-4 left-4 md:top-5 md:left-5 w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-all"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>

              <div className="absolute top-0 right-0 w-full h-2 bg-orange-500 rounded-t-3xl" />

              <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-6 md:mb-10 items-start mt-2">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0">
                  <Brain className="w-6 h-6 md:w-8 md:h-8 text-orange-500" />
                </div>
                <h3 className="text-lg md:text-2xl font-black text-gray-900 leading-tight italic flex-1">
                  "{selectedQuestion.text}"
                </h3>
              </div>

              <form onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target;
                const fullName = form.elements.namedItem('fullName').value;
                const school = form.elements.namedItem('school').value;
                const idea = form.elements.namedItem('idea').value;
                
                await base44.entities.Participant.create({
                  topic_id: selectedQuestion.id,
                  topic_text: selectedQuestion.text,
                  full_name: fullName,
                  school: school,
                  idea: idea,
                });

                setShowQuestionModal(false);
                setIsSubmitted(true);
              }} className="space-y-5 md:space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest block text-right mr-2">שם מלא</label>
                    <input name="fullName" required type="text" placeholder="השם שלך..." className="w-full p-4 md:p-6 text-base md:text-lg rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest block text-right mr-2">בית ספר / קהילה</label>
                    <input name="school" required type="text" placeholder="איפה אתם מלמדים?" className="w-full p-4 md:p-6 text-base md:text-lg rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest block text-right mr-2">איך הייתם רוצים להנגיש את החשיפה הזו לתלמידים?</label>
                  <textarea name="idea" required rows={3} placeholder="שתפו אותנו ברעיון שלכם..." className="w-full resize-none p-4 md:p-6 text-base md:text-lg rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none" />
                </div>

                <button type="submit" className="w-full py-4 md:py-5 bg-gray-900 text-white text-base md:text-lg font-bold rounded-xl flex items-center justify-center gap-3 group hover:bg-gray-800">
                  יוצאים לדרך
                  <Send className="w-5 h-5 group-hover:translate-x-[-4px] transition-transform" />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Embed Modal */}
      <AnimatePresence>
        {showEmbedModal && selectedQuestion && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 30 }}
              className="w-full max-w-lg bg-white border border-gray-200 rounded-3xl shadow-2xl relative overflow-hidden"
              dir="rtl"
            >
              <button
                onClick={() => setShowEmbedModal(false)}
                className="absolute top-4 left-4 z-10 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>

              <a
                href={selectedQuestion.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block group cursor-pointer"
              >
                {selectedQuestion.image && (
                  <div className="relative overflow-hidden">
                    <img
                      src={selectedQuestion.image}
                      alt={selectedQuestion.text}
                      className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-orange-500 text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg">
                        <ExternalLink className="w-4 h-4" />
                        פתיחה בטאב חדש
                      </div>
                    </div>
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-black text-gray-900 mb-2">{selectedQuestion.text}</h3>
                  {selectedQuestion.communityMeta && (
                    <div className="mb-3 bg-orange-50 rounded-xl px-4 py-3 border border-orange-200">
                      <p className="text-xs text-gray-900 font-bold">{selectedQuestion.communityMeta.fullName} · {selectedQuestion.communityMeta.school}</p>
                      <p className="text-[11px] text-gray-600 mt-1">{selectedQuestion.communityMeta.goal}</p>
                    </div>
                  )}
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <ExternalLink className="w-3.5 h-3.5" />
                    לחצו לפתיחה
                  </p>
                </div>
              </a>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="relative z-30 bg-gray-900 text-white py-10 px-6">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <p className="text-sm text-gray-400 leading-relaxed max-w-md mx-auto">
            תוכנית של MindCET לפיתוח אוריינות בינה מלאכותית בקרב מורים ותלמידים
          </p>

          <div className="bg-white/10 border border-white/20 rounded-2xl p-5 max-w-md mx-auto space-y-3">
            <div className="flex items-center justify-center gap-2">
              <Share2 className="w-5 h-5 text-orange-400" />
              <h3 className="text-sm font-black text-white">פיתחתם כלי? שתפו עם הקהילה!</h3>
            </div>
            <p className="text-[11px] text-gray-300 leading-relaxed">
              בניתם ניסוי, משחק או כלי אינטראקטיבי להוראת AI? הוסיפו אותו למרחב הקהילתי שלנו
            </p>
            <button
              onClick={() => setShowSubmitToolModal(true)}
              className="inline-flex items-center gap-2 bg-orange-500 text-white px-5 py-2.5 rounded-full font-bold text-xs hover:bg-orange-600 transition-all"
            >
              <Plus className="w-4 h-4" />
              שיתוף כלי שפיתחתי
            </button>
          </div>

          <p className="text-xs text-gray-500 pt-4">© {new Date().getFullYear()} MindCET · Unboxing School</p>
        </div>
      </footer>

      <AddQuestionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddSubmit}
      />

      <SubmitToolModal
        isOpen={showSubmitToolModal}
        onClose={() => setShowSubmitToolModal(false)}
      />
    </div>
  );
}