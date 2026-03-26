import { createContext, useContext, useState, useEffect } from 'react';
import { products as defaultProducts } from '../data/products';
import { api } from '../services/api';

const ProductsContext = createContext(null);

export function ProductsProvider({ children }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading]   = useState(true);

    useEffect(() => {
        api.getProducts()
            .then(async (list) => {
                if (list.length === 0) {
                    // Primera vez: sembrar desde datos estáticos
                    const initial = defaultProducts.map(p => ({ ...p, stock: 10, activo: true }));
                    for (const p of initial) {
                        await api.createProduct(p).catch(() => {});
                    }
                    setProducts(initial);
                } else {
                    setProducts(list);
                }
            })
            .catch(() => {
                // Fallback si la API falla (ej. desarrollo sin API)
                setProducts(defaultProducts.map(p => ({ ...p, stock: 10, activo: true })));
            })
            .finally(() => setLoading(false));
    }, []);

    const addProduct = async (p) => {
        const newP = { ...p, id: p.id || Date.now().toString(), activo: true };
        await api.createProduct(newP);
        setProducts(prev => [...prev, newP]);
    };

    const updateProduct = async (p) => {
        await api.updateProduct(p.id, p);
        setProducts(prev => prev.map(x => x.id === p.id ? p : x));
    };

    const deleteProduct = async (id) => {
        await api.deleteProduct(id);
        setProducts(prev => prev.filter(x => x.id !== id));
    };

    const toggleActive = async (id) => {
        await api.toggleProduct(id);
        setProducts(prev => prev.map(x => x.id === id ? { ...x, activo: !x.activo } : x));
    };

    const toggleFeatured = async (id) => {
        const product = products.find(x => x.id === id);
        if (!product) return;
        const featured = products.filter(x => x.destacado === true);
        if (!product.destacado && featured.length >= 4) return; // máx 4
        const updated = { ...product, destacado: !product.destacado };
        await api.updateProduct(id, updated);
        setProducts(prev => prev.map(x => x.id === id ? updated : x));
    };

    return (
        <ProductsContext.Provider value={{ products, loading, addProduct, updateProduct, deleteProduct, toggleActive, toggleFeatured }}>
            {children}
        </ProductsContext.Provider>
    );
}

export function useProducts() {
    return useContext(ProductsContext);
}
