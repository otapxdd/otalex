import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, DollarSign, Key, BarChart3, Plus, Search, X, Zap, PowerOff, CheckCircle2, Loader2, Coins, Edit3, Save, Ticket, Trash2, Calendar, Percent } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';

export function AdminPage() {
  const { success, warning } = useToast();
  const [activeTab, setActiveTab] = useState<'overview' | 'keys' | 'users' | 'sales' | 'plans' | 'coupons'>('overview');
  const [isCreateKeyModalOpen, setIsCreateKeyModalOpen] = useState(false);
  const [isCreateCouponModalOpen, setIsCreateCouponModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Data State
  const [stats, setStats] = useState<any[]>([]);
  const [licenses, setLicenses] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [salesList, setSalesList] = useState<any[]>([]);
  const [plansList, setPlansList] = useState<any[]>([]);
  const [couponsList, setCouponsList] = useState<any[]>([]);
  
  // Form State para Nova Key
  const [newKeyPlan, setNewKeyPlan] = useState('Personalizado');
  const [newKeyCredits, setNewKeyCredits] = useState<number>(50);
  const [creatingKey, setCreatingKey] = useState(false);

  // Form State para Novo Cupom
  const [newCouponCode, setNewCouponCode] = useState("");
  const [newCouponType, setNewCouponType] = useState<"percentage" | "fixed">("percentage");
  const [newCouponValue, setNewCouponValue] = useState("");
  const [newCouponPlanId, setNewCouponPlanId] = useState("");
  const [newCouponMaxUses, setNewCouponMaxUses] = useState("0");
  const [newCouponExpiry, setNewCouponExpiry] = useState("");
  const [creatingCoupon, setCreatingCoupon] = useState(false);

  // Edit Plans State
  const [editingPlanId, setEditingPlanId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editCoins, setEditCoins] = useState("");

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
        setLicenses(lists.keys || []);
        setUsersList(lists.users || []);
        setSalesList(lists.sales || []);
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
          expires_at: newCouponExpiry || null,
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
        body: JSON.stringify({ action: 'create_key', plan_name: newKeyPlan, credits: newKeyCredits })
      });
      if ((await res.json()).status === 'success') {
        setIsCreateKeyModalOpen(false);
        fetchAdminData();
      }
    } catch (err) { console.error(err); }
    finally { setCreatingKey(false); }
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
            { id: 'coupons', label: 'Cupons', icon: Ticket }
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

    </div>
  );
}
