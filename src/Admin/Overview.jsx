import React from 'react';
import { Container, Jumbotron, Row, Col, Card, Button } from 'react-bootstrap';

function Overview({ match }) {
    const { path } = match;

    return (
        <Container>
            <Jumbotron>
                <h1>Admin</h1>
                <p>Questa sezione è accessibile solo dagli utenti del ruolo admin.</p>
            </Jumbotron> 
            <Row>
                <Col>
                    <Card className="mart2">
                        <Card.Body>
                            <Card.Title>Gestione utenti</Card.Title>
                            <Card.Text>
                                Creazione e modifica degli utenti con accesso ad area di gestione.
                            </Card.Text>
                            <Button href={`${path}/users`} variant="primary">Vai</Button>
                        </Card.Body>                        
                    </Card>
                </Col>
                <Col>
                    <Card className="mart2">
                        <Card.Body>
                            <Card.Title>Gestione ristoranti</Card.Title>
                            <Card.Text>
                                Gestione delle sedi disponibili. Assegnazione orari e dipendenti.
                            </Card.Text>
                            <Button href={`${path}/sites`} variant="primary">Vai</Button>
                        </Card.Body>                        
                    </Card>
                </Col>
            </Row>            
        </Container>
    );
}

export { Overview };