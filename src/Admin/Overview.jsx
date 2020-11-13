import React, { useState, useEffect } from 'react';
import { Container, Jumbotron, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Role } from '../_helpers';
import { accountService } from '../_services';

function Overview({ match }) {
    const { path } = match;
    const [user, setUser] = useState({});

    useEffect(() => {
        const subscription = accountService.user.subscribe(x => setUser(x));
        //return subscription.unsubscribe;
    }, []);

    return (
        <Container fluid>
            <Jumbotron>
                <h1>Dashboard</h1>
                <p>La piattaforma ti consente di creare un sito web e gestire i suoi contenuti in modo semplice e dinamico.</p>
            </Jumbotron> 
            <Row>
                {user.role === Role.Admin &&
                    <Col>
                        <Card className="mart2">
                            <Card.Body>
                                <Card.Title>Gestione utenti</Card.Title>
                                <Card.Text>
                                    Sezione con accesso consentito solo ad Admin: gestione utenti e relativi siti.
                                </Card.Text>
                                <Link to={`${path}/users`} variant="primary">Vai</Link>
                            </Card.Body>                        
                        </Card>
                    </Col>
                }
                <Col>
                    <Card className="mart2">
                        <Card.Body>
                            <Card.Title>Gestione siti</Card.Title>
                            <Card.Text>
                                Inizia subito a gestire il tuo sito e i suoi contenuti.
                                Aggiungi testi per ottimizzare le ricerche, immagini sempre nuove e aggiorna i tuoi prodotti.
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