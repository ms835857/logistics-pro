import React, { useState } from 'react';
import { Search, Package, MapPin, Calendar, Clock, AlertCircle } from 'lucide-react';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';

const TrackShipment = () => {
    const [trackingNumber, setTrackingNumber] = useState('');
    const [shipment, setShipment] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!trackingNumber) return;

        setLoading(true);
        setError('');
        setShipment(null);

        try {
            const res = await api.get(`/shipments/track/${trackingNumber}`);
            setShipment(res.data.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Shipment not found');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] py-10">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-white mb-2">Track Your Shipment</h1>
                    <p className="text-muted">Enter your tracking number to see the real-time status of your delivery.</p>
                </div>

                <div className="glass-panel p-6 mb-8">
                    <form onSubmit={handleSearch} className="flex gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-3 text-muted" size={20} />
                            <input 
                                type="text" 
                                className="input-field pl-10" 
                                placeholder="e.g. SHIP-123456" 
                                value={trackingNumber}
                                onChange={(e) => setTrackingNumber(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn-primary flex items-center gap-2" disabled={loading}>
                            {loading ? 'Searching...' : 'Track'}
                        </button>
                    </form>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-start gap-3">
                        <AlertCircle className="shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-medium text-red-300">Tracking Failed</h4>
                            <p className="text-sm mt-1">{error}</p>
                        </div>
                    </div>
                )}

                {shipment && (
                    <div className="glass-panel p-8">
                        <div className="flex justify-between items-start mb-8 pb-6 border-b border-white/10">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-1">{shipment.trackingNumber}</h2>
                                <p className="text-sm text-muted">Order ID: {shipment.orderId}</p>
                            </div>
                            <StatusBadge status={shipment.status} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <p className="text-sm text-muted mb-1">Origin</p>
                                    <p className="font-medium text-white">{shipment.originAddress}</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent shrink-0">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <p className="text-sm text-muted mb-1">Destination</p>
                                    <p className="font-medium text-white">{shipment.destinationAddress}</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative pl-6 border-l-2 border-white/10 space-y-8 mt-10">
                            {shipment.statusHistory?.slice().reverse().map((history, idx) => (
                                <div key={idx} className="relative">
                                    <div className="absolute -left-[35px] w-4 h-4 rounded-full bg-primary ring-4 ring-[#0f172a]"></div>
                                    <div className="bg-surface/50 border border-white/5 rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-semibold text-white capitalize">{history.status.replace('-', ' ')}</h4>
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
                )}
            </div>
        </div>
    );
};

export default TrackShipment;
