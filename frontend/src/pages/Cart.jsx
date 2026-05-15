import React from 'react';
import { useCart } from '../contexts/CartContext';
import { ShoppingBag, Trash2, Plus, Minus, IndianRupee, ArrowLeft, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-12 h-12 text-gray-300" />
        </div>
        <h2 className="text-3xl font-black text-primary mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 max-w-xs text-center">Looks like you haven't added any fresh items to your cart yet.</p>
        <Link to="/items" className="px-8 py-4 bg-accent text-white font-bold rounded-2xl hover:bg-emerald-600 transition-all shadow-lg shadow-accent/20">
          Explore Store
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-4xl font-black text-primary">Your Basket</h1>
          <button onClick={clearCart} className="text-gray-400 hover:text-red-500 font-bold text-sm uppercase tracking-widest transition-colors flex items-center">
            <Trash2 size={16} className="mr-2" /> Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item._id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-6">
                <div className="w-24 h-24 bg-gray-50 rounded-2xl overflow-hidden shrink-0">
                  <img 
                    src={item.image?.startsWith('http') ? item.image : `http://localhost:5001${item.image}`} 
                    alt={item.name} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="flex-grow text-center sm:text-left">
                  <h3 className="font-bold text-lg text-primary">{item.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{item.category?.name}</p>
                  <div className="flex items-center justify-center sm:justify-start space-x-4">
                    <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-accent hover:text-white transition-colors">
                      <Minus size={14} />
                    </button>
                    <span className="font-bold text-primary w-8 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-accent hover:text-white transition-colors">
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
                <div className="text-right flex flex-col items-center sm:items-end gap-2">
                  <div className="flex items-center font-black text-xl text-primary">
                    <IndianRupee size={18} className="mr-1 text-accent" />
                    {item.price * item.quantity}
                  </div>
                  <button onClick={() => removeFromCart(item._id)} className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 sticky top-32">
              <h2 className="text-2xl font-black text-primary mb-8">Order Summary</h2>
              <div className="space-y-4 mb-8 pb-8 border-b border-gray-100">
                <div className="flex justify-between text-gray-500">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-bold text-primary flex items-center"><IndianRupee size={14} className="mr-0.5" />{cartTotal}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span className="font-medium">Delivery</span>
                  <span className="text-accent font-bold">FREE</span>
                </div>
              </div>
              <div className="flex justify-between items-center mb-10">
                <span className="text-xl font-black text-primary">Total Amount</span>
                <span className="text-3xl font-black text-accent flex items-center">
                  <IndianRupee size={24} className="mr-1" />
                  {cartTotal}
                </span>
              </div>
              <button className="w-full py-5 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/10 hover:bg-accent transition-all duration-500 flex items-center justify-center gap-2 group">
                Checkout Now <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
              </button>
              <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <CheckCircle size={14} className="text-accent" /> Secure Payment Guaranteed
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
