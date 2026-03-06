import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Zap, Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ email: '', password: '', full_name: '' });
    const [showPass, setShowPass] = useState(false);
    const { login, register } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    // Where to go after login — default to home
    const from = location.state?.from?.pathname || '/';
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (isLogin) {
                await login(formData.email, formData.password);
            } else {
                await register(formData.email, formData.password, formData.full_name);
            }
            // Go back to where they came from
            navigate(from, { replace: true });
        } catch {
            setError(isLogin ? 'Invalid email or password.' : 'Registration failed. Try again.');
        } finally {
            setLoading(false);
        }
    };

    const switchMode = () => {
        setIsLogin(!isLogin);
        setError('');
        setFormData({ email: '', password: '', full_name: '' });
    };

    return (
        <div className="min-h-screen flex" style={{ background: 'var(--color-bg-primary)' }}>
            {/* ── Left Brand Panel ──────────────────── */}
            <div
                className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden"
                style={{ background: 'linear-gradient(145deg, #1e1b4b 0%, #0f172a 100%)' }}
            >
                {/* Glow orbs */}
                <div style={{ position: 'absolute', top: '-80px', left: '-80px', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', bottom: '-60px', right: '-40px', width: '280px', height: '280px', background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)', borderRadius: '50%' }} />

                {/* Logo */}
                <div className="flex items-center gap-3 relative z-10">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center pulse-glow"
                        style={{ background: 'linear-gradient(135deg, #6366f1, #7c3aed)' }}>
                        <Zap className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-2xl font-black gradient-text">ShopEasy</span>
                </div>

                {/* Middle Content */}
                <div className="relative z-10">
                    <h2 className="text-4xl font-black mb-4 leading-tight" style={{ color: '#f1f5f9' }}>
                        Your Premium<br />
                        <span className="gradient-text">Shopping Experience</span>
                    </h2>
                    <p className="text-lg mb-10" style={{ color: '#64748b', lineHeight: 1.7 }}>
                        Access thousands of curated products, exclusive deals, and a seamless checkout — all in one place.
                    </p>

                    {/* Feature points */}
                    {[
                        ['🛍️', 'Curated premium products'],
                        ['🔒', 'Secure & encrypted checkout'],
                        ['⚡', 'Fast delivery, every time'],
                    ].map(([icon, text]) => (
                        <div key={text} className="flex items-center gap-3 mb-3">
                            <span className="text-xl">{icon}</span>
                            <span style={{ color: '#94a3b8', fontWeight: 500 }}>{text}</span>
                        </div>
                    ))}
                </div>

                {/* Bottom creds hint */}
                <div
                    className="relative z-10 p-4 rounded-2xl text-xs"
                    style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#64748b' }}
                >
                    <div className="font-semibold mb-1" style={{ color: '#a78bfa' }}>Demo Credentials</div>
                    <div>Admin: admin@shop.com / admin123</div>
                    <div>User: user@shop.com / user123</div>
                </div>
            </div>

            {/* ── Right Form Panel ──────────────────── */}
            <div className="flex-1 flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md">
                    {/* Tab switcher */}
                    <div
                        className="flex mb-8 p-1 rounded-2xl"
                        style={{ background: 'rgba(30,41,59,0.7)', border: '1px solid rgba(99,102,241,0.15)' }}
                    >
                        {['Sign In', 'Sign Up'].map((tab, i) => {
                            const active = isLogin ? i === 0 : i === 1;
                            return (
                                <button
                                    key={tab}
                                    onClick={() => { setIsLogin(i === 0); setError(''); }}
                                    className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-300"
                                    style={{
                                        background: active ? 'linear-gradient(135deg, #6366f1, #7c3aed)' : 'transparent',
                                        color: active ? '#fff' : '#64748b',
                                        boxShadow: active ? '0 4px 20px rgba(99,102,241,0.4)' : 'none',
                                    }}
                                >
                                    {tab}
                                </button>
                            );
                        })}
                    </div>

                    <h1 className="text-3xl font-black mb-2" style={{ color: '#f1f5f9' }}>
                        {isLogin ? 'Welcome back!' : 'Create account'}
                    </h1>
                    <p className="text-sm mb-8" style={{ color: '#64748b' }}>
                        {isLogin ? 'Sign in to access your account and orders.' : 'Join ShopEasy for a premium shopping experience.'}
                    </p>

                    {/* Error */}
                    {error && (
                        <div className="mb-4 px-4 py-3 rounded-xl text-sm"
                            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#6366f1' }} />
                                <input
                                    type="text"
                                    required
                                    placeholder="Full Name"
                                    className="input-glass pl-11"
                                    value={formData.full_name}
                                    onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                />
                            </div>
                        )}

                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#6366f1' }} />
                            <input
                                type="email"
                                required
                                placeholder="Email address"
                                className="input-glass pl-11"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#6366f1' }} />
                            <input
                                type={showPass ? 'text' : 'password'}
                                required
                                placeholder="Password"
                                className="input-glass pl-11 pr-12"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass(!showPass)}
                                className="absolute right-4 top-1/2 -translate-y-1/2"
                                style={{ color: '#64748b' }}
                            >
                                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-4 text-base mt-2 disabled:opacity-60"
                            style={{ borderRadius: '14px' }}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2 justify-center">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    {isLogin ? 'Signing in...' : 'Creating account...'}
                                </span>
                            ) : (
                                <>
                                    {isLogin ? 'Sign In' : 'Create Account'}
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center mt-6 text-sm" style={{ color: '#64748b' }}>
                        {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                        <button onClick={switchMode} className="font-semibold transition-colors" style={{ color: '#a78bfa' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#c4b5fd'}
                            onMouseLeave={e => e.currentTarget.style.color = '#a78bfa'}>
                            {isLogin ? 'Sign Up' : 'Sign In'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
