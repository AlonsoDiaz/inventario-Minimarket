import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import {
    FaDollarSign, FaShoppingBag, FaExclamationTriangle, FaBox,
    FaCheckCircle, FaArrowUp, FaArrowDown, FaChartBar, FaChartPie
} from 'react-icons/fa';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';

const StatCard = ({ title, value, icon, color, trend }) => (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', border: '1px solid var(--card-border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '500' }}>{title}</p>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '700', marginTop: '0.5rem', color: 'var(--text-primary)' }}>{value}</h2>
            </div>
            <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '8px',
                background: `rgba(${color}, 0.1)`,
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
                {trend === 'up' ? '12%' : '5%'}
            </span>
            <span style={{ color: 'var(--text-muted)' }}>desde ayer</span>
        </div>
    </div>
);

const Dashboard = () => {
    const navigate = useNavigate();
    const { transactions, products } = useStore();

    // KPI Calculations
    const totalRevenue = transactions.reduce((sum, t) => sum + t.total, 0);
    const totalItemsSold = transactions.reduce((sum, t) => sum + (t.items?.reduce((acc, item) => acc + item.quantity, 0) || 0), 0);
    const lowStockCount = products.filter(p => p.stock < 10).length;

    // Daily Sales Data (Last 7 Days)
    const chartData = useMemo(() => {
        const formatLabel = new Intl.DateTimeFormat('es-CL', { day: '2-digit', month: '2-digit' });

        const normalizeDate = (date) => {
            const normalized = new Date(date);
            normalized.setHours(0, 0, 0, 0);
            return normalized.toISOString().split('T')[0];
        };

        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setHours(0, 0, 0, 0);
            d.setDate(d.getDate() - (6 - i));
            return d;
        });

        return last7Days.map((day) => {
            const targetKey = normalizeDate(day);
            const dailyTotal = transactions
                .filter((t) => normalizeDate(t.date) === targetKey)
                .reduce((sum, t) => sum + t.total, 0);

            return { name: formatLabel.format(day), total: dailyTotal };
        });
    }, [transactions]);

    // Payment method distribution
    const pieData = useMemo(() => {
        const methods = transactions.reduce((acc, t) => {
            const method = t.paymentMethod || 'Efectivo';
            acc[method] = (acc[method] || 0) + 1;
            return acc;
        }, {});

        return Object.keys(methods).map(key => ({ name: key, value: methods[key] }));
    }, [transactions]);

    const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

    return (
        <div className="page-container" style={{ paddingBottom: '3rem' }}>
            {/* KPI Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <StatCard
                    title="Ingresos Totales"
                    value={`$${totalRevenue.toLocaleString('es-CL')} `}
                    icon={<FaDollarSign />}
                    color="79, 70, 229"
                    trend="up"
                />
                <StatCard
                    title="Ventas Totales"
                    value={transactions.length}
                    icon={<FaShoppingBag />}
                    color="16, 185, 129"
                    trend="up"
                />
                <StatCard
                    title="Productos Vendidos"
                    value={totalItemsSold}
                    icon={<FaBox />}
                    color="245, 158, 11"
                    trend="up"
                />
                <StatCard
                    title="Alerta Stock"
                    value={lowStockCount}
                    icon={<FaExclamationTriangle />}
                    color="239, 68, 68"
                    trend={lowStockCount > 0 ? 'down' : 'up'}
                />
            </div>

            {/* Charts Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                <div className="glass-panel" style={{ padding: '1.5rem', height: '400px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                        <FaChartBar color="var(--accent-color)" />
                        <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>Ventas Diarias (Últimos 7 días)</h3>
                    </div>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} tickFormatter={(val) => `$${val / 1000} k`} />
                            <Tooltip
                                cursor={{ fill: '#f9fafb' }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }}
                                formatter={(val) => [`$${val.toLocaleString('es-CL')} `, 'Total']}
                            />
                            <Bar dataKey="total" fill="var(--accent-color)" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem', height: '400px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                        <FaChartPie color="#10b981" />
                        <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>Métodos de Pago</h3>
                    </div>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell - ${index} `} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }} />
                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Bottom Section */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '2rem' }}>
                <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>Últimas Ventas</h3>
                        <button
                            onClick={() => navigate('/history')}
                            style={{ fontSize: '0.85rem', color: 'var(--accent-color)', fontWeight: '600', background: 'transparent', cursor: 'pointer' }}
                        >
                            Ver Todo
                        </button>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: '#f9fafb' }}>
                            <tr style={{ textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                <th style={{ padding: '0.75rem 1.5rem', fontWeight: '600' }}>Boleta</th>
                                <th style={{ padding: '0.75rem 1.5rem', fontWeight: '600' }}>Hora</th>
                                <th style={{ padding: '0.75rem 1.5rem', fontWeight: '600' }}>Método</th>
                                <th style={{ padding: '0.75rem 1.5rem', fontWeight: '600', textAlign: 'right' }}>Monto</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.slice(0, 5).map(t => (
                                <tr key={t.id} style={{ borderBottom: '1px solid var(--card-border)', transition: 'background 0.2s' }}>
                                    <td style={{ padding: '1rem 1.5rem', fontFamily: 'monospace', color: 'var(--accent-color)', fontWeight: '600' }}>#{t.id.toString().slice(-6)}</td>
                                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>{new Date(t.date).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}</td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <span style={{
                                            padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600',
                                            background: t.paymentMethod === 'Efectivo' ? '#dcfce7' : (t.paymentMethod === 'Tarjeta' ? '#e0e7ff' : '#fef3c7'),
                                            color: t.paymentMethod === 'Efectivo' ? '#15803d' : (t.paymentMethod === 'Tarjeta' ? '#4338ca' : '#b45309')
                                        }}>
                                            {t.paymentMethod || 'Efectivo'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: '600', color: 'var(--text-primary)' }}>${t.total.toLocaleString('es-CL')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1rem', fontWeight: '600' }}>Alertas de Inventario</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {products.filter(p => p.stock < 10).slice(0, 4).map(p => (
                            <div key={p.id} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '1rem',
                                background: '#fef2f2',
                                border: '1px solid #fee2e2',
                                borderRadius: '10px',
                                cursor: 'pointer'
                            }} onClick={() => navigate(`/ inventory ? search = ${p.name} `)}>
                                <div>
                                    <p style={{ fontWeight: '600', color: '#b91c1c', fontSize: '0.9rem' }}>{p.name}</p>
                                    <p style={{ fontSize: '0.8rem', color: '#ef4444' }}>Quedan solo {p.stock} unidades</p>
                                </div>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }}></div>
                            </div>
                        ))}
                        {lowStockCount === 0 && (
                            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                                <FaCheckCircle size={40} color="#10b981" style={{ marginBottom: '1rem', opacity: 0.5 }} />
                                <p>Inventario al día</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
