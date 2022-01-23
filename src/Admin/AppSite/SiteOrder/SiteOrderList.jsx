import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Card, Navbar, Nav } from 'react-bootstrap';
import { DeleteConfirmation } from '../../../_components/DeleteConfirmation';
import { BsPencil} from 'react-icons/bs';
import { FcHome } from 'react-icons/fc';
import { orderService } from '../../../_services';

function SiteOrderList({ match }) {
    const appSiteId = parseInt(match.params.appSiteId);
    const [siteOrders, setSiteOrders] = useState([]);
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [searchText, setSearchText] = useState('');
    const [total, setTotal] = useState(0);
  
    useEffect(() => {
        getSiteOrders()
    },[searchText])
    
    function getSiteOrders() {
        
        orderService.getSiteOrders(startDate, endDate, searchText,0,0,appSiteId)
            .then((_siteOrders) => { 
                setTotal(_siteOrders.totalCount)
                setSiteOrders(_siteOrders.result)
            });
        // eslint-disable-next-line    
    }

    function deleteSiteOrder(orderYear, orderId) {
        setSiteOrders(siteOrders.map(x => {
            if (x.orderYear === orderYear && x.orderId === orderId) { x.isDeleting = true; }
                return x;
        }));
        orderService.deleteSiteOrder(appSiteId, orderYear, orderId).then(() => {            
            getSiteOrders()
        });                
    }

    return (
    <Container fluid>
        <ul className="breadcrumb">
            <li className="breadcrumb-item"><Link to={`/`}><FcHome /></Link></li>                
            <li className="breadcrumb-item"><Link to={`/admin`}>Dashboard</Link></li>                
            <li className="breadcrumb-item"><Link to={`/admin/sites`}>Elenco Siti</Link></li>
            <li className="breadcrumb-item active">Elenco Ordini ({total})</li>
        </ul>

        <div className='mt-2'>
            <input type='text' placeholder='Ricerca Ordini' className='form-control' onChange={(e) => setSearchText(e.target.value)}></input>
        </div>
        
        <div className="mt-2">
            {siteOrders && siteOrders.map(siteOrder =>                                    
                <div className="block mt-1" key={siteOrder.orderId}>
                    <Card>
                        <Card.Header className={`${(siteOrder.orderState === 2 ? 'bg-green-200' : 'bg-orange-100' )} border rounded-lg`}>
                            <div className="flex space-x-2">             
                                <div className='w-32'>
                                    <p className='font-semibold'>{siteOrder.orderYear}-{siteOrder.orderId}</p>                                                        
                                </div>
                                <div className='flex-1'>
                                    {siteOrder.registry &&
                                    <p>{siteOrder.registry.name}</p>}
                                </div>
                                <div className='w-32'>
                                    <p className='font-semibold'>{siteOrder.orderTotal} €</p>                                                        
                                </div>
                                <Link title="Modifica ordine" to={`/admin/sites/siteorders/edit/${appSiteId}/${siteOrder.orderYear}/${siteOrder.orderId}`} 
                                    className="rounded-full flex bg-blue-500 p-2 pl-3 pr-3 text-white">
                                    <BsPencil />
                                </Link>
                                <div className="p-1 rounded-full block bg-red-500 text-white">
                                    <DeleteConfirmation onConfirm={() => deleteSiteOrder(siteOrder.orderYear,siteOrder.orderId)} />
                                </div>                            
                            </div>                                                        
                        </Card.Header>                                                
                    </Card>                                            
                </div>                    
            )}   
        </div>
        <Navbar fixed="bottom" variant="dark" bg="dark">
            <Nav className="mr-right">                
                
                <Link to={`/admin/sites/edit/${appSiteId}`}
                    className="flex items-center justify-center rounded-full  bg-blue-500 text-white p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Modifica sito
                </Link>
            </Nav>
        </Navbar>
    </Container>
  );
};

export { SiteOrderList };