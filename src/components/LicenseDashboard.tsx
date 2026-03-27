import { useState } from 'react';
import { motion } from 'framer-motion';
import { KeyRound, ShieldCheck, Zap, AlertCircle } from 'lucide-react';

export function LicenseDashboard() {
  const [licenseKey, setLicenseKey] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'active' | 'error'>('idle');

  const handleValidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseKey.trim()) return;
    
    setStatus('loading');
    
    // Simulate API call
    setTimeout(() => {
      // Allow any key long enough for the mock, checking for PRO- for pro users
      if (licenseKey.length >= 8) {
        setStatus('active');
      } else {
        setStatus('error');
      }
    }, 1500);
  };

  return (
    <section id="dashboard" className="w-full pt-20 pb-32 container mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center">
      
      <div className="text-center mb-16 max-w-2xl">
        <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(139,92,246,0.1)]">
          <KeyRound size={32} className="text-primary" />
        </div>
        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-zinc-100">
          Valide sua Licença
        </h2>
        <p className="text-zinc-400">
          Cole sua License Key abaixo para visualizar seus créditos ou o status da sua assinatura PRO.
        </p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="w-full max-w-xl glass-card p-8 md:p-10 border border-zinc-800 relative overflow-hidden"
      >
        {/* Glow behind card */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2" />

        <form onSubmit={handleValidate} className="relative z-10 flex flex-col gap-4">
          <label className="text-sm font-medium text-zinc-300 ml-1">License Key</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="text" 
              placeholder="Ex: XXXX-XXXX-XXXX" 
              className="flex-1 bg-zinc-950/50 border border-zinc-700/50 text-zinc-100 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono text-sm tracking-widest placeholder:tracking-normal uppercase"
              value={licenseKey}
              onChange={(e) => setLicenseKey(e.target.value)}
            />
            <button 
              type="submit" 
              disabled={status === 'loading'}
              className="bg-zinc-100 hover:bg-white text-zinc-900 px-8 py-3 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {status === 'loading' ? 'Validando...' : 'Checar Status'}
            </button>
          </div>
        </form>

        {/* Results Area */}
        {status === 'active' && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-8 pt-8 border-t border-zinc-800"
          >
            <div className="flex items-center gap-3 text-green-400 font-medium mb-6 bg-green-500/10 p-3 rounded-lg border border-green-500/20">
              <ShieldCheck size={20} />
              Licença Ativa
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-900/80 rounded-xl p-4 border border-zinc-800/50">
                <span className="text-zinc-500 text-xs uppercase font-bold tracking-wider mb-1 block">Plano Atual</span>
                <span className="text-zinc-200 font-medium text-lg">
                  {licenseKey.startsWith('PRO-') ? 'Pro (Ilimitado)' : 'Créditos Avulsos'}
                </span>
              </div>
              <div className="bg-zinc-900/80 rounded-xl p-4 border border-zinc-800/50">
                <span className="text-zinc-500 text-xs uppercase font-bold tracking-wider mb-1 block">Créditos Restantes</span>
                <div className="flex items-center gap-2 text-zinc-200 font-medium text-lg">
                  <Zap size={18} className="text-secondary" />
                  {licenseKey.startsWith('PRO-') ? '∞ (Infinity)' : '42'}
                </div>
              </div>
            </div>
            
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-6 flex items-center gap-3 text-red-400 font-medium bg-red-500/10 p-3 rounded-lg border border-red-500/20"
          >
            <AlertCircle size={20} />
            License Key inválida ou expirada.
          </motion.div>
        )}

      </motion.div>

    </section>
  );
}
