import { createContext, useContext, useState, useEffect } from 'react';
import { api, setToken, clearToken } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser]       = useState(null);
    const [loading, setLoading] = useState(true); // restaurando sesión al cargar

    // Al montar: intentar restaurar sesión con el refresh cookie httpOnly
    useEffect(() => {
        api.auth.refresh()
            .then(({ accessToken, user }) => {
                setToken(accessToken);
                setUser(user);
            })
            .catch(() => {
                // Sin sesión activa — está bien
            })
            .finally(() => setLoading(false));
    }, []);

    const register = async (name, email, password) => {
        const { accessToken, user } = await api.auth.register({ name, email, password });
        setToken(accessToken);
        setUser(user);
    };

    const login = async (email, password) => {
        const { accessToken, user } = await api.auth.login({ email, password });
        setToken(accessToken);
        setUser(user);
    };

    const logout = async () => {
        await api.auth.logout().catch(() => {});
        clearToken();
        setUser(null);
    };

    const updateProfile = async (data) => {
        await api.auth.updateProfile(data);
        setUser(prev => ({ ...prev, ...data }));
    };

    const changePassword = async (current, password) => {
        await api.auth.changePassword({ current, password });
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            isAuthenticated: !!user,
            login,
            register,
            logout,
            updateProfile,
            changePassword,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
