import React from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';

function NavBar() {
  const location = useLocation();

  // Ocultar navbar en ciertas rutas
  if (
    location.pathname === "/chess" ||
    location.pathname === "/dashboard/next" ||
    location.pathname === "/dashboard/profile" ||
    location.pathname === "/games-time" ||
    location.pathname === "/chess-play"
  ) {
    return null;
  }

  return (
    <Navbar expand="lg" style={{ backgroundColor: '#003366' }}> {/* Azul oscuro */}
      <Container>
        <Navbar.Brand 
          href="/" 
          style={{ color: 'white', fontWeight: 'bold', fontSize: '1.5rem' }}
        >
          Chess King ♔
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ backgroundColor: 'white' }} />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              href="/" 
              style={{ color: '#FFCC00', fontWeight: '500' }} // Amarillo
            >
              Inicio
            </Nav.Link>
            <Nav.Link 
              href="/ranking" 
              style={{ color: 'white', fontWeight: '500' }}
            >
              Ranking
            </Nav.Link>
            <Nav.Link 
              href="/about" 
              style={{ color: '#FFCC00', fontWeight: '500' }}
            >
              Sobre Nosotros
            </Nav.Link>
            <NavDropdown 
              title={<span style={{ color: 'white' }}>Más</span>} 
              id="basic-nav-dropdown"
              menuVariant="dark"
              style={{ color: 'white' }}
            >
              <NavDropdown.Item href="/ajedrez-tips">Tips de Ajedrez</NavDropdown.Item>
              <NavDropdown.Item href="/configuracion">Configuración</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/logout">Cerrar Sesión</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
