import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { FaShoppingCart, FaMinus, FaPlus, FaTrash, FaCheckCircle, FaBarcode, FaMoneyBillWave, FaCreditCard, FaExchangeAlt } from 'react-icons/fa';
import ReceiptModal from '../components/ReceiptModal';

const POS = () => {
    const { products, cart, addToCart, removeFromCart, updateCartQuantity, completeSale, addProduct } = useStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [showReceipt, setShowReceipt] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [lastTransaction, setLastTransaction] = useState(null);
    const inputRef = useRef(null);

    // Quick Add Modal State
    const [showQuickAdd, setShowQuickAdd] = useState(false);
    const [newProductCode, setNewProductCode] = useState('');
    const [newProductData, setNewProductData] = useState({ name: '', price: '', stock: '' });

    // Focus input on mount
    useEffect(() => {
        if (inputRef.current) inputRef.current.focus();
    }, []);

    const filteredProducts = products.filter(p =>
        p.stock > 0 && (
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.barcode && p.barcode.includes(searchTerm))
        )
    );

    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            const code = searchTerm.trim();
            if (!code) return;

            const productByBarcode = products.find(p => p.barcode === code);

            if (productByBarcode) {
                addToCart(productByBarcode);
                setSearchTerm('');
            } else {
                const productById = products.find(p => p.id.toString() === code);
                if (productById) {
                    addToCart(productById);
                    setSearchTerm('');
                } else {
                    setNewProductCode(code);
                    setNewProductData({ name: '', price: '', stock: '' });
                    setShowQuickAdd(true);
                }
            }
        }
    };

    const handleQuickAdd = (e) => {
        e.preventDefault();
        if (!newProductData.name || !newProductData.price) return;

        const newProd = {
            barcode: newProductCode,
            name: newProductData.name,
            price: parseFloat(newProductData.price),
            stock: parseInt(newProductData.stock) || 0,
            category: 'General'
        };

        addProduct(newProd);
        setShowQuickAdd(false);
        setSearchTerm('');
        alert("Producto creado. Escanéalo nuevamente para agregar.");
        if (inputRef.current) inputRef.current.focus();
    };

    const initiateCheckout = () => {
        if (cart.length === 0) return;
        setShowPaymentModal(true);
    };

    const processPayment = (method) => {
        const transactionDetails = {
            id: Date.now(),
            date: new Date(),
            items: [...cart],
            total: cartTotal,
            paymentMethod: method
        };

        setLastTransaction(transactionDetails);
        completeSale(method);
        setShowPaymentModal(false);
        setShowReceipt(true);
    };

    return (
        <div className="page-container" style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '2rem', height: 'calc(100vh - 140px)', overflow: 'hidden' }}>

            {/* Receipt Modal */}
            {showReceipt && lastTransaction && (
                <ReceiptModal
                    transaction={lastTransaction}
                    onClose={() => {
                        setShowReceipt(false);
                        if (inputRef.current) inputRef.current.focus();
                    }}
                />
            )}

            {/* Payment Selection Modal */}
            {showPaymentModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0,0,0,0.6)', zIndex: 100,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backdropFilter: 'blur(4px)'
                }}>
                    <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', width: '500px', textAlign: 'center' }}>
                        <h2 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Seleccionar Método de Pago</h2>
                        <p style={{ marginBottom: '2rem', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-color)' }}>
                            Total a Pagar: ${cartTotal.toLocaleString('es-CL')}
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                            <button
                                onClick={() => processPayment('Efectivo')}
                                className="glass-panel"
                                style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', cursor: 'pointer', border: '2px solid transparent' }}
                                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--success-color)'}
                                onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
                            >
                                <FaMoneyBillWave size={32} color="var(--success-color)" />
                                <span style={{ fontWeight: '600' }}>Efectivo</span>
                            </button>
                            <button
                                onClick={() => processPayment('Tarjeta')}
                                className="glass-panel"
                                style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', cursor: 'pointer', border: '2px solid transparent' }}
                                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-color)'}
                                onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
                            >
                                <FaCreditCard size={32} color="var(--accent-color)" />
                                <span style={{ fontWeight: '600' }}>Tarjeta</span>
                            </button>
                            <button
                                onClick={() => processPayment('Transferencia')}
                                className="glass-panel"
                                style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', cursor: 'pointer', border: '2px solid transparent' }}
                                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--warning-color)'}
                                onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
                            >
                                <FaExchangeAlt size={32} color="var(--warning-color)" />
                                <span style={{ fontWeight: '600' }}>Transf.</span>
                            </button>
                        </div>
                        <button
                            onClick={() => setShowPaymentModal(false)}
                            style={{ marginTop: '2rem', background: 'transparent', color: 'var(--text-muted)', textDecoration: 'underline' }}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            {/* Quick Add Modal */}
            {showQuickAdd && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0,0,0,0.5)', zIndex: 100,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backdropFilter: 'blur(5px)'
                }}>
                    <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', width: '400px' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Producto Nuevo Detectado</h3>
                        <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                            El código <strong>{newProductCode}</strong> no existe. Créalo ahora:
                        </p>
                        <form onSubmit={handleQuickAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <input
                                placeholder="Nombre del Producto"
                                autoFocus
                                value={newProductData.name}
                                onChange={e => setNewProductData({ ...newProductData, name: e.target.value })}
                            />
                            <input
                                placeholder="Precio (CLP)"
                                type="number"
                                value={newProductData.price}
                                onChange={e => setNewProductData({ ...newProductData, price: e.target.value })}
                            />
                            <input
                                placeholder="Stock Inicial"
                                type="number"
                                value={newProductData.stock}
                                onChange={e => setNewProductData({ ...newProductData, stock: e.target.value })}
                            />
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setShowQuickAdd(false)} style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-md)', background: '#f3f4f6', color: 'var(--text-primary)' }}>Cancelar</button>
                                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Left Side: Product Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ position: 'relative', width: '100%' }}>
                        <input
                            ref={inputRef}
                            style={{
                                padding: '1rem',
                                paddingLeft: '1.5rem',
                                fontSize: '1rem',
                                border: '1px solid var(--card-border)',
                                boxShadow: 'var(--shadow-sm)'
                            }}
                            autoFocus
                            placeholder="Escanear código de barras o buscar..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                    gap: '1rem',
                    overflowY: 'auto',
                    paddingRight: '0.5rem',
                    paddingBottom: '2rem'
                }}>
                    {filteredProducts.map(product => (
                        <div
                            key={product.id}
                            className="glass-panel"
                            onClick={() => addToCart(product)}
                            style={{
                                padding: '1.25rem',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease-out',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                height: '160px',
                                border: '1px solid var(--card-border)',
                                background: 'white'
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.borderColor = 'var(--accent-color)';
                                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'none';
                                e.currentTarget.style.borderColor = 'var(--card-border)';
                                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                            }}
                        >
                            <div>
                                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>{product.name}</h3>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', background: '#f3f4f6', padding: '2px 6px', borderRadius: '4px' }}>{product.category}</span>
                                    {product.barcode && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}><FaBarcode /> {product.barcode}</span>}
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginTop: 'auto' }}>
                                <span style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--accent-color)' }}>
                                    ${Number(product.price).toLocaleString('es-CL')}
                                </span>
                                <span style={{ fontSize: '0.8rem', color: product.stock < 5 ? 'var(--danger-color)' : 'var(--text-muted)' }}>
                                    Stock: {product.stock}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Side: Cart */}
            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: 'white', border: '1px solid var(--card-border)' }}>
                {/* Cart Items */}
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--card-border)', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FaShoppingCart size={18} color="var(--text-secondary)" />
                        <h2 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-primary)' }}>Orden Actual</h2>
                    </div>
                    <span style={{ background: 'var(--accent-color)', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                        {cart.length} items
                    </span>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
                    {cart.length === 0 ? (
                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', flexDirection: 'column' }}>
                            <div style={{ width: 64, height: 64, background: '#f3f4f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                                <FaShoppingCart size={24} color="#d1d5db" />
                            </div>
                            <p>El carro está vacío</p>
                            <p style={{ fontSize: '0.85rem' }}>Escanea un producto para comenzar</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {cart.map(item => (
                                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid #f3f4f6' }}>
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ marginBottom: '0.25rem', fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)' }}>{item.name}</h4>
                                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                            ${item.price.toLocaleString('es-CL')} x {item.quantity}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
                                            <button onClick={() => updateCartQuantity(item.id, -1)} style={{ padding: '4px 8px', color: 'var(--text-secondary)', background: 'transparent' }}><FaMinus size={10} /></button>
                                            <span style={{ minWidth: '24px', textAlign: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>{item.quantity}</span>
                                            <button onClick={() => updateCartQuantity(item.id, 1)} style={{ padding: '4px 8px', color: 'var(--accent-color)', background: 'transparent' }}><FaPlus size={10} /></button>
                                        </div>
                                        <button onClick={() => removeFromCart(item.id)} style={{ color: '#ef4444', padding: '6px', background: 'transparent', opacity: 0.8 }}>
                                            <FaTrash size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div style={{ padding: '1.5rem', background: '#f9fafb', borderTop: '1px solid var(--card-border)' }}>
                    {/* Totals */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        <span>Subtotal</span>
                        <span>${cartTotal.toLocaleString('es-CL')}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: '800' }}>
                        <span>Total</span>
                        <span>${cartTotal.toLocaleString('es-CL')}</span>
                    </div>

                    <button
                        className="btn-primary"
                        style={{ width: '100%', padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', fontSize: '1.1rem', fontWeight: '600', borderRadius: '12px' }}
                        disabled={cart.length === 0}
                        onClick={initiateCheckout}
                    >
                        <> Pagar Total </>
                    </button>
                </div>
            </div>

        </div>
    );
};

export default POS;
