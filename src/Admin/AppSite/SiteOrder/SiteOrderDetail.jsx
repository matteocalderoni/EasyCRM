import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Tabs, Tab, Container,ProgressBar } from 'react-bootstrap'
import { orderService } from '../../../_services'
import { SiteOrderAddEdit } from './SiteOrderAddEdit'

function SiteOrderDetail({ match }) {
    const { appSiteId, orderYear, orderId } = match.params;  
    const [siteOrder, setSiteOrder] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (orderId > 0) {
            setLoading(true)
            orderService.getSiteOrderById(appSiteId, orderYear, orderId).then((x) => { 
                setLoading(false)
                setSiteOrder(x)
            });
        }
        
    }, [orderYear, orderId]);  

    return (
        <Container fluid>
            <ul className="breadcrumb">
            <li className="breadcrumb-item"><Link to={`/`}>Home</Link></li>                
                <li className="breadcrumb-item"><Link to={`/admin`}>Admin</Link></li>                
                <li className="breadcrumb-item"><Link to={`/admin/sites`}>Elenco Siti</Link></li>                
                <li className="breadcrumb-item"><Link to={'/admin/sites/siteorders/'+ appSiteId}>Ordini del sito</Link></li>                               
                <li className="breadcrumb-item active">
                    Ordine {siteOrder && <b>{siteOrder.orderId}</b>}
                </li>
            </ul>
            <div className="shadow rounded-xl mt-2 bg-gray-100 p-8">
                <h1 className="text-blue-900 font-bold">Gestione Ordini</h1>                                
                <p className="text-muted">Modifica dettagli relativi agli ordini</p>                    
            </div>
            {loading && <div className="text-center mart2">
                <ProgressBar animated now={100} />
            </div>}

            <div className="shadow rounded-xl mt-2 bg-gray-100 p-8">                                
                <Tabs id="siteorder-tabs">
                    <Tab eventKey="info" title="Informazioni generali">
                        {!loading && <SiteOrderAddEdit appSiteId={appSiteId} orderYear={orderYear} orderId={orderId} />}
                    </Tab>
                    <Tab eventKey="info" title="Cliente">
                        
                    </Tab>
                    <Tab eventKey="info" title="Prodotti">
                        
                    </Tab>
                </Tabs>
            </div>
        </Container>
    );
}

export { SiteOrderDetail }