import React from 'react';

const StatusBadge = ({ status }) => {
    const statusStyles = {
        pending: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
        confirmed: 'bg-blue-500/20 text-blue-500 border-blue-500/30',
        dispatched: 'bg-indigo-500/20 text-indigo-500 border-indigo-500/30',
        delivered: 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30',
        cancelled: 'bg-red-500/20 text-red-500 border-red-500/30',
        preparing: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
        'in-transit': 'bg-indigo-500/20 text-indigo-500 border-indigo-500/30',
        'out-for-delivery': 'bg-blue-500/20 text-blue-500 border-blue-500/30',
        failed: 'bg-red-500/20 text-red-500 border-red-500/30',
    };

    const style = statusStyles[status.toLowerCase()] || 'bg-slate-500/20 text-slate-400 border-slate-500/30';

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${style}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};

export default StatusBadge;
