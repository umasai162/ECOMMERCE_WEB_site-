import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
    const { cart, total, clearCart } = useCart();
    const { user } = useAuth();
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        if (!user) return navigate('/login');

        setLoading(true);
        try {
            const orderItems = cart.map(item => ({ product_id: item.id, quantity: item.quantity }));
            await api.post('/orders/', { items: orderItems, shipping_address: address });
            clearCart();
            alert('Order placed successfully!');
            navigate('/');
        } catch (error) {
            alert('Order failed. ' + (error.response?.data?.detail || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>
            <div className="bg-white p-8 rounded-lg shadow-lg">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                    <textarea
                        required
                        className="w-full border rounded-lg p-3 focus:ring-indigo-500 focus:border-indigo-500"
                        rows="3"
                        placeholder="Enter your full address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    ></textarea>
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                    <div className="flex space-x-4">
                        <div className="border p-4 rounded-lg cursor-pointer bg-indigo-50 border-indigo-500">
                            <span className="font-bold">Credit Card (Mock)</span>
                        </div>
                        <div className="border p-4 rounded-lg cursor-pointer hover:bg-gray-50">
                            <span className="text-gray-600">PayPal</span>
                        </div>
                    </div>
                </div>

                <div className="border-t pt-6">
                    <div className="flex justify-between text-xl font-bold mb-6">
                        <span>Total Amount</span>
                        <span>${(total + 10).toFixed(2)}</span>
                    </div>

                    <button
                        onClick={handlePlaceOrder}
                        disabled={loading || cart.length === 0}
                        className="w-full bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition disabled:bg-gray-400"
                    >
                        {loading ? 'Processing...' : 'Confirm Place Order'}
                    </button>
                </div>
            </div>
        </div>
    );
}
