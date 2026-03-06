import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../config/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Star, Minus, Plus, ShoppingCart, ArrowLeft, Package, CheckCircle, Lock } from 'lucide-react';

const CATEGORY_COLORS = {
    Electronics: { bg: 'rgba(59,130,246,0.18)', color: '#93c5fd' },
    Fashion: { bg: 'rgba(236,72,153,0.18)', color: '#f9a8d4' },
    Home: { bg: 'rgba(34,197,94,0.18)', color: '#86efac' },
    Sports: { bg: 'rgba(245,158,11,0.18)', color: '#fcd34d' },
    Beauty: { bg: 'rgba(168,85,247,0.18)', color: '#d8b4fe' },
};

export default function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [qty, setQty] = useState(1);
    const [toast, setToast] = useState(null); // 'success' | 'error'
    const { addToCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        api.get(`/products/${id}`)
            .then(res => setProduct(res.data))
            .catch(err => console.error(err));
    }, [id]);

    if (!product) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 pulse-glow"
                        style={{ background: 'rgba(99,102,241,0.15)' }}>
                        <Package className="w-7 h-7" style={{ color: '#6366f1' }} />
                    </div>
                    <p style={{ color: '#94a3b8' }}>Loading product...</p>
                </div>
            </div>
        );
    }

    const catStyle = CATEGORY_COLORS[product.category] || { bg: 'rgba(99,102,241,0.18)', color: '#a5b4fc' };
    const rating = 4 + (product.id % 2 === 0 ? 0 : 1);
    const reviewCount = 8 + (product.id * 3) % 40;

    const handleAddToCart = () => {
        // Gate behind authentication
        if (!user) {
            navigate('/login', { state: { from: { pathname: `/products/${product.id}` } } });
            return;
        }
        if (product.stock_quantity === 0) return;
        addToCart(product, qty);
        setToast('success');
        setTimeout(() => setToast(null), 2500);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Toast */}
            {toast === 'success' && (
                <div
                    className="fixed top-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3 rounded-2xl toast-enter"
                    style={{
                        background: 'rgba(16, 185, 129, 0.15)',
                        border: '1px solid rgba(16,185,129,0.4)',
                        backdropFilter: 'blur(16px)',
                        color: '#6ee7b7',
                        fontWeight: 600,
                    }}
                >
                    <CheckCircle className="w-5 h-5" />
                    Added to cart!
                </div>
            )}

            {/* Back button */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 mb-6 text-sm font-medium transition-colors"
                style={{ color: '#94a3b8' }}
                onMouseEnter={e => e.currentTarget.style.color = '#a78bfa'}
                onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
            >
                <ArrowLeft className="w-4 h-4" /> Back to Products
            </button>

            {/* Product Layout */}
            <div
                className="rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-0"
                style={{
                    background: 'rgba(15,23,42,0.75)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(99,102,241,0.18)',
                }}
            >
                {/* Image Panel */}
                <div
                    className="relative img-zoom-container flex items-center justify-center"
                    style={{
                        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
                        minHeight: '420px',
                    }}
                >
                    <img
                        src={product.image_url || 'https://images.unsplash.com/photo-1481437156560-3205f6a55735?w=600'}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        style={{ maxHeight: '480px' }}
                    />
                    {/* Category overlay badge */}
                    <span
                        className="absolute top-4 left-4 text-sm font-semibold px-3 py-1.5 rounded-full"
                        style={{ ...catStyle, backdropFilter: 'blur(8px)' }}
                    >
                        {product.category}
                    </span>
                </div>

                {/* Info Panel */}
                <div className="p-8 flex flex-col" style={{ borderLeft: '1px solid rgba(99,102,241,0.12)' }}>
                    <h1 className="text-3xl font-black mb-3 leading-tight" style={{ color: '#f1f5f9' }}>
                        {product.name}
                    </h1>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4"
                                    style={{ fill: i < rating ? '#fbbf24' : 'transparent', color: i < rating ? '#fbbf24' : '#334155' }}
                                />
                            ))}
                        </div>
                        <span className="text-sm" style={{ color: '#64748b' }}>({reviewCount} reviews)</span>
                    </div>

                    {/* Price */}
                    <div className="text-4xl font-black gradient-text mb-6">
                        ${product.price.toFixed(2)}
                    </div>

                    {/* Description */}
                    <p className="text-sm leading-relaxed mb-6" style={{ color: '#94a3b8' }}>
                        {product.description || 'No description available.'}
                    </p>

                    {/* Stock */}
                    <div className="mb-6">
                        <span
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold"
                            style={product.stock_quantity > 0
                                ? { background: 'rgba(34,197,94,0.15)', color: '#86efac', border: '1px solid rgba(34,197,94,0.3)' }
                                : { background: 'rgba(239,68,68,0.15)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.3)' }
                            }
                        >
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: product.stock_quantity > 0 ? '#22c55e' : '#ef4444' }} />
                            {product.stock_quantity > 0 ? `In Stock (${product.stock_quantity} units)` : 'Out of Stock'}
                        </span>
                    </div>

                    {/* Qty Selector + Add to Cart */}
                    <div className="space-y-4 mt-auto">
                        <div className="flex items-center gap-4">
                            <div
                                className="flex items-center rounded-xl overflow-hidden"
                                style={{ border: '1px solid rgba(99,102,241,0.3)', background: 'rgba(15,23,42,0.5)' }}
                            >
                                <button
                                    onClick={() => setQty(q => Math.max(1, q - 1))}
                                    className="px-4 py-3 transition-colors hover:bg-white/5"
                                >
                                    <Minus className="w-4 h-4" style={{ color: '#a78bfa' }} />
                                </button>
                                <span className="px-5 font-bold text-lg" style={{ color: '#f1f5f9' }}>{qty}</span>
                                <button
                                    onClick={() => setQty(q => Math.min(product.stock_quantity, q + 1))}
                                    className="px-4 py-3 transition-colors hover:bg-white/5"
                                >
                                    <Plus className="w-4 h-4" style={{ color: '#a78bfa' }} />
                                </button>
                            </div>
                            <span className="text-sm" style={{ color: '#64748b' }}>
                                Max: {product.stock_quantity}
                            </span>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock_quantity === 0}
                            className="btn-primary w-full py-4 text-base disabled:opacity-40 disabled:cursor-not-allowed"
                            style={{ borderRadius: '14px' }}
                        >
                            {!user ? (
                                <><Lock className="w-5 h-5" /> Login to Add to Cart</>
                            ) : product.stock_quantity === 0 ? (
                                <><ShoppingCart className="w-5 h-5" /> Out of Stock</>
                            ) : (
                                <><ShoppingCart className="w-5 h-5" /> Add to Cart</>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
