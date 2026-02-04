
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import DayView from './components/DayView';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import { TRAINING_DAYS as INITIAL_DAYS } from './constants';
import { UserProgress, TrainingDay, CompletionRecord } from './types';
import { db } from './db';
import { LogOut, Cloud, Menu, X, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [days, setDays] = useState<TrainingDay[]>(INITIAL_DAYS);
  const [stats, setStats] = useState<CompletionRecord[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('rbt_training_session');
    return saved ? JSON.parse(saved) : { completedDays: [], currentDay: 1, userName: null, isAdmin: false };
  });

  // 1. Загрузка контента из облака
  useEffect(() => {
    const unsubscribe = db.subscribeToContent((cloudDays) => {
      if (cloudDays && cloudDays.length > 0) {
        setDays(cloudDays);
      }
      // Гарантированно снимаем загрузку, даже если данных нет
      setIsDataLoaded(true);
    });
    return () => unsubscribe();
  }, []);

  // 2. Актуализация прогресса при автологине
  useEffect(() => {
    const refreshProgress = async () => {
      if (progress.userName) {
        const profile = await db.fetchUserProfile(progress.userName);
        if (profile) {
          setProgress(prev => ({
            ...prev,
            completedDays: profile.completedDays || [],
            isAdmin: profile.isAdmin || false
          }));
        }
      }
    };
    refreshProgress();
  }, []); // Только один раз при старте

  // 3. Синхронизация прогресса с облаком при изменениях
  useEffect(() => {
    if (progress.userName) {
      localStorage.setItem('rbt_training_session', JSON.stringify(progress));
      db.syncUser(progress);
    }
  }, [progress]);

  // 4. Подписка на статистику
  useEffect(() => {
    const unsubscribe = db.subscribeToStats((liveData) => setStats(liveData));
    return () => unsubscribe();
  }, []);

  const handleCompleteDay = async (dayId: number, score?: number, total?: number) => {
    const day = days.find(d => d.id === dayId);
    if (!progress.completedDays.includes(dayId)) {
      setProgress(prev => ({
        ...prev,
        completedDays: [...prev.completedDays, dayId]
      }));
    }

    if (progress.userName) {
      const record: CompletionRecord = {
        userName: progress.userName,
        dayId,
        dayTitle: day?.title || 'Обучение',
        timestamp: Date.now(),
        score,
        totalQuestions: total
      };
      await db.saveCompletion(record);
    }
  };

  const handleLogin = (name: string, isAdmin: boolean, completedDays?: number[]) => {
    const newProgress = { 
      userName: name, 
      isAdmin,
      completedDays: completedDays || [],
      currentDay: 1
    };
    setProgress(newProgress);
    localStorage.setItem('rbt_training_session', JSON.stringify(newProgress));
  };

  const handleLogout = () => {
    if (window.confirm('Выйти из системы?')) {
      localStorage.removeItem('rbt_training_session');
      setProgress({ completedDays: [], currentDay: 1, userName: null, isAdmin: false });
      window.location.hash = '#/';
    }
  };

  const handleUpdateDays = async (updatedDays: TrainingDay[]) => {
    setDays(updatedDays);
    await db.saveContent(updatedDays);
  };

  const handleUpdateSingleDay = async (updatedDay: TrainingDay) => {
    const newDays = days.map(d => d.id === updatedDay.id ? updatedDay : d);
    setDays(newDays);
    await db.saveContent(newDays);
  };

  if (!progress.userName) return <Login onLogin={handleLogin} />;
  
  if (!isDataLoaded) return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-950 text-white p-6">
      <Loader2 className="animate-spin mb-6 text-red-600" size={64} />
      <div className="text-center">
        <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-2">RBT CLOUD</h2>
        <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em] animate-pulse">Загрузка программы обучения...</p>
      </div>
    </div>
  );

  return (
    <HashRouter>
      <div className="flex h-screen bg-slate-50 overflow-hidden relative">
        {/* Мобильная кнопка меню */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden fixed bottom-6 right-6 z-[100] bg-red-600 text-white p-4 rounded-full shadow-2xl active:scale-90 transition-transform flex items-center justify-center"
        >
          {isSidebarOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[80] lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <div className={`
          fixed lg:relative z-[90] h-full transition-all duration-500 ease-in-out
          ${isSidebarOpen ? 'translate-x-0 w-full md:w-80' : '-translate-x-full lg:translate-x-0 w-80'}
        `}>
          <Sidebar 
            days={days} 
            completedDays={progress.completedDays} 
            activeDayId={progress.currentDay} 
            isAdmin={progress.isAdmin} 
            onCloseMobile={() => setIsSidebarOpen(false)}
          />
        </div>

        <main className="flex-1 overflow-y-auto relative bg-white lg:bg-slate-50">
          <div className="max-w-[1400px] mx-auto p-4 md:p-8 lg:p-12 min-h-full flex flex-col">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 pb-8 border-b-2 border-slate-200/60">
              <div className="flex flex-col">
                <h1 className="text-4xl font-black text-slate-950 tracking-tighter uppercase italic leading-none mb-2">RBT Academy</h1>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    <p className="text-[10px] font-black uppercase tracking-widest">
                      {progress.isAdmin ? 'Global Admin' : progress.userName}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                    <Cloud size={10} className="animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Live Sync</span>
                  </div>
                </div>
              </div>
              <button onClick={handleLogout} className="self-start md:self-center group bg-white border-2 border-slate-200 px-6 py-3 rounded-2xl text-slate-600 hover:text-red-600 hover:border-red-600 transition-all font-black text-[11px] uppercase tracking-[0.1em] shadow-sm flex items-center gap-3 active:scale-95">
                Выход из системы <LogOut size={16} />
              </button>
            </header>

            <div className="flex-1">
              <Routes>
                <Route path="/" element={<Navigate to={progress.isAdmin ? "/admin/dashboard" : "/day/1"} />} />
                {progress.isAdmin && <Route path="/admin/dashboard" element={<AdminDashboard days={days} onUpdateDays={handleUpdateDays} stats={stats} />} />}
                {days.map(day => (
                  <Route key={day.id} path={`/day/${day.id}`} element={<DayView day={day} isCompleted={progress.completedDays.includes(day.id)} onComplete={(s, t) => handleCompleteDay(day.id, s, t)} isAdmin={progress.isAdmin} onUpdate={handleUpdateSingleDay} />} />
                ))}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </div>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
