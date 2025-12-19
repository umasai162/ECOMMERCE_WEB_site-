import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../config/api';
import { useCart } from '../context/CartContext';
import { Star, Minus, Plus } from 'lucide-react';

export default function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [qty, setQty] = useState(1);
    const { addToCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        api.get(`/products/${id}`)
            .then(res => setProduct(res.data))
            .catch((err) => console.error(err));
    }, [id]);

    if (!product) return <div className="text-center py-20">Loading...</div>;

    const handleAddToCart = () => {
        addToCart(product, qty);
        alert('Added to cart!');
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-8 p-6">

                {/* Image */}
                <div className="flex justify-center items-center bg-gray-50 rounded-lg">
                    <img
                        src={product.image_url || "https://via.placeholder.com/600"}
                        alt={product.name}
                        className="max-h-96 w-full object-contain"
                    />
                </div>

                {/* Details */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                    <p className="text-gray-500 mb-4 capitalize">{product.category}</p>

                    <div className="flex items-center mb-4">
                        <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                        </div>
                        <span className="text-gray-400 ml-2">(12 reviews)</span>
                    </div>

                    <p className="text-2xl font-bold text-indigo-600 mb-6">${product.price.toFixed(2)}</p>
                    <p className="text-gray-700 leading-relaxed mb-6">{product.description || "No description available."}</p>

                    <div className="mb-6">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${product.stock_quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-4 mb-8">
                        <div className="flex items-center border rounded-lg">
                            <button
                                onClick={() => setQty(q => Math.max(1, q - 1))}
                                className="px-3 py-2 hover:bg-gray-100"
                            >
                                <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-4 font-medium">{qty}</span>
                            <button
                                onClick={() => setQty(q => q + 1)}
                                className="px-3 py-2 hover:bg-gray-100"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock_quantity === 0}
                            className="flex-1 bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition disabled:bg-gray-400"
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
