import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, DollarSign, Key, BarChart3, Plus, X, Zap, Loader2, Coins, Edit3, Save, Ticket, Trash2, Percent, MessageSquare, ToggleLeft, ToggleRight, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';

export function AdminPage() {
  const { success, warning } = useToast();
  const [activeTab, setActiveTab] = useState<'overview' | 'keys' | 'users' | 'sales' | 'plans' | 'coupons' | 'prompts' | 'params'>('overview');
  const [isCreateCouponModalOpen, setIsCreateCouponModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Data State
  const [stats, setStats] = useState<any[]>([]);
  const [salesList, setSalesList] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [keysList, setKeysList] = useState<any[]>([]);
  const [plansList, setPlansList] = useState<any[]>([]);
  const [couponsList, setCouponsList] = useState<any[]>([]);
  const [promptsList, setPromptsList] = useState<any[]>([]);
  const [paramsList, setParamsList] = useState<any[]>([]);
  
  // Form State para Novo Cupom
  const [newCouponCode, setNewCouponCode] = useState("");
  const [newCouponType, setNewCouponType] = useState<"percentage" | "fixed">("percentage");
  const [newCouponValue, setNewCouponValue] = useState("");
  const [newCouponPlanId, setNewCouponPlanId] = useState("");
  const [newCouponMaxUses, setNewCouponMaxUses] = useState("0");
  const [creatingCoupon, setCreatingCoupon] = useState(false);

  // Edit Plans State
  const [editingPlanId, setEditingPlanId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editCoins, setEditCoins] = useState("");

  // Prompts State
  const [editingPromptId, setEditingPromptId] = useState<number | null>(null);
  const [editPromptNome, setEditPromptNome] = useState("");
  const [editPromptTexto, setEditPromptTexto] = useState("");
  const [savingPrompt, setSavingPrompt] = useState(false);
  const [isCreatePromptModalOpen, setIsCreatePromptModalOpen] = useState(false);
  const [newPromptNome, setNewPromptNome] = useState("");
  const [newPromptTexto, setNewPromptTexto] = useState("");
  const [creatingPrompt, setCreatingPrompt] = useState(false);

  // Params Plugin State
  const [editingParamKey, setEditingParamKey] = useState<string | null>(null);
  const [editParamValor, setEditParamValor] = useState("");
  const [savingParam, setSavingParam] = useState(false);
  const [isCreateParamModalOpen, setIsCreateParamModalOpen] = useState(false);
  const [newParamChave, setNewParamChave] = useState("");
  const [newParamValor, setNewParamValor] = useState("");
  const [creatingParam, setCreatingParam] = useState(false);

  const fetchAdminData = async () => {
    try {
      const apiUrl = import.meta.env.PROD 
        ? 'https://agapesi.ddns.com.br/teste/api/admin.php' 
        : 'http://localhost/otalex/api/admin.php';

      // 1. Stats
      const statsRes = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get_stats' })
      });
      const statsData = await statsRes.json();
      if (statsData.status === 'success') {
        setStats([
          { label: 'Faturamento Total', value: `R$ ${statsData.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, increase: '+15%', icon: DollarSign, color: 'text-green-400', bg: 'bg-green-500/10' },
          { label: 'Total Usuários', value: statsData.users_count.toString(), icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Keys Geradas', value: statsData.keys_count.toString(), icon: Key, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Cupons Ativos', value: couponsList.filter(c => c.is_active).length.toString(), icon: Ticket, color: 'text-secondary', bg: 'bg-secondary/10' },
        ]);
      }

      // 2. Main Data
      const listRes = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'list_all_data' })
      });
      const lists = await listRes.json();
      if (lists.status === 'success') {
        setSalesList(lists.sales || []);
        setUsersList(lists.users || []);
        setKeysList(lists.keys || []);
      }

      // 3. Plans
      const plansRes = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get_plans' })
      });
      const plansData = await plansRes.json();
      if (plansData.status === 'success') setPlansList(plansData.plans || []);

      // 4. Coupons
      const couponsRes = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get_coupons' })
      });
      const couponsData = await couponsRes.json();
      if (couponsData.status === 'success') setCouponsList(couponsData.coupons || []);

      // 5. Prompts
      const promptsRes = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get_prompts' })
      });
      const promptsData = await promptsRes.json();
      if (promptsData.status === 'success') setPromptsList(promptsData.prompts || []);

      // 6. Params Plugin
      const paramsRes = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get_params' })
      });
      const paramsData = await paramsRes.json();
      if (paramsData.status === 'success') setParamsList(paramsData.params || []);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAdminData(); }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingCoupon(true);
    try {
      const apiUrl = import.meta.env.PROD 
        ? 'https://agapesi.ddns.com.br/teste/api/admin.php' 
        : 'http://localhost/otalex/api/admin.php';

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'create_coupon', 
          code: newCouponCode,
          discount_type: newCouponType,
          discount_value: parseFloat(newCouponValue),
          plan_id: newCouponPlanId || null,
          max_uses: parseInt(newCouponMaxUses),
          expires_at: null,
          is_active: true
        })
      });

      if ((await res.json()).status === 'success') {
        success('Cupom criado com sucesso!');
        setIsCreateCouponModalOpen(false);
        fetchAdminData();
      }
    } catch (err) { console.error(err); }
    finally { setCreatingCoupon(false); }
  };

  const deleteCoupon = async (id: number) => {
    warning('Cupom desativado.');
    try {
      const apiUrl = import.meta.env.PROD 
        ? 'https://agapesi.ddns.com.br/teste/api/admin.php' 
        : 'http://localhost/otalex/api/admin.php';
      await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_coupon', id })
      });
      fetchAdminData();
    } catch (err) { console.error(err); }
  };



  const handleUpdatePlan = async (id: number) => {
     try {
       const apiUrl = import.meta.env.PROD 
         ? 'https://agapesi.ddns.com.br/teste/api/admin.php' 
         : 'http://localhost/otalex/api/admin.php';
       const res = await fetch(apiUrl, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ action: 'update_plan', id, name: editName, description: editDesc, price: parseFloat(editPrice), otacoins: parseInt(editCoins) })
       });
       if ((await res.json()).status === 'success') {
          setEditingPlanId(null);
          fetchAdminData();
       }
     } catch (err) { console.error(err); }
  };

  const handleSavePrompt = async (prompt: any) => {
    setSavingPrompt(true);
    try {
      const apiUrl = import.meta.env.PROD
        ? 'https://agapesi.ddns.com.br/teste/api/admin.php'
        : 'http://localhost/otalex/api/admin.php';
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_prompt', id: prompt.id, nome: editPromptNome, texto: editPromptTexto, ativo: prompt.ativo })
      });
      if ((await res.json()).status === 'success') {
        success('Prompt atualizado com sucesso!');
        setEditingPromptId(null);
        fetchAdminData();
      }
    } catch (err) { console.error(err); }
    finally { setSavingPrompt(false); }
  };

  const handleTogglePrompt = async (prompt: any) => {
    try {
      const apiUrl = import.meta.env.PROD
        ? 'https://agapesi.ddns.com.br/teste/api/admin.php'
        : 'http://localhost/otalex/api/admin.php';
      await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_prompt', id: prompt.id, nome: prompt.nome, texto: prompt.texto, ativo: !prompt.ativo })
      });
      prompt.ativo ? warning('Prompt desativado.') : success('Prompt ativado!');
      fetchAdminData();
    } catch (err) { console.error(err); }
  };

  const handleCreatePrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingPrompt(true);
    try {
      const apiUrl = import.meta.env.PROD
        ? 'https://agapesi.ddns.com.br/teste/api/admin.php'
        : 'http://localhost/otalex/api/admin.php';
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create_prompt', nome: newPromptNome, texto: newPromptTexto, ativo: true })
      });
      if ((await res.json()).status === 'success') {
        success('Prompt criado com sucesso!');
        setIsCreatePromptModalOpen(false);
        setNewPromptNome("");
        setNewPromptTexto("");
        fetchAdminData();
      }
    } catch (err) { console.error(err); }
    finally { setCreatingPrompt(false); }
  };

  // ── Parâmetros do Plugin ──────────────────────────────────────
  const apiUrl = import.meta.env.PROD
    ? 'https://agapesi.ddns.com.br/teste/api/admin.php'
    : 'http://localhost/otalex/api/admin.php';

  const handleSaveParam = async (chave: string) => {
    setSavingParam(true);
    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_param', chave, valor: editParamValor })
      });
      if ((await res.json()).status === 'success') {
        success('Parâmetro atualizado!');
        setEditingParamKey(null);
        fetchAdminData();
      }
    } catch (err) { console.error(err); }
    finally { setSavingParam(false); }
  };

  const handleDeleteParam = async (chave: string) => {
    if (!confirm(`Excluir o parâmetro "${chave}"? Esta ação não pode ser desfeita.`)) return;
    try {
      await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_param', chave })
      });
      warning(`Parâmetro "${chave}" removido.`);
      fetchAdminData();
    } catch (err) { console.error(err); }
  };

  const handleCreateParam = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingParam(true);
    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create_param', chave: newParamChave, valor: newParamValor })
      });
      if ((await res.json()).status === 'success') {
        success('Parâmetro criado com sucesso!');
        setIsCreateParamModalOpen(false);
        setNewParamChave("");
        setNewParamValor("");
        fetchAdminData();
      }
    } catch (err) { console.error(err); }
    finally { setCreatingParam(false); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary w-16 h-16" /></div>;

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 container mx-auto flex flex-col items-center">
      
      <div className="w-full max-w-7xl flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-white flex items-center gap-3">Painel Admin <span className="text-[10px] px-3 py-1 bg-primary text-white rounded-full uppercase tracking-tighter shadow-lg shadow-primary/20">Master Access</span></h1>
          <p className="text-zinc-500 mt-2 font-medium">Controle total sobre vendas, chaves, planos e cupons.</p>
        </div>
        <Link to="/" className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 px-8 py-3 rounded-2xl font-bold transition-all text-sm active:scale-95">Sair do Painel</Link>
      </div>

      <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-8 relative z-10">
        
        <div className="w-full lg:w-64 flex flex-col gap-2">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'keys', label: 'License Keys', icon: Key },
            { id: 'users', label: 'Usuários', icon: Users },
            { id: 'sales', label: 'Vendas', icon: DollarSign },
            { id: 'plans', label: 'Planos', icon: Zap },
            { id: 'coupons', label: 'Cupons', icon: Ticket },
            { id: 'prompts', label: 'Prompts IA', icon: MessageSquare },
            { id: 'params', label: 'Parâmetros', icon: SlidersHorizontal }
          ].map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-3 px-6 py-4 rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] transition-all ${activeTab === tab.id ? 'bg-primary text-white shadow-xl shadow-primary/30' : 'text-zinc-500 hover:text-white hover:bg-zinc-900'}`}>
                <tab.icon size={16} /> {tab.label}
              </button>
          ))}
        </div>

        <div className="flex-1 glass-card p-4 md:p-10 border-zinc-800 rounded-[3rem] min-h-[600px] shadow-2xl">
          <AnimatePresence mode="wait">
            
            {activeTab === 'overview' && (
              <motion.div key="overview" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                  {stats.map((s, i) => (
                    <div key={i} className="bg-zinc-900 border border-zinc-800/50 p-8 rounded-[2rem] relative group hover:border-primary/50 transition-all">
                      <div className={`p-4 rounded-2xl ${s.bg} ${s.color} w-fit mb-6 shadow-xl`}> <s.icon size={24} /> </div>
                      <h3 className="text-3xl font-black text-white leading-none mb-2">{s.value}</h3>
                      <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">{s.label}</p>
                    </div>
                  ))}
                </div>
                <h3 className="text-xl font-black text-white mb-6 uppercase tracking-tighter">Vendas Recentes</h3>
                <div className="bg-zinc-950/50 rounded-[2rem] border border-zinc-800 overflow-hidden">
                    <table className="w-full text-left text-sm text-zinc-400">
                        <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-500 uppercase font-black text-[10px] tracking-widest">
                            <tr><th className="px-8 py-5">Código</th><th className="px-8 py-5">Cliente</th><th className="px-8 py-5">Valor</th><th className="px-8 py-5">Status</th></tr>
                        </thead>
                        <tbody>
                            {salesList.slice(0, 5).map((s, i) => (
                                <tr key={i} className="border-b border-zinc-900/50 hover:bg-white/5 transition-all">
                                    <td className="px-8 py-5 font-mono text-zinc-100 font-bold">{s.transaction_code}</td>
                                    <td className="px-8 py-5">User #{s.user_id}</td>
                                    <td className="px-8 py-5 font-black text-white">R$ {parseFloat(s.amount).toFixed(2)}</td>
                                    <td className="px-8 py-5"><span className="text-[9px] font-black uppercase bg-green-500/10 text-green-400 px-3 py-1 rounded-full">{s.status}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'sales' && (
              <motion.div key="sales" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                <h2 className="text-3xl font-black text-white mb-10 tracking-tighter">Vendas</h2>
                <div className="bg-zinc-950/50 rounded-[2rem] border border-zinc-800 overflow-hidden">
                    <table className="w-full text-left text-sm text-zinc-400">
                        <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-500 uppercase font-black text-[10px] tracking-widest">
                            <tr><th className="px-8 py-5">Código</th><th className="px-8 py-5">Cliente</th><th className="px-8 py-5">Produto</th><th className="px-8 py-5">Valor</th><th className="px-8 py-5">Método</th><th className="px-8 py-5">Status</th><th className="px-8 py-5">Data</th></tr>
                        </thead>
                        <tbody>
                            {salesList.map((s, i) => (
                                <tr key={i} className="border-b border-zinc-900/50 hover:bg-white/5 transition-all">
                                    <td className="px-8 py-5 font-mono text-zinc-100 font-bold">{s.transaction_code}</td>
                                    <td className="px-8 py-5">User #{s.user_id}</td>
                                    <td className="px-8 py-5">{s.product_name || '-'}</td>
                                    <td className="px-8 py-5 font-black text-white">R$ {parseFloat(s.amount).toFixed(2)}</td>
                                    <td className="px-8 py-5 uppercase">{s.payment_method || 'PIX'}</td>
                                    <td className="px-8 py-5"><span className="text-[9px] font-black uppercase bg-green-500/10 text-green-400 px-3 py-1 rounded-full">{s.status}</span></td>
                                    <td className="px-8 py-5">{new Date(s.created_at).toLocaleDateString('pt-BR')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'keys' && (
              <motion.div key="keys" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                <h2 className="text-3xl font-black text-white mb-10 tracking-tighter">License Keys</h2>
                <div className="bg-zinc-950/50 rounded-[2rem] border border-zinc-800 overflow-hidden">
                    <table className="w-full text-left text-sm text-zinc-400">
                        <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-500 uppercase font-black text-[10px] tracking-widest">
                            <tr><th className="px-8 py-5">Key</th><th className="px-8 py-5">Usuário (Dono)</th><th className="px-8 py-5">Plano</th><th className="px-8 py-5">Créditos</th><th className="px-8 py-5">Status</th></tr>
                        </thead>
                        <tbody>
                            {keysList.map((k, i) => (
                                <tr key={i} className="border-b border-zinc-900/50 hover:bg-white/5 transition-all">
                                    <td className="px-8 py-5 font-mono text-primary font-bold tracking-widest">{k.license_key}</td>
                                    <td className="px-8 py-5">User #{k.user_id}</td>
                                    <td className="px-8 py-5">{k.plan_name}</td>
                                    <td className="px-8 py-5 font-bold">{k.credits_used} / {k.credits_total}</td>
                                    <td className="px-8 py-5"><span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full ${k.status === 'ativa' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>{k.status}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'users' && (
              <motion.div key="users" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                <h2 className="text-3xl font-black text-white mb-10 tracking-tighter">Usuários Cadastrados</h2>
                <div className="bg-zinc-950/50 rounded-[2rem] border border-zinc-800 overflow-hidden">
                    <table className="w-full text-left text-sm text-zinc-400">
                        <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-500 uppercase font-black text-[10px] tracking-widest">
                            <tr><th className="px-8 py-5">ID</th><th className="px-8 py-5">Nome</th><th className="px-8 py-5">Email</th><th className="px-8 py-5">Otacoins</th><th className="px-8 py-5">Cadastro</th></tr>
                        </thead>
                        <tbody>
                            {usersList.map((u, i) => (
                                <tr key={i} className="border-b border-zinc-900/50 hover:bg-white/5 transition-all">
                                    <td className="px-8 py-5 font-bold">#{u.id}</td>
                                    <td className="px-8 py-5 text-white font-bold">{u.full_name || '-'}</td>
                                    <td className="px-8 py-5">{u.email}</td>
                                    <td className="px-8 py-5 text-secondary font-bold font-mono">{u.otacoins_balance}</td>
                                    <td className="px-8 py-5">{new Date(u.created_at).toLocaleDateString('pt-BR')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
              </motion.div>
            )}


            {activeTab === 'coupons' && (
              <motion.div key="coupons" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-3xl font-black text-white tracking-tighter">Gestão de Cupons</h2>
                    <button onClick={() => setIsCreateCouponModalOpen(true)} className="bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.2em] flex items-center gap-2 shadow-xl shadow-primary/20 transition-all active:scale-95"> <Plus size={16} /> Novo Cupom </button>
                </div>

                <div className="grid gap-6">
                    {couponsList.map((c) => (
                        <div key={c.id} className={`bg-zinc-900 border ${c.is_active ? 'border-zinc-800' : 'border-red-900/40 opacity-60'} p-8 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center gap-8 group transition-all`}>
                            <div className="flex items-center gap-6 flex-1 w-full">
                                <div className={`p-5 rounded-[2rem] ${c.discount_type === 'percentage' ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary'} shadow-inner`}> <Ticket size={28} /> </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="text-2xl font-black text-white leading-none">{c.code}</h3>
                                        {!c.is_active && <span className="bg-red-500/20 text-red-500 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">Inativo</span>}
                                    </div>
                                    <p className="text-zinc-500 font-bold uppercase tracking-widest text-[9px]">
                                        {c.discount_type === 'percentage' ? `${parseFloat(c.discount_value)}% de Desconto` : `R$ ${parseFloat(c.discount_value).toFixed(2)} de Desconto`}
                                        {c.plan_id && ` • Exclusivo: ${plansList.find(p => p.id === c.plan_id)?.name || 'Plano #'+c.plan_id}`}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 flex-1">
                                <div className="text-center">
                                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Usos</p>
                                    <p className="text-white font-black text-lg">{c.used_count}{c.max_uses > 0 ? ` / ${c.max_uses}` : ''}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Validade</p>
                                    <p className="text-white font-black text-lg">{c.expires_at ? new Date(c.expires_at).toLocaleDateString('pt-BR') : '∞'}</p>
                                </div>
                            </div>

                            <button onClick={() => deleteCoupon(c.id)} className="p-5 bg-zinc-950 text-zinc-600 hover:text-red-400 hover:bg-red-500/10 rounded-[1.5rem] border border-zinc-800 transition-all active:scale-90"> <Trash2 size={24} /> </button>
                        </div>
                    ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'plans' && (
                <motion.div key="plans" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                    <h2 className="text-3xl font-black text-white mb-10 tracking-tighter">Configurar de Venda</h2>
                    <div className="grid gap-8">
                        {plansList.map((plan) => (
                            <div key={plan.id} className="bg-zinc-900 border border-zinc-800 p-10 rounded-[3rem] relative overflow-hidden">
                                <div className="flex justify-between items-center mb-8 pb-8 border-b border-zinc-800/50">
                                    <div className="flex-1">
                                        {editingPlanId === plan.id ? (
                                            <input value={editName} onChange={e => setEditName(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-6 py-3 text-white font-black text-2xl outline-none focus:border-primary shadow-inner" />
                                        ) : (
                                            <h3 className="text-3xl font-black text-white">{plan.name}</h3>
                                        )}
                                        <p className="text-zinc-500 font-medium mt-1">{plan.description}</p>
                                    </div>
                                    <button onClick={() => editingPlanId === plan.id ? handleUpdatePlan(plan.id) : (setEditingPlanId(plan.id), setEditName(plan.name), setEditDesc(plan.description), setEditPrice(plan.price), setEditCoins(plan.otacoins))} className={`p-5 rounded-[2rem] transition-all shadow-xl active:scale-90 ${editingPlanId === plan.id ? 'bg-green-600 text-white' : 'bg-primary/20 text-primary border border-primary/20'}`}> {editingPlanId === plan.id ? <Save size={24} /> : <Edit3 size={24} />} </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-3 block">Preço Real</label>
                                        <div className="relative">
                                            <input disabled={editingPlanId !== plan.id} value={editingPlanId === plan.id ? editPrice : plan.price} onChange={e => setEditPrice(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-6 py-4 text-white font-black text-xl outline-none disabled:opacity-40" />
                                            <DollarSign className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-700" size={20} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-3 block">Carga de Moedas</label>
                                        <div className="relative">
                                            <input disabled={editingPlanId !== plan.id} value={editingPlanId === plan.id ? editCoins : plan.otacoins} onChange={e => setEditCoins(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-6 py-4 text-white font-black text-xl outline-none disabled:opacity-40" />
                                            <Coins className="absolute right-6 top-1/2 -translate-y-1/2 text-secondary" size={20} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {activeTab === 'prompts' && (
              <motion.div key="prompts" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                <div className="flex justify-between items-center mb-10">
                  <div>
                    <h2 className="text-3xl font-black text-white tracking-tighter">Prompts da IA</h2>
                    <p className="text-zinc-500 text-sm mt-1 font-medium">Configure os prompts enviados para a API de análise de imagem.</p>
                  </div>
                  <button onClick={() => setIsCreatePromptModalOpen(true)} className="bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.2em] flex items-center gap-2 shadow-xl shadow-primary/20 transition-all active:scale-95">
                    <Plus size={16} /> Novo Prompt
                  </button>
                </div>

                <div className="grid gap-8">
                  {promptsList.map((p) => (
                    <div key={p.id} className={`bg-zinc-900 border ${p.ativo ? 'border-zinc-800' : 'border-red-900/40 opacity-60'} p-8 rounded-[2.5rem] transition-all`}>
                      
                      {/* Header */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className={`p-4 rounded-[1.5rem] ${p.ativo ? 'bg-primary/20 text-primary' : 'bg-zinc-800 text-zinc-600'} shadow-inner`}>
                            <MessageSquare size={22} />
                          </div>
                          <div>
                            {editingPromptId === p.id ? (
                              <input
                                value={editPromptNome}
                                onChange={e => setEditPromptNome(e.target.value)}
                                className="bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-2 text-white font-black text-lg outline-none focus:border-primary"
                              />
                            ) : (
                              <h3 className="text-xl font-black text-white">{p.nome}</h3>
                            )}
                            <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest mt-0.5">ID #{p.id}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Toggle ativo */}
                          <button
                            onClick={() => handleTogglePrompt(p)}
                            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest border transition-all active:scale-90 ${
                              p.ativo
                                ? 'bg-green-500/10 text-green-400 border-green-500/30 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30'
                                : 'bg-zinc-800 text-zinc-500 border-zinc-700 hover:bg-green-500/10 hover:text-green-400 hover:border-green-500/30'
                            }`}
                          >
                            {p.ativo ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                            {p.ativo ? 'Ativo' : 'Inativo'}
                          </button>

                          {/* Editar / Salvar */}
                          <button
                            onClick={() => {
                              if (editingPromptId === p.id) {
                                handleSavePrompt(p);
                              } else {
                                setEditingPromptId(p.id);
                                setEditPromptNome(p.nome);
                                setEditPromptTexto(p.texto);
                              }
                            }}
                            className={`p-4 rounded-[1.5rem] transition-all shadow-xl active:scale-90 border ${
                              editingPromptId === p.id
                                ? 'bg-green-600 text-white border-green-600'
                                : 'bg-primary/20 text-primary border-primary/20'
                            }`}
                          >
                            {editingPromptId === p.id
                              ? (savingPrompt ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />)
                              : <Edit3 size={20} />}
                          </button>

                          {/* Cancelar edição */}
                          {editingPromptId === p.id && (
                            <button
                              onClick={() => setEditingPromptId(null)}
                              className="p-4 rounded-[1.5rem] bg-zinc-800 text-zinc-500 hover:text-white border border-zinc-700 transition-all active:scale-90"
                            >
                              <X size={20} />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Texto do prompt */}
                      <div>
                        <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-3 block">Texto do Prompt</label>
                        {editingPromptId === p.id ? (
                          <textarea
                            value={editPromptTexto}
                            onChange={e => setEditPromptTexto(e.target.value)}
                            rows={6}
                            className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl px-6 py-5 text-white font-mono text-sm outline-none focus:border-primary resize-none shadow-inner leading-relaxed"
                          />
                        ) : (
                          <div className="bg-zinc-950/60 border border-zinc-800 rounded-2xl px-6 py-5">
                            <p className="text-zinc-300 font-mono text-sm leading-relaxed whitespace-pre-wrap">{p.texto}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {promptsList.length === 0 && (
                    <div className="text-center py-20">
                      <MessageSquare size={48} className="text-zinc-700 mx-auto mb-4" />
                      <p className="text-zinc-600 font-bold">Nenhum prompt configurado.</p>
                      <p className="text-zinc-700 text-sm mt-1">Clique em "Novo Prompt" para começar.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'params' && (
              <motion.div key="params" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                <div className="flex justify-between items-center mb-10">
                  <div>
                    <h2 className="text-3xl font-black text-white tracking-tighter">Parâmetros do Plugin</h2>
                    <p className="text-zinc-500 text-sm mt-1 font-medium">Configurações chave-valor consumidas pelo plugin After Effects.</p>
                  </div>
                  <button onClick={() => setIsCreateParamModalOpen(true)} className="bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.2em] flex items-center gap-2 shadow-xl shadow-primary/20 transition-all active:scale-95">
                    <Plus size={16} /> Novo Parâmetro
                  </button>
                </div>

                <div className="grid gap-4">
                  {paramsList.map((param) => (
                    <div key={param.chave} className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-6 flex flex-col md:flex-row items-start md:items-center gap-6 group hover:border-zinc-700 transition-all">

                      {/* Ícone + Chave */}
                      <div className="flex items-center gap-4 flex-shrink-0 w-full md:w-64">
                        <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                          <SlidersHorizontal size={18} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-0.5">Chave</p>
                          <p className="text-white font-mono font-bold text-sm">{param.chave}</p>
                        </div>
                      </div>

                      {/* Valor — editável inline */}
                      <div className="flex-1 w-full">
                        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">Valor</p>
                        {editingParamKey === param.chave ? (
                          <input
                            value={editParamValor}
                            onChange={e => setEditParamValor(e.target.value)}
                            className="w-full bg-zinc-950 border border-primary/50 rounded-xl px-4 py-3 text-white font-mono text-sm outline-none focus:border-primary shadow-inner"
                            autoFocus
                          />
                        ) : (
                          <p className="text-zinc-300 font-mono text-sm break-all bg-zinc-950/40 rounded-xl px-4 py-3 border border-zinc-800">{param.valor}</p>
                        )}
                      </div>

                      {/* Ações */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {editingParamKey === param.chave ? (
                          <>
                            <button
                              onClick={() => handleSaveParam(param.chave)}
                              className="p-4 rounded-2xl bg-green-600 text-white border border-green-600 transition-all active:scale-90 shadow-xl"
                            >
                              {savingParam ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            </button>
                            <button
                              onClick={() => setEditingParamKey(null)}
                              className="p-4 rounded-2xl bg-zinc-800 text-zinc-500 hover:text-white border border-zinc-700 transition-all active:scale-90"
                            >
                              <X size={18} />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => { setEditingParamKey(param.chave); setEditParamValor(param.valor); }}
                            className="p-4 rounded-2xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all active:scale-90"
                          >
                            <Edit3 size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteParam(param.chave)}
                          className="p-4 rounded-2xl bg-zinc-950 text-zinc-600 hover:text-red-400 hover:bg-red-500/10 border border-zinc-800 transition-all active:scale-90"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}

                  {paramsList.length === 0 && (
                    <div className="text-center py-20">
                      <SlidersHorizontal size={48} className="text-zinc-700 mx-auto mb-4" />
                      <p className="text-zinc-600 font-bold">Sem parâmetros configurados.</p>
                      <p className="text-zinc-700 text-sm mt-1">Clique em "Novo Parâmetro" para adicionar.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* Modal Criar Cupom */}
      <AnimatePresence>
        {isCreateCouponModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
                <motion.div initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.9}} className="bg-zinc-950 border border-zinc-800 w-full max-w-lg rounded-[3rem] p-12 relative shadow-2xl">
                    <button onClick={() => setIsCreateCouponModalOpen(false)} className="absolute top-10 right-10 p-3 bg-zinc-900 rounded-2xl text-zinc-500 hover:text-white border border-zinc-800 transition-colors"> <X size={20} /> </button>
                    <h3 className="text-3xl font-black text-white mb-10 flex items-center gap-4"> <div className="p-3 bg-primary/20 text-primary rounded-2xl"> <Ticket size={32} /> </div> Novo Cupom </h3>

                    <form onSubmit={handleCreateCoupon} className="flex flex-col gap-8">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-3 block">Código</label>
                                <input placeholder="EX: OTALEX20" value={newCouponCode} onChange={e => setNewCouponCode(e.target.value.toUpperCase())} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-primary shadow-inner" required />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-3 block">Tipo</label>
                                <select value={newCouponType} onChange={e => setNewCouponType(e.target.value as any)} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-primary appearance-none cursor-pointer">
                                    <option value="percentage">Porcentagem (%)</option>
                                    <option value="fixed">Valor Fixo (R$)</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-3 block">Valor Desconto</label>
                                <div className="relative">
                                    <input type="number" step="0.01" value={newCouponValue} onChange={e => setNewCouponValue(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-primary shadow-inner pl-14" required />
                                    {newCouponType === 'percentage' ? <Percent className="absolute left-6 top-1/2 -translate-y-1/2 text-primary" size={20} /> : <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-green-500" size={20} />}
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-3 block">Limites de Uso (0=∞)</label>
                                <input type="number" value={newCouponMaxUses} onChange={e => setNewCouponMaxUses(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-primary shadow-inner" />
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-3 block">Restringir a Plano (Opcional)</label>
                            <select value={newCouponPlanId} onChange={e => setNewCouponPlanId(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-primary appearance-none cursor-pointer">
                                <option value="">Válido para Todos</option>
                                {plansList.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>

                        <button type="submit" disabled={creatingCoupon} className="w-full bg-white text-black py-6 rounded-[2rem] font-black uppercase tracking-tighter text-lg shadow-2xl hover:bg-zinc-200 transition-all active:scale-95 flex items-center justify-center gap-3"> {creatingCoupon ? <Loader2 className="animate-spin" size={24} /> : "Criar Cupom"} </button>
                    </form>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      {/* Modal Criar Prompt */}
      <AnimatePresence>
        {isCreatePromptModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
            <motion.div initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.9}} className="bg-zinc-950 border border-zinc-800 w-full max-w-2xl rounded-[3rem] p-12 relative shadow-2xl">
              <button onClick={() => setIsCreatePromptModalOpen(false)} className="absolute top-10 right-10 p-3 bg-zinc-900 rounded-2xl text-zinc-500 hover:text-white border border-zinc-800 transition-colors"><X size={20} /></button>
              <h3 className="text-3xl font-black text-white mb-10 flex items-center gap-4">
                <div className="p-3 bg-primary/20 text-primary rounded-2xl"><MessageSquare size={32} /></div>
                Novo Prompt
              </h3>

              <form onSubmit={handleCreatePrompt} className="flex flex-col gap-8">
                <div>
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-3 block">Nome / Identificador</label>
                  <input
                    placeholder="Ex: parallax_v2"
                    value={newPromptNome}
                    onChange={e => setNewPromptNome(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-primary shadow-inner"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-3 block">Texto do Prompt</label>
                  <textarea
                    placeholder="Digite as instruções que serão enviadas à API de IA..."
                    value={newPromptTexto}
                    onChange={e => setNewPromptTexto(e.target.value)}
                    rows={8}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-5 text-white font-mono text-sm outline-none focus:border-primary resize-none shadow-inner leading-relaxed"
                    required
                  />
                </div>
                <button type="submit" disabled={creatingPrompt} className="w-full bg-white text-black py-6 rounded-[2rem] font-black uppercase tracking-tighter text-lg shadow-2xl hover:bg-zinc-200 transition-all active:scale-95 flex items-center justify-center gap-3">
                  {creatingPrompt ? <Loader2 className="animate-spin" size={24} /> : "Criar Prompt"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Criar Parâmetro */}
      <AnimatePresence>
        {isCreateParamModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
            <motion.div initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.9}} className="bg-zinc-950 border border-zinc-800 w-full max-w-lg rounded-[3rem] p-12 relative shadow-2xl">
              <button onClick={() => setIsCreateParamModalOpen(false)} className="absolute top-10 right-10 p-3 bg-zinc-900 rounded-2xl text-zinc-500 hover:text-white border border-zinc-800 transition-colors"><X size={20} /></button>
              <h3 className="text-3xl font-black text-white mb-10 flex items-center gap-4">
                <div className="p-3 bg-primary/20 text-primary rounded-2xl"><SlidersHorizontal size={32} /></div>
                Novo Parâmetro
              </h3>

              <form onSubmit={handleCreateParam} className="flex flex-col gap-6">
                <div>
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-3 block">Chave (identificador único)</label>
                  <input
                    placeholder="Ex: versao_atual, link_download"
                    value={newParamChave}
                    onChange={e => setNewParamChave(e.target.value.toLowerCase().replace(/ /g, '_'))}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-white font-mono font-bold outline-none focus:border-primary shadow-inner"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-3 block">Valor</label>
                  <input
                    placeholder="Ex: 1.0.0 ou https://..."
                    value={newParamValor}
                    onChange={e => setNewParamValor(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-white font-mono font-bold outline-none focus:border-primary shadow-inner"
                    required
                  />
                </div>
                <button type="submit" disabled={creatingParam} className="w-full bg-white text-black py-6 rounded-[2rem] font-black uppercase tracking-tighter text-lg shadow-2xl hover:bg-zinc-200 transition-all active:scale-95 flex items-center justify-center gap-3">
                  {creatingParam ? <Loader2 className="animate-spin" size={24} /> : "Criar Parâmetro"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
