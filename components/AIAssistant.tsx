
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { TrainingDay, ChatMessage } from '../types';
import { Send, Sparkles, MessageSquare, RefreshCcw } from 'lucide-react';

interface AIAssistantProps {
  currentDay: TrainingDay;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ currentDay }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      // Create a new instance right before making an API call as per guidelines
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        // Simplified contents to string as recommended for basic text tasks
        contents: userMessage,
        config: {
          systemInstruction: `Вы — эксперт-куратор академии RBT. Вы обучаете новых продавцов-консультантов. 
          Текущий модуль: День ${currentDay.id} - ${currentDay.title}.
          Описание: ${currentDay.description}
          Ваша цель: давать практические советы, которые помогут продавать больше техники (смартфоны, ТВ, бытовая техника) и оказывать лучший сервис. 
          Используйте профессиональный сленг ритейла, но оставайтесь понятны. Отвечайте на русском.`,
          temperature: 0.7,
        }
      });

      // Directly access .text property from GenerateContentResponse
      const aiText = response.text || "Извините, я не смог обработать ваш запрос.";
      setMessages(prev => [...prev, { role: 'model', text: aiText }]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Произошла ошибка. Проверьте подключение к интернету." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => setMessages([]);

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Sparkles className="text-red-600" size={18} />
          <span className="font-bold text-slate-800">RBT Тьютор</span>
        </div>
        <button 
          onClick={clearChat}
          className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"
        >
          <RefreshCcw size={14} />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="bg-red-50 p-4 rounded-full mb-4">
              <MessageSquare className="text-red-600" size={32} />
            </div>
            <h4 className="font-bold text-slate-800 mb-2">Нужна подсказка?</h4>
            <p className="text-xs text-slate-500">
              Я помогу разобраться в нюансах темы «{currentDay.title}». Спросите меня о чем угодно!
            </p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div 
              key={i} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[90%] rounded-2xl p-3 text-sm ${
                  msg.role === 'user' 
                    ? 'bg-slate-900 text-white rounded-br-none' 
                    : 'bg-white text-slate-700 border border-slate-200 shadow-sm rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 flex gap-1">
              <div className="w-1 h-1 bg-red-400 rounded-full animate-pulse" />
              <div className="w-1 h-1 bg-red-400 rounded-full animate-pulse delay-75" />
              <div className="w-1 h-1 bg-red-400 rounded-full animate-pulse delay-150" />
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-100">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ваш вопрос..."
            className="w-full pl-4 pr-10 py-2.5 bg-slate-100 border-none rounded-xl text-sm focus:ring-1 focus:ring-red-600 transition-all"
          />
          <button 
            onClick={handleSendMessage}
            className="absolute right-2 top-1.5 p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
