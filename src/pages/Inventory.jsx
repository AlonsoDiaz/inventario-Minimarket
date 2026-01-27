import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaTimes, FaBarcode } from 'react-icons/fa';

const Inventory = () => {
    const { products, addProduct } = useStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);

    const [formData, setFormData] = useState({
        barcode: '',
        name: '',
        price: '',
        stock: '',
        category: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.price || !formData.stock) return;

        addProduct({
            barcode: formData.barcode || 'N/A',
            name: formData.name,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock),
            category: formData.category || 'General'
        });

        setFormData({ barcode: '', name: '', price: '', stock: '', category: '' });
        setIsFormOpen(false);
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.barcode && p.barcode.includes(searchTerm))
    );

    return (
        <div className="page-container">
            {/* Toolbar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ position: 'relative', width: '350px' }}>
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
                        placeholder="Buscar por nombre, SKU o categoría..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>

                <button
                    className="btn-primary"
                    onClick={() => setIsFormOpen(!isFormOpen)}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    {isFormOpen ? <><FaTimes /> Cancelar</> : <><FaPlus /> Nuevo Producto</>}
                </button>
            </div>

            {/* Add Product Form (Drawer/Card) */}
            {isFormOpen && (
                <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', borderLeft: '4px solid var(--accent-color)', background: 'white' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', color: 'var(--text-primary)' }}>Registrar Nuevo Producto</h3>
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', alignItems: 'end' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Código de Barras</label>
                            <div style={{ position: 'relative' }}>
                                <FaBarcode style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    style={{ paddingLeft: '2.5rem' }}
                                    placeholder="Escanear..."
                                    value={formData.barcode}
                                    onChange={e => setFormData({ ...formData, barcode: e.target.value })}
                                    autoFocus // Focus here first for scanner
                                />
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Nombre del producto</label>
                            <input
                                placeholder="Ej. Bebida 1.5L"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Precio Venta (CLP)</label>
                            <input
                                placeholder="0"
                                type="number"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Stock Inicial</label>
                            <input
                                placeholder="0"
                                type="number"
                                value={formData.stock}
                                onChange={e => setFormData({ ...formData, stock: e.target.value })}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Categoría</label>
                            <input
                                placeholder="Ej. Abarrotes"
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                            />
                        </div>
                        <button type="submit" className="btn-primary" style={{ height: '42px' }}>Guardar Item</button>
                    </form>
                </div>
            )}

            {/* Data Grid */}
            <div className="glass-panel" style={{ overflow: 'hidden', padding: 0, background: 'white' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f9fafb', textAlign: 'left', color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Código</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Producto</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Categoría</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Precio Unitario</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Stock</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Estado</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: '600', textAlign: 'right' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map((product, index) => (
                            <tr key={product.id} style={{
                                borderBottom: '1px solid var(--card-border)',
                                transition: 'background 0.2s'
                            }}>
                                <td style={{ padding: '1rem 1.5rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>{product.barcode || '---'}</td>
                                <td style={{ padding: '1rem 1.5rem', fontWeight: '500', color: 'var(--text-primary)' }}>{product.name}</td>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <span style={{
                                        padding: '2px 10px',
                                        borderRadius: '12px',
                                        background: '#f3f4f6',
                                        border: '1px solid #e5e7eb',
                                        fontSize: '0.8rem',
                                        color: 'var(--text-secondary)'
                                    }}>
                                        {product.category}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem 1.5rem', fontFamily: 'monospace', fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                                    ${Number(product.price).toLocaleString('es-CL')}
                                </td>
                                <td style={{ padding: '1rem 1.5rem', fontWeight: '500', color: 'var(--text-primary)' }}>{product.stock}</td>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    {product.stock < 10 ? (
                                        <span style={{ color: '#b91c1c', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '500', background: '#fef2f2', padding: '2px 8px', borderRadius: '4px', border: '1px solid #fecaca' }}>
                                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }}></span> Crítico
                                        </span>
                                    ) : (
                                        <span style={{ color: '#047857', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '500', background: '#ecfdf5', padding: '2px 8px', borderRadius: '4px', border: '1px solid #a7f3d0' }}>
                                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }}></span> Ok
                                        </span>
                                    )}
                                </td>
                                <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                    <button style={{ color: 'var(--text-muted)', background: 'transparent', padding: '8px' }}>
                                        <FaEdit />
                                    </button>
                                    <button style={{ color: '#ef4444', background: 'transparent', padding: '8px' }}>
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Inventory;
