import { useEffect, useState } from 'react';
import api from '../config/api';
import { useAuth } from '../context/AuthContext';
import { Package, User, Mail, ShieldCheck, ShoppingBag } from 'lucide-react';

export default function Profile() {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            api.get('/orders/')
                .then(res => setOrders(res.data))
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [user]);

    if (!user) return null;

    const statusStyle = (status) => {
        const s = status?.toLowerCase();
        if (s === 'delivered') return { bg: 'rgba(34,197,94,0.15)', color: '#86efac', border: 'rgba(34,197,94,0.3)' };
        if (s === 'cancelled') return { bg: 'rgba(239,68,68,0.15)', color: '#fca5a5', border: 'rgba(239,68,68,0.3)' };
        return { bg: 'rgba(245,158,11,0.15)', color: '#fcd34d', border: 'rgba(245,158,11,0.3)' };
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

            {/* Profile Card */}
            <div
                className="rounded-2xl p-6 mb-8 flex items-center gap-5"
                style={{
                    background: 'rgba(15,23,42,0.8)',
                    border: '1px solid rgba(99,102,241,0.2)',
                    backdropFilter: 'blur(16px)',
                }}
            >
                {/* Avatar */}
                <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #6366f1, #7c3aed)' }}
                >
                    {(user.full_name || 'U')[0].toUpperCase()}
                </div>

                <div className="flex-1">
                    <h1 className="text-2xl font-black mb-1" style={{ color: '#f1f5f9' }}>
                        Hello, {user.full_name}
                    </h1>
                    <div className="flex flex-wrap gap-3 text-sm" style={{ color: '#64748b' }}>
                        <span className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5" /> {user.email}
                        </span>
                        <span
                            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize"
                            style={{
                                background: user.role === 'admin' ? 'rgba(245,158,11,0.15)' : 'rgba(99,102,241,0.15)',
                                color: user.role === 'admin' ? '#fcd34d' : '#a78bfa',
                                border: `1px solid ${user.role === 'admin' ? 'rgba(245,158,11,0.3)' : 'rgba(99,102,241,0.3)'}`,
                            }}
                        >
                            <ShieldCheck className="w-3 h-3" /> {user.role}
                        </span>
                    </div>
                </div>
            </div>

            {/* Order History */}
            <div className="flex items-center gap-2 mb-5">
                <Package className="w-5 h-5" style={{ color: '#6366f1' }} />
                <h2 className="text-xl font-bold" style={{ color: '#f1f5f9' }}>Order History</h2>
                {!loading && (
                    <span className="text-xs px-2.5 py-1 rounded-full font-semibold ml-1"
                        style={{ background: 'rgba(99,102,241,0.15)', color: '#a78bfa' }}>
                        {orders.length} order{orders.length !== 1 ? 's' : ''}
                    </span>
                )}
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2].map(i => (
                        <div key={i} className="skeleton rounded-2xl" style={{ height: '100px' }} />
                    ))}
                </div>
            ) : orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 rounded-2xl"
                    style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(99,102,241,0.12)' }}>
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 float-anim"
                        style={{ background: 'rgba(99,102,241,0.1)' }}>
                        <ShoppingBag className="w-7 h-7" style={{ color: '#6366f1' }} />
                    </div>
                    <p className="text-lg font-semibold mb-1" style={{ color: '#e2e8f0' }}>No orders yet</p>
                    <p className="text-sm" style={{ color: '#64748b' }}>Your order history will appear here.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map(order => {
                        const s = statusStyle(order.status);
                        return (
                            <div
                                key={order.id}
                                className="rounded-2xl p-5 transition-all hover:scale-[1.01]"
                                style={{
                                    background: 'rgba(15,23,42,0.75)',
                                    border: '1px solid rgba(99,102,241,0.15)',
                                    backdropFilter: 'blur(12px)',
                                }}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <span className="font-bold text-base" style={{ color: '#e2e8f0' }}>
                                            Order #{order.id}
                                        </span>
                                        <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>
                                            {new Date(order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-black gradient-text mb-1">
                                            ${order.total_amount.toFixed(2)}
                                        </div>
                                        <span
                                            className="text-xs font-semibold px-2.5 py-1 rounded-full"
                                            style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
                                        >
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                                <div style={{ borderTop: '1px solid rgba(99,102,241,0.1)', paddingTop: '12px' }}>
                                    <p className="text-xs" style={{ color: '#64748b' }}>
                                        <span style={{ color: '#94a3b8', fontWeight: 600 }}>Shipping to: </span>
                                        {order.shipping_address}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
