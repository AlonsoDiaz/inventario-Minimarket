import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaChartLine, FaBoxOpen, FaCashRegister, FaHistory, FaCalculator } from 'react-icons/fa';
import { MdStorefront } from 'react-icons/md';

const Sidebar = () => {
    const links = [
        { to: '/', label: 'Resumen', icon: <FaChartLine /> },
        { to: '/inventory', label: 'Inventario', icon: <FaBoxOpen /> },
        { to: '/pos', label: 'Caja', icon: <FaCashRegister /> },
        { to: '/history', label: 'Historial', icon: <FaHistory /> },
        { to: '/closure', label: 'Cierre Caja', icon: <FaCalculator /> },
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
            zIndex: 10
        }}>
            {/* Minimal Brand Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '3rem',
                paddingLeft: '0.5rem',
            }}>
                <div style={{
                    width: '32px',
                    height: '32px',
                    background: 'var(--accent-color)',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                }}>
                    <MdStorefront size={20} />
                </div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>MiniMarket</h2>
            </div>

            {/* Navigation Links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '0.75rem 1rem',
                            borderRadius: 'var(--radius-md)',
                            textDecoration: 'none',
                            // Active: Dark text with Light Blue BG. Inactive: Gray text.
                            color: isActive ? 'var(--accent-color)' : 'var(--text-secondary)',
                            background: isActive ? 'var(--accent-light)' : 'transparent',
                            fontWeight: isActive ? '600' : '500',
                            transition: 'all 0.2s ease',
                            fontSize: '0.95rem'
                        })}
                    >
                        <span style={{ fontSize: '1.1rem' }}>{link.icon}</span>
                        {link.label}
                    </NavLink>
                ))}
            </div>

            {/* Footer */}
            <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--card-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>A</span>
                    </div>
                    <div>
                        <p style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>Administrador</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pro Plan</p>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Sidebar;
