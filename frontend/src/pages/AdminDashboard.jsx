import { useEffect, useState } from 'react';
import api from '../config/api';
import { useAuth } from '../context/AuthContext';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('products'); // products | orders
    const [editingProduct, setEditingProduct] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '', price: '', stock_quantity: '', category: '', description: '', image_url: ''
    });

    useEffect(() => {
        if (user?.role !== 'admin') {
            navigate('/');
            return;
        }
        fetchData();
    }, [user]);

    const fetchData = async () => {
        const pRes = await api.get('/products/?limit=1000');
        setProducts(pRes.data);
        const oRes = await api.get('/orders/');
        setOrders(oRes.data);
    };

    const handleDeleteProduct = async (id) => {
        if (confirm('Are you sure?')) {
            await api.delete(`/products/${id}`);
            fetchData();
        }
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        await api.put(`/orders/${orderId}/status?status=${newStatus}`);
        fetchData();
    };

    const handleSaveProduct = async (e) => {
        e.preventDefault();
        const payload = { ...formData, price: parseFloat(formData.price), stock_quantity: parseInt(formData.stock_quantity) };

        if (editingProduct) {
            await api.put(`/products/${editingProduct.id}`, payload);
        } else {
            await api.post('/products/', payload);
        }
        setEditingProduct(null);
        setFormData({ name: '', price: '', stock_quantity: '', category: '', description: '', image_url: '' });
        fetchData();
    };

    const startEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            price: product.price,
            stock_quantity: product.stock_quantity,
            category: product.category,
            description: product.description || '',
            image_url: product.image_url || ''
        });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

            {/* Tabs */}
            <div className="flex space-x-4 mb-8 border-b">
                <button
                    onClick={() => setActiveTab('products')}
                    className={`py-2 px-4 font-medium ${activeTab === 'products' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500'}`}
                >
                    Products
                </button>
                <button
                    onClick={() => setActiveTab('orders')}
                    className={`py-2 px-4 font-medium ${activeTab === 'orders' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500'}`}
                >
                    Orders
                </button>
            </div>

            {activeTab === 'products' && (
                <div>
                    {/* Add/Edit Form */}
                    <div className="bg-white p-6 rounded-lg shadow mb-8">
                        <h3 className="text-lg font-bold mb-4">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                        <form onSubmit={handleSaveProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input placeholder="Name" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="border p-2 rounded" />
                            <input placeholder="Price" type="number" step="0.01" required value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="border p-2 rounded" />
                            <input placeholder="Stock" type="number" required value={formData.stock_quantity} onChange={e => setFormData({ ...formData, stock_quantity: e.target.value })} className="border p-2 rounded" />
                            <input placeholder="Category" required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="border p-2 rounded" />
                            <input placeholder="Image URL" value={formData.image_url} onChange={e => setFormData({ ...formData, image_url: e.target.value })} className="border p-2 rounded" />
                            <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="border p-2 rounded md:col-span-2" />
                            <div className="md:col-span-2 flex space-x-2">
                                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">{editingProduct ? 'Update' : 'Create'}</button>
                                {editingProduct && <button type="button" onClick={() => { setEditingProduct(null); setFormData({ name: '', price: '', stock_quantity: '', category: '', description: '', image_url: '' }); }} className="bg-gray-300 text-gray-700 px-4 py-2 rounded">Cancel</button>}
                            </div>
                        </form>
                    </div>

                    {/* List */}
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {products.map(p => (
                                    <tr key={p.id}>
                                        <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{p.name}</div></td>
                                        <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-500">${p.price}</div></td>
                                        <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-500">{p.stock_quantity}</div></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end space-x-2">
                                            <button onClick={() => startEdit(p)} className="text-indigo-600 hover:text-indigo-900"><Pencil className="w-5 h-5" /></button>
                                            <button onClick={() => handleDeleteProduct(p.id)} className="text-red-600 hover:text-red-900"><Trash2 className="w-5 h-5" /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'orders' && (
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders.map(o => (
                                <tr key={o.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">#{o.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">${o.total_amount.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${o.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {o.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">{o.shipping_address}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <select
                                            value={o.status}
                                            onChange={(e) => handleUpdateStatus(o.id, e.target.value)}
                                            className="border rounded px-2 py-1 text-sm"
                                        >
                                            <option>Processing</option>
                                            <option>Shipped</option>
                                            <option>Delivered</option>
                                            <option>Cancelled</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
