import React from 'react';
import { FaPrint, FaTimes, FaCheckCircle } from 'react-icons/fa';

const ReceiptModal = ({ transaction, onClose, onPrint }) => {
    if (!transaction) return null;

    const handlePrint = () => {
        if (onPrint) {
            onPrint();
        } else {
            window.print();
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.5)', zIndex: 100,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(5px)'
        }}>
            <div style={{
                background: 'white',
                padding: '2rem',
                borderRadius: 'var(--radius-lg)',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                display: 'flex', flexDirection: 'column', gap: '1.5rem',
                maxHeight: '90vh', overflowY: 'auto'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>Detalle de Venta</h2>
                    <button onClick={onClose} style={{ background: 'transparent', color: 'var(--text-muted)' }}>
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Thermal Ticket Preview (The Printable Area) */}
                <div className="printable-area" style={{
                    width: '300px',
                    background: '#fff',
                    padding: '1rem',
                    border: '1px dashed #ccc',
                    fontFamily: 'monospace',
                    textTransform: 'uppercase',
                    margin: '0 auto'
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 0 }}>MiniMarket</h3>
                        <p style={{ fontSize: '0.8rem', margin: '4px 0' }}>Av. Siempre Viva 123</p>
                        <p style={{ fontSize: '0.8rem', margin: 0 }}>RUT: 12.345.678-9</p>
                    </div>

                    <div style={{ borderBottom: '1px dashed black', paddingBottom: '8px', marginBottom: '8px', fontSize: '0.8rem' }}>
                        <p>Fecha: {new Date(transaction.date).toLocaleDateString('es-CL')}</p>
                        <p>Hora: {new Date(transaction.date).toLocaleTimeString('es-CL')}</p>
                        <p>Ticket: #{transaction.id ? transaction.id.toString().slice(-6) : '---'}</p>
                        <p>Vendedor: Caja 1</p>
                    </div>

                    <div style={{ fontSize: '0.8rem', marginBottom: '8px' }}>
                        {transaction.items.map((item, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                <span>{item.quantity} x {item.name.substring(0, 15)}</span>
                                <span>${(item.price * item.quantity).toLocaleString('es-CL')}</span>
                            </div>
                        ))}
                    </div>

                    <div style={{ borderTop: '1px dashed black', paddingTop: '8px', marginTop: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1rem', marginBottom: '4px' }}>
                            <span>TOTAL</span>
                            <span>${transaction.total.toLocaleString('es-CL')}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                            <span>Metodo Pago:</span>
                            <span>{transaction.paymentMethod || 'Efectivo'}</span>
                        </div>
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.7rem' }}>
                        <p>*** GRACIAS POR SU COMPRA ***</p>
                        <p>Copia Cliente</p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        className="btn-primary"
                        onClick={handlePrint}
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#334155' }}
                    >
                        <FaPrint /> Imprimir
                    </button>
                    <button
                        className="btn-primary"
                        onClick={onClose}
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                        <FaCheckCircle /> Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReceiptModal;
