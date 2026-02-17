import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Send, CheckCircle, Plus, X, ExternalLink, Sparkles, HelpCircle, Lightbulb, Swords, Gauge, Languages, Share2 } from 'lucide-react';
import BubbleField from '../components/BubbleField';
import BackgroundOrbs from '../components/BackgroundOrbs';
import AddQuestionModal from '../components/AddQuestionModal';
import SubmitToolModal from '../components/SubmitToolModal';
import BubbleChoiceModal from '../components/BubbleChoiceModal';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const INITIAL_QUESTIONS = [
  { id: 'q1', text: "כוחו של פרומפט", link: "https://gemini.google.com/share/bbce1f8f445c", image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6992e5f1be2efb5ea8e1a203/dabefa540_image.png" },
  { id: 'q2', text: "למה המודל תמיד מניח שהרופא הוא גבר?" },
  { id: 'q3', text: "זיהוי הטיות בבינה מלאכותית", link: "https://gemini.google.com/share/59d718dde511", image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6992e5f1be2efb5ea8e1a203/a7412bf54_image.png" },
  { id: 'q4', text: "האם תלמיד שכותב עם AI הוא עדיין הכותב של היצירה?" },
  { id: 'q5', text: "איך המחשב יודע מה המילה הבאה?", link: "https://gemini.google.com/share/52175e0e7da1", image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6992e5f1be2efb5ea8e1a203/8dba57ba4_image.png" },
  { id: 'q6', text: "מה ה-T ב-GPT? חקירת ארכיטקטורת Transformer", link: "https://transformer-anatomy-explorer-ea037c21.base44.app/", image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6992e5f1be2efb5ea8e1a203/4ac6b2f79_image.png" },
  { id: 'q7', text: "איך אני יכול להוכיח לתלמידים שה-AI הרגע המציא עובדה?" },
  { id: 'q8', text: "מה קורה בתוך ה'קופסה השחורה' כשיש שגיאה?" },
  { id: 'q9', text: "האם ה-AI מכיר היסטוריה שלא נכתבה על ידי המנצחים?" },
  { id: 'q10', text: "איך נראית 'הסתברות' כשמסתכלים עליה מקרוב?" },
  { id: 'q11', text: "האם אפשר ללמד AI להרגיש אמפתיה דרך מילים?" },
  { id: 'q12', text: "למה ה-AI עונה אחרת אם אני רק משנה מילה אחת?" },
  { id: 'q13', text: "איך מייצרים 'חיסון' נגד פייק ניוז שנוצר בבינה מלאכותית?", link: "https://truthseekerlab.com", image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6992e5f1be2efb5ea8e1a203/fe81fd2ad_image.png" },
  { id: 'q14', text: "למה המודל נוטה להסכים איתי גם כשאני טועה?" },
  { id: 'q15', text: "האם ל-AI יש 'סגנון אישי' או שהוא רק חיקוי של הממוצע?" },
  { id: 'q16', text: "האם המחשב באמת מבין מה הוא אומר?" },
  { id: 'q17', text: "למה ה-AI לא יודע לאיית מילים פשוטות? מה הטוקנים מסתירים?" },
  { id: 'q18', text: "מה ההבדל בין העוזר המנומס לבין ה'מוח הסטטיסטי' שמאחוריו?" },
  { id: 'q19', text: "האם הפלט של ה-AI הוא מראה דיגיטלית של הדעות הקדומות שלנו?" },
  { id: 'q20', text: "איפה ה-AI מפסיק להיות הגיוני ומתחיל להיות מוזר?" },
  { id: 'q21', text: "האם ה-AI מכיר את הסיפורים של הקהילה שלנו, או רק את ויקיפדיה?" },
];

const EXPERIMENT_IDEAS = [
  { icon: Swords, title: 'זירת הפרומפטים', desc: 'תחרות פרומפטים – שני שחקנים כותבים פרומפט לאותו אתגר, הכיתה מצביעה על התוצאה הטובה יותר' },
  { icon: Brain, title: 'גלאי ההטיות', desc: 'שנו מילה אחת בשאלה (מגדר, תרבות, גיל) וגלו איך ה-AI משנה את התשובה – חקירת הטיות בזמן אמת' },
  { icon: Gauge, title: 'מד הביטחון', desc: 'שאלו את ה-AI שאלות עובדתיות, דרגו כמה אתם בוטחים בתשובה, ואז בדקו – מי זיהה הזיה?' },
  { icon: Languages, title: 'טלפון שבור AI', desc: 'שרשרת תרגום וסיכום – צפו איך המשמעות נסחפת כשה-AI מעביר מסר ממודל למודל' },
];

const RESOURCES = [
  { title: 'Transformer Explainer', subtitle: 'Inside the Transformer Brain', desc: 'הכלי המקיף ביותר ל"קופסה שקופה" של LLMs – מריץ GPT-2 בדפדפן. הקלידו משפט וצפו איך הוא מפורק לטוקנים, עובר Self-Attention ומנבא את המילה הבאה.', link: 'https://poloclub.github.io/transformer-explainer/' },
  { title: 'LLM Visualization', subtitle: 'The 3D LLM Walkthrough', desc: 'ויזואליזציה תלת-ממדית מרהיבה שמלווה כל חישוב שהמודל עושה – הופכת את ה"קופסה השחורה" למכונה מוחשית.', link: 'https://bbycroft.net/llm' },
  { title: 'Tiktokenizer', subtitle: 'The Tokenizer Lab', desc: 'מודלי שפה לא רואים מילים – הם רואים טוקנים. הדביקו טקסט וראו איך מודלים שונים "חותכים" את השפה.', link: 'https://tiktokenizer.vercel.app/' },
  { title: 'AnimatedLLM', subtitle: 'The Step-by-Step Decoder', desc: 'כלי בדפדפן שנועד ללא-מומחים – מראה תצוגה נקייה של תהליך הדקודינג, איך המודל צורך את הפלט שלו כדי לבנות משפט קוהרנטי.', link: 'https://animatedllm.github.io/' },
  { title: 'Semantris: Blocks', subtitle: 'Word Vector Tetris', desc: 'משחק בסגנול טטריס – כתבו רמזים כדי לחסל בלוקים. ה-AI משתמש ב-Word Embeddings כדי לקשר בין המילים שלכם לבלוקים.', link: 'https://research.google.com/semantris/' },
  { title: 'Survival of the Best Fit', subtitle: 'The Hiring Algorithm Sim', desc: 'משחק על כלי גיוס AI שהופך מוטה. הדרך הטובה ביותר להסביר למה Training Data חשוב יותר מהקוד עצמו.', link: 'https://www.survivalofthebestfit.com/game/' },
  { title: 'TensorFlow Playground', subtitle: 'Neural Network Sandbox', desc: 'ארגז חול לרשת נוירונים – הוסיפו שכבות, שנו Learning Rate וצפו איך ה-AI לומד לסווג נקודות. הכלי האולטימטיבי לחקור מבפנים.', link: 'https://playground.tensorflow.org/' },
  { title: 'AI for Oceans', subtitle: 'The Data Cleaner', desc: 'חוויה אינטראקטיבית של Code.org – אמנו בוט AI להבחין בין דגים לזבל. הדרך הטובה ביותר להסביר שAI הוא רק שיקוף של התיוגים שלנו.', link: 'https://code.org/oceans' },
  { title: 'Quick, Draw!', subtitle: 'Neural Network Pictionary', desc: 'ציירו ורשת נוירונים מנסה לנחש בזמן אמת – הצצה למודלים המנטליים המשותפים שה-AI למד ממיליוני אנשים.', link: 'https://quickdraw.withgoogle.com/' },
  { title: 'AI Puzzlers', subtitle: 'Humans vs. Pattern Matchers', desc: 'משחק שמשתמש בפאזלים ויזואליים (ARC) שקלים לילדים אך קשים ל-AI. תלמידים פותרים את הפאזל, ואז צופים ב-AI מסביר בביטחון פתרון שגוי – ההוכחה ש-AI "מנבא" ולא "חושב".', link: 'https://ai-puzzlers.com/' },
  { title: 'Datasets Have Worldviews', subtitle: 'The Parameter Shifter', desc: 'אינטראקטיב שבו משנים את הגדרות הקטגוריות בדאטאסט ורואים בזמן אמת איך זה משנה את הסיווג של אלפי פריטים – ההוכחה שדאטה הוא לא "אובייקטיבי" אלא דעה.', link: 'https://pair.withgoogle.com/explorables/dataset-worldviews/' },
  { title: 'The Most Likely Machine', subtitle: 'The Algorithmic Fairness Lab', desc: 'חקירה אינטראקטיבית של אלגוריתם שמחליט מי מקבל הלוואה או עבודה. "שחקו" עם הדאטה וגלו שהסרת תוויות כמו מגדר לא תמיד מתקנת את ההטיה – חשיפת משתני פרוקסי.', link: 'https://mostlikelymachine.artefactgroup.com/' },
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
  const [topicPage, setTopicPage] = useState(0);
  const [resourcePage, setResourcePage] = useState(0);
  const [dbBubbles, setDbBubbles] = useState([]);
  const [bubbleSettings, setBubbleSettings] = useState(null);
  const [siteTopics, setSiteTopics] = useState([]);
  const [siteResources, setSiteResources] = useState([]);
  const [siteExperiments, setSiteExperiments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const tools = await base44.entities.CommunityTool.filter({ status: 'approved' }, '-created_date', 100);
      if (tools) {
        const toolBubbles = tools.map(t => ({
          id: `community-${t.id}`,
          text: t.tool_name,
          link: t.link,
          image: t.image_url,
          communityMeta: { fullName: t.full_name, school: t.school, goal: t.goal },
        }));
        setCommunityTools(toolBubbles);
      }

      const bubbles = await base44.entities.Bubble.filter({ is_active: true }, 'order', 100);
      if (bubbles && bubbles.length > 0) {
        const bubbleItems = bubbles.map(b => ({
          id: b.id,
          text: b.text,
          link: b.link || undefined,
          image: b.image_url || undefined,
        }));
        setDbBubbles(bubbleItems);
      }

      const settings = await base44.entities.BubbleSettings.list('-created_date', 1);
      if (settings && settings.length > 0) {
        setBubbleSettings(settings[0]);
      }

      const content = await base44.entities.SiteContent.filter({ is_active: true }, 'order', 200);
      if (content) {
        setSiteTopics(content.filter(c => c.content_type === 'topic'));
        setSiteResources(content.filter(c => c.content_type === 'resource'));
        setSiteExperiments(content.filter(c => c.content_type === 'experiment_idea'));
      }
    };
    fetchData();
  }, []);

  const allQuestions = dbBubbles.length > 0 ? [...communityTools, ...dbBubbles] : [...communityTools, ...questions];

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

    setSelectedQuestion(question);
    
    // If bubble has link, show embed modal with information
    if (question.link) {
      setShowEmbedModal(true);
    } else {
      // For bubbles without link, show A/B choice modal
      setShowQuestionModal(true);
    }
  };

  const handleAddSubmit = async (data) => {
    if (data.submissionType === 'solution') {
      // For solution submissions, open the tool submission modal
      setShowQuestionModal(false);
      setShowSubmitToolModal(true);
      return;
    }

    // For interest submissions, save as Participant
    await base44.entities.Participant.create({
      topic_id: data.selectedQuestion ? data.selectedQuestion.id : `custom-${Date.now()}`,
      topic_text: data.selectedQuestion ? data.selectedQuestion.text : data.topicText,
      full_name: data.fullName,
      email: data.email,
      school: data.school,
      idea: data.idea || '',
      submission_type: 'interest',
    });
    
    setShowQuestionModal(false);
    setIsSubmitted(true);
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

      <section className="relative min-h-screen flex items-center justify-center px-4 py-8">
        <BubbleField items={allQuestions} onSelect={handleSelect} settings={bubbleSettings} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-30 bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl p-4 md:p-8 max-w-[280px] md:max-w-xl text-center pointer-events-auto shadow-lg overflow-hidden min-h-[200px] md:min-h-[280px] flex flex-col justify-between"
        >
          <div className="flex-1 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {cardPage === 0 && (
                <motion.div key="page0" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }} className="space-y-3">
                  <img 
                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6992e5f1be2efb5ea8e1a203/00627d883_image.png" 
                    alt="Unboxing School" 
                    className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-1 object-contain"
                  />
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




      </section>

      {/* Question Modal - A/B Choice for bubbles without links */}

      {/* Embed Modal - Shows bubble with link + A/B choice */}
      <AnimatePresence>
        {showEmbedModal && selectedQuestion && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 md:p-6 bg-black/70 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 30 }}
              className="w-full max-w-lg bg-white border border-gray-200 rounded-3xl shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto"
              dir="rtl"
            >
              <button
                onClick={() => setShowEmbedModal(false)}
                className="sticky top-4 left-4 z-20 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-100 transition-all ml-auto mb-4 mr-4"
              >
                <X className="w-5 h-5 text-gray-600" />
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
                  <p className="text-sm text-gray-600 flex items-center gap-2 mb-4">
                    <ExternalLink className="w-3.5 h-3.5" />
                    לחצו לפתיחה בטאב חדש
                  </p>
                </div>
              </a>

              <div className="px-6 pb-6 border-t border-gray-200 pt-6">
                <p className="text-sm font-bold text-gray-900 mb-4 text-center">רוצים להוסיף משהו לנושא הזה?</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      setShowEmbedModal(false);
                      setShowSubmitToolModal(true);
                    }}
                    className="p-4 rounded-2xl border-2 border-gray-200 hover:border-orange-400 hover:bg-orange-50 transition-all"
                  >
                    <div className="text-3xl mb-1">🚀</div>
                    <div className="text-sm font-black text-gray-900">יש לי פתרון מוכן</div>
                    <div className="text-xs text-gray-600 mt-1">שיתוף כלי שפיתחתי</div>
                  </button>
                  <button
                    onClick={() => {
                      setShowEmbedModal(false);
                      setShowQuestionModal(true);
                    }}
                    className="p-4 rounded-2xl border-2 border-gray-200 hover:border-orange-400 hover:bg-orange-50 transition-all"
                  >
                    <div className="text-3xl mb-1">💭</div>
                    <div className="text-sm font-black text-gray-900">רוצה לפתח פתרון</div>
                    <div className="text-xs text-gray-600 mt-1">הרשמה למרתון פיתוח</div>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* YouTube Video Section */}
      <section className="relative z-30 bg-white py-10 px-6" dir="rtl">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-black text-gray-900 text-center mb-6">הכירו את אתגר Unboxing School</h2>
          <div className="bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden shadow-lg">
            <div className="relative" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src="https://www.youtube.com/embed/ETCi-4zRJWE"
                title="Unboxing School Challenge"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* MindCET Products Section */}
      <section className="relative z-30 bg-gray-100 py-12 px-6" dir="rtl">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-black text-gray-900 text-center mb-2">כלים של MindCET לאוריינות בינה מלאכותית</h2>
          <p className="text-xs text-gray-600 text-center mb-8">משחקים וחוויות אינטראקטיביות לפיתוח חשיבה ביקורתית ויצירתיות</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* FROST */}
            <a href="https://plai.mindcet.org/frost_index" target="_blank" rel="noopener noreferrer" className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="bg-[#dff6f9] p-6 flex items-center justify-center h-32">
                <span className="text-4xl font-black text-[#4a90a4]">FROST</span>
              </div>
              <div className="p-5 space-y-2">
                <h3 className="text-base font-black text-gray-900">FROST</h3>
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  חדר בריחה דיגיטלי לפיתוח אוריינות בינה מלאכותית. התלמידים יתמודדו עם 4 משימות שיאתגרו אותם לחשוב בצורה ביקורתית.
                </p>
                <span className="inline-flex items-center gap-1 text-[10px] text-orange-500 font-bold group-hover:underline">
                  <ExternalLink className="w-3 h-3" /> כניסה לחדר הבריחה
                </span>
              </div>
            </a>
            {/* PLAI */}
            <a href="https://plai.mindcet.org/" target="_blank" rel="noopener noreferrer" className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="bg-[#2d3436] p-6 flex items-center justify-center h-32">
                <span className="text-4xl font-black text-white">PLAI</span>
              </div>
              <div className="p-5 space-y-2">
                <h3 className="text-base font-black text-gray-900">PLAI</h3>
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  פלטפורמת MindCET לאוריינות בינה מלאכותית – סביבה אינטראקטיבית למורים ותלמידים עם כלים, משחקים וחוויות למידה מגוונות.
                </p>
                <span className="inline-flex items-center gap-1 text-[10px] text-orange-500 font-bold group-hover:underline">
                  <ExternalLink className="w-3 h-3" /> כניסה לפלטפורמה
                </span>
              </div>
            </a>
            {/* PIXA */}
            <a href="https://plai.mindcet.org/new_create_game?step=2" target="_blank" rel="noopener noreferrer" className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="bg-[#c8b4f0] p-6 flex items-center justify-center h-32">
                <span className="text-4xl font-black text-[#6b4d9e]">PIXA</span>
              </div>
              <div className="p-5 space-y-2">
                <h3 className="text-base font-black text-gray-900">PIXA</h3>
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  משחק לפיתוח אוריינות בינה מלאכותית המפתח דיוק לשוני, חשיבה ביקורתית ויצירתיות. התלמידים מנסחים פרומפטים כדי לשחזר תמונה.
                </p>
                <span className="inline-flex items-center gap-1 text-[10px] text-orange-500 font-bold group-hover:underline">
                  <ExternalLink className="w-3 h-3" /> התחילו לשחק
                </span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* AI Quests Section */}
      <section className="relative z-30 bg-white py-10 px-6" dir="rtl">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden">
            <a href="https://research.google/ai-quests/intl/he_il/teacher-resources" target="_blank" rel="noopener noreferrer" className="block group">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6992e5f1be2efb5ea8e1a203/916b9d9bd_image.png" 
                alt="AI Quests" 
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </a>
            <div className="p-6 space-y-4 text-right">
              <div>
                <h3 className="text-lg font-black text-gray-900 mb-1">AI Quests – Google Research × Stanford</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  סדרת מערכי שיעור אינטראקטיביים לחקירת AI בכיתה – כולל חומרי הוראה מוכנים בעברית.
                </p>
                <a href="https://research.google/ai-quests/intl/he_il/teacher-resources" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-orange-500 font-bold mt-2 hover:underline">
                  <ExternalLink className="w-3 h-3" /> למשאבי ההוראה
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

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

          <a
            href="https://www.mindcet.org/unboxing-school/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-orange-600 transition-all"
          >
            <ExternalLink className="w-4 h-4" />
            למדו עוד על Unboxing School
          </a>

          <div className="flex items-center justify-center gap-2 pt-2 flex-wrap">
            <button
              onClick={() => { setModalTab('topics'); setShowTopicsModal(true); }}
              className="px-4 py-2 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-md"
            >
              עוד נושאים
            </button>
            <button
              onClick={() => { setModalTab('approach'); setShowTopicsModal(true); }}
              className="px-4 py-2 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-md"
            >
              רעיונות יצירתיים ללמד ולהבין
            </button>
            <button
              onClick={() => { setModalTab('done'); setShowTopicsModal(true); }}
              className="px-4 py-2 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-md"
            >
              מה כבר נעשה 🌍
            </button>
          </div>

          <p className="text-xs text-gray-500 pt-4">© {new Date().getFullYear()} MindCET · Unboxing School</p>
        </div>
      </footer>

      {/* Topics & Approaches Modal */}
      <AnimatePresence>
        {showTopicsModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-2xl w-full max-h-[85vh] bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-2xl relative text-right overflow-hidden flex flex-col"
              dir="rtl"
            >
              <button
                onClick={() => setShowTopicsModal(false)}
                className="absolute top-4 left-4 w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-all"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>

              <div className="absolute top-0 right-0 w-full h-2 bg-orange-500 rounded-t-3xl" />

              <div className="flex items-center gap-3 mb-4 mt-2">
                <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0">
                  <Lightbulb className="w-5 h-5 text-orange-500" />
                </div>
                <h3 className="text-lg font-black text-gray-900">
                  {modalTab === 'topics' ? 'עוד נושאים' : modalTab === 'approach' ? 'רעיונות יצירתיים ללמד ולהבין' : 'מה כבר נעשה 🌍'}
                </h3>
              </div>

              <div className="flex-1 overflow-y-auto">
                <AnimatePresence mode="wait">
                {/* Tab 1: More Topics */}
                {modalTab === 'topics' && (
                  <motion.div key="topics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4 max-h-[60vh] overflow-y-auto">
                    {siteTopics.length > 0 ? (
                      <>
                        {['הבנה ושקיפות', 'אתיקה וחברה', 'חקירה מעשית'].map((cat, catIdx) => {
                          const categoryTopics = siteTopics.filter(t => t.category === cat);
                          if (categoryTopics.length === 0) return null;
                          return (
                            <div key={cat}>
                              <p className="text-[11px] font-black text-orange-500 uppercase tracking-wider mb-2">
                                {catIdx === 0 ? '🔍' : catIdx === 1 ? '⚖️' : '🧪'} {cat}
                              </p>
                              <div className="space-y-2">
                                {categoryTopics.map((t) => (
                                  <div key={t.id} className="flex items-start gap-2 bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-200">
                                    <Sparkles className="w-3 h-3 text-orange-500 shrink-0 mt-0.5" />
                                    <div>
                                      <span className="text-xs text-gray-900 font-bold block">{t.title}</span>
                                      <span className="text-[10px] text-gray-600">{t.description}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </>
                    ) : (
                      <p className="text-sm text-gray-500 text-center py-4">אין נושאים להצגה</p>
                    )}
                  </motion.div>
                )}

                {/* Tab 2: How to Approach */}
                {modalTab === 'approach' && (
                  <motion.div key="approach" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">
                    <p className="text-xs text-gray-600 mb-3">רעיונות לניסויים אינטראקטיביים בגישת Unboxing – לא ללמד על AI, אלא לתת לתלמידים לחקור בעצמם:</p>
                    {siteExperiments.length > 0 ? siteExperiments.map((idea) => {
                      const IconComponent = idea.icon === 'Swords' ? Swords : idea.icon === 'Brain' ? Brain : idea.icon === 'Gauge' ? Gauge : Languages;
                      return (
                        <div key={idea.id} className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                              <IconComponent className="w-4 h-4 text-orange-500" />
                            </div>
                            <h4 className="font-black text-gray-900 text-sm">{idea.title}</h4>
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed pr-11">{idea.description}</p>
                        </div>
                      );
                    }) : EXPERIMENT_IDEAS.map((idea) => (
                      <div key={idea.title} className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                            <idea.icon className="w-4 h-4 text-orange-500" />
                          </div>
                          <h4 className="font-black text-gray-900 text-sm">{idea.title}</h4>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed pr-11">{idea.desc}</p>
                      </div>
                    ))}
                  </motion.div>
                )}

                {/* Tab 3: What's Been Done */}
                {modalTab === 'done' && (
                  <motion.div key="done" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-2">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-gray-600">ניסויים אינטראקטיביים שכבר קיימים ברשת</p>
                        <span className="text-[9px] text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full shrink-0">English</span>
                      </div>
                      <span className="text-[10px] text-gray-600">{resourcePage + 1}/{Math.ceil((siteResources.length > 0 ? siteResources : RESOURCES).length / 4)}</span>
                    </div>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={resourcePage}
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-2"
                      >
                        {(siteResources.length > 0 ? siteResources : RESOURCES).slice(resourcePage * 4, (resourcePage + 1) * 4).map((r) => (
                          <a
                            key={r.id || r.title}
                            href={r.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block bg-gray-50 hover:bg-gray-100 rounded-xl px-4 py-3 border border-gray-200 transition-all group"
                          >
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="text-xs font-bold text-gray-900">{r.title}</span>
                              <ExternalLink className="w-3 h-3 text-gray-600 group-hover:text-orange-500 shrink-0 transition-colors" />
                            </div>
                            <p className="text-[10px] text-orange-500 font-bold mb-1">{r.subtitle}</p>
                            <p className="text-[10px] text-gray-600 leading-relaxed">{r.description || r.desc}</p>
                          </a>
                        ))}
                      </motion.div>
                    </AnimatePresence>
                    <div className="flex items-center justify-center gap-3 pt-3">
                      <button
                        onClick={() => setResourcePage(p => Math.max(0, p - 1))}
                        disabled={resourcePage === 0}
                        className="px-3 py-1.5 rounded-full bg-gray-100 text-xs font-bold text-gray-900 disabled:opacity-30 hover:bg-gray-200 transition-all"
                      >
                        → הקודם
                      </button>
                      <div className="flex gap-1.5">
                        {Array.from({ length: Math.ceil((siteResources.length > 0 ? siteResources : RESOURCES).length / 4) }).map((_, i) => (
                          <button key={i} onClick={() => setResourcePage(i)} className={`w-2 h-2 rounded-full transition-all ${resourcePage === i ? 'bg-orange-500 w-4' : 'bg-gray-300'}`} />
                        ))}
                      </div>
                      <button
                        onClick={() => setResourcePage(p => Math.min(Math.ceil((siteResources.length > 0 ? siteResources : RESOURCES).length / 4) - 1, p + 1))}
                        disabled={resourcePage === Math.ceil((siteResources.length > 0 ? siteResources : RESOURCES).length / 4) - 1}
                        className="px-3 py-1.5 rounded-full bg-gray-100 text-xs font-bold text-gray-900 disabled:opacity-30 hover:bg-gray-200 transition-all"
                      >
                        הבא ←
                      </button>
                    </div>
                  </motion.div>
                )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <BubbleChoiceModal
        isOpen={showQuestionModal}
        onClose={() => setShowQuestionModal(false)}
        selectedQuestion={selectedQuestion}
        onOpenToolSubmit={() => setShowSubmitToolModal(true)}
      />

      <SubmitToolModal
        isOpen={showSubmitToolModal}
        onClose={() => setShowSubmitToolModal(false)}
      />
    </div>
  );
}