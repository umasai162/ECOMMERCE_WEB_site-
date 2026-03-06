import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';

export default function Cart() {
    const { cart, removeFromCart, updateQuantity, total } = useCart();
    const navigate = useNavigate();

    if (cart.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="text-center">
                    <div
                        className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 float-anim"
                        style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}
                    >
                        <ShoppingBag className="w-10 h-10" style={{ color: '#6366f1' }} />
                    </div>
                    <h2 className="text-2xl font-bold mb-2" style={{ color: '#f1f5f9' }}>Your cart is empty</h2>
                    <p className="text-sm mb-8" style={{ color: '#64748b' }}>Looks like you haven't added anything yet.</p>
                    <button onClick={() => navigate('/')} className="btn-primary">
                        Start Shopping <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        );
    }

    const shipping = total > 200 ? 0 : 10;
    const orderTotal = total + shipping;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate('/')} className="p-2 rounded-xl transition-colors hover:bg-white/5"
                    style={{ color: '#94a3b8' }}>
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-3xl font-black" style={{ color: '#f1f5f9' }}>Shopping Cart</h1>
                    <p className="text-sm mt-0.5" style={{ color: '#64748b' }}>
                        {cart.length} item{cart.length !== 1 ? 's' : ''} in your cart
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {cart.map((item, idx) => (
                        <div
                            key={item.id}
                            className="flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 fade-in-up"
                            style={{
                                background: 'rgba(15,23,42,0.75)',
                                border: '1px solid rgba(99,102,241,0.15)',
                                backdropFilter: 'blur(12px)',
                                animationDelay: `${idx * 0.08}s`,
                            }}
                        >
                            {/* Image */}
                            <div className="rounded-xl overflow-hidden flex-shrink-0" style={{ width: 88, height: 88 }}>
                                <img
                                    src={item.image_url || 'https://images.unsplash.com/photo-1481437156560-3205f6a55735?w=200'}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold truncate mb-1" style={{ color: '#e2e8f0' }}>{item.name}</h3>
                                <p className="text-sm" style={{ color: '#64748b' }}>${item.price.toFixed(2)} each</p>
                            </div>

                            {/* Qty Controls */}
                            <div
                                className="flex items-center rounded-xl overflow-hidden"
                                style={{ border: '1px solid rgba(99,102,241,0.25)', background: 'rgba(15,23,42,0.5)' }}
                            >
                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="px-3 py-2 transition-colors hover:bg-white/5"
                                >
                                    <Minus className="w-3.5 h-3.5" style={{ color: '#a78bfa' }} />
                                </button>
                                <span className="px-3 py-2 font-bold text-sm min-w-[32px] text-center" style={{ color: '#f1f5f9' }}>
                                    {item.quantity}
                                </span>
                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="px-3 py-2 transition-colors hover:bg-white/5"
                                >
                                    <Plus className="w-3.5 h-3.5" style={{ color: '#a78bfa' }} />
                                </button>
                            </div>

                            {/* Line Total */}
                            <div className="text-right min-w-[80px]">
                                <div className="font-bold gradient-text text-lg">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </div>
                            </div>

                            {/* Remove */}
                            <button
                                onClick={() => removeFromCart(item.id)}
                                className="p-2 rounded-xl transition-colors hover:bg-red-500/10 flex-shrink-0"
                            >
                                <Trash2 className="w-4 h-4" style={{ color: '#f87171' }} />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="h-fit sticky top-32">
                    <div
                        className="rounded-2xl p-6"
                        style={{
                            background: 'rgba(15,23,42,0.8)',
                            backdropFilter: 'blur(16px)',
                            border: '1px solid rgba(99,102,241,0.2)',
                        }}
                    >
                        <h2 className="text-xl font-bold mb-6" style={{ color: '#f1f5f9' }}>Order Summary</h2>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-sm">
                                <span style={{ color: '#94a3b8' }}>Subtotal</span>
                                <span className="font-semibold" style={{ color: '#e2e8f0' }}>${total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span style={{ color: '#94a3b8' }}>Shipping</span>
                                {shipping === 0
                                    ? <span className="font-semibold" style={{ color: '#86efac' }}>Free 🎉</span>
                                    : <span className="font-semibold" style={{ color: '#e2e8f0' }}>${shipping.toFixed(2)}</span>
                                }
                            </div>
                            {shipping > 0 && (
                                <p className="text-xs" style={{ color: '#64748b' }}>
                                    Add ${(200 - total).toFixed(2)} more for free shipping!
                                </p>
                            )}
                            <div
                                className="flex justify-between pt-4 text-lg font-black"
                                style={{ borderTop: '1px solid rgba(99,102,241,0.15)', color: '#f1f5f9' }}
                            >
                                <span>Total</span>
                                <span className="gradient-text">${orderTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/checkout')}
                            className="btn-primary w-full py-4 text-base"
                            style={{ borderRadius: '14px' }}
                        >
                            Proceed to Checkout <ArrowRight className="w-4 h-4" />
                        </button>

                        <button
                            onClick={() => navigate('/')}
                            className="w-full mt-3 py-3 text-sm font-semibold rounded-xl transition-colors"
                            style={{ color: '#64748b' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#94a3b8'}
                            onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
                        >
                            ← Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
