import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Coins } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function PricingSection() {
  const [customCoins, setCustomCoins] = useState(1000);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const handlePurchase = () => {
    if (!isAuthenticated) {
      navigate('/auth');
    } else {
      navigate('/success');
    }
  };
  
  const handleCoinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomCoins(Number(e.target.value));
  };
  
  const customPrice = customCoins * 0.30;

  const plans = [
    {
      name: "Pacote Nizi",
      description: "Ideal para testar o plugin",
      price: "10,00",
      credits: "20 Otacoins",
      unitPrice: "R$ 0,50 cada",
      features: [
        "Acesso completo ao Plugin",
        "Alta Resolução (4K)",
        "Duração vitalícia",
      ],
      cta: "Comprar Pacote",
      popular: false,
    },
    {
      name: "Pacote Mirt",
      description: "O mais escolhido por custo benefício",
      price: "40,00",
      credits: "100 Otacoins",
      unitPrice: "R$ 0,40 cada (20% OFF)",
      features: [
        "Acesso completo ao Plugin",
        "Alta Resolução (4K)",
        "Duração vitalícia",
        "Suporte Prioritário",
      ],
      cta: "Comprar Pacote",
      popular: true,
      accent: true,
    },
    {
      name: "Pacote Nescoh",
      description: "Para não ter dor de cabeça por muito tempo",
      price: "150,00",
      credits: "500 Otacoins",
      unitPrice: "R$ 0,30 cada (40% OFF)",
      features: [
        "Acesso completo ao Plugin",
        "Alta Resolução (4K)",
        "Duração vitalícia",
        "Suporte Prioritário VIP",
      ],
      cta: "Comprar Pacote",
      popular: false,
    }
  ];

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
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`relative rounded-3xl p-8 flex flex-col ${
              plan.popular 
                ? 'bg-zinc-900 border-2 border-primary shadow-[0_0_30px_rgba(139,92,246,0.15)] md:-translate-y-4' 
                : 'glass-card'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold uppercase tracking-wider py-1 px-4 rounded-full whitespace-nowrap">
                Mais Popular
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-2xl font-bold text-zinc-100 mb-2">{plan.name}</h3>
              <p className="text-zinc-400 text-sm h-10">{plan.description}</p>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-zinc-400 font-medium">R$</span>
                <span className="text-5xl font-black text-zinc-100">{plan.price}</span>
              </div>
              <div className="text-primary/80 font-medium text-sm mt-2">{plan.unitPrice}</div>
            </div>

            <div className="mb-8 p-3 rounded-xl bg-zinc-950/50 border border-zinc-800 flex items-center justify-center gap-2 text-zinc-200 font-semibold shadow-inner">
              <Coins size={18} className="text-secondary" />
              <span>{plan.credits}</span>
            </div>

            <ul className="mb-10 flex-grow space-y-4">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
                  <Check size={18} className="text-primary shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button 
              onClick={handlePurchase}
              className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                plan.accent
                  ? 'bg-primary hover:bg-primary-hover text-white shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)]'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
              }`}
            >
              <Zap size={18} className={plan.accent ? "text-white" : "text-primary"} />
              {plan.cta}
            </button>
            
          </motion.div>
        ))}
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
                onClick={handlePurchase}
                className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-primary/50 flex items-center gap-2"
              >
                Comprar <Zap size={16} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

    </section>
  );
}
