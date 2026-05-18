import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { Power, PowerOff } from 'lucide-react';
import Table from '../../components/Table';
import ConfirmModal from '../../components/ConfirmModal';

const AdminClients = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [confirmToggle, setConfirmToggle] = useState({ isOpen: false, client: null });

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const res = await api.get('/clients');
            setClients(res.data);
            setLoading(false);
        } catch (error) {
            toast.error('Failed to load clients');
            setLoading(false);
        }
    };

    const handleToggleStatus = async () => {
        if (!confirmToggle.client) return;
        const { id, is_active } = confirmToggle.client;
        
        try {
            await api.patch(`/clients/${id}/status`, { is_active: !is_active });
            toast.success(`Client ${!is_active ? 'activated' : 'deactivated'} successfully`);
            setConfirmToggle({ isOpen: false, client: null });
            fetchClients();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update client status');
        }
    };

    const columns = [
        { header: 'Company Name', accessor: 'company_name' },
        { header: 'Rep Name', accessor: 'name' },
        { header: 'Email', accessor: 'email' },
        { header: 'Industry', accessor: 'industry' },
        { header: 'Total Orders', accessor: 'totalOrders' },
        { 
            header: 'Status', 
            accessor: 'is_active',
            render: (row) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.is_active ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'}`}>
                    {row.is_active ? 'Active' : 'Inactive'}
                </span>
            )
        },
        {
            header: 'Actions',
            accessor: 'actions',
            render: (row) => (
                <div className="flex space-x-2">
                    <button 
                        onClick={() => setConfirmToggle({ isOpen: true, client: row })}
                        className={`p-1 rounded transition-colors ${row.is_active ? 'text-red-500 hover:bg-red-500/10' : 'text-emerald-500 hover:bg-emerald-500/10'}`}
                        title={row.is_active ? "Deactivate Client" : "Activate Client"}
                    >
                        {row.is_active ? <PowerOff size={16} /> : <Power size={16} />}
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Client Accounts</h1>
                    <p className="text-muted mt-1">Manage B2B customer accounts</p>
                </div>
            </div>

            <div className="glass-panel overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-muted">Loading clients...</div>
                ) : (
                    <Table columns={columns} data={clients} />
                )}
            </div>

            <ConfirmModal 
                isOpen={confirmToggle.isOpen} 
                onClose={() => setConfirmToggle({ isOpen: false, client: null })}
                onConfirm={handleToggleStatus}
                title={confirmToggle.client?.is_active ? "Deactivate Client" : "Activate Client"}
                message={confirmToggle.client?.is_active 
                    ? `Are you sure you want to deactivate ${confirmToggle.client?.company_name}? They will no longer be able to log in or place orders.`
                    : `Are you sure you want to activate ${confirmToggle.client?.company_name}? They will regain access to the platform.`}
            />
        </div>
    );
};

export default AdminClients;
