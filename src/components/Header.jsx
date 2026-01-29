import React, { useState, useRef, useEffect } from 'react';
import { FaSearch, FaBell, FaUserCircle, FaExclamationTriangle, FaTimes } from 'react-icons/fa';
import { useStore } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';

const Header = ({ title }) => {
    const { products } = useStore();
    const navigate = useNavigate();
    const [showNotifications, setShowNotifications] = useState(false);
    const dropdownRef = useRef(null);

    // Calculate low stock products (less than 10 units)
    const lowStockProducts = products.filter(p => p.stock < 10);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header style={{
            height: '70px',
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 2rem',
            borderBottom: '1px solid var(--card-border)',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>{title}</h2>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                {/* Search Bar */}
                <div style={{ position: 'relative', width: '280px' }}>
                    <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Buscar..."
                        style={{
                            paddingLeft: '2.5rem',
                            background: '#f3f4f6',
                            border: '1px solid transparent',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            outline: 'none'
                        }}
                    />
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <div style={{ position: 'relative' }} ref={dropdownRef}>
                        <div
                            onClick={() => setShowNotifications(!showNotifications)}
                            style={{
                                cursor: 'pointer',
                                padding: '8px',
                                borderRadius: '50%',
                                background: showNotifications ? '#f3f4f6' : 'transparent',
                                transition: 'background 0.2s',
                                position: 'relative'
                            }}
                        >
                            <FaBell size={18} color={showNotifications ? 'var(--accent-color)' : 'var(--text-secondary)'} />
                            {lowStockProducts.length > 0 && (
                                <span style={{
                                    position: 'absolute', top: 4, right: 4,
                                    width: '16px', height: '16px',
                                    background: 'var(--danger-color)', borderRadius: '50%',
                                    border: '2px solid white',
                                    fontSize: '10px', color: 'white',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontWeight: 'bold'
                                }}>
                                    {lowStockProducts.length}
                                </span>
                            )}
                        </div>

                        {/* Notifications Dropdown */}
                        {showNotifications && (
                            <div style={{
                                position: 'absolute',
                                top: '50px',
                                right: '0',
                                width: '320px',
                                background: 'white',
                                borderRadius: '12px',
                                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
                                border: '1px solid var(--card-border)',
                                overflow: 'hidden'
                            }}>
                                <div style={{ padding: '1rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h4 style={{ fontSize: '0.9rem', fontWeight: '600' }}>Notificaciones</h4>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{lowStockProducts.length} alert(as)</span>
                                </div>
                                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                    {lowStockProducts.length === 0 ? (
                                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                            <FaBell size={24} style={{ opacity: 0.2, marginBottom: '0.5rem' }} />
                                            <p style={{ fontSize: '0.85rem' }}>No hay alertas de stock</p>
                                        </div>
                                    ) : (
                                        lowStockProducts.map(product => (
                                            <div
                                                key={product.id}
                                                onClick={() => {
                                                    navigate(`/inventory?search=${product.name}`);
                                                    setShowNotifications(false);
                                                }}
                                                style={{
                                                    padding: '1rem',
                                                    borderBottom: '1px solid #f8fafc',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    gap: '12px',
                                                    transition: 'background 0.2s'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                                                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                                            >
                                                <div style={{
                                                    width: '36px', height: '36px', borderRadius: '8px',
                                                    background: '#fff1f2', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    flexShrink: 0
                                                }}>
                                                    <FaExclamationTriangle color="#ef4444" size={16} />
                                                </div>
                                                <div>
                                                    <p style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '2px' }}>
                                                        Stock Crítico: {product.name}
                                                    </p>
                                                    <p style={{ fontSize: '0.8rem', color: '#ef4444' }}>
                                                        Quedan solo {product.stock} unidades.
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                                {lowStockProducts.length > 0 && (
                                    <div
                                        onClick={() => {
                                            navigate('/inventory');
                                            setShowNotifications(false);
                                        }}
                                        style={{
                                            padding: '0.85rem',
                                            textAlign: 'center',
                                            fontSize: '0.85rem',
                                            color: 'var(--accent-color)',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            background: '#f9fafb',
                                            borderTop: '1px solid #f1f5f9'
                                        }}
                                    >
                                        Gestionar Inventario
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div style={{ cursor: 'pointer' }}>
                        <FaUserCircle size={24} color="var(--text-secondary)" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
