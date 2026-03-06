import { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../config/api';
import ProductCard from '../components/ProductCard';
import { Search, Sparkles, ArrowRight, TrendingUp } from 'lucide-react';

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Home', 'Sports', 'Beauty'];

function SkeletonCard() {
    return (
        <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(99,102,241,0.12)' }}>
            <div className="skeleton" style={{ height: '220px' }} />
            <div className="p-4 space-y-3">
                <div className="skeleton h-4 rounded" style={{ width: '75%' }} />
                <div className="skeleton h-3 rounded" style={{ width: '40%' }} />
                <div className="flex justify-between items-center pt-2">
                    <div className="skeleton h-5 rounded" style={{ width: '30%' }} />
                    <div className="skeleton h-7 rounded-lg" style={{ width: '25%' }} />
                </div>
            </div>
        </div>
    );
}

export default function Home() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    const params = new URLSearchParams(location.search);
    const activeCategory = params.get('category') || 'All';

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            let query = '/products/?';
            if (search) query += `search=${encodeURIComponent(search)}&`;
            if (activeCategory && activeCategory !== 'All') query += `category=${activeCategory}`;
            const res = await api.get(query);
            setProducts(res.data);
        } catch (error) {
            console.error('Failed to fetch products', error);
        } finally {
            setLoading(false);
        }
    }, [search, activeCategory]);

    useEffect(() => {
        const timeout = setTimeout(fetchProducts, 300);
        return () => clearTimeout(timeout);
    }, [fetchProducts]);

    const handleCategory = (cat) => {
        setSearch('');
        navigate(cat === 'All' ? '/' : `/?category=${cat}`);
    };

    return (
        <div>
            {/* ── Hero Section ─────────────────────────────────────────── */}
            <section
                className="relative overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
                    borderBottom: '1px solid rgba(99,102,241,0.15)',
                }}
            >
                {/* Background glow orbs */}
                <div
                    className="absolute"
                    style={{
                        top: '-80px', left: '-80px', width: '400px', height: '400px',
                        background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)',
                        borderRadius: '50%', pointerEvents: 'none',
                    }}
                />
                <div
                    className="absolute"
                    style={{
                        bottom: '-100px', right: '-60px', width: '350px', height: '350px',
                        background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)',
                        borderRadius: '50%', pointerEvents: 'none',
                    }}
                />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
                    <div className="max-w-2xl">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 fade-in-up"
                            style={{
                                background: 'rgba(99,102,241,0.15)',
                                border: '1px solid rgba(99,102,241,0.35)',
                                color: '#a78bfa',
                            }}
                        >
                            <Sparkles className="w-3.5 h-3.5" />
                            Spring Collection 2025 — Up to 50% Off
                        </div>

                        <h1 className="text-5xl md:text-6xl font-black leading-tight mb-6 fade-in-up-delay-1" style={{ color: '#f1f5f9' }}>
                            Shop the{' '}
                            <span className="gradient-text">Future</span>
                            <br />of Style
                        </h1>

                        <p className="text-lg mb-8 fade-in-up-delay-2" style={{ color: '#94a3b8', lineHeight: 1.7 }}>
                            Discover premium products across Electronics, Fashion, Home, Sports & Beauty — curated for a life well-lived.
                        </p>

                        <div className="flex flex-wrap gap-4 fade-in-up-delay-3">
                            <button
                                onClick={() => handleCategory('All')}
                                className="btn-primary"
                            >
                                Shop All Products <ArrowRight className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => handleCategory('Electronics')}
                                className="btn-secondary"
                            >
                                <TrendingUp className="w-4 h-4" /> Trending Now
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-8 mt-12 fade-in-up-delay-3">
                            {[['22+', 'Products'], ['5', 'Categories'], ['100%', 'Secure']].map(([val, label]) => (
                                <div key={label}>
                                    <div className="text-2xl font-black gradient-text">{val}</div>
                                    <div className="text-xs mt-0.5" style={{ color: '#64748b' }}>{label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Content ───────────────────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                {/* Search + Category Filters */}
                <div className="mb-8 space-y-4">
                    {/* Search Bar */}
                    <div className="relative max-w-lg">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#6366f1' }} />
                        <input
                            type="text"
                            placeholder="Search products, brands..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="input-glass pl-11 pr-4 py-3 w-full"
                            style={{ borderRadius: '14px' }}
                        />
                    </div>

                    {/* Category Pills */}
                    <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map(cat => {
                            const isActive = activeCategory === cat;
                            return (
                                <button
                                    key={cat}
                                    onClick={() => handleCategory(cat)}
                                    className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200"
                                    style={{
                                        background: isActive
                                            ? 'linear-gradient(135deg, #6366f1, #7c3aed)'
                                            : 'rgba(30,41,59,0.7)',
                                        color: isActive ? '#fff' : '#94a3b8',
                                        border: isActive ? '1px solid transparent' : '1px solid rgba(148,163,184,0.12)',
                                        boxShadow: isActive ? '0 0 20px rgba(99,102,241,0.4)' : 'none',
                                        transform: isActive ? 'scale(1.02)' : 'scale(1)',
                                    }}
                                >
                                    {cat}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Section Title */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold" style={{ color: '#f1f5f9' }}>
                            {activeCategory === 'All' ? 'All Products' : activeCategory}
                        </h2>
                        {!loading && (
                            <p className="text-sm mt-1" style={{ color: '#64748b' }}>
                                {products.length} item{products.length !== 1 ? 's' : ''} found
                            </p>
                        )}
                    </div>
                </div>

                {/* Product Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map((product, idx) => (
                            <div key={product.id} className="fade-in-up" style={{ animationDelay: `${idx * 0.05}s` }}>
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24">
                        <div
                            className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                            style={{ background: 'rgba(99,102,241,0.1)' }}
                        >
                            <Search className="w-8 h-8" style={{ color: '#6366f1' }} />
                        </div>
                        <h3 className="text-xl font-semibold mb-2" style={{ color: '#e2e8f0' }}>No products found</h3>
                        <p className="text-sm mb-6" style={{ color: '#64748b' }}>Try adjusting your search or filter</p>
                        <button onClick={() => { setSearch(''); handleCategory('All'); }} className="btn-primary">
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
