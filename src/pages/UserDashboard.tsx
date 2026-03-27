import { motion } from 'framer-motion';
import { KeyRound, ShoppingBag, CheckCircle, Clock, Image as ImageIcon, Edit2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export function UserDashboard() {
  const purchases = [
    { id: '#9821', date: '26 Mar 2026', total: 'R$ 40,00', items: 'Pacote Mirt (100 Otacoins)' },
    { id: '#9011', date: '10 Fev 2026', total: 'R$ 10,00', items: 'Pacote Nizi (20 Otacoins)' }
  ];

  const keys = [
    { key: 'MV3X-128R-9K2P', plan: 'Pacote Mirt', status: 'Ativa', balance: '94 / 100', used: false },
    { key: '9Z2X-12LR-L2P1', plan: 'Pacote Nizi', status: 'Esgotada', balance: '0 / 20', used: true },
  ];

  const parallaxHistory = [
    { id: '#P-001', title: 'Goku UI 4K', date: '27 Mar 2026', images: 3, status: 'Gerado', link: '#' },
    { id: '#P-002', title: 'Sukuna Domain', date: '21 Mar 2026', images: 2, status: 'Em Análise', link: '#' }
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 container mx-auto">
      
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-zinc-100 mb-2">Meu Painel</h1>
          <p className="text-zinc-400">Gerencie suas compras, licenças e saldo de Otacoins.</p>
        </div>
        <Link to="/" className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-6 py-2.5 rounded-xl font-medium transition-colors text-sm">
          Voltar para Home
        </Link>
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
            {keys.map((k, i) => (
              <div key={i} className={`glass-card p-6 border ${k.used ? 'border-zinc-800 opacity-60' : 'border-primary/30'} relative overflow-hidden group`}>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-mono font-bold text-zinc-200 tracking-wider mb-1">{k.key}</h3>
                    <p className="text-sm text-zinc-500">Referente ao {k.plan}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${k.used ? 'bg-zinc-800 text-zinc-500' : 'bg-green-500/20 text-green-400'}`}>
                    {k.status}
                  </div>
                </div>

                <div className="flex justify-between items-end border-t border-zinc-800/60 pt-4">
                  <div>
                    <span className="block text-xs uppercase text-zinc-500 font-semibold mb-1">Saldo de Otacoins</span>
                    <span className="text-xl font-bold text-zinc-200">{k.balance}</span>
                  </div>
                  {!k.used && (
                    <button className="text-sm font-semibold text-primary hover:text-primary-hover flex items-center gap-1 group-hover:underline">
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
              {purchases.map((p, i) => (
                <div key={i} className="flex flex-col sm:flex-row justify-between sm:items-center py-5 border-b border-zinc-800/60 last:border-0 last:pb-0 first:pt-0 gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-zinc-200">{p.id}</span>
                      <span className="flex items-center gap-1 text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full font-medium">
                        <CheckCircle size={12} /> Aprovado
                      </span>
                    </div>
                    <p className="text-sm text-zinc-400">{p.items}</p>
                  </div>
                  
                  <div className="flex sm:flex-col sm:items-end justify-between items-center sm:gap-1">
                    <span className="font-bold text-zinc-100">{p.total}</span>
                    <span className="text-xs flex items-center gap-1 text-zinc-500"><Clock size={12} /> {p.date}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-zinc-950/50 p-4 border-t border-zinc-800 flex justify-center">
              <button className="text-sm font-semibold text-zinc-400 hover:text-zinc-200 transition-colors">
                Carregar mais
              </button>
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
           
           <Link to="/upload" target="_blank" className="bg-primary/20 hover:bg-primary/30 text-primary px-4 py-2 rounded-xl text-sm font-medium transition-colors border border-primary/30">
             Subir Novo
           </Link>
        </div>

        <div className="glass-card border border-zinc-800 overflow-hidden">
          <div className="p-6">
            {parallaxHistory.map((p, i) => (
              <div key={i} className="flex flex-col sm:flex-row justify-between sm:items-center py-5 border-b border-zinc-800/60 last:border-0 last:pb-0 first:pt-0 gap-4 group">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-zinc-200">{p.title}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.status === 'Gerado' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                      {p.status}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-400">ID: {p.id} • {p.images} camadas utilizadas</p>
                </div>
                
                <div className="flex sm:flex-col sm:items-end justify-between items-center sm:gap-1">
                  <div className="flex items-center gap-3">
                     <span className="text-xs flex items-center gap-1 text-zinc-500"><Clock size={12} /> {p.date}</span>
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
