import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api/axios';
import Table from '../../components/Table';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import { XCircle, PackagePlus } from 'lucide-react';
import toast from 'react-hot-toast';

const ClientOrders = () => {
    const { currentUser } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Client leaves total_price blank
    const [formData, setFormData] = useState({
        product_name: '',
        quantity: 1,
        supplier_id: '',
        delivery_address: currentUser?.company_address || '',
        notes: ''
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

    const handleInputChange = (e) => {
        const value = e.target.type === 'number' ? parseInt(e.target.value) : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/orders', formData);
            toast.success('Order placed successfully! Pending admin pricing.');
            closeModal();
            fetchOrders();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to place order');
        }
    };

    const handleCancelOrder = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this order?')) return;
        try {
            await api.patch(`/orders/${id}/status`, { status: 'cancelled' });
            toast.success('Order cancelled successfully!');
            fetchOrders();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to cancel order');
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFormData({
            product_name: '',
            quantity: 1,
            supplier_id: '',
            delivery_address: currentUser?.company_address || '',
            notes: ''
        });
    };

    const columns = [
        { header: 'Invoice', accessor: 'invoice_number' },
        { header: 'Date', accessor: 'created_at', render: (row) => new Date(row.created_at).toLocaleDateString() },
        { header: 'Product', accessor: 'product_name' },
        { header: 'Qty', accessor: 'quantity' },
        { 
            header: 'Total ($)', 
            accessor: 'total_price',
            render: (row) => row.total_price ? `$${parseFloat(row.total_price).toLocaleString()}` : <span className="text-muted italic">Pending Review</span> 
        },
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
                    {row.status === 'pending' && (
                        <button onClick={() => handleCancelOrder(row.id)} className="p-1 text-orange-500 hover:bg-orange-500/10 rounded transition-colors" title="Cancel Order">
                            <XCircle size={16} />
                        </button>
                    )}
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">My Orders</h1>
                    <p className="text-muted mt-1">Manage your supply chain purchases</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
                    <PackagePlus size={18} /> Place Order
                </button>
            </div>
            
            <div className="glass-panel overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-muted">Loading your orders...</div>
                ) : (
                    <Table columns={columns} data={orders} />
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal} title="Place New Order">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="bg-surface/50 border border-white/5 p-4 rounded-lg mb-4 text-sm text-muted">
                        <p><strong>Note:</strong> Price will be determined by logistics admin after order submission.</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted mb-1">Product Name</label>
                        <input name="product_name" className="input-field" value={formData.product_name} onChange={handleInputChange} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-muted mb-1">Quantity</label>
                            <input name="quantity" type="number" min="1" className="input-field" value={formData.quantity} onChange={handleInputChange} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-muted mb-1">Preferred Supplier</label>
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
                        <label className="block text-sm font-medium text-muted mb-1">Additional Notes</label>
                        <textarea name="notes" className="input-field h-24" value={formData.notes} onChange={handleInputChange} placeholder="Special instructions, packaging requests, etc." />
                    </div>
                    <button type="submit" className="btn-primary w-full mt-4 py-3">
                        Submit Order Request
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default ClientOrders;
