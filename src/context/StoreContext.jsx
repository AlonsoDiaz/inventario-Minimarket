import { createContext, useState, useEffect, useContext } from 'react';

const StoreContext = createContext();

export const useStore = () => useContext(StoreContext);

export const StoreProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [closures, setClosures] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:3001/api';

  // Load Data from Backend
  const fetchData = async () => {
    try {
      const [prodRes, transRes, closRes] = await Promise.all([
        fetch(`${API_URL}/products`),
        fetch(`${API_URL}/transactions`),
        fetch(`${API_URL}/closures`)
      ]);

      if (!prodRes.ok || !transRes.ok || !closRes.ok) throw new Error("Error fetching data");

      const prodData = await prodRes.json();
      const transData = await transRes.json();
      const closData = await closRes.json();

      setProducts(prodData);
      setTransactions(transData);
      setClosures(closData);
      setLoading(false);
    } catch (err) {
      console.error("Failed to load data:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Actions
  const addProduct = async (product) => {
    try {
      const res = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      if (res.ok) {
        const newProduct = await res.json();
        setProducts([...products, newProduct]);
      }
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };

  const deleteProduct = async (id) => {
    try {
      const res = await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(products.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  const updateProduct = async (id, updatedProduct) => {
    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct)
      });
      if (res.ok) {
        setProducts(products.map(p => p.id === id ? { ...p, ...updatedProduct } : p));
      }
    } catch (err) {
      console.error("Error updating product:", err);
    }
  };

  // Cart Actions (Client Side mainly, until sale)
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

  const completeSale = async (paymentMethod = 'Efectivo') => {
    if (cart.length === 0) return;

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const saleData = {
      total,
      paymentMethod,
      date: new Date().toISOString(),
      items: cart.map(item => ({
        id: item.id, // For stock update
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }))
    };

    try {
      const res = await fetch(`${API_URL}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saleData)
      });

      if (res.ok) {
        const completedTransaction = await res.json();
        setTransactions([completedTransaction, ...transactions]);

        // Refetch products to get updated stock
        const prodRes = await fetch(`${API_URL}/products`);
        const prodData = await prodRes.json();
        setProducts(prodData);

        clearCart();
        return completedTransaction;
      }
    } catch (err) {
      console.error("Error processing sale:", err);
      alert("Error procesando venta. Ver consola.");
    }
    return null;
  };

  const saveClosure = async (closureData) => {
    try {
      const res = await fetch(`${API_URL}/closures`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(closureData)
      });
      if (res.ok) {
        const newClosure = await res.json();
        setClosures(prev => {
          const exists = prev.find(c => c.date === newClosure.date);
          if (exists) return prev.map(c => c.date === newClosure.date ? newClosure : c);
          return [newClosure, ...prev];
        });
        return true;
      }
    } catch (err) {
      console.error("Error saving closure:", err);
    }
    return false;
  };

  return (
    <StoreContext.Provider value={{
      products,
      cart,
      transactions,
      closures,
      loading,
      error,
      addProduct,
      deleteProduct,
      updateProduct,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      completeSale,
      saveClosure
    }}>
      {children}
    </StoreContext.Provider>
  );
};
