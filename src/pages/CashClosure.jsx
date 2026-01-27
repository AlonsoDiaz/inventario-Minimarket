import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { FaMoneyBillWave, FaCreditCard, FaExchangeAlt, FaCalculator, FaCheckCircle } from 'react-icons/fa';

const CashClosure = () => {
    const { transactions } = useStore();
    const [countedCash, setCountedCash] = useState('');
    const [closureDate, setClosureDate] = useState(new Date());

    // Filter transactions for the selected date (default today)
    const dailyTransactions = transactions.filter(t =>
        new Date(t.date).toLocaleDateString() === closureDate.toLocaleDateString()
    );

    // Calculate totals by method
    const totals = dailyTransactions.reduce((acc, t) => {
        const method = t.paymentMethod || 'Efectivo';
        acc[method] = (acc[method] || 0) + t.total;
        acc.total += t.total;
        return acc;
    }, { total: 0, 'Efectivo': 0, 'Tarjeta': 0, 'Transferencia': 0 });

    const cashDifference = (parseInt(countedCash) || 0) - totals['Efectivo'];

    return (
        <div className="page-container">
            <h1 style={{ marginBottom: '0.5rem' }}>Cierre de Caja</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                Resumen del día: {closureDate.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

                {/* System Totals */}
                <div className="glass-panel" style={{ padding: '2rem', background: 'white' }}>
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FaCalculator color="var(--accent-color)" /> Totales del Sistema
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#f3f4f6', borderRadius: 'var(--radius-md)' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FaMoneyBillWave color="var(--success-color)" /> Efectivo</span>
                            <span style={{ fontWeight: 'bold' }}>${totals['Efectivo'].toLocaleString('es-CL')}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#f3f4f6', borderRadius: 'var(--radius-md)' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FaCreditCard color="var(--accent-color)" /> Tarjeta</span>
                            <span style={{ fontWeight: 'bold' }}>${totals['Tarjeta'].toLocaleString('es-CL')}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#f3f4f6', borderRadius: 'var(--radius-md)' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FaExchangeAlt color="var(--warning-color)" /> Transferencia</span>
                            <span style={{ fontWeight: 'bold' }}>${totals['Transferencia'].toLocaleString('es-CL')}</span>
                        </div>

                        <div style={{ borderTop: '2px dashed #e5e7eb', marginTop: '1rem', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 'bold' }}>
                            <span>Total Ventas</span>
                            <span>${totals.total.toLocaleString('es-CL')}</span>
                        </div>
                    </div>
                </div>

                {/* Cash Count Logic */}
                <div className="glass-panel" style={{ padding: '2rem', background: 'white', border: '1px solid var(--accent-light)' }}>
                    <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Cuadratura de Efectivo</h3>

                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Efectivo Contado en Caja</label>
                        <input
                            type="number"
                            placeholder="Ingrese el monto real..."
                            value={countedCash}
                            onChange={e => setCountedCash(e.target.value)}
                            style={{ fontSize: '1.5rem', padding: '1rem', fontWeight: 'bold', color: 'var(--text-primary)' }}
                        />
                    </div>

                    {countedCash !== '' && (
                        <div style={{
                            padding: '1.5rem',
                            borderRadius: 'var(--radius-md)',
                            background: cashDifference === 0 ? 'var(--success-bg)' : (cashDifference > 0 ? '#ecfccb' : 'var(--danger-bg)'),
                            border: `1px solid ${cashDifference === 0 ? 'var(--success-color)' : (cashDifference > 0 ? '#84cc16' : 'var(--danger-color)')}`,
                            textAlign: 'center'
                        }}>
                            <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '600' }}>Diferencia</p>
                            <h2 style={{
                                fontSize: '2rem',
                                color: cashDifference === 0 ? 'var(--success-color)' : (cashDifference > 0 ? '#65a30d' : 'var(--danger-color)')
                            }}>
                                {cashDifference > 0 ? '+' : ''}${cashDifference.toLocaleString('es-CL')}
                            </h2>
                            <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
                                {cashDifference === 0
                                    ? '¡Caja Cuadrada Perfectamente!'
                                    : (cashDifference > 0 ? 'Sobra dinero (Propina?)' : 'Falta dinero en caja')}
                            </p>
                        </div>
                    )}

                    <button className="btn-primary" style={{ width: '100%', marginTop: '2rem' }}>
                        <FaCheckCircle /> Guardar Cierre del Día
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CashClosure;
