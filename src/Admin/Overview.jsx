import React from 'react';
import { Container, Jumbotron, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Overview({ match }) {
    const { path } = match;

    return (
        <Container>
            <Jumbotron>
                <h1>Dashboard</h1>
            </Jumbotron> 
            <Row>
                <Col>
                    <Card className="mart2">
                        <Card.Body>
                            <Card.Title>Gestione utenti</Card.Title>
                            <Card.Text>
                                Creazione e modifica degli utenti con accesso ad area di gestione.
                            </Card.Text>
                            <Link to={`${path}/users`} variant="primary">Vai</Link>
                        </Card.Body>                        
                    </Card>
                </Col>
                <Col>
                    <Card className="mart2">
                        <Card.Body>
                            <Card.Title>Gestione siti</Card.Title>
                            <Card.Text>
                                Gestione delle sedi disponibili. Assegnazione orari e dipendenti.
                            </Card.Text>
                            <Link to={`${path}/sites`} variant="primary">Vai</Link>
                        </Card.Body>                        
                    </Card>
                </Col>
            </Row>            
        </Container>
    );
}

export { Overview };