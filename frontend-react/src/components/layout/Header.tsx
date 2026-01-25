import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './Header.css';

export function Header() {
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const { itemCount } = useCart();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="header">
            <div className="header-container">
                {/* Logo */}
                <Link to="/" className="header-logo">
                    <span className="logo-icon">Z</span>
                    <span className="logo-text">ZaoShop</span>
                </Link>

                {/* Navegacion */}
                <nav className="header-nav">
                    <Link to="/" className="nav-link">Inicio</Link>
                    <Link to="/productos" className="nav-link">Productos</Link>
                    {isAdmin && (
                        <Link to="/admin" className="nav-link nav-link-admin">Panel Admin</Link>
                    )}
                </nav>

                {/* Acciones */}
                <div className="header-actions">
                    {/* Carrito */}
                    <Link to="/carrito" className="cart-button">
                        <svg className="cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="9" cy="21" r="1" />
                            <circle cx="20" cy="21" r="1" />
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                        </svg>
                        {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
                    </Link>

                    {/* Usuario */}
                    {isAuthenticated ? (
                        <div className="user-menu">
                            <button className="user-button">
                                <span className="user-avatar">{user?.email?.charAt(0).toUpperCase()}</span>
                                <span className="user-email">{user?.email}</span>
                            </button>
                            <div className="user-dropdown">
                                <Link to="/mis-pedidos" className="dropdown-item">Mis Pedidos</Link>
                                <button onClick={handleLogout} className="dropdown-item dropdown-item-logout">
                                    Cerrar Sesion
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="auth-buttons">
                            <Link to="/login" className="btn-login">Ingresar</Link>
                            <Link to="/register" className="btn-register">Registrarse</Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;
