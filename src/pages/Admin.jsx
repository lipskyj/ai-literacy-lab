import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Lock, Users, MousePointerClick, ArrowRight, CheckCircle, XCircle, Clock, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const ADMIN_PASSWORD = '1234';

export default function Admin() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [topicClicks, setTopicClicks] = useState([]);
  const [communityTools, setCommunityTools] = useState([]);
  const [bubbles, setBubbles] = useState([]);
  const [settings, setSettings] = useState(null);
  const [activeTab, setActiveTab] = useState('participants');
  const [editingBubble, setEditingBubble] = useState(null);
  const [showBubbleForm, setShowBubbleForm] = useState(false);
  const [selectedColor, setSelectedColor] = useState('orange');
  const [siteContent, setSiteContent] = useState([]);
  const [editingContent, setEditingContent] = useState(null);
  const [showContentForm, setShowContentForm] = useState(false);

  const fetchData = async () => {
    const p = await base44.entities.Participant.list('-created_date', 500);
    if (p) setParticipants(p);
    const c = await base44.entities.TopicClick.list('-created_date', 500);
    if (c) setTopicClicks(c);
    const t = await base44.entities.CommunityTool.list('-created_date', 100);
    if (t) setCommunityTools(t);
    const b = await base44.entities.Bubble.list('order', 100);
    if (b) setBubbles(b);
    const s = await base44.entities.BubbleSettings.list('-created_date', 1);
    if (s && s.length > 0) setSettings(s[0]);
    const sc = await base44.entities.SiteContent.filter({ is_active: true }, 'order', 200);
    if (sc) setSiteContent(sc);
  };

  useEffect(() => {
    if (!authenticated) return;
    fetchData();
  }, [authenticated]);

  const updateToolStatus = async (id, status) => {
    await base44.entities.CommunityTool.update(id, { status });
    fetchData();
  };

  const saveBubble = async (data) => {
    if (editingBubble) {
      await base44.entities.Bubble.update(editingBubble.id, data);
    } else {
      await base44.entities.Bubble.create(data);
    }
    setEditingBubble(null);
    setShowBubbleForm(false);
    setSelectedColor('orange');
    fetchData();
  };

  const deleteBubble = async (id) => {
    if (confirm('האם למחוק בועה זו?')) {
      await base44.entities.Bubble.delete(id);
      fetchData();
    }
  };

  const toggleBubbleActive = async (id, isActive) => {
    await base44.entities.Bubble.update(id, { is_active: !isActive });
    fetchData();
  };

  const saveSettings = async (data) => {
    if (settings) {
      await base44.entities.BubbleSettings.update(settings.id, data);
    } else {
      await base44.entities.BubbleSettings.create(data);
    }
    fetchData();
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6" dir="rtl">
        <div className="max-w-sm w-full bg-white border border-gray-200 rounded-2xl p-8 shadow-lg text-center space-y-4">
          <Lock className="w-10 h-10 text-orange-500 mx-auto" />
          <h2 className="text-xl font-black text-gray-900">כניסת מנהל</h2>
          <form onSubmit={(e) => { e.preventDefault(); if (password === ADMIN_PASSWORD) setAuthenticated(true); }} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="סיסמה..."
              className="w-full p-3 text-base rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none"
            />
            <button type="submit" className="w-full py-3 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800">כניסה</button>
          </form>
        </div>
      </div>
    );
  }

  const clicksByTopic = topicClicks.reduce((acc, c) => {
    acc[c.topic_text] = (acc[c.topic_text] || 0) + 1;
    return acc;
  }, {});
  const sortedTopics = Object.entries(clicksByTopic).sort((a, b) => b[1] - a[1]);

  const pendingTools = communityTools.filter(t => t.status === 'pending');

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8" dir="rtl">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black text-gray-900">לוח בקרה</h1>
          <Link to={createPageUrl('Index')} className="text-sm text-gray-600 flex items-center gap-1 hover:text-orange-500 transition-colors">
            חזרה <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
            <Users className="w-8 h-8 text-orange-500" />
            <div>
              <p className="text-2xl font-black text-gray-900">{participants.length}</p>
              <p className="text-xs text-gray-600">נרשמים</p>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
            <MousePointerClick className="w-8 h-8 text-orange-500" />
            <div>
              <p className="text-2xl font-black text-gray-900">{topicClicks.length}</p>
              <p className="text-xs text-gray-600">לחיצות</p>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
            <Clock className="w-8 h-8 text-orange-500" />
            <div>
              <p className="text-2xl font-black text-gray-900">{pendingTools.length}</p>
              <p className="text-xs text-gray-600">ממתינים</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setActiveTab('participants')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'participants' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
            נרשמים
          </button>
          <button onClick={() => setActiveTab('clicks')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'clicks' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
            לחיצות
          </button>
          <button onClick={() => setActiveTab('tools')} className={`relative px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'tools' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
            כלים
            {pendingTools.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">
                {pendingTools.length}
              </span>
            )}
          </button>
          <button onClick={() => setActiveTab('bubbles')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'bubbles' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
            בועות
          </button>
          <button onClick={() => setActiveTab('content')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'content' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
            תוכן דף
          </button>
          <button onClick={() => setActiveTab('settings')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'settings' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
            הגדרות
          </button>
          <button onClick={() => setActiveTab('share')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'share' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
            שיתוף 📤
          </button>
        </div>

        {activeTab === 'participants' && (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-right font-bold text-gray-600">שם</th>
                    <th className="p-3 text-right font-bold text-gray-600">מייל</th>
                    <th className="p-3 text-right font-bold text-gray-600">בית ספר</th>
                    <th className="p-3 text-right font-bold text-gray-600">נושא</th>
                    <th className="p-3 text-right font-bold text-gray-600">רעיון</th>
                    <th className="p-3 text-right font-bold text-gray-600">סוג</th>
                    <th className="p-3 text-right font-bold text-gray-600">תאריך</th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map(p => (
                    <tr key={p.id} className="border-t border-gray-200">
                      <td className="p-3 text-gray-900">{p.full_name}</td>
                      <td className="p-3 text-gray-900 text-xs">{p.email}</td>
                      <td className="p-3 text-gray-900">{p.school}</td>
                      <td className="p-3 text-gray-900 text-xs">{p.topic_text}</td>
                      <td className="p-3 text-gray-900 text-xs max-w-[200px] truncate">{p.idea}</td>
                      <td className="p-3 text-gray-900 text-xs">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                          p.submission_type === 'interest' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                        }`}>
                          {p.submission_type === 'interest' ? 'מעוניין לפתח' : 'נושא חדש'}
                        </span>
                      </td>
                      <td className="p-3 text-gray-600 text-xs">{new Date(p.created_date).toLocaleDateString('he-IL')}</td>
                    </tr>
                  ))}
                  {participants.length === 0 && (
                    <tr><td colSpan={7} className="p-6 text-center text-gray-600">אין נרשמים עדיין</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'clicks' && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
            {sortedTopics.map(([topic, count]) => (
              <div key={topic} className="flex items-center gap-3">
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">{topic}</p>
                  <div className="mt-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full" style={{ width: `${Math.min(100, (count / Math.max(...Object.values(clicksByTopic))) * 100)}%` }} />
                  </div>
                </div>
                <span className="text-sm font-black text-orange-500 min-w-[30px] text-center">{count}</span>
              </div>
            ))}
            {sortedTopics.length === 0 && (
              <p className="text-center text-gray-600 py-6">אין לחיצות עדיין</p>
            )}
          </div>
        )}

        {activeTab === 'tools' && (
          <div className="space-y-4">
            {communityTools.length === 0 && (
              <p className="text-center text-gray-600 py-6">אין כלים קהילתיים עדיין</p>
            )}
            {communityTools.map(tool => (
              <div key={tool.id} className={`bg-white border rounded-xl p-5 space-y-3 ${tool.status === 'pending' ? 'border-orange-300' : tool.status === 'approved' ? 'border-green-300' : 'border-red-300'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-black text-gray-900">{tool.tool_name}</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        tool.status === 'pending' ? 'bg-orange-100 text-orange-600' :
                        tool.status === 'approved' ? 'bg-green-100 text-green-600' :
                        'bg-red-100 text-red-600'
                      }`}>
                        {tool.status === 'pending' ? 'ממתין' : tool.status === 'approved' ? 'מאושר' : 'נדחה'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">{tool.full_name} · {tool.school}</p>
                    <p className="text-xs text-gray-900 mt-2">{tool.goal}</p>
                    <a href={tool.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-orange-500 font-bold mt-1 hover:underline">
                      <ExternalLink className="w-3 h-3" /> {tool.link}
                    </a>
                    {tool.image_url && (
                      <img src={tool.image_url} alt={tool.tool_name} className="mt-2 w-full max-w-xs h-24 object-cover rounded-lg border border-gray-200" />
                    )}
                    <p className="text-[10px] text-gray-500 mt-2">{new Date(tool.created_date).toLocaleDateString('he-IL')}</p>
                  </div>
                  {tool.status === 'pending' && (
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => updateToolStatus(tool.id, 'approved')}
                        className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center hover:bg-green-200 transition-colors"
                        title="אישור"
                      >
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </button>
                      <button
                        onClick={() => updateToolStatus(tool.id, 'rejected')}
                        className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center hover:bg-red-200 transition-colors"
                        title="דחייה"
                      >
                        <XCircle className="w-5 h-5 text-red-600" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'bubbles' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-black text-gray-900">ניהול בועות</h2>
              <button
                onClick={() => { setEditingBubble(null); setShowBubbleForm(true); }}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-bold hover:bg-orange-600"
              >
                + הוספת בועה
              </button>
            </div>

            {showBubbleForm && (
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="text-sm font-black text-gray-900 mb-4">{editingBubble ? 'עריכת בועה' : 'בועה חדשה'}</h3>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const imageFile = formData.get('image');
                  let imageUrl = editingBubble?.image_url || '';
                  
                  if (imageFile && imageFile.size > 0) {
                    const result = await base44.integrations.Core.UploadFile({ file: imageFile });
                    imageUrl = result.file_url;
                  }

                  await saveBubble({
                    text: formData.get('text'),
                    link: formData.get('link') || null,
                    image_url: imageUrl || null,
                    color: selectedColor,
                    is_active: formData.get('is_active') === 'on',
                    order: parseInt(formData.get('order')) || 0,
                  });
                }} className="space-y-3" onReset={() => { setShowBubbleForm(false); setEditingBubble(null); setSelectedColor('orange'); }}>
                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1">טקסט הבועה</label>
                    <input name="text" required defaultValue={editingBubble?.text} className="w-full p-2 text-sm rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-gray-600 block mb-1">קישור (אופציונלי)</label>
                      <input name="link" type="url" defaultValue={editingBubble?.link} className="w-full p-2 text-sm rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-600 block mb-1">סדר</label>
                      <input name="order" type="number" defaultValue={editingBubble?.order || 0} className="w-full p-2 text-sm rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1">תמונה (אופציונלי)</label>
                    <input name="image" type="file" accept="image/*" className="w-full p-2 text-sm rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:outline-none" />
                    {editingBubble?.image_url && (
                      <img src={editingBubble.image_url} className="mt-2 h-20 object-cover rounded" />
                    )}
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1">צבע בועה</label>
                    <div className="grid grid-cols-6 gap-2">
                      {['orange', 'red', 'blue', 'green', 'purple', 'pink', 'teal', 'yellow', 'indigo', 'white', 'gray'].map(c => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setSelectedColor(c)}
                          className={`h-8 rounded border-2 ${selectedColor === c ? 'border-gray-900' : 'border-gray-300'} ${
                            c === 'orange' ? 'bg-orange-500' :
                            c === 'red' ? 'bg-red-500' :
                            c === 'blue' ? 'bg-blue-500' :
                            c === 'green' ? 'bg-green-500' :
                            c === 'purple' ? 'bg-purple-500' :
                            c === 'pink' ? 'bg-pink-500' :
                            c === 'teal' ? 'bg-teal-500' :
                            c === 'yellow' ? 'bg-yellow-500' :
                            c === 'indigo' ? 'bg-indigo-500' :
                            c === 'white' ? 'bg-white' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input name="is_active" type="checkbox" defaultChecked={editingBubble?.is_active !== false} className="w-4 h-4" />
                    <label className="text-xs font-bold text-gray-600">פעיל</label>
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-bold hover:bg-orange-600">שמירה</button>
                    <button type="reset" className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-300">ביטול</button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bubbles.map(bubble => (
                <div key={bubble.id} className={`bg-white border rounded-xl p-4 ${bubble.is_active ? 'border-gray-200' : 'border-gray-300 opacity-50'}`}>
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-900">{bubble.text}</p>
                      {bubble.link && (
                        <a href={bubble.link} target="_blank" rel="noopener noreferrer" className="text-xs text-orange-500 hover:underline mt-1 block">
                          {bubble.link.substring(0, 40)}...
                        </a>
                      )}
                      {bubble.image_url && (
                        <img src={bubble.image_url} className="mt-2 h-16 object-cover rounded" />
                      )}
                      <p className="text-xs text-gray-500 mt-2">סדר: {bubble.order} | {bubble.is_active ? 'פעיל' : 'לא פעיל'}</p>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => { setEditingBubble(bubble); setSelectedColor(bubble.color || 'orange'); setShowBubbleForm(true); }} className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button onClick={() => toggleBubbleActive(bubble.id, bubble.is_active)} className="p-2 bg-yellow-100 text-yellow-600 rounded hover:bg-yellow-200">
                        {bubble.is_active ? '👁️' : '🚫'}
                      </button>
                      <button onClick={() => deleteBubble(bubble.id)} className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-black text-gray-900">ניהול תוכן דף ראשי</h2>
              <button
                onClick={() => { setEditingContent(null); setShowContentForm(true); }}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-bold hover:bg-orange-600"
              >
                + הוספת פריט
              </button>
            </div>

            {showContentForm && (
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="text-sm font-black text-gray-900 mb-4">{editingContent ? 'עריכת פריט' : 'פריט חדש'}</h3>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const data = {
                    content_type: formData.get('content_type'),
                    title: formData.get('title'),
                    subtitle: formData.get('subtitle') || null,
                    description: formData.get('description'),
                    link: formData.get('link') || null,
                    icon: formData.get('icon') || null,
                    category: formData.get('category') || null,
                    order: parseInt(formData.get('order')) || 0,
                    is_active: formData.get('is_active') === 'on',
                  };
                  
                  if (editingContent) {
                    await base44.entities.SiteContent.update(editingContent.id, data);
                  } else {
                    await base44.entities.SiteContent.create(data);
                  }
                  setShowContentForm(false);
                  setEditingContent(null);
                  fetchData();
                }} className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1">סוג תוכן</label>
                    <select name="content_type" required defaultValue={editingContent?.content_type} className="w-full p-2 text-sm rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:outline-none">
                      <option value="resource">מה שכבר נעשה 🌍</option>
                      <option value="topic">עוד נושאים</option>
                      <option value="experiment_idea">רעיון יצירתי</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-gray-600 block mb-1">כותרת</label>
                      <input name="title" required defaultValue={editingContent?.title} className="w-full p-2 text-sm rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-600 block mb-1">תת-כותרת (למשאבים)</label>
                      <input name="subtitle" defaultValue={editingContent?.subtitle} className="w-full p-2 text-sm rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1">תיאור</label>
                    <textarea name="description" required defaultValue={editingContent?.description} rows={2} className="w-full p-2 text-sm rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-gray-600 block mb-1">קישור (למשאבים)</label>
                      <input name="link" type="url" defaultValue={editingContent?.link} className="w-full p-2 text-sm rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-600 block mb-1">קטגוריה (לנושאים)</label>
                      <input name="category" defaultValue={editingContent?.category} className="w-full p-2 text-sm rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:outline-none" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-gray-600 block mb-1">אייקון (לרעיונות - Brain/Swords/Gauge/Languages)</label>
                      <input name="icon" defaultValue={editingContent?.icon} className="w-full p-2 text-sm rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-600 block mb-1">סדר</label>
                      <input name="order" type="number" defaultValue={editingContent?.order || 0} className="w-full p-2 text-sm rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:outline-none" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input name="is_active" type="checkbox" defaultChecked={editingContent?.is_active !== false} className="w-4 h-4" />
                    <label className="text-xs font-bold text-gray-600">פעיל</label>
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-bold hover:bg-orange-600">שמירה</button>
                    <button type="button" onClick={() => { setShowContentForm(false); setEditingContent(null); }} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-300">ביטול</button>
                  </div>
                </form>
              </div>
            )}

            <div className="space-y-4">
              {['resource', 'topic', 'experiment_idea'].map(type => (
                <div key={type} className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="text-base font-black text-gray-900 mb-3">
                    {type === 'resource' ? '🌍 מה שכבר נעשה' : type === 'topic' ? '💡 עוד נושאים' : '🎨 רעיונות יצירתיים'}
                  </h3>
                  <div className="space-y-2">
                    {siteContent.filter(c => c.content_type === type).map(content => (
                      <div key={content.id} className={`flex justify-between items-start gap-3 p-3 rounded-lg ${content.is_active ? 'bg-gray-50' : 'bg-gray-100 opacity-50'}`}>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-gray-900">{content.title}</p>
                          {content.subtitle && <p className="text-xs text-orange-600">{content.subtitle}</p>}
                          <p className="text-xs text-gray-600 mt-1">{content.description}</p>
                          {content.link && <a href={content.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline mt-1 block">{content.link.substring(0, 50)}...</a>}
                          <p className="text-xs text-gray-500 mt-1">סדר: {content.order} {content.category && `| קטגוריה: ${content.category}`}</p>
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => { setEditingContent(content); setShowContentForm(true); }} className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          </button>
                          <button onClick={async () => {
                            await base44.entities.SiteContent.update(content.id, { is_active: !content.is_active });
                            fetchData();
                          }} className="p-2 bg-yellow-100 text-yellow-600 rounded hover:bg-yellow-200">
                            {content.is_active ? '👁️' : '🚫'}
                          </button>
                          <button onClick={async () => {
                            if (confirm('האם למחוק פריט זה?')) {
                              await base44.entities.SiteContent.delete(content.id);
                              fetchData();
                            }
                          }} className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'share' && (
          <div className="space-y-6">
            {/* QR Code for main page */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-center gap-4 text-center">
              <h2 className="text-base font-black text-gray-900 self-end">QR לדף הראשי</h2>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(window.location.origin)}`}
                alt="QR Code"
                className="w-48 h-48 border border-gray-200 rounded-xl"
              />
              <p className="text-xs text-gray-500">{window.location.origin}</p>
            </div>

            {/* Event flyer + registration */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6992e5f1be2efb5ea8e1a203/cc983264d_WhatsAppImage2026-02-27at114014.jpeg"
                alt="אירוע Unboxing"
                className="w-full object-cover"
              />
              <div className="p-5 flex flex-col items-center gap-3 text-center" dir="rtl">
                <p className="text-sm font-bold text-gray-900">מפגש בזום · 3/3/2026 - 20:30</p>
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLSehx3cLyR9RZTmx1ixyIIQXbJFSVvSYgtor3oOchRRB9XMOYQ/viewform"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-orange-600 transition-all"
                >
                  להרשמה ↗
                </a>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent('https://docs.google.com/forms/d/e/1FAIpQLSehx3cLyR9RZTmx1ixyIIQXbJFSVvSYgtor3oOchRRB9XMOYQ/viewform')}`}
                  alt="QR הרשמה"
                  className="w-36 h-36 border border-gray-200 rounded-xl mt-1"
                />
                <p className="text-[10px] text-gray-400">סרקו QR להרשמה ישירה</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-black text-gray-900 mb-4">הגדרות תצוגה</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const selectedColors = Array.from(formData.getAll('bubble_colors'));
              saveSettings({
                mobile_slot_count: parseInt(formData.get('mobile_slot_count')),
                desktop_slot_count: parseInt(formData.get('desktop_slot_count')),
                cycle_duration: parseInt(formData.get('cycle_duration')),
                bubble_colors: selectedColors.length > 0 ? selectedColors : ['orange', 'red', 'blue', 'green', 'purple'],
                regular_bubble_color: formData.get('regular_bubble_color'),
              });
            }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-gray-700 block mb-2">מספר בועות במובייל</label>
                  <input name="mobile_slot_count" type="number" min="1" max="20" defaultValue={settings?.mobile_slot_count || 10} className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:outline-none" />
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 block mb-2">מספר בועות במחשב</label>
                  <input name="desktop_slot_count" type="number" min="1" max="30" defaultValue={settings?.desktop_slot_count || 13} className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:outline-none" />
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 block mb-2">זמן החלפה (ms)</label>
                  <input name="cycle_duration" type="number" min="1000" max="10000" step="100" defaultValue={settings?.cycle_duration || 4000} className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-bold text-gray-700 block mb-2">צבעי בועות עם קישור (בחרו מספר צבעים)</label>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                    {['orange', 'red', 'blue', 'green', 'purple', 'pink', 'teal', 'yellow', 'indigo'].map(color => {
                      const isChecked = (settings?.bubble_colors || ['orange', 'red', 'blue', 'green', 'purple']).includes(color);
                      return (
                        <label key={color} className="flex items-center gap-2 p-2 border-2 rounded-lg cursor-pointer hover:bg-gray-50">
                          <input 
                            type="checkbox" 
                            name="bubble_colors" 
                            value={color}
                            defaultChecked={isChecked}
                            className="w-4 h-4"
                          />
                          <span className="text-xs font-bold">{
                            color === 'orange' ? 'כתום' :
                            color === 'red' ? 'אדום' :
                            color === 'blue' ? 'כחול' :
                            color === 'green' ? 'ירוק' :
                            color === 'purple' ? 'סגול' :
                            color === 'pink' ? 'ורוד' :
                            color === 'teal' ? 'טורקיז' :
                            color === 'yellow' ? 'צהוב' :
                            'אינדיגו'
                          }</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 block mb-2">צבע בועות רגילות</label>
                  <select name="regular_bubble_color" defaultValue={settings?.regular_bubble_color || 'white'} className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:outline-none">
                    <option value="white">לבן</option>
                    <option value="gray">אפור</option>
                    <option value="blue">כחול</option>
                    <option value="green">ירוק</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="px-6 py-3 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600">
                שמירת הגדרות
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}