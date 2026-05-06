import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import Table from '../components/Table';
import Modal from '../components/Modal';
import { Edit2, Trash2 } from 'lucide-react';

const Suppliers = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        contact_person: '',
        email: '',
        phone: '',
        address: '',
        country: ''
    });

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        try {
            const res = await api.get('/suppliers');
            setSuppliers(res.data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await api.put(`/suppliers/${editId}`, formData);
            } else {
                await api.post('/suppliers', formData);
            }
            closeModal();
            fetchSuppliers();
        } catch (error) {
            alert(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleEdit = (supplier) => {
        setEditId(supplier.id);
        setFormData({
            name: supplier.name,
            contact_person: supplier.contact_person || '',
            email: supplier.email,
            phone: supplier.phone || '',
            address: supplier.address || '',
            country: supplier.country || ''
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to deactivate this supplier?')) {
            try {
                await api.delete(`/suppliers/${id}`);
                fetchSuppliers();
            } catch (error) {
                alert('Failed to delete supplier');
            }
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditId(null);
        setFormData({ name: '', contact_person: '', email: '', phone: '', address: '', country: '' });
    };

    const columns = [
        { header: 'Name', accessor: 'name' },
        { header: 'Contact Person', accessor: 'contact_person' },
        { header: 'Email', accessor: 'email' },
        { header: 'Country', accessor: 'country' },
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
                    <button onClick={() => handleEdit(row)} className="p-1 text-primary hover:bg-primary/10 rounded">
                        <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(row.id)} className="p-1 text-red-500 hover:bg-red-500/10 rounded">
                        <Trash2 size={16} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white">Suppliers Database</h1>
                <button onClick={() => setIsModalOpen(true)} className="btn-primary">Add Supplier</button>
            </div>
            
            <div className="glass-panel overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-muted">Loading suppliers...</div>
                ) : (
                    <Table columns={columns} data={suppliers} />
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal} title={editId ? 'Edit Supplier' : 'Add New Supplier'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-muted mb-1">Supplier Name</label>
                        <input name="name" className="input-field" value={formData.name} onChange={handleInputChange} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted mb-1">Contact Person</label>
                        <input name="contact_person" className="input-field" value={formData.contact_person} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted mb-1">Email</label>
                        <input name="email" type="email" className="input-field" value={formData.email} onChange={handleInputChange} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-muted mb-1">Phone</label>
                            <input name="phone" className="input-field" value={formData.phone} onChange={handleInputChange} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-muted mb-1">Country</label>
                            <input name="country" className="input-field" value={formData.country} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted mb-1">Address</label>
                        <textarea name="address" className="input-field" rows="3" value={formData.address} onChange={handleInputChange}></textarea>
                    </div>
                    <button type="submit" className="btn-primary w-full mt-4">
                        {editId ? 'Update Supplier' : 'Save Supplier'}
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default Suppliers;
