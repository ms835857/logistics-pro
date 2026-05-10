import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Package, Database, Truck, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import GlobalMap from '../components/GlobalMap';
import { StaggerContainer, StaggerItem } from '../components/StaggerList';

const StatCard = ({ title, value, icon, color }) => (
    <motion.div 
        whileHover={{ scale: 1.05, rotateY: 5, rotateX: 5, zIndex: 10 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="glass-panel p-6 flex items-center justify-between cursor-pointer"
        style={{ perspective: 1000 }}
    >
        <div>
            <p className="text-sm font-medium text-muted mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-white">{value}</h3>
        </div>
        <div className={`p-4 rounded-full ${color}`}>
            {icon}
        </div>
    </motion.div>
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
        <div className="space-y-8">
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-8 tracking-tight">
                Dashboard Overview
            </h1>
            
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StaggerItem>
                    <StatCard 
                        title="Total Orders" 
                        value={stats.orders} 
                        icon={<Package size={24} />} 
                        color="bg-blue-500/20 text-blue-500" 
                    />
                </StaggerItem>
                <StaggerItem>
                    <StatCard 
                        title="Inventory Items" 
                        value={stats.inventory} 
                        icon={<Database size={24} />} 
                        color="bg-purple-500/20 text-purple-500" 
                    />
                </StaggerItem>
                <StaggerItem>
                    <StatCard 
                        title="Active Shipments" 
                        value={stats.shipments} 
                        icon={<Truck size={24} />} 
                        color="bg-emerald-500/20 text-emerald-500" 
                    />
                </StaggerItem>
                <StaggerItem>
                    <StatCard 
                        title="Total Suppliers" 
                        value={stats.suppliers} 
                        icon={<Users size={24} />} 
                        color="bg-amber-500/20 text-amber-500" 
                    />
                </StaggerItem>
            </StaggerContainer>
            
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="mt-8"
            >
                <GlobalMap />
            </motion.div>
        </div>
    );
};

export default Dashboard;
