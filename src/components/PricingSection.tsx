import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Coins, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function PricingSection() {
  const [customCoins, setCustomCoins] = useState(1000);
  const [buying, setBuying] = useState(false);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  const fetchPlans = async () => {
    try {
      const apiUrl = import.meta.env.PROD 
        ? 'https://agapesi.ddns.com.br/teste/api/admin.php' 
        : 'http://localhost/otalex/api/admin.php';

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get_plans' })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setPlans(data.plans || []);
      }
    } catch (err) {
      console.error("Erro ao buscar planos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handlePurchase = async (plan: any) => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    setBuying(true);
    try {
      const apiUrl = import.meta.env.PROD 
        ? 'https://agapesi.ddns.com.br/teste/api/dashboard.php' 
        : 'http://localhost/otalex/api/dashboard.php';

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'buy_package', 
          user_id: user.id,
          plan_name: plan.name,
          otacoins: plan.otacoins,
          amount: plan.price || plan.amount
        })
      });

      const data = await res.json();
      
      if (data.status === 'success') {
        navigate('/success', { state: { licenseKey: data.key } });
      } else {
        alert("Erro ao processar compra: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Erro de conexão ao processar compra.");
    } finally {
      setBuying(false);
    }
  };
  
  const handleCoinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomCoins(Number(e.target.value));
  };
  
  const customPrice = customCoins * 0.30;

  if (loading) {
    return (
      <div className="w-full py-32 flex items-center justify-center">
        <Loader2 className="animate-spin text-primary w-12 h-12" />
      </div>
    );
  }

  return (
    <section id="pricing" className="w-full py-32 container mx-auto px-6 md:px-12 relative">
      
      <div className="text-center mb-20">
        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-zinc-100">
          Adquira suas Otacoins
        </h2>
        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
          Compre o pacote que melhor atende à sua necessidade. Receba na hora uma <span className="text-primary font-semibold text-glow">License Key</span> para gerar suas cenas em 3D.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
        {plans.map((plan, index) => {
          const isCenter = index === 1; // Mantém o destaque visual no segundo item por padrão visual
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative rounded-3xl p-8 flex flex-col ${
                isCenter 
                  ? 'bg-zinc-900 border-2 border-primary shadow-[0_0_30px_rgba(139,92,246,0.15)] md:-translate-y-4' 
                  : 'glass-card'
              }`}
            >
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-zinc-100 mb-2">{plan.name}</h3>
                <p className="text-zinc-400 text-sm h-10">{plan.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-zinc-400 font-medium">R$</span>
                  <span className="text-5xl font-black text-zinc-100">
                    {parseFloat(plan.price).toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <div className="text-primary/80 font-medium text-sm mt-2">
                   R$ {(parseFloat(plan.price) / plan.otacoins).toFixed(2).replace('.', ',')} cada
                </div>
              </div>

              <div className="mb-8 p-3 rounded-xl bg-zinc-950/50 border border-zinc-800 flex items-center justify-center gap-2 text-zinc-200 font-semibold shadow-inner">
                <Coins size={18} className="text-secondary" />
                <span>{plan.otacoins} Otacoins</span>
              </div>

              <ul className="mb-10 flex-grow space-y-4">
                <li className="flex items-start gap-3 text-sm text-zinc-300">
                  <Check size={18} className="text-primary shrink-0" />
                  <span>Acesso completo ao Plugin</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-zinc-300">
                  <Check size={18} className="text-primary shrink-0" />
                  <span>Alta Resolução (4K)</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-zinc-300">
                  <Check size={18} className="text-primary shrink-0" />
                  <span>Duração vitalícia</span>
                </li>
              </ul>

              <button 
                onClick={() => handlePurchase(plan)}
                disabled={buying}
                className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                  isCenter
                    ? 'bg-primary hover:bg-primary-hover text-white shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)]'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {buying ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} className={isCenter ? "text-white" : "text-primary"} />}
                Comprar Pacote
              </button>
              
            </motion.div>
          );
        })}
      </div>

      {/* Custom Option Area */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="max-w-4xl mx-auto glass-card flex flex-col md:flex-row items-center gap-10 p-10 rounded-[2rem] border-primary/20 relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 group-hover:from-primary/10 group-hover:to-secondary/10 transition-colors" />
        
        <div className="w-full md:w-1/2 relative z-10 text-center md:text-left">
          <h3 className="text-2xl font-bold text-zinc-100 mb-3">Opção Customizada</h3>
          <p className="text-zinc-400">Quer mais? Compre a quantidade exata de Otacoins que precisa para os seus projetos.</p>
        </div>

        <div className="w-full md:w-1/2 relative z-10 flex flex-col gap-6">
          <div className="bg-zinc-950/80 rounded-2xl p-6 border border-zinc-800">
            <div className="flex justify-between items-center mb-6">
              <span className="text-zinc-400 font-medium">Quantidade:</span>
              <div className="flex items-center gap-3 bg-zinc-900 px-4 py-2 rounded-lg border border-zinc-800">
                <Coins size={16} className="text-secondary" />
                <span className="text-xl font-bold text-zinc-100">{customCoins}</span>
              </div>
            </div>

            <input 
              type="range" 
              min="500" 
              max="10000" 
              step="100"
              value={customCoins} 
              onChange={handleCoinChange}
              className="w-full accent-primary h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer mb-6"
            />
            
            <div className="flex justify-between items-end border-t border-zinc-800/60 pt-6">
              <div>
                <span className="block text-sm text-zinc-500 mb-1">Valor Total (R$ 0,30 / moeda)</span>
                <span className="text-3xl font-black text-zinc-100 flex items-center gap-1">
                  <span className="text-xl text-zinc-500 font-medium">R$</span>
                  {customPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <button 
                disabled={buying}
                onClick={() => handlePurchase({ name: 'Pacote Custom', amount: customPrice, otacoins: customCoins })}
                className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-primary/50 flex items-center gap-2 disabled:opacity-50"
              >
                {buying ? <Loader2 size={16} className="animate-spin" /> : <>Comprar <Zap size={16} /></>}
              </button>
            </div>
          </div>
        </div>
      </motion.div>

    </section>
  );
}
