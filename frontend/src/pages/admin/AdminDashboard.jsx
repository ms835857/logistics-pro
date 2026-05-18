import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Package, Truck, Database, Users, DollarSign, AlertCircle } from 'lucide-react';

const AdminDashboard = () => {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await api.get('/dashboard/admin');
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
        { title: 'Pending Orders', value: metrics.pendingOrders, icon: <Package size={24} />, color: 'bg-amber-500/20 text-amber-500 border-amber-500/30' },
        { title: 'Active Shipments', value: metrics.activeShipments, icon: <Truck size={24} />, color: 'bg-blue-500/20 text-blue-500 border-blue-500/30' },
        { title: 'Low Stock Items', value: metrics.lowStockItems, icon: <Database size={24} />, color: 'bg-red-500/20 text-red-500 border-red-500/30' },
        { title: 'Total Clients', value: metrics.totalClients, icon: <Users size={24} />, color: 'bg-purple-500/20 text-purple-500 border-purple-500/30' },
        { title: 'Total Revenue', value: `$${metrics.totalRevenue.toLocaleString()}`, icon: <DollarSign size={24} />, color: 'bg-green-500/20 text-green-500 border-green-500/30' },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">Admin Overview</h1>
                <p className="text-muted mt-2">Platform performance and operations</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-10">
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass-panel p-6">
                    <h3 className="text-xl font-semibold text-white mb-4 border-b border-white/10 pb-4 flex items-center gap-2">
                        <AlertCircle className="text-amber-500" size={20} />
                        Action Required
                    </h3>
                    <p className="text-muted">You have {metrics.pendingOrders} pending orders that need pricing and assignment.</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
