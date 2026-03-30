import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Play, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const formData = new FormData(e.currentTarget);
    const data: Record<string, any> = Object.fromEntries(formData);
    
    // Define action based on isLogin state
    data.action = isLogin ? 'login' : 'register';

    try {
      const apiUrl = import.meta.env.PROD 
        ? 'https://agapesi.ddns.com.br/teste/api/auth.php' 
        : 'http://localhost/otalex/api/auth.php';

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      const json = await res.json();
      
      if (json.status === 'success') {
         login(json.user);
         navigate(-1);
      } else {
         setErrorMsg(json.message || 'Erro de autenticação.');
      }
    } catch (err) {
      setErrorMsg('Erro interno no servidor ou de conexão.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 md:p-10 lg:p-12 overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[150px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 blur-[150px] rounded-full pointer-events-none z-0" />

      {/* Botão de voltar explícito */}
      <Link to="/" className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-medium z-30 bg-zinc-900/50 px-4 py-2 rounded-xl border border-zinc-800 backdrop-blur-md shadow-lg shadow-black/20">
        <ArrowLeft size={16} /> Voltar para o site
      </Link>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-xl xl:max-w-2xl glass-card p-10 md:p-14 lg:p-16 relative z-20 overflow-hidden shadow-2xl shadow-primary/10 border-zinc-800/60 flex flex-col items-center"
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-10 w-full">
          <Link to="/" className="flex items-center gap-2 mb-8 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-[2px] shadow-lg shadow-primary/20">
              <div className="w-full h-full bg-background rounded-lg flex items-center justify-center">
                <Play size={24} className="text-secondary ml-1 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 to-zinc-400">
              Otalex
            </span>
          </Link>
          
          <h2 className="text-xl md:text-2xl font-semibold text-white mb-8 text-center">
            {isLogin ? 'Bem-vindo de volta ao painel' : 'Crie sua conta para acessar os recursos'}
          </h2>

          <div className="flex bg-zinc-900/80 p-1.5 rounded-[1.25rem] w-full max-w-md border border-zinc-800/80 shadow-inner">
            <button 
              type="button"
              className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${isLogin ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-400 hover:text-zinc-200'}`}
              onClick={() => setIsLogin(true)}
            >
              Entrar
            </button>
            <button 
              type="button"
              className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${!isLogin ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-400 hover:text-zinc-200'}`}
              onClick={() => setIsLogin(false)}
            >
              Criar Conta
            </button>
          </div>
        </div>

        {/* Form */}
        <AnimatePresence mode="wait">
          <motion.form 
            key={isLogin ? 'login' : 'register'}
            initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-6 w-full max-w-md mx-auto"
            onSubmit={handleSubmit}
          >
            {errorMsg && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl text-sm font-medium">
                  {errorMsg}
                </div>
            )}

            {!isLogin && (
              <div>
                <label className="text-sm font-semibold text-zinc-400 mb-2 ml-1 block uppercase tracking-wider">Nome ou Apelido</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User size={20} className="text-zinc-500" />
                  </div>
                <input name="username" type="text" placeholder="Ex: motion_god" className="w-full bg-zinc-900/50 border border-zinc-700 text-zinc-100 rounded-2xl pl-12 pr-4 py-4 focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all text-base outline-none" required />
              </div>
            </div>
          )}

          <div>
            <label className="text-sm font-semibold text-zinc-400 mb-2 ml-1 block uppercase tracking-wider">E-mail</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail size={20} className="text-zinc-500" />
              </div>
              <input name="email" type="email" placeholder="seuemail@exemplo.com" className="w-full bg-zinc-900/50 border border-zinc-700 text-zinc-100 rounded-2xl pl-12 pr-4 py-4 focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all text-base outline-none" required />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-zinc-400 ml-1 block uppercase tracking-wider">Senha</label>
              {isLogin && <a href="#" className="text-sm text-primary hover:text-primary-hover font-medium transition-colors">Esqueceu a senha?</a>}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={20} className="text-zinc-500" />
              </div>
              <input name="password" type="password" placeholder="••••••••" className="w-full bg-zinc-900/50 border border-zinc-700 text-zinc-100 rounded-2xl pl-12 pr-4 py-4 focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all text-base outline-none" required />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="mt-6 w-full bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-white py-4 rounded-2xl font-bold transition-all shadow-lg hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] flex items-center justify-center gap-2 group text-base disabled:shadow-none"
          >
            {loading ? 'Carregando...' : (isLogin ? 'Entrar no Painel' : 'Criar minha conta')}
            {!loading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </motion.form>
      </AnimatePresence>
        
        <div className="mt-10 text-center w-full max-w-md mx-auto">
          <p className="text-sm text-zinc-500">
            Ao {isLogin ? 'entrar' : 'criar uma conta'}, você concorda com nossos <br className="hidden md:block"/> Termos de Serviço e Política de Privacidade.
          </p>
        </div>

      </motion.div>
    </div>
  );
}
