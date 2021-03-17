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
                <Col sm={12} md={6}>
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
                <Col sm={12} md={6}>
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
                            <b>Ver 1.2.7.11 (Marzo 2021)</b>: posizione del logo per le varie pagine. Possibilità di selezionare la posizione del logo per le singole pagine (al posto del valore fisso in cima alla pagina). Inoltre è possibile nascondere il logo. 
                        </li>
                        <li className="list-group-item">
                            <b>Ver 1.3.1.11 (Marzo 2021)</b>: in questo rilascio ci sono numerosi aggiornamenti:<br /> 
                            - modifica di titoli relativi a pagine e contenitori testo: possibilità di formattare il testo relativo a <b>Titolo di pagina</b> e <b>Titolo di Contenitori Testo</b>;<br />
                            - visualizzare anteprima di contenitori e sfondo della pagina in elenco contenitori;<br />
                            - modifica dei testi direttamente da anteprima di contenitore testo;<br />
                            - aggiunta feed di instagram con le ultime 8 foto pubblicate (in fase di sviluppo);
                        </li>
                        <li className="list-group-item">
                            <b>Ver 1.2.6.10 (Marzo 2021)</b>: aggiunta contenitore per la visualizzazione dei video Youtube. 
                        </li>
                        <li className="list-group-item">
                            <b>Ver 1.2.5.9 (Marzo 2021)</b>: aggiunta contenitore per la visualizzazione del Feed di una pagina Facebook. 
                        </li>
                        <li className="list-group-item">
                            <b>Ver 1.2.4.8 (Marzo 2021)</b>: aggiunta gestione privacy policy e cookie in rispetto delle norme relative alla GDPR. Nei dati del sito è presente una nuova voce per selezionare la pagina corrispondente (per non visualizzare la pagina nel menù principale non pubblicare la pagina). 
                        </li>
                        <li className="list-group-item">
                            <b>Ver 1.2.3.7 (Febbraio 2021)</b>: aggiunta la conferma per azioni di Elimina. 
                        </li>
                        <li className="list-group-item">
                            <b>Ver 1.2.2.6 (Febbraio 2021)</b>: gestione recapiti per contenitore Contattaci e gestione coordinare (latitudine e longitudine) in contenitore Mappa.
                            Numerosi miglioramenti a livello di layout: aggiunta barre di navigazione in fondo a pagine per ottimizzare gli spazi e la gestione da mobile.
                        </li>
                        <li className="list-group-item">
                            <b>Ver 1.2.1.5 (Febbraio 2021)</b>: gestione dimensioni dei contenitori e colore di background. Gestione sotto-pagine per estendere il numero di pagine.
                        </li>
                        <li className="list-group-item">
                            <b>Ver 1.1.3.4 (Febbraio 2021)</b>: 4 nuove dimensioni per alineare le card (servizi top, dipendenti, ecc).
                        </li>
                        <li className="list-group-item">
                            <b>Ver 1.1.2.3 (Gennaio 2021)</b>: modifica del componente per la formattazione dei testi. Aggiunta di numerose funzionalità: colore del testo, font, dimensione, tabelle e molte altre.
                        </li>
                        <li className="list-group-item">
                            <b>Ver 1.1.1.2 (Gennaio 2021)</b>: aggiunta icone e ottimizazione layout di elenchi e moduli, aggiunta 5 decimali per salvataggio coordinate google maps.
                        </li>
                        <li className="list-group-item">
                            <b>Ver 1.1.0.1 (Dicembre 2020)</b>: in questo rilascio è stato aggiunto il supporto multilingua. Con questa funzione è possibile gestire le traduzioni per visualizzare il sito in altre lingue.
                        </li>
                        <li className="list-group-item">
                            <b>Ver 1.0.0.0 (Novembre 2020)</b>: prima versione ufficiale.
                        </li>
                    </ul>
                </Card.Body>
            </Card>
        </Container>        
    );
}

export { Home };