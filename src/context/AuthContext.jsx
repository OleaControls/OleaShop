import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('oleacontrols-user');
        return saved ? JSON.parse(saved) : null;
    });

    const register = (name, email, password) => {
        const newUser = { name, email };
        localStorage.setItem('oleacontrols-user', JSON.stringify(newUser));
        setUser(newUser);
    };

    const login = (email, password) => {
        const saved = localStorage.getItem('oleacontrols-user');
        if (saved) {
            const stored = JSON.parse(saved);
            if (stored.email === email) {
                setUser(stored);
                return true;
            }
        }
        // Si no hay cuenta registrada, crear sesión con ese email
        const newUser = { name: email.split('@')[0], email };
        localStorage.setItem('oleacontrols-user', JSON.stringify(newUser));
        setUser(newUser);
        return true;
    };

    const logout = () => {
        localStorage.removeItem('oleacontrols-user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
