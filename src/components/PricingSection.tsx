import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Coins, Loader2, ShoppingCart, Trash2, X, ArrowRight, ChevronDown, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';

export function PricingSection() {
  const [customCoins, setCustomCoins] = useState(10);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  
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

  // Calcula o preço por moeda com base em camadas derivadas dos planos
  const getPricePerCoin = (quantity: number): number => {
    const sorted = [...plans]
      .filter(p => Number(p.otacoins) > 0 && Number(p.price) > 0)
      .sort((a, b) => Number(a.otacoins) - Number(b.otacoins));

    if (sorted.length === 0) return 0.05; // fallback: R$0.05/moeda

    const smallestPlan = sorted[0];
    const smallestRate = parseFloat(smallestPlan.price) / Number(smallestPlan.otacoins);
    // Abaixo do menor plano: 30% mais caro por moeda
    const microRate = smallestRate * 1.3;

    // Verifica se bate exatamente em algum plano
    let matched = null;
    for (let i = sorted.length - 1; i >= 0; i--) {
      if (quantity >= Number(sorted[i].otacoins)) {
        matched = sorted[i];
        break;
      }
    }
    if (matched) return parseFloat(matched.price) / Number(matched.otacoins);

    // Interpola entre microRate e o menor plano
    const ratio = quantity / Number(smallestPlan.otacoins);
    return microRate - (microRate - smallestRate) * ratio;
  };

  const pricePerCoin = getPricePerCoin(customCoins);
  const customPrice = parseFloat((customCoins * pricePerCoin).toFixed(2));
  const customBelowMin = customPrice < 0.50;

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

        {/* Custom Option — Collapsível */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          {/* Toggle Button */}
          <button
            onClick={() => setShowCustom(v => !v)}
            className="w-full glass-card border border-zinc-800 hover:border-primary/40 rounded-[2rem] p-6 flex items-center justify-between group transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Coins size={22} className="text-primary" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-bold text-zinc-100">Quantidade Customizada</h3>
                <p className="text-zinc-500 text-sm">Escolha exatamente quantas Otacoins você quer</p>
              </div>
            </div>
            <motion.div animate={{ rotate: showCustom ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <ChevronDown size={22} className="text-zinc-400 group-hover:text-primary transition-colors" />
            </motion.div>
          </button>

          {/* Painel customizável */}
          <AnimatePresence>
            {showCustom && (
              <motion.div
                key="custom-panel"
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="glass-card rounded-[2rem] border border-zinc-800 p-8 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />

                  <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center">

                    {/* Coluna esquerda: input + slider */}
                    <div className="w-full md:w-1/2 flex flex-col gap-6">
                      <div>
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3 block">Quantidade de Otacoins</label>
                        <div className="flex items-center gap-3 bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 focus-within:border-primary transition-colors">
                          <Coins size={18} className="text-secondary shrink-0" />
                          <input
                            type="number"
                            min={1}
                            max={100000}
                            value={customCoins}
                            onChange={e => setCustomCoins(Math.max(1, parseInt(e.target.value) || 1))}
                            className="bg-transparent text-2xl font-black text-white w-full outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <span className="text-zinc-600 text-sm font-bold shrink-0">coins</span>
                        </div>
                      </div>

                      <div>
                        <input
                          type="range"
                          min={1}
                          max={10000}
                          step={1}
                          value={customCoins}
                          onChange={e => setCustomCoins(Number(e.target.value))}
                          className="w-full accent-primary h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-zinc-600 font-bold mt-1">
                          <span>1</span>
                          <span>10.000</span>
                        </div>
                      </div>
                    </div>

                    {/* Coluna direita: resumo de preço */}
                    <div className="w-full md:w-1/2 bg-zinc-950/80 rounded-2xl border border-zinc-800 p-6 flex flex-col gap-4">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-zinc-500 font-medium">Preço por moeda</span>
                        <span className="text-primary font-bold font-mono">
                          R$ {pricePerCoin.toFixed(4).replace('.', ',')}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-zinc-500 font-medium">Quantidade</span>
                        <span className="text-zinc-200 font-bold">{customCoins.toLocaleString('pt-BR')} coins</span>
                      </div>
                      <div className="border-t border-zinc-800 pt-4 flex justify-between items-end">
                        <span className="text-zinc-500 text-xs font-black uppercase tracking-widest">Total</span>
                        <span className={`text-3xl font-black leading-none ${
                          customBelowMin ? 'text-red-400' : 'text-white'
                        }`}>
                          R$ {customPrice.toFixed(2).replace('.', ',')}
                        </span>
                      </div>

                      {/* Aviso de valor mínimo */}
                      {customBelowMin && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-xs text-red-400 font-medium"
                        >
                          <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                          <span>O valor mínimo para pagamento é <strong>R$ 0,50</strong>. Adicione mais {Math.ceil(0.50 / pricePerCoin) - customCoins + 1} moedas para continuar.</span>
                        </motion.div>
                      )}

                      <button
                        disabled={customBelowMin}
                        onClick={() => {
                          addToCart({ id: 999, name: `Pacote Custom (${customCoins.toLocaleString('pt-BR')} coins)`, price: customPrice, otacoins: customCoins });
                          setIsCartOpen(true);
                        }}
                        className="w-full bg-primary hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-primary/50 flex items-center justify-center gap-2 active:scale-95"
                      >
                        <ShoppingCart size={18} /> Adicionar ao Carrinho
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}

function CartDrawer({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { items, removeFromCart, subtotal, total, clearCart, applyCoupon, coupon } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { success, error, info } = useToast();
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

  const handleApplyCoupon = async () => {
    const result = await applyCoupon(couponInput);
    if (result.success) {
      success('Cupom aplicado com sucesso!');
      setCouponInput('');
    } else {
      error(result.message || 'Cupom inválido.');
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

      // Somente cupom de 100% bypassa o Mercado Pago
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

      // Mercado Pago não aceita valores abaixo de R$ 0,50:
      // se o desconto baixou o valor mas não zerou, cobra o mínimo de R$ 0,50 e avisa
      const effectiveTotal = (total > 0 && total < 0.50) ? 0.50 : total;
      if (total > 0 && total < 0.50) {
        info('O valor mínimo é R$ 0,50. Seu pagamento será cobrado nesse valor mínimo.', 6000);
        // aguarda um momento para o usuário ler o aviso
        await new Promise(r => setTimeout(r, 1500));
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
            price: effectiveTotal,
            otacoins: planToBuy.otacoins
          }
        })
      });

      const data = await res.json();
      if (data.status === 'success' && data.init_point) {
        window.location.href = data.init_point;
      } else {
        error('Erro ao gerar pagamento: ' + (data.message || 'Erro desconhecido'));
      }
    } catch (err) {
      console.error(err);
      error('Erro ao conectar com o servidor de pagamento.');
    } finally {
      setBuying(false);
    }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999999]">
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
            className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-zinc-950 border-l border-zinc-800 shadow-2xl flex flex-col"
            style={{ willChange: 'transform' }}
          >
            {/* Header fixo — sempre visível no topo mesmo no mobile */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-zinc-800 shrink-0 bg-zinc-950">
              <h3 className="text-xl font-black text-white flex items-center gap-3">
                <ShoppingCart className="text-primary" size={24} /> Carrinho
              </h3>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-zinc-800 rounded-xl transition-colors text-zinc-400 hover:text-white active:scale-90"
                aria-label="Fechar carrinho"
              >
                <X size={26} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto space-y-4 px-6 py-5 custom-scrollbar">
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
                        className="p-3 text-zinc-600 hover:text-red-400 md:opacity-0 md:group-hover:opacity-100 opacity-100 transition-all hover:scale-110"
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
              <div className="px-6 pb-6 pt-5 border-t border-zinc-800 flex flex-col gap-5 shrink-0 bg-zinc-950">
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest opacity-40">
                    <span>Subtotal</span>
                    <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                  </div>
                  {coupon && (
                    <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-green-500">
                      <span>Desconto ({coupon.type === 'percentage' ? `${(coupon.discount * 100).toFixed(0)}%` : 'fixo'})</span>
                      <span>- R$ {(subtotal - total).toFixed(2).replace('.', ',')}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-end mt-1 pt-3 border-t border-zinc-900">
                    <span className="text-zinc-500 font-black uppercase tracking-widest text-[10px]">Total</span>
                    <span className="text-4xl font-black text-white leading-none">R$ {total.toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>
                
                <button 
                  onClick={handleCheckout}
                  disabled={buying}
                  className="w-full bg-white text-black hover:bg-zinc-200 py-5 rounded-[2rem] font-black uppercase tracking-tighter text-lg flex justify-center items-center gap-3 shadow-[0_15px_40px_rgba(255,255,255,0.1)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                >
                  {buying ? <Loader2 className="animate-spin" size={24} /> : <>{total === 0 ? 'Resgatar Agora' : 'Finalizar Compra'} <ArrowRight size={24} /></>}
                </button>

                <button 
                  onClick={clearCart}
                  className="text-[10px] font-black text-zinc-600 hover:text-zinc-400 uppercase tracking-[0.2em] transition-colors w-fit mx-auto"
                >
                  Limpar Carrinho
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
