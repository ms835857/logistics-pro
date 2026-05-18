import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { Building } from 'lucide-react';

const ClientProfile = () => {
    const { currentUser } = useContext(AuthContext);
    
    // Personal Details
    const [name, setName] = useState(currentUser?.name || '');
    const [email, setEmail] = useState(currentUser?.email || '');
    
    // Company Details
    const [companyName, setCompanyName] = useState(currentUser?.company_name || '');
    const [industry, setIndustry] = useState(currentUser?.industry || 'Retail');
    const [companyAddress, setCompanyAddress] = useState(currentUser?.company_address || '');
    const [companyPhone, setCompanyPhone] = useState(currentUser?.company_phone || '');
    const [taxId, setTaxId] = useState(currentUser?.tax_id || '');

    // Security
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            await api.put('/users/me', { 
                name, email, 
                company_name: companyName,
                industry,
                company_address: companyAddress,
                company_phone: companyPhone,
                tax_id: taxId
            });
            toast.success('Company profile updated successfully');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update profile');
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        try {
            await api.put('/users/me/password', { currentPassword, newPassword });
            toast.success('Password updated successfully');
            setCurrentPassword('');
            setNewPassword('');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update password');
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold text-white tracking-tight">Business Profile</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass-panel p-6">
                        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                            <Building size={20} /> Company Information
                        </h2>
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Representative Name</label>
                                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Work Email</label>
                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Company Name</label>
                                    <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="input-field" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Industry</label>
                                    <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="input-field bg-[#1e293b]" required>
                                        <option value="Retail">Retail</option>
                                        <option value="Manufacturing">Manufacturing</option>
                                        <option value="Healthcare">Healthcare</option>
                                        <option value="Technology">Technology</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Primary Address</label>
                                    <input type="text" value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} className="input-field" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Business Phone</label>
                                    <input type="text" value={companyPhone} onChange={(e) => setCompanyPhone(e.target.value)} className="input-field" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Tax ID / VAT</label>
                                    <input type="text" value={taxId} onChange={(e) => setTaxId(e.target.value)} className="input-field" />
                                </div>
                            </div>
                            <button type="submit" className="btn-primary w-full mt-4 py-3">
                                Update Company Details
                            </button>
                        </form>
                    </div>
                </div>

                <div>
                    <div className="glass-panel p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">Security Settings</h2>
                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Current Password</label>
                                <input 
                                    type="password" 
                                    value={currentPassword} 
                                    onChange={(e) => setCurrentPassword(e.target.value)} 
                                    className="input-field" 
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">New Password</label>
                                <input 
                                    type="password" 
                                    value={newPassword} 
                                    onChange={(e) => setNewPassword(e.target.value)} 
                                    className="input-field" 
                                    required
                                />
                            </div>
                            <button type="submit" className="btn-secondary w-full mt-4 border border-blue-500/50 hover:bg-blue-500/10 text-blue-400">
                                Change Password
                            </button>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ClientProfile;
