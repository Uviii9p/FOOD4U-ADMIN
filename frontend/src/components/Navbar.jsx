import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Utensils, ShoppingBag, ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { cartCount } = useCart();

  const links = [
    { name: 'Home', path: '/shop' },
    { name: 'About Us', path: '/shop/about' },
    { name: 'Categories', path: '/shop/categories' },
    { name: 'Store', path: '/shop/items' },
    { name: 'Gallery', path: '/shop/gallery' },
    { name: 'Contact', path: '/shop/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/shop" className="flex items-center space-x-2 group">
              <div className="bg-accent/10 p-2 rounded-lg group-hover:scale-110 transition-transform">
                <Utensils className="h-7 w-7 text-accent" />
              </div>
              <span className="font-sans font-black text-2xl tracking-tight text-primary">Sujal<span className="text-accent">FoodShop</span></span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-bold tracking-wide uppercase transition-all duration-300 ${
                  isActive(link.path) ? 'text-accent border-b-2 border-accent pb-1' : 'text-gray-500 hover:text-accent'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link to="/shop/cart" className="relative p-2 bg-gray-50 rounded-full hover:bg-accent/10 transition-colors group">
                <ShoppingCart className="w-6 h-6 text-gray-600 group-hover:text-accent" />
                {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white animate-bounce">
                        {cartCount}
                    </span>
                )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <Link to="/shop/cart" className="relative p-2">
                <ShoppingCart className="w-6 h-6 text-gray-600" />
                {cartCount > 0 && (
                    <span className="absolute top-0 right-0 bg-accent text-white text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full animate-bounce">
                        {cartCount}
                    </span>
                )}
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-primary focus:outline-none">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.path) ? 'bg-gray-100 text-accent' : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
