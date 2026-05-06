import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import Table from '../components/Table';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import { Edit2, Trash2 } from 'lucide-react';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        customer_name: '',
        customer_email: '',
        product_name: '',
        quantity: 1,
        total_price: 0,
        supplier_id: '',
        status: 'pending'
    });

    useEffect(() => {
        fetchOrders();
        fetchSuppliers();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await api.get('/orders');
            setOrders(res.data.data);
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
                await api.put(`/orders/${editId}`, formData);
            } else {
                await api.post('/orders', formData);
            }
            closeModal();
            fetchOrders();
        } catch (error) {
            alert(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleEdit = (order) => {
        setEditId(order.id);
        setFormData({
            customer_name: order.customer_name,
            customer_email: order.customer_email || '',
            product_name: order.product_name,
            quantity: order.quantity,
            total_price: order.total_price,
            supplier_id: order.supplier_id || '',
            status: order.status
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            try {
                await api.delete(`/orders/${id}`);
                fetchOrders();
            } catch (error) {
                alert('Failed to delete order');
            }
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditId(null);
        setFormData({
            customer_name: '',
            customer_email: '',
            product_name: '',
            quantity: 1,
            total_price: 0,
            supplier_id: '',
            status: 'pending'
        });
    };

    const columns = [
        { header: 'Order ID', accessor: 'id' },
        { header: 'Customer', accessor: 'customer_name' },
        { header: 'Product', accessor: 'product_name' },
        { header: 'Qty', accessor: 'quantity' },
        { header: 'Total ($)', accessor: 'total_price' },
        { 
            header: 'Status', 
            accessor: 'status', 
            render: (row) => <StatusBadge status={row.status} /> 
        },
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
                <h1 className="text-2xl font-bold text-white">Orders Management</h1>
                <button onClick={() => setIsModalOpen(true)} className="btn-primary">Create Order</button>
            </div>
            
            <div className="glass-panel overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-muted">Loading orders...</div>
                ) : (
                    <Table columns={columns} data={orders} />
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal} title={editId ? 'Edit Order' : 'Create New Order'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-muted mb-1">Customer Name</label>
                            <input name="customer_name" className="input-field" value={formData.customer_name} onChange={handleInputChange} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-muted mb-1">Customer Email</label>
                            <input name="customer_email" type="email" className="input-field" value={formData.customer_email} onChange={handleInputChange} required />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-muted mb-1">Product Name</label>
                            <input name="product_name" className="input-field" value={formData.product_name} onChange={handleInputChange} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-muted mb-1">Quantity</label>
                            <input name="quantity" type="number" min="1" className="input-field" value={formData.quantity} onChange={handleInputChange} required />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-muted mb-1">Total Price ($)</label>
                            <input name="total_price" type="number" step="0.01" className="input-field" value={formData.total_price} onChange={handleInputChange} required />
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
                    </div>
                    {editId && (
                        <div>
                            <label className="block text-sm font-medium text-muted mb-1">Status</label>
                            <select name="status" className="input-field bg-slate-800" value={formData.status} onChange={handleInputChange} required>
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="dispatched">Dispatched</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    )}
                    <button type="submit" className="btn-primary w-full mt-4">
                        {editId ? 'Update Order' : 'Create Order'}
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default Orders;
