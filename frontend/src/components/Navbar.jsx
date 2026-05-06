import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Package, Users, Truck, Database, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
    const { currentUser, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!currentUser) return null;

    return (
        <nav className="bg-surface/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-8">
                        <Link to="/dashboard" className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                            LogisticsPro
                        </Link>
                        <div className="hidden md:flex space-x-4">
                            <NavLink to="/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" />
                            <NavLink to="/orders" icon={<Package size={18} />} label="Orders" />
                            <NavLink to="/inventory" icon={<Database size={18} />} label="Inventory" />
                            <NavLink to="/shipments" icon={<Truck size={18} />} label="Shipments" />
                            <NavLink to="/suppliers" icon={<Users size={18} />} label="Suppliers" />
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="text-sm">
                            <span className="text-muted block text-right">{currentUser.name}</span>
                            <span className="text-xs text-primary font-semibold uppercase">{currentUser.role}</span>
                        </div>
                        <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-white/10 text-muted hover:text-white transition-colors">
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

const NavLink = ({ to, icon, label }) => (
    <Link to={to} className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-muted hover:text-white hover:bg-white/5 transition-colors">
        {icon}
        <span>{label}</span>
    </Link>
);

export default Navbar;
