import { motion } from 'framer-motion';
import { KeyRound, ShoppingBag, CheckCircle, Clock, Image as ImageIcon, Edit2, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export function UserDashboard() {
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<{
    keys: any[],
    transactions: any[],
    projects: any[]
  }>({ keys: [], transactions: [], projects: [] });

  useEffect(() => {
    async function loadDashboard() {
      if (!user) return;
      
      try {
        const apiUrl = import.meta.env.PROD 
          ? 'https://agapesi.ddns.com.br/teste/api/dashboard.php' 
          : 'http://localhost/otalex/api/dashboard.php';

        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'get_dashboard', user_id: user.id })
        });

        const data = await res.json();
        if (data.status === 'success') {
          setDashboardData({
            keys: data.keys || [],
            transactions: data.transactions || [],
            projects: data.projects || []
          });
          
          // Se o saldo mudou, atualiza o contexto de auth
          if (data.user && data.user.otacoins_balance !== user.otacoins_balance) {
            login(data.user);
          }
        }
      } catch (err) {
        console.error("Erro ao carregar dashboard:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary w-12 h-12" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 container mx-auto">
      
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-zinc-100 mb-2">Meu Painel</h1>
          <p className="text-zinc-400">Gerencie suas compras, licenças e saldo de Otacoins.</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-zinc-900/50 border border-zinc-800 px-6 py-2.5 rounded-xl flex flex-col items-center">
              <span className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest">Saldo Atual</span>
              <span className="text-xl font-bold text-primary">{user?.otacoins_balance || 0} Otacoins</span>
           </div>
           <Link to="/" className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-6 py-2.5 rounded-xl font-medium transition-colors text-sm flex items-center">
             Voltar para Home
           </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* Minhas Keys Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/20 text-primary">
              <KeyRound size={24} />
            </div>
            <h2 className="text-2xl font-semibold text-zinc-100">Minhas Keys</h2>
          </div>

          <div className="flex flex-col gap-4">
            {dashboardData.keys.length === 0 ? (
               <div className="glass-card p-10 border border-zinc-800 text-center text-zinc-500">
                  Nenhuma chave de licença encontrada.
               </div>
            ) : dashboardData.keys.map((k, i) => (
              <div key={i} className={`glass-card p-6 border ${k.status === 'esgotada' ? 'border-zinc-800 opacity-60' : 'border-primary/30'} relative overflow-hidden group`}>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-mono font-bold text-zinc-200 tracking-wider mb-1">{k.license_key}</h3>
                    <p className="text-sm text-zinc-500">Referente ao {k.plan_name}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${k.status === 'esgotada' ? 'bg-zinc-800 text-zinc-500' : 'bg-green-500/20 text-green-400'}`}>
                    {k.status}
                  </div>
                </div>

                <div className="flex justify-between items-end border-t border-zinc-800/60 pt-4">
                  <div>
                    <span className="block text-xs uppercase text-zinc-500 font-semibold mb-1">Créditos de Uso</span>
                    <span className="text-xl font-bold text-zinc-200">{k.credits_total - k.credits_used} / {k.credits_total}</span>
                  </div>
                  {k.status !== 'esgotada' && (
                    <button 
                      onClick={() => {
                         navigator.clipboard.writeText(k.license_key);
                         alert("Key copiada com sucesso!");
                      }}
                      className="text-sm font-semibold text-primary hover:text-primary-hover flex items-center gap-1 group-hover:underline">
                      Copiar Key
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Histórico de Compras */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col gap-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-secondary/20 text-secondary">
              <ShoppingBag size={24} />
            </div>
            <h2 className="text-2xl font-semibold text-zinc-100">Histórico de Compras</h2>
          </div>

          <div className="glass-card border border-zinc-800 overflow-hidden">
            <div className="p-6">
              {dashboardData.transactions.length === 0 ? (
                 <div className="text-center py-10 text-zinc-500">Nenhuma compra realizada.</div>
              ) : dashboardData.transactions.map((p, i) => (
                <div key={i} className="flex flex-col sm:flex-row justify-between sm:items-center py-5 border-b border-zinc-800/60 last:border-0 last:pb-0 first:pt-0 gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-zinc-200">{p.transaction_code}</span>
                      <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${p.status === 'pago' ? 'text-green-400 bg-green-500/10' : 'text-yellow-400 bg-yellow-500/10'}`}>
                        {p.status === 'pago' && <CheckCircle size={12} />} {p.status}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-400">{p.product_name}</p>
                  </div>
                  
                  <div className="flex sm:flex-col sm:items-end justify-between items-center sm:gap-1">
                    <span className="font-bold text-zinc-100">R$ {parseFloat(p.amount).toFixed(2).replace('.', ',')}</span>
                    <span className="text-xs flex items-center gap-1 text-zinc-500"><Clock size={12} /> {new Date(p.created_at).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

      </div>

      {/* Histórico de Parallax Upados */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-12 flex flex-col gap-6"
      >
        <div className="flex items-center justify-between mb-2">
           <div className="flex items-center gap-3">
             <div className="p-2 rounded-lg bg-pink-500/20 text-pink-400">
               <ImageIcon size={24} />
             </div>
             <h2 className="text-2xl font-semibold text-zinc-100">Parallax Upados</h2>
           </div>
           
           <Link to="/upload" className="bg-primary/20 hover:bg-primary/30 text-primary px-4 py-2 rounded-xl text-sm font-medium transition-colors border border-primary/30">
             Subir Novo
           </Link>
        </div>

        <div className="glass-card border border-zinc-800 overflow-hidden">
          <div className="p-6">
            {dashboardData.projects.length === 0 ? (
               <div className="text-center py-10 text-zinc-500">Você ainda não enviou nenhum projeto.</div>
            ) : dashboardData.projects.map((p, i) => (
              <div key={i} className="flex flex-col sm:flex-row justify-between sm:items-center py-5 border-b border-zinc-800/60 last:border-0 last:pb-0 first:pt-0 gap-4 group">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-zinc-200">{p.title}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.status === 'aprovado' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                      {p.status}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-400">{p.anime_tag} • {new Date(p.created_at).toLocaleDateString('pt-BR')}</p>
                </div>
                
                <div className="flex sm:flex-col sm:items-end justify-between items-center sm:gap-1">
                  <div className="flex items-center gap-3">
                     <span className="text-xs flex items-center gap-1 text-zinc-500"><Clock size={12} /> {p.downloads} downloads</span>
                     <button className="flex items-center gap-1 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-lg transition-colors border border-zinc-700 hover:border-zinc-500">
                        <Edit2 size={12} /> Editar
                     </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
      
    </div>
  );
}
