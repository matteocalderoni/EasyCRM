import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Card } from 'react-bootstrap';
import { DeleteConfirmation } from '../../../_components/DeleteConfirmation';
import { BsPencil} from 'react-icons/bs';
import { FcHome } from 'react-icons/fc';
import { orderService } from '../../../_services';
import { FooterNav } from '../../../_components/FooterNav';

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
            <li className="breadcrumb-item"><Link to={`/admin/sites/edit/${appSiteId}`}>Sito</Link></li>                
            <li className="breadcrumb-item active">Elenco Ordini ({total})</li>
        </ul>

        <div className='mt-2'>
            <input type='text' placeholder='Ricerca Ordini' className='form-control' onChange={(e) => setSearchText(e.target.value)}></input>
        </div>
        
        <div className="mt-2">
            {siteOrders && siteOrders.map(siteOrder =>                                    
                <div className="block mt-1" key={siteOrder.orderId}>
                    <Card>
                        <Card.Header className={`${(siteOrder.orderState === 3 ? 'bg-green-200' : 'bg-orange-100' )} border rounded-lg`}>
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
                                <Link title="Modifica ordine" to={`/admin/sites/siteorders/edit/${appSiteId}/${siteOrder.orderYear}/${siteOrder.orderId}/${siteOrder.registryId}`} 
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

        <FooterNav appSiteId={appSiteId} />

    </Container>
  );
};

export { SiteOrderList };