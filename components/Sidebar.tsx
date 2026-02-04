
import React from 'react';
import { NavLink } from 'react-router-dom';
import { TrainingDay } from '../types';
import { CheckCircle2, Circle, LayoutDashboard, Settings, ChevronRight, GraduationCap } from 'lucide-react';

interface SidebarProps {
  days: TrainingDay[];
  completedDays: number[];
  activeDayId: number;
  isAdmin?: boolean;
  onCloseMobile?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ days, completedDays, isAdmin, onCloseMobile }) => {
  const completionRate = Math.round((completedDays.length / days.length) * 100) || 0;

  return (
    <div className="w-full lg:w-80 bg-slate-950 text-slate-300 flex flex-col h-full border-r border-slate-800 shadow-2xl relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full blur-[60px] translate-x-1/2 -translate-y-1/2" />
      
      <div className="p-8 flex items-center gap-4 border-b border-white/5 bg-slate-900/30 relative z-10">
        <div className="bg-red-600 p-2.5 rounded-2xl shadow-2xl shadow-red-600/40 rotate-6 transform hover:rotate-0 transition-transform duration-500">
          <GraduationCap className="text-white" size={28} />
        </div>
        <div>
          <span className="block font-black text-white text-3xl tracking-tighter uppercase italic leading-none">RBT</span>
          <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] block mt-1">Academy 2.0</span>
        </div>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-8 space-y-1 custom-scrollbar relative z-10 px-4">
        {isAdmin && (
          <div className="mb-10">
            <div className="px-4 py-2 text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-3">Admin Console</div>
            <NavLink
              to="/admin/dashboard"
              onClick={onCloseMobile}
              className={({ isActive }) => `
                flex items-center gap-4 px-5 py-5 rounded-2xl transition-all duration-500 group relative overflow-hidden
                ${isActive ? 'bg-red-600 text-white shadow-2xl shadow-red-600/20 scale-[1.02]' : 'text-slate-400 hover:bg-white/5 border border-transparent hover:border-white/5'}
              `}
            >
              <Settings size={20} className="relative z-10" />
              <span className="text-[11px] font-black uppercase tracking-widest relative z-10">Панель управления</span>
              {/* Active Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </NavLink>
          </div>
        )}

        <div className="px-4 py-2 text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-3">Программа курса</div>
        <div className="space-y-2">
          {days.map((day) => {
            const isCompleted = completedDays.includes(day.id);
            return (
              <NavLink
                key={day.id}
                to={`/day/${day.id}`}
                onClick={onCloseMobile}
                className={({ isActive }) => `
                  flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group relative
                  ${isActive ? 'bg-white text-slate-950 shadow-2xl scale-[1.03]' : 'text-slate-400 hover:bg-white/5'}
                `}
              >
                <div className="flex-shrink-0 relative z-10">
                  {isCompleted ? (
                    <div className="bg-emerald-500/10 p-1 rounded-lg">
                      <CheckCircle2 size={18} className="text-emerald-500" />
                    </div>
                  ) : (
                    <Circle size={18} className="text-slate-800 group-hover:text-slate-600 transition-colors" />
                  )}
                </div>
                <div className="flex-1 min-w-0 z-10">
                  <div className={`text-[9px] uppercase font-black tracking-widest mb-1 transition-colors ${isCompleted ? 'text-emerald-500' : 'text-slate-500'}`}>
                    Блок {day.id}
                  </div>
                  <div className="text-[13px] font-bold truncate pr-2 group-hover:whitespace-normal group-hover:overflow-visible transition-all duration-300">
                    {day.title}
                  </div>
                </div>
                <ChevronRight size={14} className={`opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0 ${isCompleted ? 'text-emerald-500' : ''}`} />
                
                {/* Status Bar */}
                {isCompleted && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-emerald-500 rounded-r-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      <div className="p-8 border-t border-white/5 bg-slate-900/40 relative z-10">
        <div className="bg-white/5 rounded-[2rem] p-6 border border-white/10 backdrop-blur-xl">
          <div className="flex justify-between items-end mb-4">
             <div>
               <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] mb-1">Обучение</p>
               <span className="text-xl font-black text-white italic tracking-tighter">{completionRate}%</span>
             </div>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{completedDays.length} / {days.length}</span>
          </div>
          <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden p-[1px]">
            <div 
              className="h-full bg-gradient-to-r from-red-600 to-red-500 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(220,38,38,0.4)]" 
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
