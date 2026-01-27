import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { FaSearch, FaFileInvoiceDollar, FaPrint } from 'react-icons/fa';
import ReceiptModal from '../components/ReceiptModal';

const SalesHistory = () => {
    const { transactions } = useStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    // Simple search filter
    const filteredTransactions = transactions.filter(t =>
        t.id.toString().includes(searchTerm) ||
        new Date(t.date).toLocaleDateString('es-CL').includes(searchTerm)
    ).sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by newest first

    return (
        <div className="page-container">
            {/* Modal for Reprinting */}
            {selectedTransaction && (
                <ReceiptModal
                    transaction={selectedTransaction}
                    onClose={() => setSelectedTransaction(null)}
                />
            )}

            {/* Toolbar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem' }}>Historial de Ventas</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Revisa y reimprime boletas antiguas</p>
                </div>

                <div style={{ position: 'relative', width: '300px' }}>
                    <FaSearch style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        style={{
                            width: '100%',
                            padding: '0.75rem 1rem 0.75rem 3rem',
                            borderRadius: '50px',
                            border: '1px solid var(--card-border)',
                            background: 'white',
                            boxShadow: 'var(--shadow-sm)'
                        }}
                        placeholder="Buscar por ID o Fecha..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Data Grid */}
            <div className="glass-panel" style={{ overflow: 'hidden', padding: 0, background: 'white' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f9fafb', textAlign: 'left', color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>ID Venta</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Fecha y Hora</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Productos</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Total</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: '600', textAlign: 'right' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    No se encontraron ventas.
                                </td>
                            </tr>
                        ) : (
                            filteredTransactions.map((t, index) => (
                                <tr key={t.id} style={{
                                    borderBottom: '1px solid var(--card-border)',
                                    transition: 'background 0.1s'
                                }}>
                                    <td style={{ padding: '1rem 1.5rem', fontWeight: '500', color: 'var(--accent-color)', fontFamily: 'monospace' }}>
                                        #{t.id.toString().slice(-6)}
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-primary)' }}>
                                        {new Date(t.date).toLocaleDateString('es-CL')}
                                        <span style={{ color: 'var(--text-muted)', marginLeft: '8px', fontSize: '0.85rem' }}>
                                            {new Date(t.date).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>
                                        {t.items.length} items
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '6px' }}>
                                            ({t.items.slice(0, 2).map(i => i.name).join(', ')}{t.items.length > 2 ? '...' : ''})
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                                        ${t.total.toLocaleString('es-CL')}
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                        <button
                                            onClick={() => setSelectedTransaction(t)}
                                            style={{
                                                display: 'inline-flex', alignItems: 'center', gap: '6px',
                                                padding: '6px 12px',
                                                border: '1px solid var(--card-border)',
                                                borderRadius: '6px',
                                                background: 'white',
                                                color: 'var(--text-primary)',
                                                fontSize: '0.85rem',
                                                fontWeight: '500'
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--text-muted)'}
                                            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--card-border)'}
                                        >
                                            <FaPrint size={12} color="var(--text-muted)" /> Ver Ticket
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SalesHistory;
