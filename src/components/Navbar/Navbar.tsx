import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

interface NavbarProps {
    onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const getTitle = () => {
        switch (location.pathname) {
            case '/':
                return 'Главная';
            case '/sessions':
                return 'Все смены';
            default:
                if (location.pathname.startsWith('/session/')) {
                    return 'Детали смены';
                }
                return '';
        }
    };

    const canGoBack = location.pathname !== '/';

    return (
        <nav className="navbar">
            <div className="navbar__left">
                {canGoBack && (
                    <button 
                        className="navbar__back-button" 
                        onClick={() => navigate(-1)}
                    >
                        <img 
                            src="/icons/ic_arrow_back.svg" 
                            alt="Назад" 
                            className="navbar__icon"
                        />
                        <span>Назад</span>
                    </button>
                )}
                <h1 className="navbar__title">{getTitle()}</h1>
            </div>
            
            <div className="navbar__right">
                <button 
                    className="navbar__home-button" 
                    onClick={() => navigate('/')}
                >
                    <img 
                        src="/icons/ic_home.svg" 
                        alt="Главная" 
                        className="navbar__icon"
                    />
                </button>
                <button 
                    className="navbar__logout-button" 
                    onClick={onLogout}
                >
                    <img 
                        src="/icons/ic_logout.svg" 
                        alt="Выйти" 
                        className="navbar__icon"
                    />
                </button>
            </div>
        </nav>
    );
};

export default Navbar; 