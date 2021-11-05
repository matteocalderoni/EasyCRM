import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';

import { accountService } from '../_services';

function Details({ match }) {
    const { path } = match;
    const user = accountService.userValue;

    return (
        <div>
            <div className="shadow rounded-xl mt-16 bg-gray-100 p-8">
                <h1 className="font-bold text-green-900">Profilo personale</h1>
                <p>Gestione dei dati di utente collegato.</p>
            </div>

            <Card className="shadow m-2">
                <Card.Body>
                    <Card.Title>Profilo</Card.Title>
                    <Card.Text>
                        <strong>Nome: </strong> {user.title} {user.firstName} {user.lastName}<br />
                        <strong>Email: </strong> {user.email}
                    </Card.Text>
                    <div className="mt-5">
                        <Link to={`${path}/update`} className="text-white bg-blue-900 p-2 rounded">Modifica profilo</Link>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
}

export { Details };