import { Routes, Route, useLocation } from 'react-router-dom';
import LenisScroll from "./components/lenis-scroll";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import HeroSection from "./sections/hero-section";
import WhatWeDoSection from "./sections/what-we-do-section";
import OurTestimonialSection from "./sections/our-testimonials-section";
import FaqSection from "./sections/faq-section";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Cuenta from "./pages/Cuenta";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Nosotros from "./pages/Nosotros";
import Contacto from "./pages/Contacto";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Privacidad from "./pages/Privacidad";
import Terminos from "./pages/Terminos";
import Devoluciones from "./pages/Devoluciones";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { ProductsProvider } from "./context/ProductsContext";
import { AdminAuthProvider } from "./context/AdminAuthContext";

import Categories from "./components/Categories";
import Features from "./components/Features";
import ProductsSection from "./components/ProductsSection";
import WhatsAppButton from "./components/WhatsAppButton";

function HomePage() {
    return (
        <main>
            <HeroSection />
            <Categories />
            <Features />
            <ProductsSection />
            <WhatWeDoSection />
            <OurTestimonialSection />
            <FaqSection />
        </main>
    );
}

function AppShell() {
    const { pathname } = useLocation();
    const isAdmin = pathname.startsWith('/admin');

    return (
        <>
            <LenisScroll />
            {!isAdmin && <Navbar />}
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/cuenta" element={<Cuenta />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/nosotros" element={<Nosotros />} />
                <Route path="/contacto" element={<Contacto />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/privacidad" element={<Privacidad />} />
                <Route path="/terminos" element={<Terminos />} />
                <Route path="/devoluciones" element={<Devoluciones />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<Admin />} />
            </Routes>
            {!isAdmin && <Footer />}
            {!isAdmin && <WhatsAppButton />}
        </>
    );
}

export default function App() {
    return (
        <AdminAuthProvider>
        <AuthProvider>
        <ProductsProvider>
        <CartProvider>
            <AppShell />
        </CartProvider>
        </ProductsProvider>
        </AuthProvider>
        </AdminAuthProvider>
    );
}
