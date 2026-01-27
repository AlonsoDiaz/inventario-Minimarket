import { createContext, useState, useEffect, useContext } from 'react';

const StoreContext = createContext();

export const useStore = () => useContext(StoreContext);

export const StoreProvider = ({ children }) => {
  // Initial Data
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : [
      { id: 1, barcode: '7801610001353', name: 'Coca Cola 2L', price: 2500, stock: 50, category: 'Bebidas' },
      { id: 2, barcode: '7802800533456', name: 'Papas Lays', price: 1500, stock: 30, category: 'Snacks' },
      { id: 3, barcode: '7801620005432', name: 'Agua Mineral 500ml', price: 800, stock: 100, category: 'Bebidas' },
    ];
  });

  const [cart, setCart] = useState([]);

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : [];
  });

  // Persistence
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Actions
  const addProduct = (product) => {
    setProducts([...products, { ...product, id: Date.now() }]);
  };

  const updateProductStock = (id, quantity) => {
    setProducts(products.map(p =>
      p.id === id ? { ...p, stock: p.stock - quantity } : p
    ));
  };

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateCartQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  const completeSale = (paymentMethod = 'Efectivo') => {
    if (cart.length === 0) return;

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const newTransaction = {
      id: Date.now(),
      date: new Date().toISOString(),
      items: cart,
      total: total,
      paymentMethod: paymentMethod // Saved 'Efectivo', 'Tarjeta', etc.
    };

    setTransactions([newTransaction, ...transactions]);

    // Update Stock
    cart.forEach(item => {
      updateProductStock(item.id, item.quantity);
    });

    clearCart();
  };

  return (
    <StoreContext.Provider value={{
      products,
      cart,
      transactions,
      addProduct,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      completeSale
    }}>
      {children}
    </StoreContext.Provider>
  );
};
