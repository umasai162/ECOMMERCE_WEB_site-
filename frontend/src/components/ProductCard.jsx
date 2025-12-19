import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition duration-300">
            <Link to={`/products/${product.id}`}>
                <img
                    src={product.image_url || "https://via.placeholder.com/300"}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                />
            </Link>
            <div className="p-4">
                <Link to={`/products/${product.id}`}>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1 hover:text-indigo-600 truncate">{product.name}</h3>
                </Link>
                <p className="text-gray-500 text-sm mb-2 capitalize">{product.category}</p>
                <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                    <Link
                        to={`/products/${product.id}`}
                        className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
}
