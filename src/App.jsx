import { Routes, Route } from 'react-router-dom';
import Banner from "./components/banner";
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
import { CartProvider } from "./context/CartContext";

// Nuevos componentes de la Home
import Categories from "./components/Categories";
import Features from "./components/Features";
import ProductsSection from "./components/ProductsSection";

function HomePage() {
    return (
        <main className='px-4 md:px-0'>
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

export default function App() {
    return (
        <CartProvider>
            <LenisScroll />
            <Banner />
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
            </Routes>
            <Footer />
        </CartProvider>
    );
}
