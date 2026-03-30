import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, DollarSign, Key, BarChart3, Plus, Search, X, Zap, PowerOff, CheckCircle2, Loader2, Coins, Edit3, Save } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AdminPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'keys' | 'users' | 'sales' | 'plans'>('overview');
  const [isCreateKeyModalOpen, setIsCreateKeyModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Data State
  const [stats, setStats] = useState<any[]>([]);
  const [licenses, setLicenses] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [salesList, setSalesList] = useState<any[]>([]);
  const [plansList, setPlansList] = useState<any[]>([]);
  
  // Form State para Nova Key
  const [newKeyPlan, setNewKeyPlan] = useState('Personalizado');
  const [newKeyCredits, setNewKeyCredits] = useState<number>(50);
  const [creatingKey, setCreatingKey] = useState(false);

  // Edit Plans State
  const [editingPlanId, setEditingPlanId] = useState<number | null>(null);
  const [editPrice, setEditPrice] = useState("");
  const [editCoins, setEditCoins] = useState("");

  const fetchAdminData = async () => {
    try {
      const apiUrl = import.meta.env.PROD 
        ? 'https://agapesi.ddns.com.br/teste/api/admin.php' 
        : 'http://localhost/otalex/api/admin.php';

      // Carregar estatísticas
      const statsRes = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get_stats' })
      });
      const statsData = await statsRes.json();
      
      if (statsData.status === 'success') {
        setStats([
          { label: 'Faturamento Total', value: `R$ ${statsData.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, increase: '+15%', icon: DollarSign, color: 'text-green-400', bg: 'bg-green-500/10' },
          { label: 'Total Usuários', value: statsData.users_count.toString(), increase: '+8%', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Keys Geradas', value: statsData.keys_count.toString(), increase: '+22%', icon: Key, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Projetos Parallax', value: statsData.projects_count.toString(), increase: '+45%', icon: BarChart3, color: 'text-secondary', bg: 'bg-secondary/10' },
        ]);
      }

      // Carregar Listas
      const listRes = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'list_all_data' })
      });
      const lists = await listRes.json();
      
      if (lists.status === 'success') {
        setLicenses(lists.keys || []);
        setUsersList(lists.users || []);
        setSalesList(lists.sales || []);
      }

      // Carregar Planos
      const plansRes = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get_plans' })
      });
      const plansData = await plansRes.json();
      if (plansData.status === 'success') {
         setPlansList(plansData.plans || []);
      }

    } catch (err) {
      console.error("Erro ao buscar dados admin:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingKey(true);

    try {
      const apiUrl = import.meta.env.PROD 
        ? 'https://agapesi.ddns.com.br/teste/api/admin.php' 
        : 'http://localhost/otalex/api/admin.php';

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'create_key', 
          plan_name: newKeyPlan, 
          credits: newKeyCredits 
        })
      });

      const data = await res.json();
      if (data.status === 'success') {
        alert("Key gerada com sucesso: " + data.key);
        setIsCreateKeyModalOpen(false);
        fetchAdminData(); // Atualiza a lista
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao criar key.");
    } finally {
      setCreatingKey(false);
    }
  };

  const handleUpdatePlan = async (id: number) => {
     try {
       const apiUrl = import.meta.env.PROD 
         ? 'https://agapesi.ddns.com.br/teste/api/admin.php' 
         : 'http://localhost/otalex/api/admin.php';

       const res = await fetch(apiUrl, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ 
           action: 'update_plan', 
           id: id,
           price: parseFloat(editPrice),
           otacoins: parseInt(editCoins)
         })
       });

       const data = await res.json();
       if (data.status === 'success') {
          alert("Plano atualizado!");
          setEditingPlanId(null);
          fetchAdminData();
       }
     } catch (err) {
        console.error(err);
     }
  };

  const toggleKeyStatus = async (id: string, currentStatus: string) => {
    alert("Status alternado de " + id + " para " + (currentStatus === 'ativa' ? 'inativa' : 'ativa'));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary w-16 h-16" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 container mx-auto flex flex-col items-center">
      
      {/* Header Admin */}
      <div className="w-full max-w-7xl flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-bold text-zinc-100 flex items-center gap-3">
            Admin Dashboard <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full uppercase tracking-wider font-bold">Otalex v1.2 - Live</span>
          </h1>
          <p className="text-zinc-400 mt-2">Visão geral do negócio e controle total da plataforma.</p>
        </div>
        <Link to="/" className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 px-6 py-2.5 rounded-xl font-medium transition-colors text-sm shadow-md">
          Sair do Painel
        </Link>
      </div>

      <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-8 relative z-10">
        
        {/* Sidebar Nav */}
        <div className="w-full lg:w-64 flex flex-col gap-2">
          {[
            { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
            { id: 'keys', label: 'Gerenciar Keys', icon: Key },
            { id: 'users', label: 'Usuários', icon: Users },
            { id: 'sales', label: 'Vendas', icon: DollarSign },
            { id: 'plans', label: 'Configurar Planos', icon: Zap }
          ].map((tab) => {
             const Icon = tab.icon;
             return (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                   activeTab === tab.id 
                    ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(139,92,246,0.1)]' 
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 border border-transparent'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
             );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 glass-card p-6 md:p-10 border-zinc-800 rounded-3xl min-h-[600px] shadow-2xl">
          
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
                      <h3 className="text-3xl font-black text-white mb-1 tracking-tight">{s.value}</h3>
                      <p className="text-zinc-500 text-sm font-medium">{s.label}</p>
                    </div>
                  ))}
                </div>
                
                <h3 className="text-xl font-bold text-white mb-4">Últimas Vendas</h3>
                <div className="bg-zinc-950/60 rounded-2xl border border-zinc-800 overflow-hidden">
                  <table className="w-full text-left text-sm text-zinc-400">
                    <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-300">
                      <tr>
                        <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Transação</th>
                        <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Cliente ID</th>
                        <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Produto</th>
                        <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Valor</th>
                        <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {salesList.slice(0, 5).map((sale, i) => (
                        <tr key={i} className="border-b border-zinc-800/50 hover:bg-zinc-900/40 transition-colors">
                          <td className="px-6 py-4 font-mono text-xs">{sale.transaction_code}</td>
                          <td className="px-6 py-4">ID #{sale.user_id}</td>
                          <td className="px-6 py-4 text-zinc-200">{sale.product_name}</td>
                          <td className="px-6 py-4 font-medium text-white">R$ {parseFloat(sale.amount).toFixed(2).replace('.', ',')}</td>
                          <td className="px-6 py-4"><span className={`text-[10px] px-2 py-1 rounded-md uppercase font-bold ${sale.status === 'pago' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-500'}`}>{sale.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* KEYS TAB */}
            {activeTab === 'keys' && (
              <motion.div key="keys" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}}>
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                  <h2 className="text-2xl font-bold text-white tracking-tight">Gerenciamento de Keys</h2>
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                      <input type="text" placeholder="Buscar key..." className="w-full bg-zinc-900 border border-zinc-800 text-sm focus:border-primary px-4 py-2 pl-9 rounded-xl outline-none text-zinc-200 shadow-inner" />
                    </div>
                    <button 
                      onClick={() => setIsCreateKeyModalOpen(true)}
                      className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg hover:shadow-primary/50 transition-all border border-primary/20"
                    >
                      <Plus size={16} /> Nova Key
                    </button>
                  </div>
                </div>

                <div className="bg-zinc-950/60 rounded-2xl border border-zinc-800 overflow-hidden shadow-xl">
                  <table className="w-full text-left text-sm text-zinc-400 whitespace-nowrap">
                    <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-300">
                      <tr>
                        <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">License Key</th>
                        <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Plano/Tipo</th>
                        <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Créditos</th>
                        <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">ID Usuário</th>
                        <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {licenses.map((lic, idx) => (
                        <tr key={idx} className="border-b border-zinc-800/50 hover:bg-zinc-900/40 transition-colors">
                          <td className="px-6 py-4 font-mono font-bold text-zinc-200">{lic.license_key}</td>
                          <td className="px-6 py-4">{lic.plan_name}</td>
                          <td className="px-6 py-4 font-medium text-white flex items-center gap-1">
                            <Zap size={14} className="text-secondary" />
                            {lic.credits_total - lic.credits_used} / {lic.credits_total}
                          </td>
                          <td className="px-6 py-4">#{lic.user_id || 'Avulsa'}</td>
                          <td className="px-6 py-4">
                            <span className={`text-[10px] px-2 py-1 rounded-md uppercase font-bold ${
                              lic.status === 'ativa' ? 'bg-green-500/10 text-green-400' : 
                              lic.status === 'inativa' ? 'bg-zinc-800 text-zinc-400' : 'bg-red-500/10 text-red-500'
                            }`}>
                              {lic.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 flex justify-end">
                            <button 
                              onClick={() => toggleKeyStatus(lic.id, lic.status)}
                              className={`p-2 rounded-lg transition-colors ${
                                lic.status === 'ativa' 
                                  ? 'text-zinc-500 hover:text-red-400 hover:bg-red-500/10' 
                                  : 'text-zinc-500 hover:text-green-400 hover:bg-green-500/10'
                              }`}
                            >
                              {lic.status === 'ativa' ? <PowerOff size={16} /> : <CheckCircle2 size={16} />}
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
                        <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Nome</th>
                        <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">E-mail</th>
                        <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Moedas</th>
                        <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Data Cadastro</th>
                        <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersList.map((u, i) => (
                        <tr key={i} className="border-b border-zinc-800/50 hover:bg-zinc-900/40 transition-colors">
                          <td className="px-6 py-4 font-medium text-zinc-200">
                             <div className="flex flex-col">
                                <span>{u.name}</span>
                                <span className="text-[10px] text-zinc-500 font-mono">@{u.username}</span>
                             </div>
                          </td>
                          <td className="px-6 py-4">{u.email}</td>
                          <td className="px-6 py-4">
                            <span className="text-xs px-2 py-1 bg-zinc-800 text-zinc-300 rounded-md border border-zinc-700 flex items-center gap-1">
                               <Coins size={12} className="text-secondary" /> {u.otacoins_balance}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-mono text-xs">{new Date(u.created_at).toLocaleDateString('pt-BR')}</td>
                          <td className="px-6 py-4">
                            <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${u.status === 'ativo' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
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
                <div className="bg-zinc-950/60 rounded-2xl border border-zinc-800 overflow-hidden shadow-2xl">
                  <table className="w-full text-left text-sm text-zinc-400 whitespace-nowrap">
                    <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-300">
                      <tr>
                        <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Transação</th>
                        <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Data</th>
                        <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Usuário ID</th>
                        <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Produto</th>
                        <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Valor</th>
                        <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {salesList.map((s, i) => (
                        <tr key={i} className="border-b border-zinc-800/50 hover:bg-zinc-900/40 transition-colors">
                          <td className="px-6 py-4 font-mono font-bold text-zinc-200">{s.transaction_code}</td>
                          <td className="px-6 py-4 font-mono text-xs">{new Date(s.created_at).toLocaleDateString('pt-BR')}</td>
                          <td className="px-6 py-4 text-xs font-mono">#{s.user_id}</td>
                          <td className="px-6 py-4">{s.product_name}</td>
                          <td className="px-6 py-4 font-medium text-white tracking-widest">R$ {parseFloat(s.amount).toFixed(2).replace('.', ',')}</td>
                          <td className="px-6 py-4">
                            <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md ${s.status === 'pago' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
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

            {/* PLANS TAB */}
            {activeTab === 'plans' && (
              <motion.div key="plans" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}}>
                <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">Configurar Planos de Venda</h2>
                <div className="grid gap-6">
                  {plansList.map((plan) => (
                    <div key={plan.id} className="bg-zinc-950/50 border border-zinc-800 p-8 rounded-[2rem] flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-primary/30 transition-all relative overflow-hidden backdrop-blur-sm">
                      <div className="flex-1">
                         <div className="flex items-center gap-3 mb-2">
                           <h3 className="text-2xl font-black text-white">{plan.name}</h3>
                           {plan.is_popular && <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-black uppercase tracking-widest border border-primary/20">Popular</span>}
                         </div>
                         <p className="text-zinc-500 text-sm font-medium">{plan.description}</p>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-6 w-full md:w-auto">
                         <div className="flex flex-col gap-2 w-full sm:w-36">
                           <span className="text-[10px] uppercase font-black text-zinc-500 tracking-widest ml-1">Preço (R$)</span>
                           <div className="relative">
                              <input 
                                disabled={editingPlanId !== plan.id}
                                value={editingPlanId === plan.id ? editPrice : plan.price}
                                onChange={e => setEditPrice(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 text-white font-bold focus:border-primary outline-none disabled:opacity-50 transition-all"
                              />
                              <DollarSign size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600" />
                           </div>
                         </div>

                         <div className="flex flex-col gap-2 w-full sm:w-36">
                           <span className="text-[10px] uppercase font-black text-zinc-500 tracking-widest ml-1">Otacoins</span>
                           <div className="relative">
                              <input 
                                disabled={editingPlanId !== plan.id}
                                value={editingPlanId === plan.id ? editCoins : plan.otacoins}
                                onChange={e => setEditCoins(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 text-white font-bold focus:border-primary outline-none disabled:opacity-50 transition-all"
                              />
                              <Coins size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary" />
                           </div>
                         </div>

                         <div className="flex gap-2 w-full sm:w-auto mt-6">
                            {editingPlanId === plan.id ? (
                               <button 
                                  onClick={() => handleUpdatePlan(plan.id)}
                                  className="bg-green-600 hover:bg-green-500 text-white p-4 rounded-2xl transition-all shadow-lg shadow-green-900/20 active:scale-95"
                               >
                                  <Save size={20} />
                               </button>
                            ) : (
                               <button 
                                  onClick={() => {
                                     setEditingPlanId(plan.id);
                                     setEditPrice(plan.price);
                                     setEditCoins(plan.otacoins);
                                  }}
                                  className="bg-zinc-800 hover:bg-zinc-700 text-primary p-4 rounded-2xl transition-all active:scale-95 border border-zinc-700"
                               >
                                  <Edit3 size={20} />
                               </button>
                            )}
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>

      {/* Modal Criar Nova Key */}
      <AnimatePresence>
        {isCreateKeyModalOpen && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md px-6">
              <motion.div
                 initial={{ opacity: 0, scale: 0.95, y: 20 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.95, y: 20 }}
                 className="bg-zinc-950 border border-zinc-800 w-full max-w-md rounded-[2.5rem] p-10 relative overflow-hidden glass-card shadow-[0_0_50px_rgba(139,92,246,0.2)]"
              >
                 <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-secondary to-primary animate-pulse" />

                 <button 
                    onClick={() => setIsCreateKeyModalOpen(false)}
                    className="absolute top-8 right-8 text-zinc-500 hover:text-white bg-zinc-900 p-2.5 rounded-2xl transition-colors border border-zinc-800"
                 >
                    <X size={20} />
                 </button>

                 <h3 className="text-3xl font-black text-white mb-8 flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-primary/20 text-primary">
                       <Key size={28} />
                    </div>
                    Gerar Key
                 </h3>

                 <form onSubmit={handleCreateKey} className="flex flex-col gap-6">
                    <div>
                       <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1 mb-2.5 block">Selecione o Plano Base</label>
                       <select 
                          value={newKeyPlan}
                          onChange={e => {
                             setNewKeyPlan(e.target.value);
                             const p = plansList.find(pl => pl.name === e.target.value);
                             if (p) setNewKeyCredits(p.otacoins);
                          }}
                          className="w-full bg-zinc-900/50 border border-zinc-800 text-zinc-100 px-5 py-4 rounded-2xl focus:border-primary outline-none transition-all cursor-pointer hover:bg-zinc-900"
                       >
                          <option>Personalizado</option>
                          {plansList.map(p => (
                             <option key={p.id} value={p.name}>{p.name}</option>
                          ))}
                       </select>
                    </div>

                    <div>
                       <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1 mb-2.5 block">Quantidade de Créditos</label>
                       <div className="relative">
                          <input 
                              type="number" 
                              min="1"
                              value={newKeyCredits}
                              onChange={e => setNewKeyCredits(Number(e.target.value))}
                              className="w-full bg-zinc-900/50 border border-zinc-800 text-zinc-100 px-5 py-4 rounded-2xl focus:border-primary outline-none transition-all pl-12"
                          />
                          <Zap size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary" />
                       </div>
                    </div>

                    <button 
                       type="submit"
                       disabled={creatingKey}
                       className="w-full bg-primary hover:bg-primary-hover disabled:bg-zinc-800 text-white py-4 rounded-3xl font-black uppercase tracking-widest flex justify-center items-center gap-3 mt-4 transition-all shadow-[0_10px_20px_rgba(139,92,246,0.3)] hover:shadow-[0_15px_30px_rgba(139,92,246,0.5)] border border-primary/20 disabled:shadow-none"
                    >
                       {creatingKey ? <Loader2 className="animate-spin" size={20} /> : <><Plus size={20} /> Ativar Chave</>}
                    </button>
                 </form>
              </motion.div>
           </div>
        )}
      </AnimatePresence>

    </div>
  );
}

