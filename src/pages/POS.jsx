import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import {
    FaSearch, FaShoppingCart, FaTrash, FaPlus, FaMinus,
    FaBarcode, FaMoneyBillWave, FaCreditCard, FaExchangeAlt, FaPrint, FaImage
} from 'react-icons/fa';
import ReceiptModal from '../components/ReceiptModal';

const POS = () => {
    const { products, cart, addToCart, removeFromCart, updateCartQuantity, clearCart, completeSale, addProduct, transactions } = useStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [showQuickAdd, setShowQuickAdd] = useState(false);
    const [scannedBarcode, setScannedBarcode] = useState('');
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showReceipt, setShowReceipt] = useState(false);
    const [lastTransaction, setLastTransaction] = useState(null);

    const searchInputRef = useRef(null);

    // Auto-focus search input
    useEffect(() => {
        if (!showQuickAdd && !showPaymentModal && !showReceipt) {
            searchInputRef.current?.focus();
        }
    }, [showQuickAdd, showPaymentModal, showReceipt]);

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.barcode && p.barcode.includes(searchTerm))
    );

    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const handleBarcodeSearch = (e) => {
        if (e.key === 'Enter') {
            const product = products.find(p => p.barcode === searchTerm);
            if (product) {
                addToCart(product);
                setSearchTerm('');
            } else if (searchTerm.trim() !== '') {
                setScannedBarcode(searchTerm);
                setShowQuickAdd(true);
            }
        }
    };

    const handleQuickAdd = (newProduct) => {
        addProduct(newProduct);
        setShowQuickAdd(false);
        setSearchTerm('');
    };

    const processPayment = async (method) => {
        await completeSale(method);
        setShowPaymentModal(false);
        setLastTransaction(transactions[0]);
        setShowReceipt(true);
    };

    // Since transactions state update is async, we watch it to show receipt
    useEffect(() => {
        if (transactions.length > 0 && !showReceipt && lastTransaction === null && cart.length === 0) {
            // This is a bit of a hack to show the receipt for the LAST sale made in THIS session
            // A better way is to have completeSale return the transaction.
        }
    }, [transactions]);

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', height: 'calc(100vh - 140px)', gap: '1.5rem', padding: '1.5rem' }}>

            {/* Left: Product Selection */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', overflow: 'hidden' }}>
                <div style={{ position: 'relative' }}>
                    <FaSearch style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        ref={searchInputRef}
                        className="search-input"
                        style={{
                            width: '100%',
                            padding: '1rem 1rem 1rem 3.5rem',
                            borderRadius: '12px',
                            border: '1px solid var(--card-border)',
                            fontSize: '1.1rem',
                            background: 'white',
                            boxShadow: 'var(--shadow-sm)'
                        }}
                        placeholder="Escanear código o buscar producto..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        onKeyDown={handleBarcodeSearch}
                    />
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                    gap: '1.25rem',
                    overflowY: 'auto',
                    paddingBottom: '1rem'
                }}>
                    {filteredProducts.map(product => (
                        <div
                            key={product.id}
                            className="glass-panel"
                            onClick={() => addToCart(product)}
                            style={{
                                padding: '0',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                border: '1px solid var(--card-border)',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                height: '260px' // FIXED HEIGHT for grid alignment
                            }}
                        >
                            <div style={{
                                width: '100%',
                                height: '140px',
                                flexShrink: 0, // PREVENT SHRANKING/GROWING
                                background: '#f8fafc',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderBottom: '1px solid var(--card-border)',
                                overflow: 'hidden'
                            }}>
                                {product.image ? (
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <FaImage size={40} style={{ color: '#cbd5e1' }} />
                                )}
                            </div>
                            <div style={{ padding: '0.75rem', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <h4 style={{ fontSize: '0.9rem', marginBottom: '0.25rem', color: 'var(--text-primary)', lineBreak: 'anywhere', maxHeight: '2.4em', overflow: 'hidden' }}>
                                    {product.name}
                                </h4>
                                <p style={{ fontWeight: '700', color: 'var(--accent-color)', fontSize: '1.2rem', marginBottom: '2px' }}>
                                    ${product.price ? product.price.toLocaleString('es-CL') : '0'}
                                </p>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    Stock: {product.stock}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right: Shopping Cart */}
            <div className="glass-panel" style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '1.5rem',
                background: 'white',
                border: '1px solid var(--card-border)',
                height: '100%'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
                    <FaShoppingCart color="var(--accent-color)" />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>Orden Actual</h3>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1.5rem' }}>
                    {cart.length === 0 ? (
                        <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '3rem' }}>
                            <FaShoppingCart size={40} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                            <p>El carro está vacío</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {cart.map(item => (
                                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: '1px solid #f8fafc' }}>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-primary)' }}>{item.name}</p>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>${item.price.toLocaleString('es-CL')} c/u</p>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <button onClick={() => updateCartQuantity(item.id, -1)} style={{ width: '24px', height: '24px', borderRadius: '4px', border: '1px solid #e2e8f0', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FaMinus size={10} /></button>
                                        <span style={{ fontWeight: '600', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                                        <button onClick={() => updateCartQuantity(item.id, 1)} style={{ width: '24px', height: '24px', borderRadius: '4px', border: '1px solid #e2e8f0', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FaPlus size={10} /></button>
                                        <button onClick={() => removeFromCart(item.id)} style={{ color: '#ef4444', background: 'transparent', marginLeft: '5px' }}><FaTrash size={12} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div style={{ borderTop: '2px dashed #f1f5f9', paddingTop: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.25rem', fontWeight: '700' }}>
                        <span>Total:</span>
                        <span style={{ color: 'var(--accent-color)' }}>${cartTotal.toLocaleString('es-CL')}</span>
                    </div>
                    <button
                        className="btn-primary"
                        disabled={cart.length === 0}
                        onClick={() => setShowPaymentModal(true)}
                        style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                    >
                        Pagar Total
                    </button>
                </div>
            </div>

            {/* Quick Add Modal */}
            {showQuickAdd && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
                    <div className="glass-panel" style={{ padding: '2rem', width: '400px', background: 'white' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>Producto Nuevo Detectado</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <FaBarcode color="var(--text-muted)" />
                                <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{scannedBarcode}</span>
                            </div>
                            <input id="qa-name" placeholder="Nombre del producto" />
                            <input id="qa-price" type="number" placeholder="Precio de venta" />
                            <input id="qa-stock" type="number" placeholder="Stock inicial" />
                            <input id="qa-image" placeholder="URL de Imagen (Opcional)" />
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button className="btn-primary" onClick={() => {
                                    const name = document.getElementById('qa-name').value;
                                    const price = document.getElementById('qa-price').value;
                                    const stock = document.getElementById('qa-stock').value;
                                    const image = document.getElementById('qa-image').value;
                                    if (name && price && stock) {
                                        handleQuickAdd({ barcode: scannedBarcode, name, price: parseFloat(price), stock: parseInt(stock), image });
                                    }
                                }}>Añadir y Cargar</button>
                                <button className="btn-primary" style={{ background: '#94a3b8' }} onClick={() => setShowQuickAdd(false)}>Cerrar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Modal */}
            {showPaymentModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
                    <div className="glass-panel" style={{ padding: '2.5rem', width: '500px', background: 'white', textAlign: 'center' }}>
                        <h2 style={{ marginBottom: '2rem' }}>Seleccionar Método de Pago</h2>
                        <h1 style={{ fontSize: '3rem', marginBottom: '2.5rem', color: 'var(--accent-color)' }}>${cartTotal.toLocaleString('es-CL')}</h1>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
                            <button className="payment-btn" onClick={() => processPayment('Efectivo')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fbfc' }}>
                                <FaMoneyBillWave size={30} color="#10b981" />
                                <span style={{ fontWeight: '600' }}>Efectivo</span>
                            </button>
                            <button className="payment-btn" onClick={() => processPayment('Tarjeta')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fbfc' }}>
                                <FaCreditCard size={30} color="#6366f1" />
                                <span style={{ fontWeight: '600' }}>Tarjeta</span>
                            </button>
                            <button className="payment-btn" onClick={() => processPayment('Transferencia')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fbfc' }}>
                                <FaExchangeAlt size={30} color="#f59e0b" />
                                <span style={{ fontWeight: '600' }}>Transf.</span>
                            </button>
                        </div>

                        <button onClick={() => setShowPaymentModal(false)} style={{ marginTop: '2.5rem', background: 'transparent', color: 'var(--text-muted)', fontWeight: '600' }}>Cancelar Selección</button>
                    </div>
                </div>
            )}

            {/* Receipt Modal */}
            {showReceipt && (
                <ReceiptModal
                    transaction={lastTransaction || transactions[0]}
                    onClose={() => {
                        setShowReceipt(false);
                        setLastTransaction(null);
                    }}
                />
            )}
        </div>
    );
};

export default POS;
