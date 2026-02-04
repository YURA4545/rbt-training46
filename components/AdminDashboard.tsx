
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TrainingDay, CompletionRecord } from '../types';
import { Settings, BarChart3, Lightbulb, Search, CheckCircle, Clock, ExternalLink, User as UserIcon, Filter, HelpCircle } from 'lucide-react';
import AdminIdeas from './AdminIdeas';

interface AdminDashboardProps {
  days: TrainingDay[];
  onUpdateDays: (days: TrainingDay[]) => void;
  stats: CompletionRecord[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ days, stats }) => {
  const [activeTab, setActiveTab] = useState<'content' | 'stats' | 'ideas'>('content');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStats = stats.filter(s => 
    s.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.dayTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-16">
        <div>
          <h2 className="text-5xl md:text-6xl font-black text-slate-950 uppercase italic tracking-tighter leading-tight">System Control</h2>
          <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            Мониторинг обучения в реальном времени
          </p>
        </div>
        <div className="flex flex-wrap bg-slate-200/50 backdrop-blur-xl p-2 rounded-[2.5rem] border border-slate-200 shadow-inner">
          {[
            { id: 'content', label: 'Программа', icon: Settings },
            { id: 'stats', label: 'Аналитика', icon: BarChart3 },
            { id: 'ideas', label: 'Банк Идей', icon: Lightbulb }
          ].map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id as any)} 
              className={`px-6 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-all ${activeTab === tab.id ? 'bg-white text-red-600 shadow-2xl scale-105' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'stats' && (
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-red-600 transition-colors" size={24} />
              <input 
                className="w-full bg-white border-2 border-slate-100 rounded-[2rem] py-6 pl-16 pr-8 shadow-xl shadow-slate-200/30 focus:border-red-600 outline-none font-bold text-slate-800 transition-all placeholder:text-slate-300"
                placeholder="Поиск сотрудника или темы..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="bg-white border-2 border-slate-100 p-6 rounded-[2rem] text-slate-400 hover:text-red-600 transition-all shadow-xl shadow-slate-200/30 active:scale-95">
              <Filter size={24} />
            </button>
          </div>

          <div className="bg-white border-2 border-slate-100 rounded-[3.5rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.03)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[900px]">
                <thead>
                  <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                    <th className="px-12 py-8">Сотрудник</th>
                    <th className="px-12 py-8">Тема обучения</th>
                    <th className="px-12 py-8">Результат Теста</th>
                    <th className="px-12 py-8">Дата завершения</th>
                    <th className="px-12 py-8 text-right">Статус</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStats.slice().reverse().map((record, i) => {
                    const isGreat = record.score !== undefined && record.totalQuestions !== undefined && (record.score / record.totalQuestions) >= 0.8;
                    return (
                      <tr key={i} className="hover:bg-slate-50/40 transition-colors group">
                        <td className="px-12 py-8">
                          <div className="flex items-center gap-5">
                            <div className="w-12 h-12 bg-slate-950 text-white rounded-2xl flex items-center justify-center font-black text-sm shadow-xl shadow-slate-900/10 group-hover:scale-110 transition-transform">{record.userName[0]}</div>
                            <span className="font-bold text-slate-950 text-lg">{record.userName}</span>
                          </div>
                        </td>
                        <td className="px-12 py-8">
                          <div className="text-[11px] font-black text-slate-500 uppercase italic tracking-widest bg-slate-100 px-3 py-1.5 rounded-lg inline-block border border-slate-200">{record.dayTitle}</div>
                        </td>
                        <td className="px-12 py-8">
                          {record.score !== undefined ? (
                            <div className="flex items-center gap-4">
                              <div className="h-2 w-24 bg-slate-100 rounded-full overflow-hidden p-[1px] border border-slate-200">
                                <div className={`h-full rounded-full ${isGreat ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]' : 'bg-red-500'}`} style={{width: `${(record.score / record.totalQuestions!) * 100}%`}} />
                              </div>
                              <span className={`text-sm font-black ${isGreat ? 'text-emerald-600' : 'text-red-600'}`}>{record.score} / {record.totalQuestions}</span>
                            </div>
                          ) : <span className="text-[10px] text-slate-300 font-black uppercase tracking-widest italic">Нет данных</span>}
                        </td>
                        <td className="px-12 py-8">
                          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 font-bold">
                            <Clock size={12} />
                            {new Date(record.timestamp).toLocaleString('ru-RU')}
                          </div>
                        </td>
                        <td className="px-12 py-8 text-right">
                          <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border inline-flex items-center gap-2 ${isGreat ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                            <CheckCircle size={12} /> {isGreat ? 'Блестяще' : 'Завершено'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {filteredStats.length === 0 && (
              <div className="p-24 text-center">
                <BarChart3 size={64} className="mx-auto text-slate-200 mb-6" />
                <p className="text-slate-400 font-black uppercase text-xs tracking-widest">Данные пока отсутствуют</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'content' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          <div className="col-span-full bg-slate-950 rounded-[3.5rem] p-12 text-white mb-6 shadow-2xl relative overflow-hidden group border border-white/5">
             <div className="relative z-10 max-w-2xl">
                <h3 className="text-4xl font-black uppercase italic tracking-tighter mb-4">Content CMS</h3>
                <p className="text-slate-400 font-bold text-lg leading-relaxed mb-8">Управляйте образовательной программой RBT. Все изменения мгновенно синхронизируются у всех сотрудников через Firebase.</p>
                <div className="flex gap-4">
                   <div className="px-6 py-3 bg-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-red-600/20">Active Management</div>
                   <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest">Auto-Saving Enabled</div>
                </div>
             </div>
             <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
                <Settings size={300} className="animate-spin-slow" />
             </div>
          </div>
          {days.map(day => (
            <div key={day.id} className="bg-white p-10 rounded-[3.5rem] border-2 border-slate-50 flex flex-col justify-between hover:border-red-600 hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)] transition-all group relative overflow-hidden active:scale-95">
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="w-16 h-16 bg-slate-950 text-white rounded-3xl flex items-center justify-center text-2xl font-black italic shadow-2xl group-hover:bg-red-600 transition-colors">{day.id}</div>
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest group-hover:text-red-600/50 transition-colors">Training Module</span>
                </div>
                <h4 className="font-black text-slate-950 uppercase italic text-2xl tracking-tighter leading-tight mb-4 break-words">{day.title}</h4>
                <div className="flex flex-wrap gap-3 mb-10">
                  <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100"><HelpCircle size={12} className="text-red-600" /> {day.questions.length} вопросов</span>
                  <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100"><Clock size={12} /> 15-20 мин</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between border-t border-slate-50 pt-8 mt-auto">
                 <div className="flex -space-x-3">
                    {[1,2,3,4].map(i => <div key={i} className="w-9 h-9 rounded-2xl border-2 border-white bg-slate-100 flex items-center justify-center shadow-sm"><UserIcon size={14} className="text-slate-300" /></div>)}
                 </div>
                 <Link 
                   to={`/day/${day.id}?edit=true`} 
                   className="px-6 py-3 bg-slate-950 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-red-600 transition-all flex items-center gap-3 shadow-xl active:scale-90"
                 >
                    Редактировать <ExternalLink size={14}/>
                 </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'ideas' && <AdminIdeas />}
    </div>
  );
};

export default AdminDashboard;
