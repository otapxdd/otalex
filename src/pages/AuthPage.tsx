import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Play, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen relative flex items-center justify-center pt-24 pb-12 px-6">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[150px] rounded-full point-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 blur-[150px] rounded-full point-events-none z-0" />

      {/* Botão de voltar explícito */}
      <Link to="/" className="absolute top-8 left-8 sm:left-12 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-medium z-20 bg-zinc-900/50 px-4 py-2 rounded-xl border border-zinc-800 backdrop-blur-md">
        <ArrowLeft size={16} /> Voltar para o site
      </Link>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass-card p-8 md:p-10 relative z-10 overflow-hidden"
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <Link to="/" className="flex items-center gap-2 mb-6 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-[2px]">
              <div className="w-full h-full bg-background rounded-lg flex items-center justify-center">
                <Play size={20} className="text-secondary ml-1 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 to-zinc-400">
              Otalex
            </span>
          </Link>
          
          <div className="flex bg-zinc-900/80 p-1 rounded-xl w-full">
            <button 
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors ${isLogin ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}
              onClick={() => setIsLogin(true)}
            >
              Entrar
            </button>
            <button 
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors ${!isLogin ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}
              onClick={() => setIsLogin(false)}
            >
              Criar Conta
            </button>
          </div>
        </div>

        {/* Forms */}
        <AnimatePresence mode="wait">
          <motion.form 
            key={isLogin ? 'login' : 'register'}
            initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-5"
          >
            {!isLogin && (
              <div>
                <label className="text-xs font-semibold text-zinc-400 mb-1.5 ml-1 block uppercase tracking-wider">Nome ou Apelido</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User size={18} className="text-zinc-500" />
                  </div>
                  <input type="text" placeholder="Ex: motion_god" className="w-full bg-zinc-900/50 border border-zinc-700 text-zinc-100 rounded-xl pl-10 pr-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm" />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-zinc-400 mb-1.5 ml-1 block uppercase tracking-wider">E-mail</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail size={18} className="text-zinc-500" />
                </div>
                <input type="email" placeholder="seuemail@exemplo.com" className="w-full bg-zinc-900/50 border border-zinc-700 text-zinc-100 rounded-xl pl-10 pr-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-zinc-400 ml-1 block uppercase tracking-wider">Senha</label>
                {isLogin && <a href="#" className="text-xs text-primary hover:text-primary-hover font-medium">Esqueceu a senha?</a>}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock size={18} className="text-zinc-500" />
                </div>
                <input type="password" placeholder="••••••••" className="w-full bg-zinc-900/50 border border-zinc-700 text-zinc-100 rounded-xl pl-10 pr-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm" />
              </div>
            </div>

            <Link 
              to="/dashboard"
              className="mt-4 w-full bg-primary hover:bg-primary-hover text-white py-3.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-primary/50 flex items-center justify-center gap-2"
            >
              {isLogin ? 'Entrar no Otalex' : 'Criar minha conta'}
              <ArrowRight size={18} />
            </Link>
          </motion.form>
        </AnimatePresence>
        
        <div className="mt-8 text-center">
          <p className="text-xs text-zinc-500">
            Ao {isLogin ? 'entrar' : 'criar uma conta'}, você concorda com nossos <br/> Termos de Serviço e Política de Privacidade.
          </p>
        </div>

      </motion.div>
    </div>
  );
}
