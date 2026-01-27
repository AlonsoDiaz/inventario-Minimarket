import React from 'react';
import { FaSearch, FaBell, FaUserCircle } from 'react-icons/fa';

const Header = ({ title }) => {
    return (
        <header style={{
            height: '70px',
            background: 'rgba(255, 255, 255, 0.8)', // White with blur
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 2rem',
            borderBottom: '1px solid var(--card-border)',
            position: 'sticky',
            top: 0,
            zIndex: 5
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
                            background: '#f3f4f6', // Light gray input
                            border: '1px solid transparent',
                            borderRadius: '8px',
                            fontSize: '0.9rem'
                        }}
                    />
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <div style={{ position: 'relative', cursor: 'pointer' }}>
                        <FaBell size={18} color="var(--text-secondary)" />
                        <span style={{
                            position: 'absolute', top: -4, right: -4,
                            width: '8px', height: '8px',
                            background: 'var(--danger-color)', borderRadius: '50%',
                            border: '2px solid white'
                        }}></span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
