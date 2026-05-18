import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Package, Users, Truck, Database, LayoutDashboard, User, Shield, Briefcase } from 'lucide-react';

const Navbar = () => {
    const { currentUser, logout, isAdmin } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!currentUser) return null;

    const isUserAdmin = isAdmin();

    return (
        <nav className="bg-surface/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-8">
                        <Link to={isUserAdmin ? "/admin/dashboard" : "/dashboard"} className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                            LogisticsPro {isUserAdmin && <span className="text-sm font-normal text-muted">(Admin)</span>}
                        </Link>
                        <div className="hidden md:flex space-x-4">
                            {isUserAdmin ? (
                                <>
                                    <NavLink to="/admin/dashboard" icon={<LayoutDashboard size={18} />} label="Overview" />
                                    <NavLink to="/admin/orders" icon={<Package size={18} />} label="All Orders" />
                                    <NavLink to="/admin/inventory" icon={<Database size={18} />} label="Inventory" />
                                    <NavLink to="/admin/shipments" icon={<Truck size={18} />} label="Shipments" />
                                    <NavLink to="/admin/suppliers" icon={<Briefcase size={18} />} label="Suppliers" />
                                    <NavLink to="/admin/clients" icon={<Users size={18} />} label="Clients" />
                                </>
                            ) : (
                                <>
                                    <NavLink to="/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" />
                                    <NavLink to="/orders" icon={<Package size={18} />} label="My Orders" />
                                    <NavLink to="/shipments" icon={<Truck size={18} />} label="My Shipments" />
                                    <NavLink to="/suppliers" icon={<Briefcase size={18} />} label="My Suppliers" />
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link to={isUserAdmin ? "/admin/profile" : "/profile"} className="flex items-center space-x-2 text-muted hover:text-white transition-colors border-r border-white/10 pr-4">
                            <User size={18} />
                            <span className="text-sm font-medium">Profile</span>
                        </Link>
                        <div className="text-sm">
                            <span className="text-muted block text-right">{currentUser.name}</span>
                            <span className="text-xs text-primary font-semibold uppercase">{isUserAdmin ? 'Admin' : currentUser.company_name || 'Client'}</span>
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
