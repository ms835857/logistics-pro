import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Package } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center">
            <div className="glass-panel p-8 w-full max-w-md">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4 text-primary">
                        <Package size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
                    <p className="text-muted text-sm mt-1">Sign in to your account</p>
                </div>
                
                {error && <div className="bg-red-500/20 text-red-500 p-3 rounded-lg text-sm mb-6 border border-red-500/30 text-center">{error}</div>}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-muted mb-1">Email</label>
                        <input 
                            type="email" 
                            className="input-field" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted mb-1">Password</label>
                        <input 
                            type="password" 
                            className="input-field" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <button type="submit" className="btn-primary w-full mt-6">Sign In</button>
                </form>
                <div className="mt-6 text-center text-sm text-muted">
                    Don't have an account? <Link to="/register" className="text-primary hover:text-white transition-colors">Register here</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
