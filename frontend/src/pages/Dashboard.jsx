import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Package, Database, Truck, Users } from 'lucide-react';

const StatCard = ({ title, value, icon, color }) => (
    <div className="glass-panel p-6 flex items-center justify-between hover:-translate-y-1 transition-transform duration-300">
        <div>
            <p className="text-sm font-medium text-muted mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-white">{value}</h3>
        </div>
        <div className={`p-4 rounded-full ${color}`}>
            {icon}
        </div>
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState({
        orders: 0,
        inventory: 0,
        shipments: 0,
        suppliers: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [ordersRes, inventoryRes, shipmentsRes, suppliersRes] = await Promise.all([
                    api.get('/orders'),
                    api.get('/inventory'),
                    api.get('/shipments'),
                    api.get('/suppliers')
                ]);

                setStats({
                    orders: ordersRes.data.data.length,
                    inventory: inventoryRes.data.data.length,
                    shipments: shipmentsRes.data.data.length,
                    suppliers: suppliersRes.data.data.length
                });
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white mb-8">Dashboard Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Total Orders" 
                    value={stats.orders} 
                    icon={<Package size={24} />} 
                    color="bg-blue-500/20 text-blue-500" 
                />
                <StatCard 
                    title="Inventory Items" 
                    value={stats.inventory} 
                    icon={<Database size={24} />} 
                    color="bg-purple-500/20 text-purple-500" 
                />
                <StatCard 
                    title="Active Shipments" 
                    value={stats.shipments} 
                    icon={<Truck size={24} />} 
                    color="bg-emerald-500/20 text-emerald-500" 
                />
                <StatCard 
                    title="Total Suppliers" 
                    value={stats.suppliers} 
                    icon={<Users size={24} />} 
                    color="bg-amber-500/20 text-amber-500" 
                />
            </div>
            
            <div className="mt-12 glass-panel p-8">
                <h2 className="text-xl font-bold text-white mb-4">Welcome to LogisticsPro System</h2>
                <p className="text-muted">Navigate through the system using the top menu. This dashboard is built with a dynamic UI, featuring smooth glassmorphism effects and modern styling to ensure a premium user experience.</p>
            </div>
        </div>
    );
};

export default Dashboard;
