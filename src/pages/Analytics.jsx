import React, { useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { FaChartLine, FaTicketAlt, FaWallet } from 'react-icons/fa';

const Analytics = () => {
  const { transactions } = useStore();

  const totalRevenue = useMemo(
    () => transactions.reduce((sum, t) => sum + (t.total || 0), 0),
    [transactions]
  );

  const avgTicket = useMemo(
    () => (transactions.length ? totalRevenue / transactions.length : 0),
    [transactions.length, totalRevenue]
  );

  const paymentBreakdown = useMemo(() => {
    const map = transactions.reduce((acc, t) => {
      const method = t.paymentMethod || 'Efectivo';
      const total = t.total || 0;
      acc[method] = acc[method] || { name: method, count: 0, value: 0 };
      acc[method].count += 1;
      acc[method].value += total;
      return acc;
    }, {});
    return Object.values(map).sort((a, b) => b.value - a.value);
  }, [transactions]);

  const dailySales = useMemo(() => {
    const days = [...Array(14)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d;
    }).reverse();

    return days.map((d) => {
      const label = d.toLocaleDateString('es-CL');
      const total = transactions
        .filter((t) => new Date(t.date).toLocaleDateString('es-CL') === label)
        .reduce((sum, t) => sum + (t.total || 0), 0);
      return { name: `${d.getDate()}/${d.getMonth() + 1}`, total };
    });
  }, [transactions]);

  const topProducts = useMemo(() => {
    const map = transactions.reduce((acc, t) => {
      (t.items || []).forEach((item) => {
        const key = item.name || `ID-${item.id}`;
        acc[key] = acc[key] || { name: key, quantity: 0, revenue: 0 };
        acc[key].quantity += item.quantity || 0;
        acc[key].revenue += (item.price || 0) * (item.quantity || 0);
      });
      return acc;
    }, {});
    return Object.values(map)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 8);
  }, [transactions]);

  const colors = ['#4f46e5', '#22c55e', '#f97316', '#06b6d4', '#e11d48', '#6366f1', '#0ea5e9', '#84cc16'];

  return (
    <div className="page-container" style={{ paddingBottom: '3rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.25rem', border: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(79,70,229,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5' }}>
            <FaWallet />
          </div>
          <div>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Ingresos 14 días</p>
            <h3 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)' }}>${totalRevenue.toLocaleString('es-CL')}</h3>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', border: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(34,197,94,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a' }}>
            <FaTicketAlt />
          </div>
          <div>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Ticket promedio</p>
            <h3 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)' }}>${avgTicket.toLocaleString('es-CL', { maximumFractionDigits: 0 })}</h3>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', border: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(6,182,212,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0891b2' }}>
            <FaChartLine />
          </div>
          <div>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Ventas registradas</p>
            <h3 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)' }}>{transactions.length}</h3>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.25rem', height: 420, display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: '600' }}>Ventas diarias (14 días)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailySales}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} tickFormatter={(val) => `$${Math.round(val / 1000)}k`} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }} formatter={(val) => [`$${val.toLocaleString('es-CL')}`, 'Total']} />
              <Bar dataKey="total" fill="var(--accent-color)" radius={[6, 6, 0, 0]} barSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', height: 420, display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: '600' }}>Métodos de pago</h3>
          {paymentBreakdown.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>Sin datos</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={paymentBreakdown} cx="50%" cy="50%" outerRadius={110} dataKey="value" label>
                  {paymentBreakdown.map((entry, i) => (
                    <Cell key={entry.name} fill={colors[i % colors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(val) => `$${val.toLocaleString('es-CL')}`} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '1.25rem', border: '1px solid var(--card-border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>Top productos por ingreso</h3>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Últimas {transactions.length} ventas</span>
        </div>
        {topProducts.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Sin datos de productos</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f8fafc', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              <tr>
                <th style={{ padding: '0.75rem 0.5rem' }}>Producto</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Cantidad</th>
                <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Ingreso</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((p, idx) => (
                <tr key={p.name} style={{ borderBottom: '1px solid var(--card-border)' }}>
                  <td style={{ padding: '0.75rem 0.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: colors[idx % colors.length] }} />
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{p.name}</span>
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-secondary)' }}>{p.quantity}</td>
                  <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right', fontWeight: 700 }}>${p.revenue.toLocaleString('es-CL')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Analytics;
