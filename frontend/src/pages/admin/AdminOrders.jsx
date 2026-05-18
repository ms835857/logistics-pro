import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Table from '../../components/Table';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import ConfirmModal from '../../components/ConfirmModal';
import { Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, id: null });
    const [formData, setFormData] = useState({
        manual_user_id: '',
        product_name: '',
        quantity: 1,
        total_price: 0,
        supplier_id: '',
        status: 'pending',
        delivery_address: '',
        notes: ''
    });

    useEffect(() => {
        fetchOrders();
        fetchSuppliers();
        fetchClients();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await api.get('/orders');
            setOrders(res.data.data);
        } catch (error) {
            toast.error('Failed to load orders');
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

    const fetchClients = async () => {
        try {
            const res = await api.get('/clients');
            setClients(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleClientChange = (e) => {
        const clientId = e.target.value;
        const client = clients.find(c => c.id === clientId);
        if (client) {
            setFormData({
                ...formData,
                manual_user_id: clientId,
                delivery_address: client.company_address || ''
            });
        } else {
            setFormData({ ...formData, manual_user_id: '', delivery_address: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await api.put(`/orders/${editId}`, formData);
                toast.success('Order updated successfully!');
            } else {
                const client = clients.find(c => c.id === formData.manual_user_id);
                if (!client) return toast.error('Please select a valid client');
                
                await api.post('/orders', {
                    ...formData,
                    manual_customer_name: client.name,
                    manual_customer_email: client.email
                });
                toast.success('Order created successfully!');
            }
            closeModal();
            fetchOrders();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleEdit = (order) => {
        setEditId(order.id);
        setFormData({
            manual_user_id: order.user_id || '',
            product_name: order.product_name,
            quantity: order.quantity,
            total_price: order.total_price || 0,
            supplier_id: order.supplier_id || '',
            status: order.status,
            delivery_address: order.delivery_address || '',
            notes: order.notes || ''
        });
        setIsModalOpen(true);
    };

    const executeDelete = async () => {
        try {
            await api.delete(`/orders/${confirmDelete.id}`);
            toast.success('Order deleted successfully!');
            fetchOrders();
        } catch (error) {
            toast.error('Failed to delete order');
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditId(null);
        setFormData({
            manual_user_id: '',
            product_name: '',
            quantity: 1,
            total_price: 0,
            supplier_id: '',
            status: 'pending',
            delivery_address: '',
            notes: ''
        });
    };

    const columns = [
        { header: 'Invoice', accessor: 'invoice_number' },
        { header: 'Company', accessor: 'company_name' },
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
                    <button onClick={() => handleEdit(row)} className="p-1 text-primary hover:bg-primary/10 rounded transition-colors" title="Edit Order">
                        <Edit2 size={16} />
                    </button>
                    <button onClick={() => setConfirmDelete({ isOpen: true, id: row.id })} className="p-1 text-red-500 hover:bg-red-500/10 rounded transition-colors" title="Delete Order">
                        <Trash2 size={16} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white tracking-tight">Orders Management</h1>
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
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-muted mb-1">Client (Company)</label>
                            <select name="manual_user_id" className="input-field bg-slate-800" value={formData.manual_user_id} onChange={handleClientChange} required disabled={!!editId}>
                                <option value="">Select a client</option>
                                {clients.map(c => (
                                    <option key={c.id} value={c.id}>{c.company_name} - {c.name}</option>
                                ))}
                            </select>
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
                    <div>
                        <label className="block text-sm font-medium text-muted mb-1">Delivery Address</label>
                        <input name="delivery_address" className="input-field" value={formData.delivery_address} onChange={handleInputChange} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted mb-1">Notes</label>
                        <textarea name="notes" className="input-field h-20" value={formData.notes} onChange={handleInputChange} />
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

            <ConfirmModal 
                isOpen={confirmDelete.isOpen} 
                onClose={() => setConfirmDelete({ isOpen: false, id: null })}
                onConfirm={executeDelete}
                title="Delete Order"
                message="Are you sure you want to permanently delete this order? This action cannot be undone."
            />
        </div>
    );
};

export default AdminOrders;
