import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Table from '../../components/Table';
import toast from 'react-hot-toast';

const ClientSuppliers = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMySuppliers();
    }, []);

    const fetchMySuppliers = async () => {
        try {
            const res = await api.get('/suppliers/my-suppliers');
            setSuppliers(res.data.data);
        } catch (error) {
            toast.error('Failed to load your suppliers');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { header: 'Supplier Name', accessor: 'name' },
        { header: 'Contact Person', accessor: 'contact_person' },
        { header: 'Email', accessor: 'email' },
        { header: 'Country', accessor: 'country' }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">My Suppliers</h1>
                    <p className="text-muted mt-1">Partners involved in your active supply chain</p>
                </div>
            </div>
            
            <div className="glass-panel overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-muted">Loading your suppliers...</div>
                ) : suppliers.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-surface border border-white/10 rounded-full flex items-center justify-center mx-auto mb-4 text-muted">
                            <span className="text-2xl">🌍</span>
                        </div>
                        <h3 className="text-xl font-medium text-white mb-2">No Suppliers Found</h3>
                        <p className="text-muted">You do not have any suppliers linked to your orders yet.</p>
                    </div>
                ) : (
                    <Table columns={columns} data={suppliers} />
                )}
            </div>
        </div>
    );
};

export default ClientSuppliers;
