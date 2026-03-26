import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { api, setToken, clearToken } from '../services/api';

const AdminAuthContext = createContext(null);

let _adminToken = null;
export const setAdminToken   = (t) => { _adminToken = t; setToken(t); };
export const clearAdminToken = ()  => { _adminToken = null; clearToken(); };

export function AdminAuthProvider({ children }) {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.admin.refresh()
            .then(({ accessToken }) => {
                setAdminToken(accessToken);
                setIsAdmin(true);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const login = async (user, password) => {
        const { accessToken } = await api.admin.login({ user, password });
        setAdminToken(accessToken);
        setIsAdmin(true);
    };

    const logout = async () => {
        await api.admin.logout().catch(() => {});
        clearAdminToken();
        setIsAdmin(false);
    };

    return (
        <AdminAuthContext.Provider value={{ isAdmin, loading, login, logout }}>
            {children}
        </AdminAuthContext.Provider>
    );
}

export function useAdminAuth() {
    return useContext(AdminAuthContext);
}
