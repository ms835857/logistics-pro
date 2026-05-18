import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Table from '../../components/Table';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import ConfirmModal from '../../components/ConfirmModal';
import { Edit2, Trash2, Info } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminShipments = () => {
    const [shipments, setShipments] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, id: null });
    const [formData, setFormData] = useState({
        orderId: '',
        driverName: '',
        vehicleNumber: '',
        originAddress: '',
        destinationAddress: '',
        estimatedDelivery: '',
        status: 'preparing',
        note: ''
    });

    useEffect(() => {
        fetchShipments();
        fetchOrders();
    }, []);

    const fetchShipments = async () => {
        try {
            const res = await api.get('/shipments');
            setShipments(res.data.data);
        } catch (error) {
            toast.error('Failed to load shipments');
        } finally {
            setLoading(false);
        }
    };

    const fetchOrders = async () => {
        try {
            const res = await api.get('/orders');
            setOrders(res.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleOrderChange = (e) => {
        const orderId = e.target.value;
        const selectedOrder = orders.find(o => o.id.toString() === orderId);
        if (selectedOrder) {
            setFormData({
                ...formData,
                orderId: orderId,
                destinationAddress: selectedOrder.delivery_address || ''
            });
        } else {
            setFormData({ ...formData, orderId: '', destinationAddress: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await api.patch(`/shipments/${editId}/status`, { 
                    status: formData.status, 
                    note: formData.note || 'Status updated manually' 
                });
                toast.success('Shipment status updated!');
            } else {
                await api.post('/shipments', formData);
                toast.success('Shipment created successfully!');
            }
            closeModal();
            fetchShipments();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleEdit = (shipment) => {
        setEditId(shipment._id);
        setFormData({
            orderId: shipment.orderId,
            driverName: shipment.driverName || '',
            vehicleNumber: shipment.vehicleNumber || '',
            originAddress: shipment.originAddress || '',
            destinationAddress: shipment.destinationAddress || '',
            estimatedDelivery: shipment.estimatedDelivery ? shipment.estimatedDelivery.split('T')[0] : '',
            status: shipment.status,
            note: ''
        });
        setIsModalOpen(true);
    };

    const executeDelete = async () => {
        try {
            await api.delete(`/shipments/${confirmDelete.id}`);
            toast.success('Shipment deleted successfully!');
            fetchShipments();
        } catch (error) {
            toast.error('Failed to delete shipment');
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditId(null);
        setFormData({
            orderId: '',
            driverName: '',
            vehicleNumber: '',
            originAddress: '',
            destinationAddress: '',
            estimatedDelivery: '',
            status: 'preparing',
            note: ''
        });
    };

    const columns = [
        { header: 'Tracking No.', accessor: 'trackingNumber' },
        { header: 'Order Ref', accessor: 'orderId' },
        { 
            header: 'Status', 
            accessor: 'status',
            render: (row) => <StatusBadge status={row.status} />
        },
        { header: 'Driver', accessor: 'driverName' },
        {
            header: 'Actions',
            accessor: 'actions',
            render: (row) => (
                <div className="flex space-x-2">
                    <button onClick={() => handleEdit(row)} className="p-1 text-primary hover:bg-primary/10 rounded transition-colors" title="Update Status">
                        <Edit2 size={16} />
                    </button>
                    <button onClick={() => setConfirmDelete({ isOpen: true, id: row._id })} className="p-1 text-red-500 hover:bg-red-500/10 rounded transition-colors" title="Delete Shipment">
                        <Trash2 size={16} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Shipments Management</h1>
                    <p className="text-muted mt-1">Manage deliveries and update transit status</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="btn-primary">Create Shipment</button>
            </div>
            
            <div className="glass-panel overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-muted">Loading shipments...</div>
                ) : (
                    <Table columns={columns} data={shipments} />
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal} title={editId ? 'Update Shipment Status' : 'Create New Shipment'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {!editId ? (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-muted mb-1">Select Order</label>
                                <select name="orderId" className="input-field bg-slate-800" value={formData.orderId} onChange={handleOrderChange} required>
                                    <option value="">Select an order</option>
                                    {orders.map(o => (
                                        <option key={o.id} value={o.id}>{o.invoice_number} - {o.customer_name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-muted mb-1">Driver Name</label>
                                    <input name="driverName" className="input-field" value={formData.driverName} onChange={handleInputChange} required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-muted mb-1">Vehicle Number</label>
                                    <input name="vehicleNumber" className="input-field" value={formData.vehicleNumber} onChange={handleInputChange} required />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-muted mb-1">Origin Address</label>
                                    <input name="originAddress" className="input-field" value={formData.originAddress} onChange={handleInputChange} required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-muted mb-1">Destination Address</label>
                                    <input name="destinationAddress" className="input-field" value={formData.destinationAddress} onChange={handleInputChange} required />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted mb-1">Estimated Delivery</label>
                                <input name="estimatedDelivery" type="date" className="input-field" value={formData.estimatedDelivery} onChange={handleInputChange} required />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="bg-surface/50 border border-white/5 p-4 rounded-lg mb-4 flex gap-3">
                                <Info className="text-primary shrink-0" />
                                <div className="text-sm text-muted">
                                    <p className="text-white font-medium mb-1">Update Tracking Status</p>
                                    <p>Selecting a new status and adding a note will append to the shipment's history timeline visible to the client.</p>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted mb-1">Update Status</label>
                                <select name="status" className="input-field bg-slate-800" value={formData.status} onChange={handleInputChange} required>
                                    <option value="preparing">Preparing</option>
                                    <option value="in-transit">In-Transit</option>
                                    <option value="out-for-delivery">Out-for-Delivery</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="failed">Failed</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted mb-1">Status Note</label>
                                <textarea name="note" className="input-field h-24" placeholder="Enter a reason or update note..." value={formData.note} onChange={handleInputChange}></textarea>
                            </div>
                        </>
                    )}
                    <button type="submit" className="btn-primary w-full mt-4 py-3">
                        {editId ? 'Update Status' : 'Create Shipment'}
                    </button>
                </form>
            </Modal>

            <ConfirmModal 
                isOpen={confirmDelete.isOpen} 
                onClose={() => setConfirmDelete({ isOpen: false, id: null })}
                onConfirm={executeDelete}
                title="Delete Shipment"
                message="Are you sure you want to permanently delete this shipment tracking record?"
            />
        </div>
    );
};

export default AdminShipments;
