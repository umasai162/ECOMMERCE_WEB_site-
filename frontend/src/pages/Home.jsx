import { useEffect, useState } from 'react';
import api from '../config/api';
import ProductCard from '../components/ProductCard';
import { Search } from 'lucide-react';

export default function Home() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, [search, category]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            let query = '/products/?';
            if (search) query += `search=${search}&`;
            if (category) query += `category=${category}`;

            const res = await api.get(query);
            setProducts(res.data);
        } catch (error) {
            console.error("Failed to fetch products", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Hero Section */}
            <div className="bg-indigo-600 rounded-2xl shadow-xl overflow-hidden mb-10 text-white">
                <div className="p-8 md:p-12 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Summer Collection 2025</h1>
                    <p className="text-lg md:text-xl text-indigo-100 mb-6">Discover the best trends for the season. Up to 50% off.</p>
                    <button className="bg-white text-indigo-600 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition">Shop Now</button>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div className="relative w-full md:w-96">
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                </div>

                <select
                    className="w-full md:w-48 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="">All Categories</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Home">Home</option>
                </select>
            </div>

            {/* Product Grid */}
            {loading ? (
                <div className="text-center py-20">Loading...</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.length > 0 ? (
                        products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    ) : (
                        <div className="col-span-full text-center text-gray-500 py-10">No products found.</div>
                    )}
                </div>
            )}
        </div>
    );
}
