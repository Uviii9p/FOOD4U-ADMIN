import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layouts
import MainLayout from './components/MainLayout';
import AdminLayout from './components/AdminLayout';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Categories from './pages/Categories';
import Items from './pages/Items';
import Gallery from './pages/Gallery';
import Offers from './pages/Offers';
import Contact from './pages/Contact';
import Cart from './pages/Cart';

// Admin Pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ManageCategories from './pages/admin/ManageCategories';
import ManageGallery from './pages/admin/ManageGallery';
import ManageItems from './pages/admin/ManageItems';
import ManageOffers from './pages/admin/ManageOffers';
import ManageMessages from './pages/admin/ManageMessages';
import ManageSettings from './pages/admin/ManageSettings';
import ManageVendors from './pages/admin/ManageVendors';
import ManageHome from './pages/admin/ManageHome';
import ManageAbout from './pages/admin/ManageAbout';

// Context
import { AuthContext } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { useContext } from 'react';

const ProtectedRoute = ({ children }) => {
  const { admin, loading } = useContext(AuthContext);
  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!admin) return <Navigate to="/admin/login" />;
  return children;
};

function App() {
  return (
    <CartProvider>
      <Router>
        <ToastContainer position="bottom-right" />
        <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="categories" element={<Categories />} />
          <Route path="items" element={<Items />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="offers" element={<Offers />} />
          <Route path="contact" element={<Contact />} />
          <Route path="cart" element={<Cart />} />
        </Route>

        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="categories" element={<ManageCategories />} />
          <Route path="gallery" element={<ManageGallery />} />
          <Route path="items" element={<ManageItems />} />
          <Route path="offers" element={<ManageOffers />} />
          <Route path="vendors" element={<ManageVendors />} />
          <Route path="messages" element={<ManageMessages />} />
          <Route path="settings" element={<ManageSettings />} />
          <Route path="home" element={<ManageHome />} />
          <Route path="about" element={<ManageAbout />} />
        </Route>
      </Routes>
    </Router>
  </CartProvider>
  );
}

export default App;
