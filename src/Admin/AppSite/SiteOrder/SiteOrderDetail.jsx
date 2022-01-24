import React from 'react'
import { Link } from 'react-router-dom'
import { Tabs, Tab, Container } from 'react-bootstrap'
import { SiteOrderAddEdit } from './SiteOrderAddEdit'
import { RegistryAddEdit} from './RegistryAddEdit';
import { OrderDetailList } from './OrderDetailList';
 
function SiteOrderDetail({ match }) {
    const { appSiteId, orderYear, orderId, registryId } = match.params;     

    return (
        <Container fluid>
            <ul className="breadcrumb">
            <li className="breadcrumb-item"><Link to={`/`}>Home</Link></li>                
                <li className="breadcrumb-item"><Link to={`/admin`}>Admin</Link></li>                
                <li className="breadcrumb-item"><Link to={`/admin/sites`}>Elenco Siti</Link></li>                
                <li className="breadcrumb-item"><Link to={'/admin/sites/siteorders/'+ appSiteId}>Ordini del sito</Link></li>                               
                <li className="breadcrumb-item active">
                    Ordine <b>{orderYear}-{orderId}</b>
                </li>
            </ul>
            <div className="shadow rounded-xl mt-2 bg-gray-100 p-8">
                <h1 className="text-blue-900 font-bold">Ordine {orderYear}-{orderId}</h1>                                
                <p className="text-muted">Modifica dettagli relativi a ordine</p>                    
            </div>
            
            <div className="shadow rounded-xl mt-2 bg-gray-100 p-8">                                
                <Tabs id="siteorder-tabs">
                    <Tab eventKey="info" title="Informazioni generali">
                        <SiteOrderAddEdit appSiteId={appSiteId} orderYear={orderYear} orderId={orderId} />
                    </Tab>
                    <Tab eventKey="registry" title="Cliente">
                        <RegistryAddEdit registryId={registryId} />
                    </Tab>
                    <Tab eventKey="orderDetails" title="Prodotti">
                        <OrderDetailList appSiteId={appSiteId} orderYear={orderYear} orderId={orderId} />
                    </Tab>
                </Tabs>
            </div>
        </Container>
    );
}

export { SiteOrderDetail }