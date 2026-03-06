import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, LogOut, User as UserIcon, Zap, Menu, X } from 'lucide-react';

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Home', 'Sports', 'Beauty'];

export default function Navbar() {
    const { user, logout } = useAuth();
    const { cart } = useCart();
    const navigate = useNavigate();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleCategory = (cat) => {
        const query = cat === 'All' ? '/' : `/?category=${cat}`;
        navigate(query);
        setMobileOpen(false);
    };

    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <nav
            className="sticky top-0 z-50 transition-all duration-300"
            style={{
                background: scrolled
                    ? 'rgba(2, 6, 23, 0.92)'
                    : 'rgba(2, 6, 23, 0.75)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(99, 102, 241, 0.15)',
                boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.5)' : 'none',
            }}
        >
            {/* Top bar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center pulse-glow"
                            style={{ background: 'linear-gradient(135deg, #6366f1, #7c3aed)' }}
                        >
                            <Zap className="w-4 h-4 text-white" />
                        </div>
                        <span
                            className="text-xl font-black gradient-text tracking-tight"
                        >
                            ShopEasy
                        </span>
                    </Link>

                    {/* Desktop Right Actions */}
                    <div className="hidden md:flex items-center gap-3">
                        {user?.role === 'admin' && (
                            <Link
                                to="/admin"
                                className="px-3 py-1.5 text-sm font-semibold rounded-lg"
                                style={{
                                    background: 'rgba(245,158,11,0.15)',
                                    color: '#fcd34d',
                                    border: '1px solid rgba(245,158,11,0.3)',
                                }}
                            >
                                Admin
                            </Link>
                        )}

                        {/* Cart */}
                        <Link to="/cart" className="relative p-2 rounded-xl transition-colors hover:bg-white/5">
                            <ShoppingCart className="w-5 h-5" style={{ color: '#94a3b8' }} />
                            {cartCount > 0 && (
                                <span
                                    className="absolute -top-1 -right-1 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold badge-pulse"
                                    style={{ background: 'linear-gradient(135deg, #6366f1, #7c3aed)', fontSize: '10px' }}
                                >
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* User */}
                        {user ? (
                            <div className="flex items-center gap-2">
                                <Link
                                    to="/profile"
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl transition-colors hover:bg-white/5"
                                >
                                    <div
                                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                                        style={{ background: 'linear-gradient(135deg, #6366f1, #7c3aed)' }}
                                    >
                                        {(user.full_name || 'U')[0].toUpperCase()}
                                    </div>
                                    <span className="text-sm font-medium hidden sm:block" style={{ color: '#cbd5e1' }}>
                                        {user.full_name?.split(' ')[0] || 'User'}
                                    </span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 rounded-xl transition-colors hover:bg-red-500/10"
                                    title="Logout"
                                >
                                    <LogOut className="w-4 h-4" style={{ color: '#f87171' }} />
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="btn-primary py-2 px-5 text-sm">
                                Sign In
                            </Link>
                        )}

                        {/* Mobile toggle */}
                        <button
                            className="md:hidden p-2 rounded-xl hover:bg-white/5"
                            onClick={() => setMobileOpen(!mobileOpen)}
                        >
                            {mobileOpen
                                ? <X className="w-5 h-5 text-slate-300" />
                                : <Menu className="w-5 h-5 text-slate-300" />
                            }
                        </button>
                    </div>

                    {/* Mobile cart + menu */}
                    <div className="flex md:hidden items-center gap-2">
                        <Link to="/cart" className="relative p-2 rounded-xl">
                            <ShoppingCart className="w-5 h-5 text-slate-300" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold badge-pulse" style={{ fontSize: '10px' }}>
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-xl hover:bg-white/5">
                            {mobileOpen ? <X className="w-5 h-5 text-slate-300" /> : <Menu className="w-5 h-5 text-slate-300" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Category Pills Bar */}
            <div
                className="border-t"
                style={{ borderColor: 'rgba(99,102,241,0.1)' }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2 py-2 overflow-x-auto scrollbar-hide">
                        {CATEGORIES.map(cat => {
                            const params = new URLSearchParams(location.search);
                            const currentCat = params.get('category') || 'All';
                            const isActive = currentCat === cat;
                            return (
                                <button
                                    key={cat}
                                    onClick={() => handleCategory(cat)}
                                    className="whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
                                    style={{
                                        background: isActive
                                            ? 'linear-gradient(135deg, #6366f1, #7c3aed)'
                                            : 'rgba(30, 41, 59, 0.5)',
                                        color: isActive ? '#fff' : '#94a3b8',
                                        border: isActive
                                            ? '1px solid transparent'
                                            : '1px solid rgba(148,163,184,0.1)',
                                        boxShadow: isActive ? '0 0 20px rgba(99,102,241,0.35)' : 'none',
                                    }}
                                >
                                    {cat}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Mobile Dropdown */}
            {mobileOpen && (
                <div
                    className="md:hidden px-4 pb-4"
                    style={{ borderTop: '1px solid rgba(99,102,241,0.1)' }}
                >
                    <div className="pt-3 space-y-2">
                        {user ? (
                            <>
                                <Link to="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 p-3 rounded-xl hover:bg-white/5 text-slate-300">
                                    <UserIcon className="w-4 h-4" /> {user.full_name || 'Profile'}
                                </Link>
                                <button onClick={handleLogout} className="flex items-center gap-2 p-3 rounded-xl hover:bg-red-500/10 text-red-400 w-full">
                                    <LogOut className="w-4 h-4" /> Logout
                                </button>
                            </>
                        ) : (
                            <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-primary w-full text-center">
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
