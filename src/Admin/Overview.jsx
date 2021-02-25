import React, { useState, useEffect } from 'react';
import { Container, Jumbotron, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Role } from '../_helpers';
import { accountService } from '../_services';

function Overview({ match }) {
    const { path } = match;
    const [user, setUser] = useState({});

    useEffect(() => {
        accountService.user.subscribe(x => setUser(x));        
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
                        <Card className="mart1" bg="danger" text="white">
                            <Card.Header>
                                <Card.Title>Gestione utenti</Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <Card.Text>
                                    Sezione con accesso consentito solo ad Admin: gestione utenti e relativi siti.<br />
                                    Creazione nuovi utenti e modifica di quelli già registrati.
                                </Card.Text>                                
                            </Card.Body>                        
                            <Card.Footer className="d-flex justify-content-end">                                
                                <Link to={`${path}/users`} className="btn btn-primary">Vai</Link>
                            </Card.Footer>
                        </Card>
                    </Col>
                }
                <Col>
                    <Card className="mart1">
                        <Card.Header>
                            <Card.Title>Gestione siti</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <Card.Text>
                                Inizia subito a gestire il tuo sito e i suoi contenuti.
                                Aggiungi testi per ottimizzare le ricerche, immagini sempre nuove e aggiorna i tuoi prodotti.
                            </Card.Text>                            
                        </Card.Body>   
                        <Card.Footer className="d-flex justify-content-end">
                            <Link to={`${path}/sites`} className="btn btn-primary">Vai</Link>
                        </Card.Footer>                     
                    </Card>
                </Col>
            </Row>            
        </Container>
    );
}

export { Overview };