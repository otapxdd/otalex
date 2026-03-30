import { motion } from 'framer-motion';
import { CheckCircle, Download, KeyRound, ArrowRight, AlertCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export function SuccessPage() {
  const location = useLocation();
  const generatedKey = location.state?.licenseKey;

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 container mx-auto flex flex-col items-center justify-center">
      
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[150px] rounded-full pointer-events-none z-0" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-2xl glass-card p-10 md:p-14 border-primary/30 shadow-2xl shadow-primary/10 text-center relative z-10 flex flex-col items-center"
      >
        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
          <CheckCircle size={40} className="text-green-400" />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-4">Pagamento Confirmado!</h1>
        
        <p className="text-zinc-400 mb-8 max-w-lg leading-relaxed">
          Muito obrigado por apoiar o Otalex! Sua compra nos ajuda imensamente a manter o desenvolvimento do projeto firme e forte. O script já está disponível para você.
        </p>

        <div className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl p-6 mb-8 text-left">
          {generatedKey ? (
            <div className="mb-6">
              <span className="text-xs uppercase font-semibold text-zinc-500 tracking-wider flex items-center gap-2 mb-2">
                <KeyRound size={16} /> Sua License Key
              </span>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono text-lg px-4 py-3 rounded-xl tracking-wider select-all cursor-text flex items-center justify-center sm:justify-start overflow-hidden text-ellipsis whitespace-nowrap">
                  {generatedKey}
                </div>
                <button 
                  onClick={() => navigator.clipboard.writeText(generatedKey)}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-xl font-medium transition-colors whitespace-nowrap"
                >
                  Copiar
                </button>
              </div>
              <p className="text-xs text-zinc-500 mt-2">Guarde esta chave. Você vai precisar dela para ativar o Otalex no After Effects.</p>
            </div>
          ) : (
             <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-4">
                <AlertCircle className="text-red-400 shrink-0" size={24} />
                <div>
                   <h4 className="font-bold text-red-100 text-sm">Chave não encontrada</h4>
                   <p className="text-xs text-red-300 opacity-80 mt-1">Houve um problema ao recuperar sua chave. Por favor, verifique seu painel ou entre em contato com o suporte.</p>
                </div>
             </div>
          )}

          <div className="border-t border-zinc-800/60 pt-6">
            <span className="text-xs uppercase font-semibold text-zinc-500 tracking-wider flex items-center gap-2 mb-3">
              <Download size={16} /> Arquivos do Projeto
            </span>
            <a 
              href="https://agapesi.ddns.com.br/teste/otalex_v1.zip" 
              target="_blank"
              rel="noreferrer"
              className="w-full bg-primary hover:bg-primary-hover text-white px-6 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] flex items-center justify-center gap-2"
            >
               Baixar Script Otalex v1.0.zip
               <Download size={18} />
            </a>
          </div>
        </div>

        <Link to="/dashboard" className="text-primary hover:text-primary-hover font-semibold flex items-center gap-2 transition-colors">
          Ir para Meu Painel <ArrowRight size={18} />
        </Link>
      </motion.div>

    </div>
  );
}
