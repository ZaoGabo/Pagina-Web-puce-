import { Link } from 'react-router-dom';
import './Footer.css';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-container">
                {/* Seccion principal */}
                <div className="footer-main">
                    {/* Logo y descripcion */}
                    <div className="footer-brand">
                        <Link to="/" className="footer-logo">
                            <span className="logo-icon">Z</span>
                            <span className="logo-text">ZaoShop</span>
                        </Link>
                        <p className="footer-description">
                            Tu tienda de tecnologia de confianza. Productos de calidad con los mejores precios.
                        </p>
                    </div>

                    {/* Enlaces rapidos */}
                    <div className="footer-links">
                        <h4 className="footer-title">Enlaces</h4>
                        <nav className="footer-nav">
                            <Link to="/">Inicio</Link>
                            <Link to="/productos">Productos</Link>
                            <Link to="/carrito">Carrito</Link>
                        </nav>
                    </div>

                    {/* Cuenta */}
                    <div className="footer-links">
                        <h4 className="footer-title">Mi Cuenta</h4>
                        <nav className="footer-nav">
                            <Link to="/login">Iniciar Sesion</Link>
                            <Link to="/register">Registrarse</Link>
                            <Link to="/mis-pedidos">Mis Pedidos</Link>
                        </nav>
                    </div>

                    {/* Contacto */}
                    <div className="footer-links">
                        <h4 className="footer-title">Contacto</h4>
                        <div className="footer-contact">
                            <p>info@zaoshop.com</p>
                            <p>+593 99 123 4567</p>
                            <p>Quito, Ecuador</p>
                        </div>
                    </div>
                </div>

                {/* Barra inferior */}
                <div className="footer-bottom">
                    <p className="footer-copyright">
                        {currentYear} ZaoShop. Todos los derechos reservados.
                    </p>
                    <p className="footer-credits">
                        Desarrollado para RDA 3 - PUCE
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
