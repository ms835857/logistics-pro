import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import Table from '../components/Table';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import { Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Shipments = () => {
    const { isAdmin } = useContext(AuthContext);
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
            console.error(error);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                // Update status specifically as it requires a note in the backend
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

    const triggerDelete = (id) => {
        setConfirmDelete({ isOpen: true, id });
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
        { header: 'Driver', accessor: 'driverName' }
    ];

    if (isAdmin()) {
        columns.push({
            header: 'Actions',
            accessor: 'actions',
            render: (row) => (
                <div className="flex space-x-2">
                    <button onClick={() => handleEdit(row)} className="p-1 text-primary hover:bg-primary/10 rounded transition-colors">
                        <Edit2 size={16} />
                    </button>
                    <button onClick={() => triggerDelete(row._id)} className="p-1 text-red-500 hover:bg-red-500/10 rounded transition-colors">
                        <Trash2 size={16} />
                    </button>
                </div>
            )
        });
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 tracking-tight">
                    Shipments Tracking
                </h1>
                {isAdmin() && (
                    <button onClick={() => setIsModalOpen(true)} className="btn-primary">Create Shipment</button>
                )}
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
                                <select name="orderId" className="input-field bg-slate-800" value={formData.orderId} onChange={handleInputChange} required>
                                    <option value="">Select an order</option>
                                    {orders.map(o => (
                                        <option key={o.id} value={o.id}>Order #{o.id} - {o.customer_name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input name="driverName" placeholder="Driver Name" className="input-field" value={formData.driverName} onChange={handleInputChange} required />
                                <input name="vehicleNumber" placeholder="Vehicle Number" className="input-field" value={formData.vehicleNumber} onChange={handleInputChange} required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input name="originAddress" placeholder="Origin" className="input-field" value={formData.originAddress} onChange={handleInputChange} required />
                                <input name="destinationAddress" placeholder="Destination" className="input-field" value={formData.destinationAddress} onChange={handleInputChange} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted mb-1">Estimated Delivery</label>
                                <input name="estimatedDelivery" type="date" className="input-field" value={formData.estimatedDelivery} onChange={handleInputChange} required />
                            </div>
                        </>
                    ) : (
                        <>
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
                                <textarea name="note" className="input-field" placeholder="Enter a reason or update note..." value={formData.note} onChange={handleInputChange}></textarea>
                            </div>
                        </>
                    )}
                    <button type="submit" className="btn-primary w-full mt-4">
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

export default Shipments;
