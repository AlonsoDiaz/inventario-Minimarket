import React from 'react';
import { useStore } from '../context/StoreContext';
import { FaDollarSign, FaShoppingBag, FaExclamationTriangle, FaBox, FaCheckCircle, FaArrowUp, FaArrowDown } from 'react-icons/fa';

const StatCard = ({ title, value, icon, color, trend }) => (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '500' }}>{title}</p>
                <h2 style={{ fontSize: '2rem', fontWeight: '700', marginTop: '0.5rem', color: 'var(--text-primary)' }}>{value}</h2>
            </div>
            <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '8px',
                background: `rgba(${color}, 0.1)`, /* Pastel background */
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: `rgb(${color})`,
                fontSize: '1.25rem'
            }}>
                {icon}
            </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
            <span style={{ color: trend === 'up' ? 'var(--success-color)' : 'var(--danger-color)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
                {trend === 'up' ? <FaArrowUp size={10} /> : <FaArrowDown size={10} />}
                3.2%
            </span>
            <span style={{ color: 'var(--text-muted)' }}>mes anterior</span>
        </div>
    </div>
);

const Dashboard = () => {
    const { transactions, products } = useStore();

    const totalRevenue = transactions.reduce((sum, t) => sum + t.total, 0);
    const totalItemsSold = transactions.reduce((sum, t) => sum + t.items.reduce((acc, item) => acc + item.quantity, 0), 0);
    const lowStockCount = products.filter(p => p.stock < 10).length;

    return (
        <div className="page-container">
            {/* KPI Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <StatCard
                    title="Ingresos Totales"
                    value={`$${totalRevenue.toLocaleString('es-CL')}`}
                    icon={<FaDollarSign />}
                    color="79, 70, 229" // Indigo
                    trend="up"
                />
                <StatCard
                    title="Ventas Totales"
                    value={transactions.length}
                    icon={<FaShoppingBag />}
                    color="16, 185, 129" // Emerald
                    trend="up"
                />
                <StatCard
                    title="Productos Vendidos"
                    value={totalItemsSold}
                    icon={<FaBox />}
                    color="245, 158, 11" // Amber
                    trend="up"
                />
                <StatCard
                    title="Alerta Stock"
                    value={lowStockCount}
                    icon={<FaExclamationTriangle />}
                    color="239, 68, 68" // Red
                    trend={lowStockCount > 0 ? 'down' : 'up'}
                />
            </div>

            {/* Split Content */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>

                {/* Recent Transactions Table */}
                <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--card-border)' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>Últimas Ventas</h3>
                    </div>

                    {transactions.length === 0 ? (
                        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                            <p>No hay datos disponibles.</p>
                        </div>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ background: '#f9fafb' }}>
                                <tr style={{ textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    <th style={{ padding: '0.75rem 1.5rem', fontWeight: '600' }}>ID</th>
                                    <th style={{ padding: '0.75rem 1.5rem', fontWeight: '600' }}>Hora</th>
                                    <th style={{ padding: '0.75rem 1.5rem', fontWeight: '600' }}>Cant.</th>
                                    <th style={{ padding: '0.75rem 1.5rem', fontWeight: '600', textAlign: 'right' }}>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.slice(0, 7).map(t => (
                                    <tr key={t.id} style={{ borderBottom: '1px solid var(--card-border)' }}>
                                        <td style={{ padding: '1rem 1.5rem', fontFamily: 'monospace', color: 'var(--accent-color)', fontWeight: '500' }}>#{t.id.toString().slice(-4)}</td>
                                        <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>{new Date(t.date).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}</td>
                                        <td style={{ padding: '1rem 1.5rem', color: 'var(--text-primary)' }}>{t.items.length} items</td>
                                        <td style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: '600', color: 'var(--text-primary)' }}>${t.total.toLocaleString('es-CL')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Stock Alert Feed */}
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1rem', fontWeight: '600' }}>Estado del Inventario</h3>
                    {lowStockCount === 0 ? (
                        <div style={{
                            padding: '1.5rem',
                            background: 'var(--success-bg)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid rgba(16, 185, 129, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            color: 'var(--success-color)'
                        }}>
                            <FaCheckCircle size={20} />
                            <div>
                                <h4 style={{ color: '#065f46', fontSize: '0.95rem' }}>Todo optimizado</h4>
                                <p style={{ fontSize: '0.85rem', color: '#047857' }}>Niveles de stock saludables.</p>
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {products.filter(p => p.stock < 10).map(p => (
                                <div key={p.id} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '1rem',
                                    background: 'var(--danger-bg)',
                                    border: '1px solid #fee2e2',
                                    borderRadius: 'var(--radius-md)'
                                }}>
                                    <div>
                                        <p style={{ fontWeight: '600', color: '#b91c1c', fontSize: '0.9rem' }}>{p.name}</p>
                                        <p style={{ fontSize: '0.8rem', color: '#ef4444' }}>Quedan solo {p.stock}</p>
                                    </div>
                                    <button style={{
                                        padding: '4px 10px',
                                        background: '#fff',
                                        border: '1px solid #fecaca',
                                        color: '#ef4444',
                                        borderRadius: '6px',
                                        fontSize: '0.75rem',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}>
                                        Reponer
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
