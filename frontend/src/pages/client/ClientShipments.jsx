import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Table from '../../components/Table';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import { Eye, Clock, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const ClientShipments = () => {
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedShipment, setSelectedShipment] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchShipments();
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

    const handleViewTimeline = (shipment) => {
        setSelectedShipment(shipment);
        setIsModalOpen(true);
    };

    const columns = [
        { header: 'Tracking No.', accessor: 'trackingNumber' },
        { header: 'Order Ref', accessor: 'orderId' },
        { 
            header: 'Est. Delivery', 
            accessor: 'estimatedDelivery',
            render: (row) => row.estimatedDelivery ? new Date(row.estimatedDelivery).toLocaleDateString() : 'TBD'
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
                <button onClick={() => handleViewTimeline(row)} className="btn-secondary py-1 px-3 text-xs flex items-center gap-1">
                    <Eye size={14} /> Timeline
                </button>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">My Shipments</h1>
                    <p className="text-muted mt-1">Track your active and completed deliveries</p>
                </div>
            </div>
            
            <div className="glass-panel overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-muted">Loading shipments...</div>
                ) : (
                    <Table columns={columns} data={shipments} />
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Shipment Details">
                {selectedShipment && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-start pb-4 border-b border-white/10">
                            <div>
                                <h2 className="text-xl font-bold text-white mb-1">{selectedShipment.trackingNumber}</h2>
                                <p className="text-sm text-muted">Order ID: {selectedShipment.orderId}</p>
                            </div>
                            <StatusBadge status={selectedShipment.status} />
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="bg-surface/30 p-3 rounded-lg border border-white/5">
                                <span className="text-muted block mb-1 flex items-center gap-1"><MapPin size={14}/> Origin</span>
                                <span className="text-white font-medium">{selectedShipment.originAddress}</span>
                            </div>
                            <div className="bg-surface/30 p-3 rounded-lg border border-white/5">
                                <span className="text-muted block mb-1 flex items-center gap-1"><MapPin size={14}/> Destination</span>
                                <span className="text-white font-medium">{selectedShipment.destinationAddress}</span>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold text-white mb-4">Status Timeline</h3>
                            <div className="relative pl-6 border-l-2 border-white/10 space-y-6 ml-2">
                                {selectedShipment.statusHistory?.slice().reverse().map((history, idx) => (
                                    <div key={idx} className="relative">
                                        <div className="absolute -left-[31px] w-3 h-3 rounded-full bg-primary ring-4 ring-[#0f172a] mt-1"></div>
                                        <div className="bg-surface/50 border border-white/5 rounded-lg p-3">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-semibold text-white text-sm capitalize">{history.status.replace('-', ' ')}</h4>
                                                <span className="text-xs text-muted flex items-center gap-1">
                                                    <Clock size={12} />
                                                    {new Date(history.updatedAt).toLocaleString()}
                                                </span>
                                            </div>
                                            {history.note && <p className="text-sm text-muted">{history.note}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ClientShipments;
