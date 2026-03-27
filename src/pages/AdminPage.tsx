import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, DollarSign, Key, BarChart3, Plus, Search, X, Zap, PowerOff, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

// Tipagens
type License = {
  id: string;
  key: string;
  plan: string;
  credits: number | string;
  user: string;
  status: 'Ativa' | 'Inativa' | 'Esgotada';
};

export function AdminPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'keys' | 'users' | 'sales'>('overview');
  const [isCreateKeyModalOpen, setIsCreateKeyModalOpen] = useState(false);
  
  // Form State para Nova Key
  const [newKeyPlan, setNewKeyPlan] = useState('Personalizado');
  const [newKeyCredits, setNewKeyCredits] = useState<number>(50);
  
  // Mock Dados
  const [licenses, setLicenses] = useState<License[]>([
    { id: '1', key: 'MV3X-128R-9K2P', plan: 'Pacote Mirt', credits: 100, user: 'motion_god', status: 'Ativa' },
    { id: '2', key: '9Z2X-12LR-L2P1', plan: 'Pacote Nizi', credits: 20, user: 'eren_edits', status: 'Esgotada' },
    { id: '3', key: 'PRO-INF-Z99B-8XQA', plan: 'PRO Mensal', credits: 'Ilimitado', user: 'swordsman.ae', status: 'Ativa' },
  ]);

  const stats = [
    { label: 'Faturamento Mensal', value: 'R$ 4.250,00', increase: '+15%', icon: DollarSign, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'Usuários Ativos', value: '1.284', increase: '+8%', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Keys Geradas', value: '849', increase: '+22%', icon: Key, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Projetos de Parallax', value: '312', increase: '+45%', icon: BarChart3, color: 'text-secondary', bg: 'bg-secondary/10' },
  ];

  const mockUsers = [
    { id: 1, name: 'Lucas', user: 'lucas_vfx', email: 'lucas@vfx.com', plan: 'Pacote Mirt', joined: '12 Jan 2026', status: 'Ativo' },
    { id: 2, name: 'Camila', user: 'camila.ae', email: 'camila@edit.com', plan: 'PRO Mensal', joined: '05 Mar 2026', status: 'Ativo' },
    { id: 3, name: 'Pedro', user: 'pedro_edits', email: 'pedro@gmail.com', plan: 'Pacote Nizi', joined: '20 Fev 2026', status: 'Inativo' },
  ];

  const mockSales = [
    { id: '#TRX-8292', date: '27 Mar 2026', user: '@camila.ae', product: 'PRO Mensal', value: 'R$ 80,00', status: 'Pago' },
    { id: '#TRX-8291', date: '26 Mar 2026', user: '@lucas_vfx', product: 'Pacote Mirt', value: 'R$ 40,00', status: 'Pago' },
    { id: '#TRX-8290', date: '25 Mar 2026', user: '@pedro_edits', product: 'Pacote Nescoh', value: 'R$ 150,00', status: 'Estornado' },
  ];

  const handleCreateKey = (e: React.FormEvent) => {
    e.preventDefault();
    const randomKey = Array.from({length: 3}, () => Math.random().toString(36).substring(2, 6).toUpperCase()).join('-');
    const newLicense: License = {
      id: Math.random().toString(),
      key: `CUS-${randomKey}`,
      plan: newKeyPlan,
      credits: newKeyCredits,
      user: 'Sem Vínculo', // Key gerada avulsa
      status: 'Ativa'
    };
    
    setLicenses([newLicense, ...licenses]);
    setIsCreateKeyModalOpen(false);
  };

  const toggleKeyStatus = (id: string) => {
    setLicenses(licenses.map(l => {
      if (l.id === id) {
        return { ...l, status: l.status === 'Ativa' ? 'Inativa' : 'Ativa' };
      }
      return l;
    }));
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 container mx-auto flex flex-col items-center">
      
      {/* Header Admin */}
      <div className="w-full max-w-7xl flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-bold text-zinc-100 flex items-center gap-3">
            Admin Dashboard <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full uppercase tracking-wider font-bold">Otalex v1.0</span>
          </h1>
          <p className="text-zinc-400 mt-2">Visão geral do negócio, gerenciamento de licenças e usuários.</p>
        </div>
        <Link to="/" className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 px-6 py-2.5 rounded-xl font-medium transition-colors text-sm shadow-md">
          Sair do Painel
        </Link>
      </div>

      <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-8 relative z-10">
        
        {/* Sidebar Nav */}
        <div className="w-full lg:w-64 flex flex-col gap-2">
          {['overview', 'keys', 'users', 'sales'].map((tab) => {
             const labels: Record<string, string> = { overview: 'Visão Geral', keys: 'Gerenciar Keys', users: 'Usuários', sales: 'Vendas' };
             const icons: Record<string, any> = { overview: BarChart3, keys: Key, users: Users, sales: DollarSign };
             const Icon = icons[tab];
             return (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  activeTab === tab 
                    ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(139,92,246,0.1)]' 
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 border border-transparent'
                }`}
              >
                <Icon size={18} />
                {labels[tab]}
              </button>
             );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 glass-card p-6 md:p-10 border-zinc-800 rounded-3xl min-h-[600px]">
          
          <AnimatePresence mode="wait">
            
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <motion.div key="overview" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                  {stats.map((s, i) => (
                    <div key={i} className="bg-zinc-950/50 p-6 rounded-2xl border border-zinc-800 relative overflow-hidden group">
                      <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-xl ${s.bg} ${s.color}`}>
                          <s.icon size={22} />
                        </div>
                        <span className="text-green-400 text-xs font-bold bg-green-400/10 px-2 py-1 rounded-md">{s.increase}</span>
                      </div>
                      <h3 className="text-3xl font-black text-white mb-1">{s.value}</h3>
                      <p className="text-zinc-500 text-sm font-medium">{s.label}</p>
                    </div>
                  ))}
                </div>
                
                <h3 className="text-xl font-bold text-white mb-4">Últimas Vendas</h3>
                <div className="bg-zinc-950/60 rounded-2xl border border-zinc-800 overflow-hidden">
                  <table className="w-full text-left text-sm text-zinc-400">
                    <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-300">
                      <tr>
                        <th className="px-6 py-4 font-semibold">Transação</th>
                        <th className="px-6 py-4 font-semibold">Cliente</th>
                        <th className="px-6 py-4 font-semibold">Produto</th>
                        <th className="px-6 py-4 font-semibold">Valor</th>
                        <th className="px-6 py-4 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-zinc-800/50 hover:bg-zinc-900/40 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs">#TRX-8291</td>
                        <td className="px-6 py-4">@lucas_vfx</td>
                        <td className="px-6 py-4 text-zinc-200">Pacote Mirt</td>
                        <td className="px-6 py-4 font-medium text-white">R$ 40,00</td>
                        <td className="px-6 py-4"><span className="text-xs px-2 py-1 bg-green-500/10 text-green-400 rounded-md">Pago</span></td>
                      </tr>
                      <tr className="border-b border-zinc-800/50 hover:bg-zinc-900/40 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs">#TRX-8290</td>
                        <td className="px-6 py-4">@anime_edits</td>
                        <td className="px-6 py-4 text-zinc-200">Pacote Nescoh</td>
                        <td className="px-6 py-4 font-medium text-white">R$ 150,00</td>
                        <td className="px-6 py-4"><span className="text-xs px-2 py-1 bg-green-500/10 text-green-400 rounded-md">Pago</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* KEYS TAB */}
            {activeTab === 'keys' && (
              <motion.div key="keys" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}}>
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                  <h2 className="text-2xl font-bold text-white">Gerenciamento de Keys</h2>
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                      <input type="text" placeholder="Buscar key..." className="w-full bg-zinc-900 border border-zinc-800 text-sm focus:border-primary px-4 py-2 pl-9 rounded-xl outline-none text-zinc-200" />
                    </div>
                    <button 
                      onClick={() => setIsCreateKeyModalOpen(true)}
                      className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg hover:shadow-primary/50 transition-all border border-primary/20"
                    >
                      <Plus size={16} /> Nova Key
                    </button>
                  </div>
                </div>

                <div className="bg-zinc-950/60 rounded-2xl border border-zinc-800 overflow-hidden">
                  <table className="w-full text-left text-sm text-zinc-400 whitespace-nowrap">
                    <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-300">
                      <tr>
                        <th className="px-6 py-4 font-semibold">License Key</th>
                        <th className="px-6 py-4 font-semibold">Plano/Tipo</th>
                        <th className="px-6 py-4 font-semibold">Créditos</th>
                        <th className="px-6 py-4 font-semibold">Titular</th>
                        <th className="px-6 py-4 font-semibold">Status</th>
                        <th className="px-6 py-4 font-semibold text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {licenses.map(lic => (
                        <tr key={lic.id} className="border-b border-zinc-800/50 hover:bg-zinc-900/40 transition-colors">
                          <td className="px-6 py-4 font-mono font-bold text-zinc-200">{lic.key}</td>
                          <td className="px-6 py-4">{lic.plan}</td>
                          <td className="px-6 py-4 font-medium text-white flex items-center gap-1">
                            {lic.credits !== 'Ilimitado' && <Zap size={14} className="text-secondary" />}
                            {lic.credits}
                          </td>
                          <td className="px-6 py-4">@{lic.user}</td>
                          <td className="px-6 py-4">
                            <span className={`text-xs px-2 py-1 rounded-md ${
                              lic.status === 'Ativa' ? 'bg-green-500/10 text-green-400' : 
                              lic.status === 'Inativa' ? 'bg-zinc-800 text-zinc-400' : 'bg-red-500/10 text-red-400'
                            }`}>
                              {lic.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 flex justify-end">
                            <button 
                              onClick={() => toggleKeyStatus(lic.id)}
                              title={lic.status === 'Ativa' ? 'Desativar Key' : 'Ativar Key'}
                              className={`p-2 rounded-lg transition-colors ${
                                lic.status === 'Ativa' 
                                  ? 'text-zinc-500 hover:text-red-400 hover:bg-red-500/10' 
                                  : 'text-zinc-500 hover:text-green-400 hover:bg-green-500/10'
                              }`}
                            >
                              {lic.status === 'Ativa' ? <PowerOff size={16} /> : <CheckCircle2 size={16} />}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* USERS TAB */}
            {activeTab === 'users' && (
              <motion.div key="users" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">Usuários Cadastrados</h2>
                </div>
                <div className="bg-zinc-950/60 rounded-2xl border border-zinc-800 overflow-hidden">
                  <table className="w-full text-left text-sm text-zinc-400 whitespace-nowrap">
                    <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-300">
                      <tr>
                        <th className="px-6 py-4 font-semibold">Nome</th>
                        <th className="px-6 py-4 font-semibold">Username</th>
                        <th className="px-6 py-4 font-semibold">E-mail</th>
                        <th className="px-6 py-4 font-semibold">Plano Principal</th>
                        <th className="px-6 py-4 font-semibold">Membro Desde</th>
                        <th className="px-6 py-4 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockUsers.map(u => (
                        <tr key={u.id} className="border-b border-zinc-800/50 hover:bg-zinc-900/40 transition-colors">
                          <td className="px-6 py-4 font-medium text-zinc-200">{u.name}</td>
                          <td className="px-6 py-4">@{u.user}</td>
                          <td className="px-6 py-4">{u.email}</td>
                          <td className="px-6 py-4">
                            <span className="text-xs px-2 py-1 bg-zinc-800 text-zinc-300 rounded-md border border-zinc-700">{u.plan}</span>
                          </td>
                          <td className="px-6 py-4">{u.joined}</td>
                          <td className="px-6 py-4">
                            <span className={`text-xs px-2 py-1 rounded-full ${u.status === 'Ativo' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                              {u.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* SALES TAB */}
            {activeTab === 'sales' && (
              <motion.div key="sales" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">Histórico de Vendas</h2>
                </div>
                <div className="bg-zinc-950/60 rounded-2xl border border-zinc-800 overflow-hidden">
                  <table className="w-full text-left text-sm text-zinc-400 whitespace-nowrap">
                    <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-300">
                      <tr>
                        <th className="px-6 py-4 font-semibold">Transação</th>
                        <th className="px-6 py-4 font-semibold">Data</th>
                        <th className="px-6 py-4 font-semibold">Cliente</th>
                        <th className="px-6 py-4 font-semibold">Produto</th>
                        <th className="px-6 py-4 font-semibold">Valor</th>
                        <th className="px-6 py-4 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockSales.map(s => (
                        <tr key={s.id} className="border-b border-zinc-800/50 hover:bg-zinc-900/40 transition-colors">
                          <td className="px-6 py-4 font-mono font-bold text-zinc-200">{s.id}</td>
                          <td className="px-6 py-4">{s.date}</td>
                          <td className="px-6 py-4">{s.user}</td>
                          <td className="px-6 py-4">{s.product}</td>
                          <td className="px-6 py-4 font-medium text-white">{s.value}</td>
                          <td className="px-6 py-4">
                            <span className={`text-xs px-2 py-1 rounded-md ${s.status === 'Pago' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                              {s.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>

      {/* Modal Criar Nova Key */}
      <AnimatePresence>
        {isCreateKeyModalOpen && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm px-6">
              <motion.div
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.95 }}
                 className="bg-zinc-950 border border-zinc-800 w-full max-w-md rounded-3xl p-8 relative overflow-hidden glass-card"
              >
                 <button 
                    onClick={() => setIsCreateKeyModalOpen(false)}
                    className="absolute top-6 right-6 text-zinc-500 hover:text-white bg-zinc-900 p-2 rounded-xl transition-colors"
                 >
                    <X size={18} />
                 </button>

                 <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <Key size={24} className="text-primary" />
                    Gerar Nova Key
                 </h3>

                 <form onSubmit={handleCreateKey} className="flex flex-col gap-5">
                    <div>
                       <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-1 mb-2 block">Tipo de Plano</label>
                       <select 
                          value={newKeyPlan}
                          onChange={e => setNewKeyPlan(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-3 rounded-xl focus:border-primary outline-none"
                       >
                          <option>Personalizado</option>
                          <option>Pacote Nizi</option>
                          <option>Pacote Mirt</option>
                          <option>Pacote Nescoh</option>
                          <option>PRO Mensal</option>
                       </select>
                    </div>

                    <div>
                       <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-1 mb-2 block">Quantidade de Créditos</label>
                       <input 
                          type="number" 
                          min="1"
                          value={newKeyCredits}
                          onChange={e => setNewKeyCredits(Number(e.target.value))}
                          className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-3 rounded-xl focus:border-primary outline-none"
                       />
                       <span className="text-xs text-secondary font-medium ml-1 mt-1 block">Cada render 4K gasta 1 crédito.</span>
                    </div>

                    <button 
                       type="submit"
                       className="w-full bg-primary hover:bg-primary-hover text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2 mt-4 transition-all shadow-lg hover:shadow-primary/50"
                    >
                       <Plus size={18} /> Criar e Ativar Key
                    </button>
                 </form>
              </motion.div>
           </div>
        )}
      </AnimatePresence>

    </div>
  );
}
