import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Card, Navbar, Nav } from 'react-bootstrap';
import { DeleteConfirmation } from '../../../_components/DeleteConfirmation';
import { BsPencil} from 'react-icons/bs';
import { FcHome } from 'react-icons/fc';
import { userService } from '../../../_services/user.service';
import { UserModal } from './UserModal';

function UserList({ match }) {
    const appSiteId = parseInt(match.params.appSiteId);
    const [searchUsers, setSearchUsers] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [showSearchbar, setShowSearchbar] = useState(false);
    const [total, setTotal] = useState(0);
  
    useEffect(() => {
        getUsers()
    },[searchText])

    function getUsers() {
        userService.getUsers(searchText,0,0,appSiteId)
            .then((_users) => { 
                setTotal(_users.length)
                setSearchUsers(_users)
            });
        // eslint-disable-next-line    
    }

    function deleteUser(id) {
        setSearchUsers(searchUsers.map(x => {
            if (x.id === id) { x.isDeleting = true; }
                return x;
        }));
        userService.deleteUser(id).then(() => {            
            setSearchText('')
        });                
    }

    return (
    <Container fluid>
        <ul className="breadcrumb">
            <li className="breadcrumb-item"><Link to={`/`}><FcHome /></Link></li>                
            <li className="breadcrumb-item"><Link to={`/admin`}>Dashboard</Link></li>                
            <li className="breadcrumb-item"><Link to={`/admin/sites`}>Elenco Siti</Link></li>
            <li className="breadcrumb-item active">Elenco Utenti</li>
        </ul>
        <div className="mt-4">
            {searchUsers && searchUsers.map(user =>                                    
                <div className="block mt-1" key={user.id}>
                    <Card>
                        <Card.Header className="bg-blue-500 rounded-lg">
                            <div className="md:flex">                                                                     
                                <Link title="Modifica utente" to={`/admin/sites/users/edit/${appSiteId}/${user.id}`} className="flex-1 flex items-center justify-center rounded-full bg-blue-200 mt-1 p-1 text-blue-900 text-lg">
                                    <BsPencil className="mr-2" /> {user.userName}
                                </Link>
                                <div className="mt-1 ml-2 p-1 pr-2 rounded-full block bg-red-500 text-white">
                                    <DeleteConfirmation onConfirm={() => deleteUser(user)} /> Elimina
                                </div>                            
                            </div>                                                        
                        </Card.Header>                                                
                    </Card>                                            
                </div>                    
            )}   
        </div>
        <Navbar fixed="bottom" variant="dark" bg="dark">
            <Nav className="mr-right">
                <UserModal appSiteId={appSiteId} id={0} handleAddEdit={(appSiteId) => getUsers()} />
            </Nav>
        </Navbar>
    </Container>
  );
};

export { UserList };