import React from 'react';
import { Container, Jumbotron, Row, Col,Card, Button } from 'react-bootstrap';

import { accountService } from '../_services';

function Home() {
    const user = accountService.userValue;
    
    return (
        <Container>
            <Jumbotron className="mart2">
                <h1>Benvenuto {user.firstName}!</h1>
                <p>Tramite questa sezione è possibile gestire i contenuti del sito: dati del ristorante, menù e blog.</p>
            </Jumbotron>
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title>Profilo utente</Card.Title>
                            <Card.Text>
                                Gestione profilo personale: modifica email e password.
                            </Card.Text>
                            <Button href="/profile" variant="primary">Vai</Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title>Admin</Card.Title>
                            <Card.Text>
                                Gestione contenuti del sito: ristoranti, menù e blog.
                            </Card.Text>
                            <Button href="/admin" variant="primary">Vai</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>        
    );
}

export { Home };