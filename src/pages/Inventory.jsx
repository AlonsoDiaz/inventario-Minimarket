import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaTimes, FaBarcode, FaSave, FaImage } from 'react-icons/fa';

const Inventory = () => {
    const { products, addProduct, deleteProduct, updateProduct } = useStore();
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const formRef = useRef(null);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const search = params.get('search');
        if (search) {
            setSearchTerm(search);
        }
    }, [location]);

    const [formData, setFormData] = useState({
        barcode: '',
        name: '',
        price: '',
        stock: '',
        category: '',
        image: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.price || !formData.stock) return;

        const productData = {
            barcode: formData.barcode || 'N/A',
            name: formData.name,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock),
            category: formData.category || 'General',
            image: formData.image
        };

        if (editingId) {
            updateProduct(editingId, productData);
            setEditingId(null);
        } else {
            addProduct(productData);
        }

        setFormData({ barcode: '', name: '', price: '', stock: '', category: '', image: '' });
        setIsFormOpen(false);
    };

    const handleEdit = (product) => {
        setFormData({
            barcode: product.barcode || '',
            name: product.name,
            price: product.price,
            stock: product.stock,
            category: product.category,
            image: product.image || ''
        });
        setEditingId(product.id);
        setIsFormOpen(true);
        setTimeout(() => {
            formRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setFormData({ barcode: '', name: '', price: '', stock: '', category: '', image: '' });
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
                    onClick={() => {
                        if (isFormOpen && editingId) {
                            cancelEdit();
                        } else {
                            setIsFormOpen(!isFormOpen);
                        }
                    }}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    {isFormOpen ? <><FaTimes /> Cancelar</> : <><FaPlus /> Nuevo Producto</>}
                </button>
            </div>

            {/* Add/Edit Product Form */}
            {isFormOpen && (
                <div ref={formRef} className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', borderLeft: editingId ? '4px solid #f59e0b' : '4px solid var(--accent-color)', background: 'white' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                        {editingId ? 'Editar Producto' : 'Registrar Nuevo Producto'}
                    </h3>
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
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Stock Actual</label>
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
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-secondary)' }}>URL de Imagen</label>
                            <div style={{ position: 'relative' }}>
                                <FaImage style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    style={{ paddingLeft: '2.5rem' }}
                                    placeholder="https://..."
                                    value={formData.image}
                                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn-primary" style={{ height: '42px', background: editingId ? '#f59e0b' : 'var(--accent-color)' }}>
                            {editingId ? <><FaSave /> Actualizar</> : <><FaSave /> Guardar Item</>}
                        </button>
                    </form>
                </div>
            )}

            {/* Data Grid */}
            <div className="glass-panel" style={{ overflow: 'hidden', padding: 0, background: 'white' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f9fafb', textAlign: 'left', color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Img</th>
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
                        {filteredProducts.map((product) => (
                            <tr key={product.id} style={{
                                borderBottom: '1px solid var(--card-border)',
                                transition: 'background 0.2s',
                                background: editingId === product.id ? '#fffbeb' : 'transparent'
                            }}>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        background: '#f3f4f6',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: '1px solid var(--card-border)'
                                    }}>
                                        {product.image ? (
                                            <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <FaImage style={{ color: '#d1d5db' }} />
                                        )}
                                    </div>
                                </td>
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
                                    <button
                                        onClick={() => handleEdit(product)}
                                        style={{ color: 'var(--text-muted)', background: 'transparent', padding: '8px', cursor: 'pointer' }}
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (window.confirm('¿Seguro que deseas eliminar este producto?')) {
                                                deleteProduct(product.id);
                                            }
                                        }}
                                        style={{ color: '#ef4444', background: 'transparent', padding: '8px', cursor: 'pointer' }}
                                    >
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
