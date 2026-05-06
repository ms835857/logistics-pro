import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import Table from '../components/Table';
import Modal from '../components/Modal';
import { Edit2, Trash2 } from 'lucide-react';

const Inventory = () => {
    const [inventory, setInventory] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        product_name: '',
        sku: '',
        quantity_in_stock: 0,
        unit_price: 0,
        warehouse_location: '',
        supplier_id: '',
        low_stock_threshold: 10
    });

    useEffect(() => {
        fetchInventory();
        fetchSuppliers();
    }, []);

    const fetchInventory = async () => {
        try {
            const res = await api.get('/inventory');
            setInventory(res.data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSuppliers = async () => {
        try {
            const res = await api.get('/suppliers');
            setSuppliers(res.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await api.put(`/inventory/${editId}`, formData);
            } else {
                await api.post('/inventory', formData);
            }
            closeModal();
            fetchInventory();
        } catch (error) {
            alert(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleEdit = (item) => {
        setEditId(item.id);
        setFormData({
            product_name: item.product_name,
            sku: item.sku,
            quantity_in_stock: item.quantity_in_stock,
            unit_price: item.unit_price,
            warehouse_location: item.warehouse_location || '',
            supplier_id: item.supplier_id || '',
            low_stock_threshold: item.low_stock_threshold || 10
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await api.delete(`/inventory/${id}`);
                fetchInventory();
            } catch (error) {
                alert('Failed to delete item');
            }
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditId(null);
        setFormData({
            product_name: '',
            sku: '',
            quantity_in_stock: 0,
            unit_price: 0,
            warehouse_location: '',
            supplier_id: '',
            low_stock_threshold: 10
        });
    };

    const columns = [
        { header: 'SKU', accessor: 'sku' },
        { header: 'Product Name', accessor: 'product_name' },
        { 
            header: 'Stock Level', 
            accessor: 'quantity_in_stock',
            render: (row) => (
                <div className="flex items-center space-x-2">
                    <span className={row.low_stock ? 'text-red-400 font-bold' : 'text-white'}>
                        {row.quantity_in_stock}
                    </span>
                    {row.low_stock && (
                        <span className="bg-red-500/20 text-red-500 text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">
                            Low Stock
                        </span>
                    )}
                </div>
            )
        },
        { header: 'Unit Price ($)', accessor: 'unit_price' },
        {
            header: 'Actions',
            accessor: 'actions',
            render: (row) => (
                <div className="flex space-x-2">
                    <button onClick={() => handleEdit(row)} className="p-1 text-primary hover:bg-primary/10 rounded">
                        <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(row.id)} className="p-1 text-red-500 hover:bg-red-500/10 rounded">
                        <Trash2 size={16} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white">Inventory Management</h1>
                <button onClick={() => setIsModalOpen(true)} className="btn-primary">Add Item</button>
            </div>
            
            <div className="glass-panel overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-muted">Loading inventory...</div>
                ) : (
                    <Table columns={columns} data={inventory} />
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal} title={editId ? 'Edit Inventory Item' : 'Add Inventory Item'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-muted mb-1">Product Name</label>
                            <input name="product_name" className="input-field" value={formData.product_name} onChange={handleInputChange} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-muted mb-1">SKU</label>
                            <input name="sku" className="input-field" value={formData.sku} onChange={handleInputChange} required />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-muted mb-1">Stock Quantity</label>
                            <input name="quantity_in_stock" type="number" className="input-field" value={formData.quantity_in_stock} onChange={handleInputChange} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-muted mb-1">Unit Price ($)</label>
                            <input name="unit_price" type="number" step="0.01" className="input-field" value={formData.unit_price} onChange={handleInputChange} required />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted mb-1">Supplier</label>
                        <select name="supplier_id" className="input-field bg-slate-800" value={formData.supplier_id} onChange={handleInputChange} required>
                            <option value="">Select a supplier</option>
                            {suppliers.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted mb-1">Warehouse Location</label>
                        <input name="warehouse_location" className="input-field" value={formData.warehouse_location} onChange={handleInputChange} />
                    </div>
                    <button type="submit" className="btn-primary w-full mt-4">
                        {editId ? 'Update Item' : 'Save Item'}
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default Inventory;
