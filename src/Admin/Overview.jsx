import React, { useState, useEffect } from 'react';
import { Container, Card } from 'react-bootstrap';
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
            <div className="shadow rounded-xl mt-2 bg-gray-100 p-4">
                <h1 className="text-xl text-blue-900 font-bold ml-2">Dashboard</h1>
                <p>La piattaforma ti consente di creare un sito web e gestire i suoi contenuti in modo semplice e dinamico.</p>
            </div> 
            <div className="md:flex items-stretch mt-8">
                {user.roles && user.roles.indexOf(Role.Admin) > -1 &&
                    <div className="m-2 self-auto">
                        <Card className="shadow">
                            <Card.Header className="bg-red-50">
                                <Card.Title>Gestione utenti</Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <Card.Text className='h-32'>
                                    Sezione con accesso consentito solo ad Admin: gestione utenti e relativi siti.<br />
                                    Creazione nuovi utenti e modifica di quelli già registrati.
                                </Card.Text>                                
                            </Card.Body>                        
                            <Card.Footer className="d-flex justify-content-end bg-red-100">                                
                                <Link to={`${path}/users`} className="text-white bg-blue-900 p-2 rounded">Vai</Link>
                            </Card.Footer>
                        </Card>
                    </div>
                }
                <div className="m-2 self-auto">
                    <Card className="shadow">
                        <Card.Header className="bg-blue-50">
                            <Card.Title>Gestione siti</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <Card.Text className='h-32'>
                                Inizia subito a gestire il tuo sito e i suoi contenuti.
                                Aggiungi testi per ottimizzare le ricerche, immagini sempre nuove e aggiorna i tuoi prodotti.
                            </Card.Text>                            
                        </Card.Body>   
                        <Card.Footer className="d-flex justify-content-end bg-blue-100">
                            <Link to={`${path}/sites`} className="text-white bg-blue-900 p-2 rounded">Vai</Link>
                        </Card.Footer>                     
                    </Card>
                </div>
            </div>            
        </Container>
    );
}

export { Overview };