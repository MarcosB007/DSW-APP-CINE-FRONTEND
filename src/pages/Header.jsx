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

function Header() {
  
  // --- Simulación de Estado de Autenticación ---
  // En un proyecto real, esto vendría del Context, Redux, o un estado de React.
  // ¡Cambia esto a 'true' para ver el menú de usuario!
  const isLoggedIn = false; 
  // ---------------------------------------------

  return (
    
    <Navbar bg="dark" data-bs-theme="dark" expand="lg" className="header-custom">
      <Container>
        {/* 1. Logo/Marca */}
        <Navbar.Brand href="#home" className="navbar-brand-custom">
          Mi App Cine
        </Navbar.Brand>
        
        {/* 2. Botón Hamburguesa (móvil) */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        {/* 3. Contenido Colapsable */}
        <Navbar.Collapse id="basic-navbar-nav">
          
          {/* 3a. Enlaces de Navegación (Izquierda) */}
          <Nav className="me-auto">
            <Nav.Link href="#home">Inicio</Nav.Link>
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
            {isLoggedIn ? (
              // -- SI ESTÁ LOGUEADO --
              <NavDropdown 
                title={<FaUserCircle className="user-avatar-icon" />} 
                id="user-nav-dropdown" 
                align="end"
              >
                <NavDropdown.Item href="#perfil">Mi Perfil</NavDropdown.Item>
                <NavDropdown.Item href="#favoritos">Mis Favoritos</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#logout">Cerrar Sesión</NavDropdown.Item>
              </NavDropdown>
            ) : (
              // -- NO ESTÁ LOGUEADO --
              <>
                <Nav.Link href="#login" className="ms-lg-3">Iniciar Sesión</Nav.Link>
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