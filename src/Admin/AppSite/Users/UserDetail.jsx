import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { UserAddEdit } from './UserAddEdit'
import { Tabs, Tab, Container,ProgressBar } from 'react-bootstrap'
import { userService } from '../../../_services/user.service'

function UserDetail({ match }) {
    const { appSiteId, id } = match.params;  
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (id > 0) {
            setLoading(true)
            userService.getUserById(id).then((x) => { 
                setLoading(false)
                setUser(x)
            });
        }
        
    }, [id]);  

    return (
        <Container fluid>
            <ul className="breadcrumb">
            <li className="breadcrumb-item"><Link to={`/`}>Home</Link></li>                
                <li className="breadcrumb-item"><Link to={`/admin`}>Admin</Link></li>                
                <li className="breadcrumb-item"><Link to={`/admin/sites`}>Elenco Siti</Link></li>                
                <li className="breadcrumb-item"><Link to={'/admin/sites/users/'+ appSiteId}>Utenti del sito</Link></li>                               
                <li className="breadcrumb-item active">
                    Utente {user && <b>{user.userName}</b>}
                </li>
            </ul>
            <div className="shadow rounded-xl mt-2 bg-gray-100 p-4">
                <h1 className="text-blue-900 font-bold">Gestione Utenti</h1>                                
                <p className="text-muted">Modifica dettagli relativi a utente</p>                    
            </div>
            {loading && <div className="text-center mart2">
                <ProgressBar animated now={100} />
            </div>}

            <div className="shadow rounded-xl mt-2 bg-gray-100 p-4">                                
                <Tabs id="user-tabs">
                    <Tab eventKey="info" title="Informazioni generali">
                        {!loading && <UserAddEdit appSiteId={appSiteId} id={id} />}
                    </Tab>
                </Tabs>
            </div>
        </Container>
    );
}

export { UserDetail }