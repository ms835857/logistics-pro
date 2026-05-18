import React from 'react';

const StatusBadge = ({ status }) => {
    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            // Order statuses
            case 'pending':
            case 'preparing':
                return 'bg-amber-500/20 text-amber-500 border border-amber-500/30';
            case 'confirmed':
                return 'bg-blue-500/20 text-blue-500 border border-blue-500/30';
            case 'dispatched':
            case 'in-transit':
            case 'out-for-delivery':
                return 'bg-purple-500/20 text-purple-400 border border-purple-500/30';
            case 'delivered':
                return 'bg-green-500/20 text-green-500 border border-green-500/30';
            case 'cancelled':
            case 'failed':
                return 'bg-red-500/20 text-red-500 border border-red-500/30';
            default:
                return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
        }
    };

    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${getStatusStyle(status)}`}>
            {status?.replace(/-/g, ' ')}
        </span>
    );
};

export default StatusBadge;
