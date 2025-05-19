import JoinRoom from '@/components/modal/JoinRoom';
import { useAuth } from '@/context/authContext/authContext';
import { useModalContext } from '@/context/modalContext/modalContext';
import React from 'react';
import { Container, Row, Col, Button, Carousel, Card, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Home() {
  const {showModalMin, setShowModalMin} = useModalContext();
  const {auth} = useAuth();
  const navigate = useNavigate()

  const handleRoom = () => {
    if(auth.user){
      setShowModalMin(true);
    }else{
      navigate('/login');
    }
  };

  return (
    <Container fluid style={{ backgroundColor: '#001F3F', minHeight: '100vh', padding: '2rem' }}>
      <Row>
        {/* Sección Izquierda */}
        <Col md={5} style={{ color: 'white', textAlign: 'center', padding: '2rem' }}>
          <h1 style={{ color: '#FFCC00', fontWeight: 'bold', marginBottom: '2rem' }}>
            Chess King ♔
          </h1>

          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Chess_klt45.svg/800px-Chess_klt45.svg.png" 
            alt="Chess Icon" 
            style={{ width: '60%', marginBottom: '2rem' }} 
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Button 
              // href="/join-room" 
              onClick={handleRoom}
              style={{ backgroundColor: '#00509E', borderColor: '#00509E', fontWeight: '500' }}
            >
              Unirse a una sala
            </Button>

            <Button 
              href="/play-vs-ai" 
              style={{ backgroundColor: '#FFCC00', borderColor: '#FFCC00', color: '#001F3F', fontWeight: '500' }}
            >
              Jugar contra la máquina
            </Button>
          </div>
        </Col>

        {/* Sección Derecha */}
        <Col md={7} style={{ padding: '2rem' }}>
          <Carousel fade indicators={false}>
            {/* Carrusel Clásico */}
            <Carousel.Item>
              <Card style={{ backgroundColor: '#003366', color: 'white' }}>
                <Card.Header style={{ backgroundColor: '#00509E', color: '#FFCC00', fontWeight: 'bold' }}>
                  Ranking Clásico ♚
                </Card.Header>
                <ListGroup variant="flush">
                  <ListGroup.Item style={{ backgroundColor: '#003366', color: 'white' }}>1. Oscar</ListGroup.Item>
                  <ListGroup.Item style={{ backgroundColor: '#003366', color: 'white' }}>2. Mateo</ListGroup.Item>
                  <ListGroup.Item style={{ backgroundColor: '#003366', color: 'white' }}>3. Lucía</ListGroup.Item>
                  <ListGroup.Item style={{ backgroundColor: '#003366', color: 'white' }}>4. Sofía</ListGroup.Item>
                  <ListGroup.Item style={{ backgroundColor: '#003366', color: 'white' }}>5. Diego</ListGroup.Item>
                </ListGroup>
                <Card.Footer style={{ backgroundColor: '#00509E' }}>
                  <Button 
                    href="/ranking"
                    variant="light"
                    size="sm"
                    style={{ color: '#003366', fontWeight: '500' }}
                  >
                    Ver más →
                  </Button>
                </Card.Footer>
              </Card>
            </Carousel.Item>

            {/* Carrusel Rápidas */}
            <Carousel.Item>
              <Card style={{ backgroundColor: '#003366', color: 'white' }}>
                <Card.Header style={{ backgroundColor: '#00509E', color: '#FFCC00', fontWeight: 'bold' }}>
                  Ranking Rápidas ♞
                </Card.Header>
                <ListGroup variant="flush">
                  <ListGroup.Item style={{ backgroundColor: '#003366', color: 'white' }}>1. Ana</ListGroup.Item>
                  <ListGroup.Item style={{ backgroundColor: '#003366', color: 'white' }}>2. Juan</ListGroup.Item>
                  <ListGroup.Item style={{ backgroundColor: '#003366', color: 'white' }}>3. Laura</ListGroup.Item>
                  <ListGroup.Item style={{ backgroundColor: '#003366', color: 'white' }}>4. Mario</ListGroup.Item>
                  <ListGroup.Item style={{ backgroundColor: '#003366', color: 'white' }}>5. Dany</ListGroup.Item>
                </ListGroup>
                <Card.Footer style={{ backgroundColor: '#00509E' }}>
                  <Button 
                    href="/ranking"
                    variant="light"
                    size="sm"
                    style={{ color: '#003366', fontWeight: '500' }}
                  >
                    Ver más →
                  </Button>
                </Card.Footer>
              </Card>
            </Carousel.Item>

            {/* Carrusel Blitz */}
            <Carousel.Item>
              <Card style={{ backgroundColor: '#003366', color: 'white' }}>
                <Card.Header style={{ backgroundColor: '#00509E', color: '#FFCC00', fontWeight: 'bold' }}>
                  Ranking Blitz ♝
                </Card.Header>
                <ListGroup variant="flush">
                  <ListGroup.Item style={{ backgroundColor: '#003366', color: 'white' }}>1. Pedro</ListGroup.Item>
                  <ListGroup.Item style={{ backgroundColor: '#003366', color: 'white' }}>2. Carla</ListGroup.Item>
                  <ListGroup.Item style={{ backgroundColor: '#003366', color: 'white' }}>3. Luis</ListGroup.Item>
                  <ListGroup.Item style={{ backgroundColor: '#003366', color: 'white' }}>4. Nadia</ListGroup.Item>
                  <ListGroup.Item style={{ backgroundColor: '#003366', color: 'white' }}>5. Joel</ListGroup.Item>
                </ListGroup>
                <Card.Footer style={{ backgroundColor: '#00509E' }}>
                  <Button 
                    href="/ranking"
                    variant="light"
                    size="sm"
                    style={{ color: '#003366', fontWeight: '500' }}
                  >
                    Ver más →
                  </Button>
                </Card.Footer>
              </Card>
            </Carousel.Item>

            {/* Carrusel Bullet */}
            <Carousel.Item>
              <Card style={{ backgroundColor: '#003366', color: 'white' }}>
                <Card.Header style={{ backgroundColor: '#00509E', color: '#FFCC00', fontWeight: 'bold' }}>
                  Ranking Bullet ♟
                </Card.Header>
                <ListGroup variant="flush">
                  <ListGroup.Item style={{ backgroundColor: '#003366', color: 'white' }}>1. Valen</ListGroup.Item>
                  <ListGroup.Item style={{ backgroundColor: '#003366', color: 'white' }}>2. Cris</ListGroup.Item>
                  <ListGroup.Item style={{ backgroundColor: '#003366', color: 'white' }}>3. Pablo</ListGroup.Item>
                  <ListGroup.Item style={{ backgroundColor: '#003366', color: 'white' }}>4. Lola</ListGroup.Item>
                  <ListGroup.Item style={{ backgroundColor: '#003366', color: 'white' }}>5. Alex</ListGroup.Item>
                </ListGroup>
                <Card.Footer style={{ backgroundColor: '#00509E' }}>
                  <Button 
                    href="/ranking"
                    variant="light"
                    size="sm"
                    style={{ color: '#003366', fontWeight: '500' }}
                  >
                    Ver más →
                  </Button>
                </Card.Footer>
              </Card>
            </Carousel.Item>
          </Carousel>
        </Col>
      </Row>
     { showModalMin && <JoinRoom/>}
    </Container>
  );
}

export default Home;
