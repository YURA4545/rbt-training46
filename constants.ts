
import { TrainingDay } from './types';

// Fixed TypeScript error: Added explicit type assertion to the initial days array
// to ensure videoPlatform is correctly typed as the union 'vk' | 'rutube' | 'other'
export const TRAINING_DAYS: TrainingDay[] = (
  [
    {
      id: 1,
      title: "Основы работы с клиентами",
      description: "Первое впечатление, приветствие и этикет в розничной торговле. Как расположить к себе покупателя в RBT.",
      videoUrl: "https://rutube.ru/video/215b1212ce46c88b6090f7d392d34b12/",
      videoPlatform: 'rutube',
      objectives: ["Стандарты приветствия", "Улыбка и доверие", "Начало диалога"],
      summary: "Улыбка — ваш первый инструмент.",
      questions: [
        { id: '1-1', question: "В течение какого времени нужно поприветствовать вошедшего клиента?", options: ["Сразу", "В течение 30 секунд", "Когда он сам подойдет"], correctAnswer: 1 },
        { id: '1-2', question: "Допустимо ли использовать уменьшительно-ласкательные слова?", options: ["Да", "Нет", "Только с детьми"], correctAnswer: 1 }
      ]
    },
    {
      id: 2,
      title: "Техника продаж: выявление потребностей",
      description: "Учимся задавать вопросы, которые помогают продавать.",
      videoUrl: "https://vkvideo.ru/video-38484531_456239436",
      videoPlatform: 'vk',
      objectives: ["Воронка вопросов", "Активное слушание"],
      summary: "Тот, кто задает вопросы, управляет сделкой.",
      questions: [
        { id: '2-1', question: "Какой тип вопроса лучше использовать для начала выявления потребностей?", options: ["Закрытый", "Альтернативный", "Открытый"], correctAnswer: 2 }
      ]
    }
  ] as TrainingDay[]
).concat(Array.from({ length: 8 }, (_, i): TrainingDay => ({
  id: i + 3,
  title: `Тема дня ${i + 3}`,
  description: "Описание темы будет добавлено администратором.",
  videoUrl: "",
  videoPlatform: 'other',
  objectives: ["Цель 1", "Цель 2"],
  summary: "Важное правило.",
  questions: []
})));
