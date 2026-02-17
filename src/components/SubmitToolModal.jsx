import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const SubmitToolModal = ({ isOpen, onClose }) => {
  const [fullName, setFullName] = useState('');
  const [school, setSchool] = useState('');
  const [toolName, setToolName] = useState('');
  const [goal, setGoal] = useState('');
  const [link, setLink] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || !school.trim() || !toolName.trim() || !goal.trim() || !link.trim()) return;
    
    setIsSubmitting(true);
    try {
      let imageUrl = null;
      
      if (imageFile) {
        const uploadResult = await base44.integrations.Core.UploadFile({ file: imageFile });
        imageUrl = uploadResult.file_url;
      }

      await base44.entities.CommunityTool.create({
        full_name: fullName,
        school,
        tool_name: toolName,
        goal,
        link,
        image_url: imageUrl,
        status: 'pending',
      });

      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFullName('');
    setSchool('');
    setToolName('');
    setGoal('');
    setLink('');
    setImageFile(null);
    setImagePreview(null);
    setIsSubmitted(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="max-w-lg w-full bg-white border border-gray-200 rounded-3xl p-5 md:p-7 shadow-2xl relative text-right my-8"
            dir="rtl"
          >
            <button
              onClick={handleClose}
              className="absolute top-4 left-4 w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-all"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>

            <div className="absolute top-0 right-0 w-full h-2 bg-orange-500 rounded-t-3xl" />

            {isSubmitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-3xl">🎉</span>
                </div>
                <h3 className="text-xl font-black text-gray-900">תודה על השיתוף!</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  הכלי שלכם נשלח לבדיקה. לאחר אישור, הוא יופיע כבועה כתומה במרחב הקהילתי שלנו! 🚀
                </p>
                <button onClick={handleClose} className="px-6 py-3 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800">
                  סגירה
                </button>
              </div>
            ) : (
              <>
                <div className="mt-2 mb-4">
                  <h3 className="text-lg font-black text-gray-900 mb-1">שתפו כלי שפיתחתם 🛠️</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    פיתחתם ניסוי, משחק או כלי אינטראקטיבי להוראת AI? שתפו אותו עם הקהילה!
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mr-1">שם מלא</label>
                      <input
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="השם שלך..."
                        className="w-full p-2.5 text-sm rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mr-1">בית ספר / קהילה</label>
                      <input
                        required
                        value={school}
                        onChange={(e) => setSchool(e.target.value)}
                        placeholder="איפה אתם מלמדים?"
                        className="w-full p-2.5 text-sm rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mr-1">שם הכלי</label>
                    <input
                      required
                      value={toolName}
                      onChange={(e) => setToolName(e.target.value)}
                      placeholder="שם הכלי/ניסוי שפיתחתם..."
                      className="w-full p-2.5 text-sm rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mr-1">מטרת הכלי</label>
                    <textarea
                      required
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      placeholder="מה הכלי מלמד?"
                      rows={2}
                      className="w-full resize-none p-2.5 text-sm rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mr-1">קישור לכלי</label>
                    <input
                      required
                      type="url"
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      placeholder="https://..."
                      className="w-full p-2.5 text-sm rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none"
                      dir="ltr"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mr-1">תמונת תצוגה (אופציונלי)</label>
                    <div className="relative">
                      {imagePreview ? (
                        <div className="relative rounded-xl overflow-hidden border border-gray-200">
                          <img src={imagePreview} alt="Preview" className="w-full h-24 object-cover" />
                          <button
                            type="button"
                            onClick={() => { setImageFile(null); setImagePreview(null); }}
                            className="absolute top-2 left-2 w-6 h-6 rounded-full bg-white/80 flex items-center justify-center"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex items-center justify-center gap-2 h-16 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-orange-500 transition-colors">
                          <Upload className="w-4 h-4 text-gray-400" />
                          <span className="text-xs text-gray-600">העלו תמונה</span>
                          <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                        </label>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 hover:from-orange-600 hover:to-orange-700 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        שולח...
                      </>
                    ) : (
                      'שליחה לאישור 🚀'
                    )}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SubmitToolModal;