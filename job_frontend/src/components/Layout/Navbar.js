import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    JobTracker Pro
                </Link>

                {isAuthenticated ? (
                    <div className="navbar-menu">
                        <span className="navbar-greeting">Hello, {user?.name}</span>
                        <Link to="/dashboard" className="navbar-link">
                            Dashboard
                        </Link>
                        <Link to="/applications" className="navbar-link">
                            Applications
                        </Link>
                        <Link to="/analytics" className="navbar-link">
                            Analytics
                        </Link>
                        <button 
                            onClick={handleLogout}
                            className="button logout-button"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className="navbar-menu">
                        <Link to="/login" className="navbar-link">
                            Login
                        </Link>
                        <Link to="/register" className="navbar-link">
                            Register
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;