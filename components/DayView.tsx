
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { TrainingDay, QuizQuestion } from '../types';
import { CheckCircle, ArrowRight, MonitorPlay, Edit3, Save, X, HelpCircle, Trophy, GraduationCap, Play, Info } from 'lucide-react';

interface DayViewProps {
  day: TrainingDay;
  isCompleted: boolean;
  onComplete: (score?: number, total?: number) => void;
  isAdmin: boolean;
  onUpdate: (day: TrainingDay) => void;
}

const DayView: React.FC<DayViewProps> = ({ day, isCompleted, onComplete, isAdmin, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [editData, setEditData] = useState<TrainingDay>(day);
  const [iframeKey, setIframeKey] = useState(0);
  const location = useLocation();

  // Автоматический вход в режим редактирования при наличии параметра в URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('edit') === 'true' && isAdmin) {
      setIsEditing(true);
    }
  }, [location, isAdmin]);

  useEffect(() => { setEditData(day); }, [day]);

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    let cleanUrl = url.trim();

    // Rutube
    if (cleanUrl.includes('rutube.ru')) {
      const videoId = cleanUrl.match(/video\/([a-zA-Z0-9]+)/)?.[1] || 
                      cleanUrl.match(/embed\/([a-zA-Z0-9]+)/)?.[1] ||
                      cleanUrl.split('/').filter(Boolean).pop();
      return `https://rutube.ru/play/embed/${videoId}/`;
    }

    // VK
    if (cleanUrl.includes('vk.com/video') || cleanUrl.includes('vkvideo.ru/video')) {
      const match = cleanUrl.match(/video(-?\d+)_(\d+)/);
      if (match) {
        return `https://vk.com/video_ext.php?oid=${match[1]}&id=${match[2]}&hd=2`;
      }
    }

    return cleanUrl;
  };

  const handleAnswer = (optionIndex: number) => {
    if (optionIndex === day.questions[currentQuestionIndex].correctAnswer) {
      setScore(prev => prev + 1);
    }
    
    if (currentQuestionIndex + 1 < day.questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const finishTraining = () => {
    onComplete(score, day.questions.length);
    setShowQuiz(false);
    setQuizFinished(false);
    setCurrentQuestionIndex(0);
    setScore(0);
  };

  const embedUrl = getEmbedUrl(day.videoUrl);

  if (isEditing) {
    return (
      <div className="max-w-4xl mx-auto pb-12 animate-in fade-in zoom-in-95">
        <div className="bg-white border-4 border-slate-900 rounded-[3rem] p-6 md:p-12 shadow-[0_40px_100px_rgba(0,0,0,0.1)]">
          <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-100">
            <div>
              <h2 className="text-3xl font-black uppercase italic text-slate-950 tracking-tighter">Редактор Модуля {day.id}</h2>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600 mt-1">Изменения будут видны всем сотрудникам</p>
            </div>
            <button onClick={() => setIsEditing(false)} className="p-4 bg-slate-100 rounded-2xl hover:bg-red-50 hover:text-red-600 transition-all active:scale-90"><X /></button>
          </div>
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-full md:col-span-1">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Заголовок темы</label>
                <input className="w-full p-5 bg-slate-50 border-2 border-slate-200 rounded-[1.5rem] font-bold focus:border-red-600 focus:bg-white outline-none transition-all shadow-inner" value={editData.title} onChange={e => setEditData({...editData, title: e.target.value})} placeholder="Название"/>
              </div>
              <div className="col-span-full md:col-span-1">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Ссылка на видео (VK или Rutube)</label>
                <input className="w-full p-5 bg-slate-50 border-2 border-slate-200 rounded-[1.5rem] text-blue-600 font-mono text-sm focus:border-red-600 focus:bg-white outline-none transition-all shadow-inner" value={editData.videoUrl} onChange={e => setEditData({...editData, videoUrl: e.target.value})} placeholder="https://..."/>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Описание обучения</label>
              <textarea className="w-full p-5 bg-slate-50 border-2 border-slate-200 rounded-[1.5rem] font-medium h-40 focus:border-red-600 focus:bg-white outline-none transition-all shadow-inner resize-none" value={editData.description} onChange={e => setEditData({...editData, description: e.target.value})} placeholder="О чем этот урок?"/>
            </div>
            
            <div className="p-8 bg-slate-950 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
              <h4 className="font-black uppercase text-xs tracking-widest mb-8 flex items-center gap-3 text-red-500 relative z-10"><HelpCircle size={18}/> Аттестационный тест ({editData.questions.length})</h4>
              <div className="space-y-6 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar relative z-10">
                {editData.questions.map((q, qIdx) => (
                  <div key={qIdx} className="p-8 border border-white/10 rounded-[2rem] bg-white/5 group relative hover:border-white/20 transition-all">
                    <button onClick={() => {
                      const newQ = editData.questions.filter((_, i) => i !== qIdx);
                      setEditData({...editData, questions: newQ});
                    }} className="absolute top-6 right-6 text-slate-500 hover:text-red-500 transition-colors bg-white/5 p-2 rounded-xl"><X size={18}/></button>
                    
                    <div className="mb-6">
                       <label className="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-2">Вопрос {qIdx + 1}</label>
                       <input className="bg-transparent border-b-2 border-white/10 w-full py-3 outline-none font-bold text-xl focus:border-red-600 transition-all" value={q.question} onChange={e => {
                         const newQ = [...editData.questions];
                         newQ[qIdx].question = e.target.value;
                         setEditData({...editData, questions: newQ});
                       }} placeholder="Текст вопроса"/>
                    </div>
                    
                    <div className="space-y-3">
                      <label className="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-2">Варианты ответов</label>
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${q.correctAnswer === oIdx ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-900/50 border-white/5'}`}>
                          <input type="radio" name={`correct-${qIdx}`} checked={q.correctAnswer === oIdx} onChange={() => {
                            const newQ = [...editData.questions];
                            newQ[qIdx].correctAnswer = oIdx;
                            setEditData({...editData, questions: newQ});
                          }} className="w-5 h-5 accent-emerald-500 cursor-pointer"/>
                          <input className="bg-transparent text-sm w-full outline-none text-slate-300 font-bold" value={opt} onChange={e => {
                            const newQ = [...editData.questions];
                            newQ[qIdx].options[oIdx] = e.target.value;
                            setEditData({...editData, questions: newQ});
                          }} placeholder={`Вариант ${oIdx + 1}`}/>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => setEditData({...editData, questions: [...editData.questions, {id: Date.now().toString(), question: 'Новый вопрос', options: ['Да', 'Нет', 'Возможно'], correctAnswer: 0}]})} className="w-full mt-8 py-6 border-2 border-dashed border-white/10 rounded-[2rem] text-[11px] uppercase font-black hover:border-red-600 hover:text-red-500 transition-all text-slate-600 bg-white/5">
                + Добавить вопрос к аттестации
              </button>
            </div>

            <button onClick={() => {onUpdate(editData); setIsEditing(false);}} className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-8 rounded-[2.5rem] shadow-2xl shadow-red-600/40 flex items-center justify-center gap-4 transition-all active:scale-95 uppercase tracking-widest text-lg">
              <Save size={24} /> Сохранить и Опубликовать
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-4">
          <div className="bg-slate-950 text-white p-4 rounded-[1.5rem] shadow-2xl flex flex-col items-center justify-center min-w-[100px] border border-white/10">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1">Модуль</span>
            <span className="text-3xl font-black italic tracking-tighter leading-none">{day.id}</span>
          </div>
          {isCompleted && (
            <div className="bg-emerald-500 text-white px-6 py-3 rounded-full flex items-center gap-3 uppercase font-black text-[10px] tracking-[0.2em] shadow-xl shadow-emerald-500/20 border border-emerald-400/30">
              <CheckCircle size={18} className="animate-pulse" /> 
              Пройдено
            </div>
          )}
        </div>
        {isAdmin && (
          <button 
            onClick={() => setIsEditing(true)} 
            className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.1em] text-slate-600 hover:text-red-600 transition-all bg-white px-6 py-4 rounded-[1.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 active:scale-95"
          >
            <Edit3 size={18} className="text-red-600" /> Редактировать контент
          </button>
        )}
      </div>

      <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-950 mb-12 uppercase italic tracking-tighter leading-[0.85] drop-shadow-sm">
        {day.title}
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Content Area */}
        <div className="lg:col-span-12 space-y-12">
          <div className="bg-white border-2 border-slate-100 rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.05)] overflow-hidden">
            <div className="p-8 md:p-16">
              <div className="relative mb-16 pl-8 border-l-4 border-red-600">
                <p className="text-xl md:text-3xl text-slate-800 leading-tight font-bold italic opacity-90">{day.description}</p>
                <div className="mt-6 flex items-center gap-3 text-slate-400">
                  <Info size={18} className="text-red-600" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Информация к изучению</span>
                </div>
              </div>
              
              <div className="relative rounded-[3rem] overflow-hidden bg-slate-950 shadow-2xl aspect-video mb-16 ring-[16px] ring-slate-50 group border border-white/5">
                {embedUrl ? (
                  <iframe 
                    key={iframeKey} 
                    src={embedUrl} 
                    width="100%" 
                    height="100%" 
                    allow="autoplay; encrypted-media; fullscreen" 
                    frameBorder="0" 
                    allowFullScreen 
                    className="absolute inset-0 z-10"
                  ></iframe>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-slate-500">
                    <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 animate-pulse">
                      <MonitorPlay size={48} className="opacity-20" />
                    </div>
                    <p className="text-[12px] uppercase font-black tracking-[0.3em] text-slate-600">Ожидание контента...</p>
                  </div>
                )}
              </div>

              {!showQuiz && !isCompleted && (
                <button onClick={() => setShowQuiz(true)} className="w-full bg-slate-950 hover:bg-red-600 text-white font-black py-10 rounded-[3rem] flex items-center justify-center gap-8 transition-all shadow-2xl hover:shadow-red-600/30 uppercase tracking-[0.2em] text-lg group active:scale-[0.98]">
                  Изучил материал. К Тесту <ArrowRight size={28} className="group-hover:translate-x-3 transition-transform" />
                </button>
              )}

              {isCompleted && (
                <div className="p-10 bg-emerald-50 border-2 border-emerald-100 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-6 text-emerald-900">
                   <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <Trophy size={32} className="text-white" />
                      </div>
                      <div>
                        <h4 className="font-black uppercase text-lg italic tracking-tighter">Аттестация пройдена!</h4>
                        <p className="text-xs font-bold opacity-70">Вы успешно освоили материалы данного модуля.</p>
                      </div>
                   </div>
                   <button onClick={() => setShowQuiz(true)} className="px-8 py-4 bg-white border border-emerald-200 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all shadow-sm">
                      Пройти повторно
                   </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Modal Overlay */}
      {showQuiz && (
        <div className="fixed inset-0 z-[200] bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-4 animate-in fade-in duration-500">
          <div className="bg-white w-full max-w-2xl rounded-[4rem] overflow-hidden shadow-[0_0_150px_rgba(220,38,38,0.2)] animate-in slide-in-from-bottom-12 duration-700">
            {!quizFinished ? (
              <div className="p-8 md:p-16">
                <div className="flex justify-between items-center mb-12">
                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em] block">Проверка знаний</span>
                    <div className="h-2 w-48 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-red-600 transition-all duration-700" 
                        style={{width: `${((currentQuestionIndex + 1) / day.questions.length) * 100}%`}} 
                      />
                    </div>
                  </div>
                  <button onClick={() => setShowQuiz(false)} className="w-14 h-14 flex items-center justify-center bg-slate-100 text-slate-400 rounded-[1.5rem] hover:bg-red-50 hover:text-red-600 transition-all active:scale-90"><X size={24}/></button>
                </div>
                
                <h3 className="text-2xl md:text-4xl font-black text-slate-950 mb-12 leading-tight italic uppercase tracking-tighter">
                  {day.questions[currentQuestionIndex]?.question}
                </h3>
                
                <div className="space-y-4">
                  {day.questions[currentQuestionIndex]?.options.map((opt, i) => (
                    <button key={i} onClick={() => handleAnswer(i)} className="w-full text-left p-6 md:p-8 rounded-[2rem] border-2 border-slate-100 hover:border-red-600 hover:bg-red-50/30 transition-all font-bold text-slate-700 flex items-center justify-between group">
                      <span className="text-lg md:text-xl pr-4">{opt}</span>
                      <div className="w-12 h-12 rounded-2xl border-2 border-slate-100 group-hover:border-red-600 group-hover:bg-red-600 group-hover:text-white flex items-center justify-center text-sm font-black transition-all flex-shrink-0">
                        {String.fromCharCode(65 + i)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-16 text-center">
                <div className="w-32 h-32 bg-red-600 rounded-[3rem] flex items-center justify-center mx-auto mb-12 shadow-2xl shadow-red-600/40 rotate-6 animate-bounce-slow">
                  <GraduationCap size={64} className="text-white" />
                </div>
                <h3 className="text-5xl font-black text-slate-950 mb-4 uppercase italic tracking-tighter">Счет: {score} / {day.questions.length}</h3>
                <p className="text-slate-500 font-bold mb-16 text-xl">Ваш результат зафиксирован в RBT Cloud.</p>
                <button onClick={finishTraining} className="w-full bg-slate-950 text-white font-black py-10 rounded-[2.5rem] shadow-2xl hover:bg-red-600 transition-all uppercase tracking-[0.2em] text-lg active:scale-95">
                  Завершить аттестацию
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DayView;
