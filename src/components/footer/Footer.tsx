import { FiGithub, FiLinkedin, FiMail, FiShield } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand-section">
          <div className="footer-logo">
            <FiShield className="logo-icon" />
            <span>tekne <strong>Policies</strong></span>
          </div>
          <p className="footer-description">
            Plataforma avanzada para la gestión de pólizas y análisis de riesgos financieros.
          </p>
        </div>

        <div className="footer-nav-section">
          <div className="footer-column">
            <h4>Recursos</h4>
            <a href="#docs">Documentación</a>
            <a href="#api">API Reference</a>
            <a href="#status">Estado del Sistema</a>
          </div>
          <div className="footer-column">
            <h4>Contacto</h4>
            <a href="mailto:nico@example.com"><FiMail /> Soporte</a>
            <a href="https://github.com" target="_blank" rel="noreferrer">
              <FiGithub /> GitHub
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">
              <FiLinkedin /> LinkedIn
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <span>&copy; {currentYear} Nicolás Selicki.</span>
          <div className="footer-legal">
            <a href="#privacy">Privacidad</a>
            <span className="separator">•</span>
            <a href="#terms">Términos</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
