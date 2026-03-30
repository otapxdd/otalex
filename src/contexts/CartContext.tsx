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
  applyCoupon: (code: string) => boolean;
  coupon: { code: string; discount: number } | null;
  total: number;
  subtotal: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState<{ code: string; discount: number } | null>(null);

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

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'TOTALEX100') {
      setCoupon({ code: cleanCode, discount: 1.0 }); // 100%
      return true;
    }
    return false;
  };

  const subtotal = items.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
  const discountAmount = coupon ? subtotal * coupon.discount : 0;
  const total = subtotal - discountAmount;
  const itemCount = items.reduce((acc, curr) => acc + curr.quantity, 0);

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
