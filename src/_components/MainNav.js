import React, { useState, useEffect } from 'react';
import {  Navbar,Nav,Button,Image } from 'react-bootstrap';
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
        <>
            <Navbar fixed="top" className="navbar navbar-expand navbar-dark bg-blue-800 flex justify-end">
                <Navbar.Brand to="/">
                    <Image src="/assets/icon.png" className="brand-logo" />
                </Navbar.Brand>
                <Nav className="flex-grow">
                    <NavLink exact to="/" className="nav-item nav-link"><b>Home</b></NavLink>
                    {/* <NavLink to="/profile" className="nav-item nav-link"><b>Profilo</b></NavLink> */}
                    <NavLink to="/admin" className="nav-item nav-link"><b>Dashboard</b></NavLink>                    
                </Nav>
                {user &&
                    <Nav className="flex justify-end">                    
                        <NavLink to="/profile" className="nav-item nav-link">
                            Benvenuto <b className="text-blue">{user.firstName}</b>
                        </NavLink>
                        <Button onClick={accountService.logout}>Esci</Button>
                    </Nav>
                }
            </Navbar>
            <Route path="/admin" component={AdminNav} />
        </>
    );
}

function AdminNav({ match }) {
    const { path } = match;
    const [user, setUser] = useState({});

    useEffect(() => {
        accountService.user.subscribe(x => setUser(x));
        //return subscription.unsubscribe;
    }, []);

    return (
        <Navbar className="bg-grey-500">
            <Nav bg="light" className="mr-auto">
                <NavLink to={`${path}/`} className="nav-item nav-link">Dashboard</NavLink>        
                {user.roles && user.roles.indexOf(Role.Admin) > -1 &&
                    <NavLink to={`${path}/users`} className="nav-item nav-link">Gestione Utenti</NavLink>
                }
                <NavLink to={`${path}/sites`} className="nav-item nav-link">Gestione Siti</NavLink>        
            </Nav>
        </Navbar>        
    );
}

export { MainNav }; 