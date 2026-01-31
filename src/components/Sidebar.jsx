import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    FaThLarge, FaBox, FaShoppingCart, FaHistory,
    FaChartLine, FaCog, FaCalculator, FaUsers
} from 'react-icons/fa';
import { MdStorefront } from 'react-icons/md';

const Sidebar = () => {
    const location = useLocation();

    const menuItems = [
        { path: '/', name: 'Dashboard', icon: <FaThLarge /> },
        { path: '/pos', name: 'Vender (POS)', icon: <FaShoppingCart /> },
        { path: '/inventory', name: 'Inventario', icon: <FaBox /> },
        { path: '/closure', name: 'Cierre de Caja', icon: <FaCalculator /> },
        { path: '/history', name: 'Historial', icon: <FaHistory /> },
        { path: '/analytics', name: 'Reportes', icon: <FaChartLine /> },
    ];

    return (
        <nav style={{
            width: '260px',
            height: '100vh',
            background: 'var(--sidebar-bg)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            borderRight: '1px solid var(--card-border)',
            position: 'fixed',
            zIndex: 10,
            boxShadow: 'var(--shadow-sm)'
        }}>
            {/* Professional Brand Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '3rem',
                padding: '1rem',
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)'
            }}>
                <div style={{
                    width: '32px',
                    height: '32px',
                    background: 'var(--accent-color)',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                }}>
                    <MdStorefront size={18} />
                </div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)' }}>MiniMarket</h2>
            </div>

            {/* Navigation Links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '0.75rem 1rem',
                            borderRadius: 'var(--radius-md)',
                            textDecoration: 'none',
                            color: isActive ? 'white' : 'var(--text-secondary)',
                            background: isActive ? 'var(--accent-color)' : 'transparent',
                            fontWeight: isActive ? '500' : '400',
                            transition: 'all 0.15s ease',
                            fontSize: 'var(--font-size-base)'
                        })}
                    >
                        <span style={{ fontSize: '1.1rem', opacity: location.pathname === item.path ? 1 : 0.7 }}>
                            {item.icon}
                        </span>
                        {item.name}
                    </NavLink>
                ))}
            </div>

            {/* Footer */}
            <div style={{ 
                marginTop: 'auto', 
                paddingTop: 'var(--spacing-lg)', 
                borderTop: '1px solid var(--border-light)'
            }}>
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    padding: 'var(--spacing-md)',
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)'
                }}>
                    <div style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '50%', 
                        background: 'var(--accent-color)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        color: 'white'
                    }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>A</span>
                    </div>
                    <div>
                        <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: '500', color: 'var(--text-primary)', margin: 0 }}>Administrador</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Cuenta Pro</p>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Sidebar;
