import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, CheckCircle, Clock, Image as ImageIcon, Edit2, Loader2, Download, Tag, Lock, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

export function UserDashboard() {
  const { user, login } = useAuth();
  const { success, error } = useToast();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<{
    transactions: any[],
    projects: any[]
  }>({ transactions: [], projects: [] });
  const [pluginParams, setPluginParams] = useState<Record<string, string>>({});

  // Senha States
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);



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

  useEffect(() => {
    async function loadPluginParams() {
      try {
        const apiUrl = import.meta.env.PROD
          ? 'https://agapesi.ddns.com.br/teste/api/plugin.php'
          : 'http://localhost/otalex/api/plugin.php';
        const res = await fetch(apiUrl);
        const data = await res.json();
        if (data.status === 'success') setPluginParams(data.params || {});
      } catch (err) {
        console.error('Erro ao carregar params do plugin:', err);
      }
    }
    loadPluginParams();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary w-12 h-12" />
      </div>
    );
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      error("As novas senhas não coincidem!");
      return;
    }
    setChangingPassword(true);
    try {
      const apiUrl = import.meta.env.PROD 
        ? 'https://agapesi.ddns.com.br/teste/api/auth.php' 
        : 'http://localhost/otalex/api/auth.php';

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
           action: 'change_password', 
           user_id: user?.id, 
           current_password: currentPassword, 
           new_password: newPassword 
        })
      });
      const data = await res.json();
      if (data.status === 'success') {
         success(data.message);
         setIsPasswordModalOpen(false);
         setCurrentPassword('');
         setNewPassword('');
         setConfirmNewPassword('');
      } else {
         error(data.message || "Erro ao alterar senha.");
      }
    } catch (err) { 
         error("Erro de conexão ao alterar senha.");
    } finally { 
      setChangingPassword(false); 
    }
  }



  // Converte links do Google Drive para download direto
  // Suporta formatos: /file/d/ID/view e drive.google.com/open?id=ID
  function convertDriveLink(url: string): string {
    const matchFile = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (matchFile) return `https://drive.google.com/uc?export=download&id=${matchFile[1]}`;
    const matchOpen = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (matchOpen) return `https://drive.google.com/uc?export=download&id=${matchOpen[1]}`;
    return url; // Retorna o URL original se não for do Drive
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

        {/* Card de Download do Plugin */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2"
        >
          <div className="relative overflow-hidden rounded-[2rem] border border-primary/30 bg-gradient-to-br from-primary/10 via-zinc-900 to-zinc-950 p-8 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-primary/5">
            {/* Glow decorativo */}
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center gap-6 relative z-10">
              <div className="p-5 rounded-[1.5rem] bg-primary/20 text-primary shadow-xl shadow-primary/20">
                <Download size={32} />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-2xl font-black text-white">Otalex Plugin</h2>
                  {pluginParams.versao_atual && (
                    <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest bg-primary/20 text-primary px-3 py-1 rounded-full border border-primary/30">
                      <Tag size={10} />
                      v{pluginParams.versao_atual}
                    </span>
                  )}
                </div>
                <p className="text-zinc-400 text-sm">Baixe o plugin para After Effects e ative com sua license key.</p>
              </div>
            </div>

            <div className="flex items-center gap-4 relative z-10 flex-shrink-0">
              {pluginParams.link_download ? (
                <a
                  href={convertDriveLink(pluginParams.link_download)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-[1.5rem] font-black uppercase text-sm tracking-widest shadow-xl shadow-primary/30 transition-all active:scale-95 group"
                >
                  <Download size={18} className="group-hover:-translate-y-0.5 transition-transform" />
                  Baixar Plugin
                </a>
              ) : (
                <div className="flex items-center gap-2 text-zinc-600 text-sm">
                  <Loader2 size={16} className="animate-spin" />
                  Carregando link...
                </div>
              )}
            </div>
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

      {/* Segurança da Conta */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-12 flex flex-col gap-6"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-orange-500/20 text-orange-400">
            <Lock size={24} />
          </div>
          <h2 className="text-2xl font-semibold text-zinc-100">Segurança da Conta</h2>
        </div>
        <div className="glass-card border border-zinc-800 overflow-hidden p-8">
           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                 <h3 className="font-bold text-xl text-white mb-1">E-mail e Senha de Acesso</h3>
                 <p className="text-sm text-zinc-400">Atualize a senha mestre que você usa para fazer login na Plataforma Otalex.</p>
              </div>
              <button 
                onClick={() => setIsPasswordModalOpen(true)}
                className="bg-zinc-800 hover:bg-zinc-700 text-white px-8 py-4 rounded-xl font-bold transition-all active:scale-95 flex items-center gap-2 whitespace-nowrap"
              >
                 <Lock size={18} /> Trocar Minha Senha
              </button>
           </div>
        </div>
      </motion.div>
      
      {/* Modal Mudar Senha */}
      <AnimatePresence>
        {isPasswordModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
             <motion.div initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.9}} className="bg-zinc-950 border border-zinc-800 w-full max-w-md rounded-[3rem] p-10 relative shadow-2xl">
                <button onClick={() => setIsPasswordModalOpen(false)} className="absolute top-8 right-8 p-3 bg-zinc-900 rounded-2xl text-zinc-500 hover:text-white border border-zinc-800 transition-colors"> <X size={20} /> </button>
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-orange-500/20 text-orange-400 rounded-2xl"> <Lock size={24} /> </div>
                  <h3 className="text-2xl font-bold text-white tracking-tighter">Trocar Senha</h3>
                </div>

                <form onSubmit={handleChangePassword} className="flex flex-col gap-6">
                   <div>
                       <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 block">Senha Atual</label>
                       <input type="password" placeholder="••••••••" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 text-white font-medium outline-none focus:border-primary shadow-inner" required />
                   </div>
                   <div>
                       <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 block">Nova Senha</label>
                       <input type="password" placeholder="••••••••" value={newPassword} onChange={e => setNewPassword(e.target.value)} minLength={6} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 text-white font-medium outline-none focus:border-primary shadow-inner" required />
                   </div>
                   <div>
                       <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 block">Confirmar Nova Senha</label>
                       <input type="password" placeholder="••••••••" value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} minLength={6} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 text-white font-medium outline-none focus:border-primary shadow-inner" required />
                   </div>
                   <button type="submit" disabled={changingPassword} className="w-full mt-4 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white py-5 rounded-[2rem] font-black uppercase tracking-tighter flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-primary/20"> 
                     {changingPassword ? <Loader2 className="animate-spin" size={20} /> : "Atualizar Senha"} 
                   </button>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>



    </div>
  );
}
