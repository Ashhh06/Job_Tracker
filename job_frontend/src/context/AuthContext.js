import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../services/api';  

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));


    //check if user is logged in on mount
    useEffect(() => {
        const checkAuth = async () => {
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if(storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
                try {
                    const response = await authAPI.getMe();
                    setUser(response.data.user);
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                } catch (error) {
                    //token invalid, clear storage
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setToken(null);
                    setUser(null);
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    //register
    const register = async (userData) => {
        const response = await authAPI.register(userData);
        const { token, user } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setToken(token);
        setUser(user);

        return response.data;
    };

    //login
    const login = async (credentials) => {
        const response = await authAPI.login(credentials);
        const { token, user } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setToken(token);
        setUser(user);

        return response.data;
    };

    //logout
    const logout = () => {
        localStorage.removeItem(token);
        localStorage.removeItem(user);
        setToken(null);
        setUser(null);
    };

    const value = {
        user, 
        token,
        loading,
        register,
        login,
        logout,
        isAuthenticated: !!token
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
};