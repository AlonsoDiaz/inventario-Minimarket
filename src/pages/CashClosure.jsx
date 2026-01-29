import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { FaMoneyBillWave, FaCreditCard, FaExchangeAlt, FaCalculator, FaCheckCircle, FaHistory } from 'react-icons/fa';

const CashClosure = () => {
    const { transactions, saveClosure, closures } = useStore();
    const [countedCash, setCountedCash] = useState('');
    const [closureDate, setClosureDate] = useState(new Date());
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    // Reset saved state when input changes
    useEffect(() => {
        setSaved(false);
    }, [countedCash]);

    // Helper to get YYYY-MM-DD from a date object or string (Local Timezone)
    const getISODate = (dateInput) => {
        const d = new Date(dateInput);
        if (isNaN(d.getTime())) return null;
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    };

    const targetDateISO = getISODate(closureDate);

    // Filter transactions for the selected date (default today)
    const dailyTransactions = transactions.filter(t => {
        const transDate = getISODate(t.date);
        return transDate === targetDateISO;
    });

    // Calculate totals by method
    const totals = dailyTransactions.reduce((acc, t) => {
        const method = t.paymentMethod || 'Efectivo';
        const amount = Number(t.total) || 0; // Force numeric

        acc[method] = (acc[method] || 0) + amount;
        acc.total += amount;
        return acc;
    }, { total: 0, 'Efectivo': 0, 'Tarjeta': 0, 'Transferencia': 0 });

    // Clean the input to remove dots or commas used as thousands separators in CLP
    const cleanNumber = (val) => {
        if (typeof val === 'string') {
            return Number(val.replace(/\D/g, '')) || 0;
        }
        return Number(val) || 0;
    };

    const cashDifference = cleanNumber(countedCash) - totals['Efectivo'];

    const handleSave = async () => {
        if (!countedCash) return;

        setIsSaving(true);
        const closureData = {
            date: targetDateISO,
            systemTotal: totals.total,
            systemCash: totals['Efectivo'],
            systemCard: totals['Tarjeta'],
            systemTransfer: totals['Transferencia'],
            countedCash: cleanNumber(countedCash),
            difference: cashDifference
        };

        const success = await saveClosure(closureData);
        setIsSaving(false);
        if (success) {
            setSaved(true);
            setTimeout(() => setSaved(false), 5000);
        } else {
            alert('Error al guardar el cierre. Intente nuevamente.');
        }
    };

    return (
        <div className="page-container">
            <h1 style={{ marginBottom: '0.5rem' }}>Cierre de Caja</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                Resumen del día: {closureDate.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>

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
                    <div style={{ marginBottom: '1.5rem', background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>Efectivo en Sistema:</span>
                            <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>${totals['Efectivo'].toLocaleString('es-CL')}</span>
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>* Solo se compara el dinero físico (Efectivo). Las tarjetas y transferencias ($ {(totals['Tarjeta'] + totals['Transferencia']).toLocaleString('es-CL')}) no se cuentan aquí.</p>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Efectivo Real (Contado en Caja)</label>
                        <input
                            type="text"
                            placeholder="Ej. 10.000"
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
                            <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '600' }}>Diferencia de Efectivo</p>
                            <h2 style={{
                                fontSize: '2rem',
                                color: cashDifference === 0 ? 'var(--success-color)' : (cashDifference > 0 ? '#65a30d' : 'var(--danger-color)')
                            }}>
                                {cashDifference > 0 ? '+' : ''}${cashDifference.toLocaleString('es-CL')}
                            </h2>
                            <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', fontWeight: '500' }}>
                                {cashDifference === 0
                                    ? '¡Caja Cuadrada!'
                                    : (cashDifference > 0 ? `Sobran $${cashDifference.toLocaleString('es-CL')} en efectivo` : `Faltan $${Math.abs(cashDifference).toLocaleString('es-CL')} en efectivo`)}
                            </p>
                        </div>
                    )}

                    <button
                        className="btn-primary"
                        onClick={handleSave}
                        disabled={!countedCash || isSaving || saved}
                        style={{
                            width: '100%',
                            marginTop: '2rem',
                            background: saved ? 'var(--success-color)' : (isSaving ? '#94a3b8' : 'var(--accent-color)'),
                            transition: 'all 0.3s'
                        }}
                    >
                        {isSaving ? 'Guardando...' : (saved ? <><FaCheckCircle /> Cierre Guardado</> : <><FaCheckCircle /> Guardar Cierre del Día</>)}
                    </button>
                    {saved && <p style={{ color: 'var(--success-color)', fontSize: '0.8rem', textAlign: 'center', marginTop: '10px', fontWeight: 'bold' }}>El cierre se ha registrado correctamente en la base de datos.</p>}
                </div>
            </div>

            {/* History Section */}
            <div className="glass-panel" style={{ padding: '2rem', background: 'white' }}>
                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FaHistory color="var(--text-secondary)" /> Historial de Cierres Recientes
                </h3>
                {closures.length === 0 ? (
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No hay cierres guardados aún.</p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f5f9' }}>
                                    <th style={{ padding: '1rem' }}>Fecha</th>
                                    <th style={{ padding: '1rem' }}>Total Ventas</th>
                                    <th style={{ padding: '1rem' }}>Efectivo Sist.</th>
                                    <th style={{ padding: '1rem' }}>Efectivo Real</th>
                                    <th style={{ padding: '1rem' }}>Diferencia</th>
                                    <th style={{ padding: '1rem' }}>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {closures.map((c, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid #f8fafc' }}>
                                        <td style={{ padding: '1rem', fontWeight: '600' }}>{new Date(c.date + 'T12:00:00').toLocaleDateString('es-CL')}</td>
                                        <td style={{ padding: '1rem' }}>${c.systemTotal.toLocaleString('es-CL')}</td>
                                        <td style={{ padding: '1rem' }}>${c.systemCash.toLocaleString('es-CL')}</td>
                                        <td style={{ padding: '1rem', fontWeight: '700' }}>${c.countedCash.toLocaleString('es-CL')}</td>
                                        <td style={{
                                            padding: '1rem',
                                            fontWeight: '700',
                                            color: c.difference === 0 ? 'var(--success-color)' : (c.difference > 0 ? '#65a30d' : 'var(--danger-color)')
                                        }}>
                                            {c.difference > 0 ? '+' : ''}${c.difference.toLocaleString('es-CL')}
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                fontSize: '0.75rem',
                                                background: c.difference === 0 ? 'var(--success-bg)' : '#fff7ed',
                                                color: c.difference === 0 ? 'var(--success-color)' : 'var(--warning-color)',
                                                fontWeight: '600'
                                            }}>
                                                {c.difference === 0 ? 'Cuadrada' : 'Desajuste'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CashClosure;
