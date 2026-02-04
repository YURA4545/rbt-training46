
import React, { useState } from 'react';
import { User, LogIn, ShieldCheck, Lock, UserPlus } from 'lucide-react';
import { db } from '../db';

interface LoginProps {
  onLogin: (name: string, isAdmin: boolean, completedDays?: number[]) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (showAdminLogin) {
        if (name.toLowerCase() === 'admin' && password === '4545') {
          onLogin('Администратор', true, []);
        } else {
          alert('Неверный логин или пароль администратора');
        }
      } else {
        // Валидация пароля из 3 цифр для сотрудников
        if (!/^\d{3}$/.test(password)) {
          alert('Пароль должен состоять ровно из 3 цифр (например, 123)');
          setLoading(false);
          return;
        }

        if (isRegistering) {
          const userData = await db.registerUser(name.trim(), password);
          alert('Регистрация успешна!');
          onLogin(userData.name, userData.isAdmin, userData.completedDays);
        } else {
          const userData = await db.loginUser(name.trim(), password);
          onLogin(userData.name, userData.isAdmin, userData.completedDays);
        }
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setName('');
    setPassword('');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-red-600/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-900/10 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-500/20 transform -rotate-3 transition-transform hover:rotate-0 duration-500">
            {isRegistering ? <UserPlus size={40} className="text-white" /> : <ShieldCheck size={40} className="text-white" />}
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight uppercase">RBT Studio</h1>
          <p className="text-slate-400">
            {showAdminLogin ? 'Вход для администратора' : 
             isRegistering ? 'Регистрация нового сотрудника' : 'Личный кабинет сотрудника'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">
              {showAdminLogin ? 'Логин' : 'ФИО полностью'}
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
              <input
                type="text"
                required
                value={name}
                disabled={loading}
                onChange={(e) => setName(e.target.value)}
                placeholder={showAdminLogin ? "admin" : "Иванов Иван Иванович"}
                className="w-full bg-slate-800 border-none text-white pl-12 pr-4 py-4 rounded-xl focus:ring-2 focus:ring-red-600 transition-all placeholder:text-slate-600 outline-none disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">
              {showAdminLogin ? 'Пароль' : 'Пароль (3 цифры)'}
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
              <input
                type="password"
                required
                value={password}
                disabled={loading}
                maxLength={showAdminLogin ? 20 : 3}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={showAdminLogin ? "••••" : "777"}
                className="w-full bg-slate-800 border-none text-white pl-12 pr-4 py-4 rounded-xl focus:ring-2 focus:ring-red-600 transition-all placeholder:text-slate-600 outline-none disabled:opacity-50"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-600/20 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Обработка...' : (isRegistering ? 'Зарегистрироваться' : 'Войти')} <LogIn size={20} />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col items-center gap-4">
          {!showAdminLogin && (
            <button 
              onClick={toggleMode}
              className="text-xs text-red-400 hover:text-red-300 transition-colors font-bold uppercase tracking-widest"
            >
              {isRegistering ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
            </button>
          )}
          
          <button 
            onClick={() => {
              setShowAdminLogin(!showAdminLogin);
              setIsRegistering(false);
              setName('');
              setPassword('');
            }}
            className="text-xs text-slate-500 hover:text-red-400 transition-colors underline decoration-slate-700 underline-offset-4"
          >
            {showAdminLogin ? 'Вернуться к обычному входу' : 'Вход для администратора'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
