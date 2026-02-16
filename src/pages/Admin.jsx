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
  const [activeTab, setActiveTab] = useState('participants');

  const fetchData = async () => {
    const p = await base44.entities.Participant.list('-created_date', 500);
    if (p) setParticipants(p);
    const c = await base44.entities.TopicClick.list('-created_date', 500);
    if (c) setTopicClicks(c);
    const t = await base44.entities.CommunityTool.list('-created_date', 100);
    if (t) setCommunityTools(t);
  };

  useEffect(() => {
    if (!authenticated) return;
    fetchData();
  }, [authenticated]);

  const updateToolStatus = async (id, status) => {
    await base44.entities.CommunityTool.update(id, { status });
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

        <div className="flex gap-2">
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
        </div>

        {activeTab === 'participants' && (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-right font-bold text-gray-600">שם</th>
                    <th className="p-3 text-right font-bold text-gray-600">בית ספר</th>
                    <th className="p-3 text-right font-bold text-gray-600">נושא</th>
                    <th className="p-3 text-right font-bold text-gray-600">רעיון</th>
                    <th className="p-3 text-right font-bold text-gray-600">תאריך</th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map(p => (
                    <tr key={p.id} className="border-t border-gray-200">
                      <td className="p-3 text-gray-900">{p.full_name}</td>
                      <td className="p-3 text-gray-900">{p.school}</td>
                      <td className="p-3 text-gray-900 text-xs">{p.topic_text}</td>
                      <td className="p-3 text-gray-900 text-xs max-w-[200px] truncate">{p.idea}</td>
                      <td className="p-3 text-gray-600 text-xs">{new Date(p.created_date).toLocaleDateString('he-IL')}</td>
                    </tr>
                  ))}
                  {participants.length === 0 && (
                    <tr><td colSpan={5} className="p-6 text-center text-gray-600">אין נרשמים עדיין</td></tr>
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
      </div>
    </div>
  );
}