import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Users, Building } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        company_name: '',
        company_address: '',
        company_phone: '',
        industry: 'Retail',
        tax_id: ''
    });
    const [error, setError] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-10">
            <div className="glass-panel p-8 w-full max-w-2xl">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mb-4 text-secondary">
                        <Users size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Create Business Account</h2>
                    <p className="text-muted text-sm mt-1">Register your company on LogisticsPro</p>
                </div>
                
                {error && <div className="bg-red-500/20 text-red-500 p-3 rounded-lg text-sm mb-6 border border-red-500/30 text-center">{error}</div>}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Section 1: Personal Details */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4 border-b border-white/10 pb-2">Personal Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-muted mb-1">Full Name *</label>
                                <input type="text" name="name" className="input-field" value={formData.name} onChange={handleChange} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted mb-1">Email Address *</label>
                                <input type="email" name="email" className="input-field" value={formData.email} onChange={handleChange} required />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-muted mb-1">Password *</label>
                                <input type="password" name="password" className="input-field" value={formData.password} onChange={handleChange} required minLength={6} />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Company Details */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4 border-b border-white/10 pb-2 flex items-center gap-2">
                            <Building size={18} /> Company Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-muted mb-1">Company Name *</label>
                                <input type="text" name="company_name" className="input-field" value={formData.company_name} onChange={handleChange} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted mb-1">Industry *</label>
                                <select name="industry" className="input-field bg-[#1e293b]" value={formData.industry} onChange={handleChange} required>
                                    <option value="Retail">Retail</option>
                                    <option value="Manufacturing">Manufacturing</option>
                                    <option value="Healthcare">Healthcare</option>
                                    <option value="Technology">Technology</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-muted mb-1">Company Address *</label>
                                <input type="text" name="company_address" className="input-field" value={formData.company_address} onChange={handleChange} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted mb-1">Company Phone *</label>
                                <input type="text" name="company_phone" className="input-field" value={formData.company_phone} onChange={handleChange} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted mb-1">Tax ID / VAT (Optional)</label>
                                <input type="text" name="tax_id" className="input-field" value={formData.tax_id} onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="btn-primary w-full mt-6 text-lg py-3">Register Company</button>
                </form>
                <div className="mt-6 text-center text-sm text-muted flex flex-col gap-2">
                    <span>
                        Already have an account? <Link to="/login" className="text-secondary hover:text-white transition-colors">Sign in</Link>
                    </span>
                    <span>
                        Want to track a shipment? <Link to="/track" className="text-secondary hover:text-white transition-colors">Track Publicly</Link>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Register;
