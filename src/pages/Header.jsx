import React from 'react';
import {
  Container,
  Nav,
  Navbar,
  NavDropdown,
  Form,
  FormControl,
  Button
} from 'react-bootstrap';
import { FaUserCircle, FaSearch } from 'react-icons/fa'; // Iconos
import '../styles/header.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import swal from 'sweetalert2';

function Header() {

  // --- Simulación de Estado de Autenticación ---
  // En un proyecto real, esto vendría del Context, Redux, o un estado de React.
  // ¡Cambia esto a 'true' para ver el menú de usuario!
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    swal.fire({
      title: "Cerrando sesión...",
      timer: 2000, // Espera 2 segundos antes de redirigir
      buttons: false,
      icon: "success",
      position: "center",
      background: 'black',
      color: 'white',
      customClass: {
        container: 'custom-swal-container',
        title: 'custom-swal-title',
        content: 'custom-swal-content',
        confirmButton: 'custom-swal-confirm-button',
        cancelButton: 'custom-swal-cancel-button',
      },
    }).then(() => {
      logout();
      navigate("/"); // Navega al home ("/") después de cerrar sesión
    });
  };

  //const isLoggedIn = true; 
  // ---------------------------------------------

  return (

    <Navbar bg="dark" data-bs-theme="dark" expand="lg" className="header-custom">
      <Container>
        {/* 1. Logo/Marca */}
        <Navbar.Brand as={Link} to="/home" href="#home" className="navbar-brand-custom">
          Mi App Cine
        </Navbar.Brand>

        {/* 2. Botón Hamburguesa (móvil) */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        {/* 3. Contenido Colapsable */}
        <Navbar.Collapse id="basic-navbar-nav">

          {/* 3a. Enlaces de Navegación (Izquierda) */}
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" href="#home">Inicio</Nav.Link>
            <Nav.Link href="#peliculas">Películas</Nav.Link>
            <Nav.Link href="#series">Series</Nav.Link>

            <NavDropdown title="Géneros" id="basic-nav-dropdown">
              <NavDropdown.Item href="#genero-accion">Acción</NavDropdown.Item>
              <NavDropdown.Item href="#genero-comedia">Comedia</NavDropdown.Item>
              <NavDropdown.Item href="#genero-drama">Drama</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#genero-todos">Ver Todos</NavDropdown.Item>
            </NavDropdown>
          </Nav>

          {/* 3b. Búsqueda y Autenticación (Derecha) */}
          <Nav className="ms-auto d-flex align-items-center">

            {/* Barra de Búsqueda */}
            <Form className="d-flex header-search">
              <FormControl
                type="search"
                placeholder="Buscar..."
                className="me-2"
                aria-label="Buscar"
              />
              <Button variant="outline-primary"><FaSearch /></Button>
            </Form>

            {/* Lógica de Autenticación */}
            {isAuthenticated ? (
              // -- SI ESTÁ LOGUEADO --
              <NavDropdown
                title={<FaUserCircle className="user-avatar-icon" />}
                id="user-nav-dropdown"
                align="end"
              >
                <NavDropdown.Item href="#perfil">Mi Perfil</NavDropdown.Item>
                <NavDropdown.Item href="#favoritos">Mis Favoritos</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/home" onClick={handleLogout} href="#logout">Cerrar Sesión</NavDropdown.Item>
              </NavDropdown>
            ) : (
              // -- NO ESTÁ LOGUEADO --
              <>
                <Nav.Link as={Link} to="/login" className="ms-lg-3">Iniciar Sesión</Nav.Link>
                <Button variant="primary" href="#register" className="ms-2 btn-register">
                  Registrarse
                </Button>
              </>
            )}
          </Nav>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;