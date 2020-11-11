import React from 'react';
import { Link } from 'react-router-dom';
import { Jumbotron, Card } from 'react-bootstrap';

import { accountService } from '../_services';

function Details({ match }) {
    const { path } = match;
    const user = accountService.userValue;

    return (
        <div>
            <Jumbotron>
                <h1>Profilo personale</h1>
                <p>Gestione dei dati di utente collegato.</p>
            </Jumbotron>

            <Card>
                <Card.Body>
                    <Card.Title>Profilo</Card.Title>
                    <Card.Text>
                        <strong>Nome: </strong> {user.title} {user.firstName} {user.lastName}<br />
                        <strong>Email: </strong> {user.email}
                    </Card.Text>
                    <Link to={`${path}/update`}>Modifica profilo</Link>
                </Card.Body>
            </Card>
        </div>
    );
}

export { Details };