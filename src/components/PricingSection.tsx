import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Coins, Loader2, ShoppingCart, Trash2, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

export function PricingSection() {
  const [customCoins, setCustomCoins] = useState(1000);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const { addToCart, itemCount } = useCart();
  
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
    <>
      <section id="pricing" className="w-full py-32 container mx-auto px-6 md:px-12 relative z-10">
        
        {/* Carrinho Flutuante */}
        <div className="fixed bottom-8 right-8 z-[100]">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="bg-primary hover:bg-primary-hover text-white p-4 rounded-2xl shadow-[0_10px_30px_rgba(139,92,246,0.4)] flex items-center gap-3 transition-all hover:scale-110 active:scale-95 group border border-primary/20"
          >
            <div className="relative">
               <ShoppingCart size={24} />
               {itemCount > 0 && (
                 <span className="absolute -top-2 -right-2 bg-secondary text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-primary animate-bounce">
                   {itemCount}
                 </span>
               )}
            </div>
            <span className="font-bold text-sm hidden md:block">Meu Carrinho</span>
          </button>
        </div>

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
            const isCenter = index === 1;
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
                </ul>

                <button 
                  onClick={() => {
                    addToCart(plan);
                    setIsCartOpen(true);
                  }}
                  className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                    isCenter
                      ? 'bg-primary hover:bg-primary-hover text-white shadow-[0_0_20px_rgba(139,92,246,0.4)]'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
                  }`}
                >
                  <ShoppingCart size={18} className={isCenter ? "text-white" : "text-primary"} />
                  Adicionar ao Carrinho
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
            <h3 className="text-2xl font-bold text-zinc-100 mb-3">Opção Comum</h3>
            <p className="text-zinc-400">Quer mais? Compre a quantidade exata de Otacoins que precisa.</p>
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
                  <span className="block text-sm text-zinc-500 mb-1">Total (R$ 0,30 / unid)</span>
                  <span className="text-3xl font-black text-zinc-100 flex items-center gap-1">
                    <span className="text-xl text-zinc-500 font-medium">R$</span>
                    {customPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <button 
                  onClick={() => {
                    addToCart({ id: 999, name: 'Pacote Custom', price: customPrice, otacoins: customCoins });
                    setIsCartOpen(true);
                  }}
                  className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-primary/50 flex items-center gap-2"
                >
                  Adicionar <ShoppingCart size={16} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}

function CartDrawer({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { items, removeFromCart, subtotal, total, itemCount, clearCart, applyCoupon, coupon } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState("");
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleApplyCoupon = () => {
    if (applyCoupon(couponInput)) {
      alert("Cupom aplicado!");
    } else {
      alert("Cupom inválido.");
    }
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      onClose();
      navigate('/auth');
      return;
    }

    if (items.length === 0) return;

    setBuying(true);
    try {
      const planToBuy = items[0]; 

      if (total === 0) {
        const apiUrl = import.meta.env.PROD 
          ? 'https://agapesi.ddns.com.br/teste/api/dashboard.php' 
          : 'http://localhost/otalex/api/dashboard.php';

        const res = await fetch(apiUrl, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ 
             action: 'buy_package', 
             user_id: user.id,
             plan_name: planToBuy.name,
             otacoins: planToBuy.otacoins,
             amount: 0
           })
        });

        const data = await res.json();
        if (data.status === 'success') {
           const key = data.key;
           clearCart();
           onClose();
           navigate('/success', { state: { licenseKey: key } });
           return;
        }
      }

      const apiUrl = import.meta.env.PROD 
        ? 'https://agapesi.ddns.com.br/teste/api/mercadopago.php' 
        : 'http://localhost/otalex/api/mercadopago.php';

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'create_preference', 
          user_id: user.id,
          email: user.email,
          plan: {
            name: planToBuy.name,
            price: total,
            otacoins: planToBuy.otacoins
          }
        })
      });

      const data = await res.json();
      if (data.status === 'success' && data.init_point) {
        window.location.href = data.init_point;
      } else {
        alert("Erro ao gerar pagamento: " + (data.message || "Erro desconhecido"));
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao conectar com servidor de pagamento.");
    } finally {
      setBuying(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99991]">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }}
            className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-zinc-950 border-l border-zinc-800 p-8 shadow-2xl flex flex-col"
            style={{ willChange: 'transform' }}
          >
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black text-white flex items-center gap-3">
                <ShoppingCart className="text-primary" size={28} /> Carrinho
              </h3>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-zinc-800 rounded-xl transition-colors text-zinc-500 hover:text-white"
              >
                <X size={28} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-4 opacity-40">
                  <ShoppingCart size={64} />
                  <p className="font-bold uppercase tracking-widest text-xs">Vazio</p>
                </div>
              ) : (
                <>
                  {items.map(item => (
                    <div key={item.id} className="bg-zinc-900 border border-zinc-800/50 p-5 rounded-3xl flex justify-between items-center group hover:border-primary/30 transition-colors">
                      <div>
                        <h4 className="font-bold text-white mb-1">{item.name}</h4>
                        <div className="flex items-center gap-4 text-xs font-medium">
                          <span className="text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-md font-mono">x{item.quantity}</span>
                          <span className="text-primary font-bold">R$ {item.price.toFixed(2)}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="p-3 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))}

                  <div className="mt-10 pt-6 border-t border-zinc-800/50">
                     <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3 block">Cupom de Desconto</label>
                     <div className="flex gap-2">
                        <input 
                          placeholder="DIGITE O CÓDIGO"
                          value={couponInput}
                          onChange={e => setCouponInput(e.target.value)}
                          className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 text-sm text-white focus:border-primary outline-none transition-all placeholder:text-zinc-700 font-bold"
                        />
                        <button 
                          onClick={handleApplyCoupon}
                          className="bg-primary hover:bg-primary-hover text-white px-6 rounded-2xl text-xs font-black uppercase tracking-wider transition-all active:scale-95"
                        >
                          Aplicar
                        </button>
                     </div>
                     {coupon && (
                       <motion.p 
                         initial={{ opacity: 0, scale: 0.9 }}
                         animate={{ opacity: 1, scale: 1 }}
                         className="text-green-400 text-[10px] font-black mt-3 flex items-center gap-1 uppercase tracking-widest bg-green-500/10 w-fit px-3 py-1 rounded-full border border-green-500/20"
                       >
                         <Check size={12} /> Cupom {coupon.code} ativado!
                       </motion.p>
                     )}
                  </div>
                </>
              )}
            </div>

            {items.length > 0 && (
              <div className="mt-8 pt-8 border-t border-zinc-800 flex flex-col gap-6">
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest opacity-40">
                    <span>Subtotal</span>
                    <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                  </div>
                  {coupon && (
                    <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-green-500">
                      <span>Desconto</span>
                      <span>- R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-end mt-2 pt-4 border-t border-zinc-900">
                    <span className="text-zinc-500 font-black uppercase tracking-widest text-[10px]">Total</span>
                    <span className="text-4xl font-black text-white leading-none">R$ {total.toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>
                
                <button 
                  onClick={handleCheckout}
                  disabled={buying}
                  className="w-full bg-white text-black hover:bg-zinc-200 py-6 rounded-[2rem] font-black uppercase tracking-tighter text-lg flex justify-center items-center gap-3 shadow-[0_15px_40px_rgba(255,255,255,0.1)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                >
                  {buying ? <Loader2 className="animate-spin" size={24} /> : <>{total === 0 ? 'Resgatar Agora' : 'Finalizar Compra'} <ArrowRight size={24} /></>}
                </button>

                <button 
                  onClick={clearCart}
                  className="text-[10px] font-black text-zinc-600 hover:text-zinc-400 uppercase tracking-[0.2em] transition-colors w-fit mx-auto mt-2"
                >
                  Limpar Carrinho
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
