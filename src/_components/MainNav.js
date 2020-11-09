import React, { useState, useEffect } from 'react';
import { Container, Navbar,Nav } from 'react-bootstrap';
import { NavLink, Route } from 'react-router-dom';

import { Role } from '../_helpers';
import { accountService } from '../_services';

function MainNav() {
    const [user, setUser] = useState({});

    useEffect(() => {
        const subscription = accountService.user.subscribe(x => setUser(x));
        return subscription.unsubscribe;
    }, []);

    // only show nav when logged in
    if (!user) return null;

    return (
        <Container fluid>
            <Navbar className="navbar navbar-expand navbar-dark bg-dark">
                <div className="navbar-nav">
                    <Container>
                        <NavLink exact to="/" className="nav-item nav-link"><b>Pagina iniziale</b></NavLink>
                        <NavLink to="/profile" className="nav-item nav-link"><b>Profilo utente</b></NavLink>
                        {user.role === Role.Admin &&
                            <NavLink to="/admin" className="nav-item nav-link"><b>Admin</b></NavLink>
                        }
                        <button onClick={accountService.logout}>Esci</button>
                    </Container>                                        
                </div>
            </Navbar>
            <Route path="/admin" component={AdminNav} />
        </Container>
    );
}

function AdminNav({ match }) {
    const { path } = match;

    return (
        <Container fluid>
            <Navbar bg="dark" expand="sm" className="navbar navbar-expand navbar-dark bg-dark">
                <Nav bg="light" className="mr-auto">
                    <NavLink to={`${path}/users`} className="nav-item nav-link">Utenti</NavLink>                    
                    <NavLink to={`${path}/sites`} className="nav-item nav-link">Siti</NavLink>        
                </Nav>
            </Navbar>
        </Container>        
    );
}

export { MainNav }; 