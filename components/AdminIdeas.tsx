
import React, { useState } from 'react';
import { Lightbulb, Search, Copy, CheckCircle, Video, Star, Zap, ShoppingBag, Heart, Shield, Laptop, Smartphone, Tv, WashingMachine, Cpu, Headphones, Gamepad, Award, Coffee, User, Layout, Watch, Home } from 'lucide-react';

const TRAINING_IDEAS = [
  // Категория: Техника (Hard Skills)
  { topic: "Тренды ТВ 2024: OLED vs QLED vs MiniLED", category: "ТВ", icon: Tv, search: "разница между oled qled miniled для продавцов 2024" },
  { topic: "Экосистема Apple: Почему это покупают?", category: "Смартфоны", icon: Smartphone, search: "преимущества экосистемы apple для клиента обучение" },
  { topic: "Android флагманы: Samsung S24 и Pixel 8", category: "Смартфоны", icon: Smartphone, search: "сравнение флагманов андроид 2024 обучение ритейл" },
  { topic: "Холодильники: Технологии No Frost и инверторы", category: "КБТ", icon: WashingMachine, search: "как работает инверторный компрессор в холодильнике просто" },
  { topic: "Стиральные машины: Пар, AI и дозагрузка", category: "КБТ", icon: WashingMachine, search: "функции современных стиральных машин объяснение выгоды" },
  { topic: "Игровые ноутбуки: Видеокарты RTX 40 серии", category: "ПК", icon: Laptop, search: "преимущества видеокарт rtx 40 для геймеров обучение" },
  { topic: "Кофемашины: От рожковых до автоматических", category: "МБТ", icon: Coffee, search: "типы кофемашин как выбрать для дома обучение продажи" },
  { topic: "Роботы-пылесосы: Лазерная навигация и базы самоочистки", category: "МБТ", icon: Zap, search: "как выбрать робот пылесос с лидаром обучение" },
  
  // Категория: Техники продаж (Soft Skills)
  { topic: "Установление контакта: Правило 30 секунд", category: "Продажи", icon: ShoppingBag, search: "установление контакта в рознице примеры фраз" },
  { topic: "Выявление потребностей: Техника SPIN", category: "Продажи", icon: Lightbulb, search: "метод спин в розничных продажах простыми словами" },
  { topic: "Работа с возражением 'Я только посмотрю'", category: "Продажи", icon: Search, search: "обработка возражения я просто смотрю в магазине" },
  { topic: "Работа с возражением 'Дорого'", category: "Продажи", icon: Copy, search: "аргументация цены в рознице техника бутерброда" },
  { topic: "Кросс-продажи: ТВ + Кронштейн + Настройка", category: "Продажи", icon: Zap, search: "комплексные продажи в магазине электроники кейсы" },
  { topic: "Дожим без давления: Закрытие сделки", category: "Продажи", icon: Award, search: "техники закрытия сделки в магазине примеры" },
  { topic: "Upsell: Как перевести клиента на более дорогую модель", category: "Продажи", icon: Star, search: "техника апсейл в рознице обучение" },
  
  // Категория: Психология и Сервис
  { topic: "Работа с агрессивным клиентом", category: "Сервис", icon: Heart, search: "алгоритм работы с конфликтным клиентом в ритейле" },
  { topic: "Эмпатия в продажах: Слушай и слышь", category: "Сервис", icon: Heart, search: "активное слушание в продажах упражнения" },
  { topic: "Стрессоустойчивость продавца-консультанта", category: "Психология", icon: Shield, search: "как не выгорать в розничной торговле советы" },
  { topic: "Язык тела и невербалика в зале", category: "Психология", icon: User, search: "невербальное общение в продажах секреты" },
  
  // Категория: Специфика RBT
  { topic: "Как продать ПДС (Доп. гарантия) выгодно", category: "RBT", icon: Shield, search: "ценность дополнительного сервиса для клиента" },
  { topic: "Продажа в кредит: Страхи и выгоды", category: "RBT", icon: ShoppingBag, search: "как предлагать рассрочку и кредит эффективно" },
  { topic: "Программа лояльности: Зачем нужны бонусы?", category: "RBT", icon: Star, search: "зачем клиенту карта лояльности аргументы" },
  { topic: "Мерчандайзинг: Золотая полка", category: "RBT", icon: Layout, search: "основы мерчандайзинга в магазине техники" },
  
  // Еще Техника (Дополнительно)
  { topic: "Смарт-часы: Здоровье или игрушка?", category: "Гаджеты", icon: Watch, search: "преимущества смарт часов для спорта и жизни" },
  { topic: "Беспроводной звук: Кодеки LDAC и aptX", category: "Звук", icon: Headphones, search: "разница в качестве звука блютуз наушников обучение" },
  { topic: "Процессоры Intel vs AMD: Что советовать?", category: "ПК", icon: Cpu, search: "сравнение процессоров intel и amd 2024 для работы" },
  { topic: "Умный дом: С чего начать?", category: "Гаджеты", icon: Home, search: "датчики умного дома сценарии использования обучение" },
  { topic: "Игровые консоли: PS5 vs Xbox Series", category: "Гейминг", icon: Gamepad, search: "преимущества игровых приставок обучение" }
];

