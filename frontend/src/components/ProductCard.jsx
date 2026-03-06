import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, Star, Lock } from 'lucide-react';

const CATEGORY_COLORS = {
    Electronics: { bg: 'rgba(59,130,246,0.18)', color: '#93c5fd' },
    Fashion: { bg: 'rgba(236,72,153,0.18)', color: '#f9a8d4' },
    Home: { bg: 'rgba(34,197,94,0.18)', color: '#86efac' },
    Sports: { bg: 'rgba(245,158,11,0.18)', color: '#fcd34d' },
    Beauty: { bg: 'rgba(168,85,247,0.18)', color: '#d8b4fe' },
};

function StarRating({ rating = 4 }) {
    return (
        <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
                <Star
                    key={i}
                    className="w-3 h-3"
                    style={{
                        fill: i < rating ? '#fbbf24' : 'transparent',
                        color: i < rating ? '#fbbf24' : '#334155',
                    }}
                />
            ))}
        </div>
    );
}

export default function ProductCard({ product }) {
    const { addToCart } = useCart();
    const { user } = useAuth();
    const [adding, setAdding] = useState(false);
    const navigate = useNavigate();

    const catStyle = CATEGORY_COLORS[product.category] || { bg: 'rgba(99,102,241,0.18)', color: '#a5b4fc' };
    const rating = 4 + (product.id % 2 === 0 ? 0 : 1);

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Gate behind auth — redirect to login with return path
        if (!user) {
            navigate('/login', { state: { from: { pathname: '/' } } });
            return;
        }

        setAdding(true);
        addToCart(product, 1);
        setTimeout(() => setAdding(false), 900);
    };

    return (
        <div
            className="card-hover gradient-border rounded-2xl overflow-hidden flex flex-col group cursor-pointer"
            style={{
                background: 'rgba(15, 23, 42, 0.7)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(99, 102, 241, 0.15)',
            }}
            onClick={() => navigate(`/products/${product.id}`)}
        >
            {/* Image */}
            <div className="relative img-zoom-container" style={{ height: '220px' }}>
                <img
                    src={product.image_url || 'https://images.unsplash.com/photo-1481437156560-3205f6a55735?w=600'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                />

                {/* Category badge */}
                <span
                    className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: catStyle.bg, color: catStyle.color, backdropFilter: 'blur(8px)' }}
                >
                    {product.category}
                </span>

                {/* Stock badge */}
                {product.stock_quantity === 0 && (
                    <span className="absolute top-3 right-3 bg-red-500/80 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                        Sold Out
                    </span>
                )}
                {product.stock_quantity > 0 && product.stock_quantity <= 10 && (
                    <span className="absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ background: 'rgba(245,158,11,0.2)', color: '#fcd34d' }}>
                        Only {product.stock_quantity} left
                    </span>
                )}

                {/* Quick Add overlay — shows Login prompt if not authenticated */}
                <div
                    className="absolute inset-0 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: 'linear-gradient(to top, rgba(2,6,23,0.85) 0%, transparent 60%)' }}
                >
                    {user ? (
                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock_quantity === 0 || adding}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-50"
                            style={{
                                background: adding
                                    ? 'linear-gradient(135deg, #10b981, #059669)'
                                    : 'linear-gradient(135deg, #6366f1, #7c3aed)',
                                boxShadow: '0 0 20px rgba(99,102,241,0.5)',
                            }}
                        >
                            <ShoppingCart className="w-4 h-4" />
                            {adding ? 'Added! ✓' : 'Quick Add'}
                        </button>
                    ) : (
                        <button
                            onClick={handleAddToCart}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-200"
                            style={{
                                background: 'rgba(15,23,42,0.85)',
                                border: '1px solid rgba(99,102,241,0.4)',
                                color: '#a78bfa',
                            }}
                        >
                            <Lock className="w-3.5 h-3.5" />
                            Login to Add
                        </button>
                    )}
                </div>
            </div>

            {/* Info */}
            <div className="p-4 flex flex-col gap-2 flex-1">
                <div>
                    <h3
                        className="font-semibold text-sm mb-1 transition-colors duration-200 group-hover:text-indigo-400"
                        style={{
                            color: '#e2e8f0',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            lineHeight: '1.4',
                            minHeight: '2.8em',
                        }}
                    >
                        {product.name}
                    </h3>
                    <StarRating rating={rating} />
                </div>

                <div className="flex items-center justify-between mt-auto pt-2" style={{ borderTop: '1px solid rgba(99,102,241,0.1)' }}>
                    <span className="text-lg font-bold gradient-text">
                        ${product.price.toFixed(2)}
                    </span>
                    <Link
                        to={`/products/${product.id}`}
                        onClick={e => e.stopPropagation()}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors duration-200"
                        style={{
                            color: '#a78bfa',
                            background: 'rgba(99,102,241,0.1)',
                            border: '1px solid rgba(99,102,241,0.2)',
                        }}
                    >
                        Details →
                    </Link>
                </div>
            </div>
        </div>
    );
}
