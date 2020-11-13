import React from 'react';
import { Container, Jumbotron, Row, Col,Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { accountService } from '../_services';

function Home() {
    const user = accountService.userValue;
    
    return (
        <Container>
            <Jumbotron className="mart2">
                <h1>Benvenuto {user.firstName} {user.lastName}!</h1>
                <p>Questa piattaforma si basa sua una gestione <b>semplice</b> e <b>intuitiva</b> per pubblicare i <b>tuoi contenuti online</b>.<br />
                Ti permette di creare rapidamente delle <b>nuove PAGINE</b> e con i <b>CONTENITORI</b> disponibili puoi rapidamente aggiungere testo, immagini e molto altro.</p>
            </Jumbotron>
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title>Profilo utente</Card.Title>
                            <Card.Text>
                                Gestione profilo personale: modifica email e/o password.
                            </Card.Text>
                            <Link to="/profile" variant="primary">Vai</Link>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title>Gestione <b>Siti</b></Card.Title>
                            <Card.Text>
                                Gestione contenuti del sito: ristoranti, menù e blog.
                            </Card.Text>
                            <Link to="/admin" variant="primary">Vai</Link>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>        
    );
}

export { Home };