import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Card } from 'react-bootstrap';
import { DeleteConfirmation } from '../../../_components/DeleteConfirmation';
import { BsPencil} from 'react-icons/bs';
import { FcHome } from 'react-icons/fc';
import { userService } from '../../../_services';
import { UserModal } from './UserModal';
import { FooterNav } from '../../../_components/FooterNav';

function UserList({ match }) {
    const appSiteId = parseInt(match.params.appSiteId);
    const [searchUsers, setSearchUsers] = useState([]);
    const [searchText, setSearchText] = useState('');
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
        userService.deleteUser(+id).then(() => {            
            getUsers()
        });                
    }

    return (
    <Container fluid>
        <ul className="breadcrumb">
            <li className="breadcrumb-item"><Link to={`/`}><FcHome /></Link></li>                
            <li className="breadcrumb-item"><Link to={`/admin`}>Dashboard</Link></li>                
            <li className="breadcrumb-item"><Link to={`/admin/sites`}>Elenco Siti</Link></li>
            <li className="breadcrumb-item"><Link to={`/admin/sites/edit/${appSiteId}`}>Sito</Link></li>                
            <li className="breadcrumb-item active">Elenco Utenti ({total})</li>
        </ul>

        <div className='mt-2'>
            <input type='text' placeholder='Ricerca Utente' className='form-control' onChange={(e) => setSearchText(e.target.value)}></input>
        </div>
        
        <div className="mt-2">
            {searchUsers && searchUsers.map(user =>                                    
                <div className="block mt-1" key={user.id}>
                    <Card>
                        <Card.Header className="bg-gray-200 rounded-lg">
                            <div className="flex space-x-2">             
                                <div className='flex-1'>
                                    <p className='font-semibold'>{user.userName}</p>                                                        
                                </div>
                                <Link title="Modifica utente" to={`/admin/sites/users/edit/${appSiteId}/${user.id}`} 
                                    className="rounded-full flex bg-blue-500 p-2 pl-3 pr-3 text-white">
                                    <BsPencil />
                                </Link>
                                <div className="p-1 rounded-full block bg-red-500 text-white">
                                    <DeleteConfirmation onConfirm={() => deleteUser(user.id)} />
                                </div>                            
                            </div>                                                        
                        </Card.Header>                                                
                    </Card>                                            
                </div>                    
            )}   
        </div>

        <div className='relative'>                        
            <UserModal appSiteId={appSiteId} id={0} handleAddEdit={(appSiteId) => getUsers()} /> 
        </div>

        <FooterNav appSiteId={appSiteId} />
    </Container>
  );
};

export { UserList };