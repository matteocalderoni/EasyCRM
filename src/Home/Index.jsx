import React from 'react';
import { Container, Jumbotron, Row, Col,Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { accountService } from '../_services';

function Home() {
    const user = accountService.userValue;
    
    return (
        <Container>
            <Jumbotron className="home-container">
                <h1>Benvenuto {user.firstName} {user.lastName}!</h1>
                <p>Easy<b>CRM</b> è un <b>C</b>ontent <b>R</b>apid <b>M</b>anagament: un sistema rapido e semplice per gestire i contenuti online.</p>
                <small>Questa piattaforma si basa sua una gestione <b>semplice</b> e <b>intuitiva</b> per pubblicare i <b>tuoi contenuti online</b>.<br />
                Ti permette di creare rapidamente delle <b>nuove PAGINE</b> e con i <b>CONTENITORI</b> disponibili puoi rapidamente aggiungere testo, immagini e molto altro.</small>                
            </Jumbotron>            
            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <Card.Title>Profilo utente</Card.Title>
                        </Card.Header>
                        <Card.Body> 
                            <Card.Text>
                                Gestione profilo personale: modifica email e/o password.
                                Tramite questa sezione puoi modificare email e password per accedere ad area riservata.
                            </Card.Text>                            
                        </Card.Body>
                        <Card.Footer className="d-flex justify-content-end">
                            <Link to="/profile" variant="primary">Vai</Link>
                        </Card.Footer>                            
                    </Card>
                </Col>
                <Col>
                    <Card>
                        <Card.Header>
                            <Card.Title>Dashboard</Card.Title>
                        </Card.Header>
                        <Card.Body>                            
                            <Card.Text>
                                Gestione siti e altre impostazioni.
                                In questa sezione trovi le funzioni principali per la gestione dei tuoi siti: 
                                aggiungere testi, immagini, lingue differenti, mappe e molto altro.                                
                            </Card.Text>                            
                        </Card.Body>
                        <Card.Footer className="d-flex justify-content-end">
                            <Link to="/admin" variant="primary">Vai</Link>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
            <Card className="mart2">
                <Card.Header>
                    Note sui rilasci: tutti gli aggiornamenti vengono documentati in questa sezione.
                </Card.Header>
                <Card.Body>
                    <ul className="list-group">
                        <li className="list-group-item">
                            <b>Ver 1.1</b>: in questo rilascio è stato aggiunto il supporto multilingua. Con questa funzione è possibile gestire le traduzioni per visualizzare il sito in altre lingue.
                        </li>
                        <li className="list-group-item">
                            <b>Ver 1.0</b>: prima versione ufficiale.
                        </li>
                    </ul>
                </Card.Body>
            </Card>
        </Container>        
    );
}

export { Home };