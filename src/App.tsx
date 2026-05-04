import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { FiLayout, FiUploadCloud, FiShield, FiAlertOctagon, FiMenu, FiX } from 'react-icons/fi';
import './styles/index.css';
import ChatBot from './components/chatbot/ChatBot';
import Footer from './components/footer/Footer';

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path ? 'active' : '';
  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className={`app-layout ${isMobileMenuOpen ? 'menu-open' : ''}`}>
      <button className="mobile-toggle" onClick={toggleMenu} aria-label="Abrir menú">
        {isMobileMenuOpen ? <FiX /> : <FiMenu />}
      </button>

      {isMobileMenuOpen && <div className="menu-overlay" onClick={toggleMenu}></div>}

      <aside className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-icon">T</div>
          <span>tekne <small>v2.0</small></span>
        </div>

        <nav className="sidebar-nav">
          <ul>
            <li className={isActive('/')} onClick={() => setIsMobileMenuOpen(false)}>
              <Link to="/"><FiLayout /> Dashboard</Link>
            </li>
            <li className={isActive('/upload')} onClick={() => setIsMobileMenuOpen(false)}>
              <Link to="/upload"><FiUploadCloud /> Upload</Link>
            </li>
            <li className={isActive('/policies')} onClick={() => setIsMobileMenuOpen(false)}>
              <Link to="/policies"><FiShield /> Policies</Link>
            </li>
            <li className={isActive('/errors')} onClick={() => setIsMobileMenuOpen(false)}>
              <Link to="/errors"><FiAlertOctagon /> Errores</Link>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <div className="content-wrapper">
          <Outlet />
        </div>

        <Footer />
      </main>

      <ChatBot />
    </div>
  );
}

export default App;