const AdminIdeas: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>('Все');

  const categories = ['Все', ...Array.from(new Set(TRAINING_IDEAS.map(i => i.category)))];

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const filteredIdeas = filter === 'Все' 
    ? TRAINING_IDEAS 
    : TRAINING_IDEAS.filter(i => i.category === filter);

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="bg-gradient-to-br from-red-600 via-red-700 to-slate-900 rounded-[3.5rem] p-12 text-white mb-12 shadow-2xl shadow-red-600/20 relative overflow-hidden group">
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-white/10 backdrop-blur-xl rounded-2xl ring-1 ring-white/20">
              <Zap size={32} className="text-amber-400 fill-amber-400" />
            </div>
            <h2 className="text-4xl font-black uppercase tracking-tighter italic leading-none">Контент-банк RBT</h2>
          </div>
          <p className="text-red-50 text-xl max-w-2xl font-bold leading-relaxed opacity-90">
            Огромная библиотека проверенных тем. Копируйте запрос, находите видео на Rutube или VK и вставляйте в уроки.
          </p>
        </div>
        <div className="absolute top-[-50px] right-[-50px] opacity-10 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-1000">
          <Star size={300} />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-10 pb-4 border-b border-slate-200 overflow-x-auto custom-scrollbar">
        {categories.map(cat => (
          <button 
            key={cat} 
            onClick={() => setFilter(cat)}
            className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${filter === cat ? 'bg-red-600 text-white shadow-lg' : 'bg-white text-slate-400 hover:bg-slate-50 border border-slate-100'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIdeas.map((idea, index) => {
          const Icon = idea.icon || Video;
          return (
            <div 
              key={index} 
              className="group bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl transition-all hover:-translate-y-2 border-b-4 border-b-slate-100 hover:border-b-red-600"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="bg-slate-50 p-3 rounded-2xl text-slate-400 group-hover:text-red-600 group-hover:bg-red-50 transition-colors">
                  <Icon size={24} />
                </div>
                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{idea.category}</span>
              </div>
              
              <h3 className="font-black text-slate-900 text-xl mb-6 group-hover:text-red-600 transition-colors leading-tight italic uppercase tracking-tighter">
                {idea.topic}
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  <Search size={12} /> Поисковый запрос
                </div>
                <div className="flex items-center justify-between gap-4 bg-slate-50 rounded-2xl p-4 border border-slate-100 group-hover:border-red-100 group-hover:bg-red-50/50 transition-all">
                  <code className="text-[11px] text-slate-600 font-mono font-bold truncate">
                    {idea.search}
                  </code>
                  <button 
                    onClick={() => copyToClipboard(idea.search, index)}
                    className={`flex-shrink-0 w-10 h-10 rounded-xl transition-all flex items-center justify-center ${
                      copiedIndex === index 
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                        : 'bg-white text-slate-400 hover:text-red-600 shadow-sm border border-slate-100'
                    }`}
                  >
                    {copiedIndex === index ? <CheckCircle size={18} /> : <Copy size={18} />}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-20 p-12 bg-slate-900 rounded-[3.5rem] text-center border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4">База знаний RBT</h4>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto font-bold">Используйте эти темы для создания новых обучающих модулей. Чем больше практики — тем выше продажи!</p>
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 rounded-full text-amber-500 font-black text-[10px] uppercase tracking-widest ring-1 ring-white/10">
            <Zap size={14} /> Всегда актуальные материалы
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminIdeas;
