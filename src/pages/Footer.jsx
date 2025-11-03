import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa'; // Importa los íconos de redes sociales
import "../styles/footer.css"

const Footer = () => {
  return (
    <footer className="footer-custom py-5">
      <Container>
        <Row className="justify-content-between align-items-center mb-4">
          {/* Columna de Logo y Copyright */}
          <Col md={4} className="text-center text-md-start mb-3 mb-md-0">
            <h4 className="footer-logo mb-2">Mi App Cine</h4>
            <p className="footer-text mb-0">&copy; {new Date().getFullYear()} Mi App Cine. Todos los derechos reservados.</p>
          </Col>

          {/* Columna de Enlaces Rápidos */}
          <Col md={4} className="text-center text-md-start mb-3 mb-md-0">
            <h5 className="footer-title">Enlaces Rápidos</h5>
            <ul className="list-unstyled footer-links">
              <li><a href="#home">Inicio</a></li>
              <li><a href="#peliculas">Películas</a></li>
              <li><a href="#series">Series</a></li>
              {/* Puedes añadir más enlaces aquí */}
            </ul>
          </Col>

          {/* Columna de Redes Sociales */}
          <Col md={4} className="text-center text-md-end">
            <h5 className="footer-title">Síguenos</h5>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebook /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><FaTwitter /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedin /></a>
            </div>
          </Col>
        </Row>

        <hr className="footer-divider" />

        <Row className="mt-4">
          <Col className="text-center">
            <ul className="list-inline footer-legal-links">
              <li className="list-inline-item"><a href="#politica-privacidad">Política de Privacidad</a></li>
              <li className="list-inline-item">|</li>
              <li className="list-inline-item"><a href="#terminos-servicio">Términos de Servicio</a></li>
            </ul>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;