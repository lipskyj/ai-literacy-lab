import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const AddQuestionModal = ({ isOpen, onClose, onSubmit }) => {
  const [topicText, setTopicText] = useState('');
  const [fullName, setFullName] = useState('');
  const [school, setSchool] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!topicText.trim() || !fullName.trim() || !school.trim()) return;
    onSubmit(topicText, fullName, school);
    setTopicText('');
    setFullName('');
    setSchool('');
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
            <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-6 italic">
              שתפו נושא חדש והצטרפו!
            </h3>
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
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest block mr-2">בית ספר / קהילה</label>
                  <input
                    required
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    placeholder="איפה אתם מלמדים?"
                    className="w-full p-4 text-base rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>
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
              <div className="flex gap-4 pt-2">
                <button type="submit" className="flex-1 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold text-lg hover:from-orange-600 hover:to-orange-700">
                  הוספה לזרם 🚀
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