import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Package, Truck, DollarSign, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const ClientDashboard = () => {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await api.get('/dashboard/client');
                setMetrics(res.data.data);
            } catch (error) {
                console.error("Failed to load dashboard metrics", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    if (loading) return <div className="text-center py-20 text-muted">Loading dashboard...</div>;
    if (!metrics) return <div className="text-center py-20 text-red-500">Failed to load data.</div>;

    const cards = [
        { title: 'Total Orders', value: metrics.totalOrders, icon: <Package size={24} />, color: 'bg-blue-500/20 text-blue-500 border-blue-500/30' },
        { title: 'Active Shipments', value: metrics.activeShipments, icon: <Truck size={24} />, color: 'bg-amber-500/20 text-amber-500 border-amber-500/30' },
        { title: 'Delivered', value: metrics.deliveredShipments, icon: <CheckCircle size={24} />, color: 'bg-green-500/20 text-green-500 border-green-500/30' },
        { title: 'Total Spend', value: `$${metrics.totalSpend.toLocaleString()}`, icon: <DollarSign size={24} />, color: 'bg-purple-500/20 text-purple-500 border-purple-500/30' },
    ];

    return (
        <div>
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Client Portal</h1>
                    <p className="text-muted mt-2">Manage your supply chain</p>
                </div>
                <Link to="/orders" className="btn-primary">Place New Order</Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
                {cards.map((card, idx) => (
                    <div key={idx} className={`glass-panel p-6 border ${card.color}`}>
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl bg-surface/50`}>
                                {card.icon}
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium opacity-80 mb-1">{card.title}</p>
                            <h3 className="text-3xl font-bold">{card.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-8">
                <div className="glass-panel p-6 flex flex-col items-center justify-center py-12 text-center border border-white/5">
                    <Truck className="text-muted mb-4 opacity-50" size={48} />
                    <h3 className="text-xl font-semibold text-white mb-2">Track your active deliveries</h3>
                    <p className="text-muted max-w-md mx-auto mb-6">You currently have {metrics.activeShipments} shipments in transit to your facilities.</p>
                    <Link to="/shipments" className="btn-secondary">View Shipments</Link>
                </div>
            </div>
        </div>
    );
};

export default ClientDashboard;
