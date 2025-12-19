import { useEffect, useState } from 'react';
import api from '../config/api';
import { useAuth } from '../context/AuthContext';
import { Package } from 'lucide-react';

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

    if (!user) return <div className="p-8">Please log in.</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white shadow rounded-lg p-6 mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Hello, {user.full_name}</h1>
                <p className="text-gray-600">{user.email}</p>
                <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full mt-2 capitalize">{user.role}</span>
            </div>

            <h2 className="text-xl font-bold mb-4 flex items-center">
                <Package className="mr-2" /> Order History
            </h2>

            {loading ? (
                <div>Loading orders...</div>
            ) : orders.length === 0 ? (
                <div className="text-gray-500 bg-white p-6 rounded-lg shadow">No orders found.</div>
            ) : (
                <div className="space-y-4">
                    {orders.map(order => (
                        <div key={order.id} className="bg-white p-6 rounded-lg shadow transition hover:shadow-md">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <span className="font-bold text-lg">Order #{order.id}</span>
                                    <p className="text-gray-500 text-sm">{new Date(order.created_at).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                    <span className="block font-bold text-indigo-600">${order.total_amount.toFixed(2)}</span>
                                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                            order.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                            <div className="border-t pt-4">
                                <p className="text-sm text-gray-600"><span className="font-medium">Shipping to:</span> {order.shipping_address}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
