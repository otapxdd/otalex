import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  otacoins: number;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: any) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => Promise<{ success: boolean; message?: string }>;
  coupon: { code: string; discount: number; type: 'percentage' | 'fixed' } | null;
  total: number;
  subtotal: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState<{ code: string; discount: number; type: 'percentage' | 'fixed' } | null>(null);

  useEffect(() => {
    const savedCart = localStorage.getItem('otalex_cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Erro ao carregar carrinho:", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('otalex_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: any) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { 
        id: product.id, 
        name: product.name, 
        price: parseFloat(product.price), 
        otacoins: product.otacoins,
        quantity: 1 
      }];
    });
  };

  const removeFromCart = (id: number) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
  };

  const applyCoupon = async (code: string): Promise<{ success: boolean; message?: string }> => {
    const cleanCode = code.trim().toUpperCase();
    
    try {
      const apiUrl = import.meta.env.PROD 
        ? 'https://agapesi.ddns.com.br/teste/api/mercadopago.php' 
        : 'http://localhost/otalex/api/mercadopago.php';

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'validate_coupon', code: cleanCode })
      });
      const data = await res.json();

      if (data.status === 'success') {
        const c = data.coupon;
        
        // Verifica se o cupom é restrito a um plano
        if (c.plan_id && items.length > 0) {
          const hasPlan = items.some((i: CartItem) => i.id === c.plan_id);
          if (!hasPlan) {
            return { success: false, message: 'Este cupom não é válido para os itens no seu carrinho.' };
          }
        }

        setCoupon({ 
          code: c.code, 
          discount: c.discount_type === 'percentage' ? c.discount_value / 100 : c.discount_value,
          type: c.discount_type
        });
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Cupom inválido.' };
      }
    } catch (err) {
      console.error(err);
      return { success: false, message: 'Erro ao validar cupom. Tente novamente.' };
    }
  };

  const subtotal = items.reduce((acc: number, curr: CartItem) => acc + (curr.price * curr.quantity), 0);
  let discountAmount = 0;
  if (coupon) {
    discountAmount = coupon.type === 'percentage' ? subtotal * coupon.discount : coupon.discount;
  }
  
  // Garantir precisão de 2 casas decimais para evitar erros de floating point
  const totalRaw = Math.max(0, subtotal - discountAmount);
  const total = parseFloat(totalRaw.toFixed(2));
  const itemCount = items.reduce((acc: number, curr: CartItem) => acc + curr.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, applyCoupon, coupon, total, subtotal, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
