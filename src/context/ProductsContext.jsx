import { createContext, useContext, useState } from 'react';
import { products as defaultProducts } from '../data/products';

const STORAGE_KEY = 'olea-products';

function seed() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    const initial = defaultProducts.map(p => ({ ...p, stock: 10, activo: true }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
}

const ProductsContext = createContext(null);

export function ProductsProvider({ children }) {
    const [products, setProducts] = useState(seed);

    const save = (list) => {
        setProducts(list);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    };

    const addProduct    = (p)  => save([...products, { ...p, id: Date.now().toString(), activo: true }]);
    const updateProduct = (p)  => save(products.map(x => x.id === p.id ? p : x));
    const deleteProduct = (id) => save(products.filter(x => x.id !== id));
    const toggleActive  = (id) => save(products.map(x => x.id === id ? { ...x, activo: !x.activo } : x));

    return (
        <ProductsContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, toggleActive }}>
            {children}
        </ProductsContext.Provider>
    );
}

export function useProducts() {
    return useContext(ProductsContext);
}
