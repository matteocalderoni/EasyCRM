import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { SiteProductAddEdit } from './SiteProductAddEdit'
import { Tabs, Tab, Container,ProgressBar } from 'react-bootstrap'
import { productService } from '../../../_services/product.service'

function SiteProductDetail({ match }) {
    const { appSiteId, siteProductId } = match.params;  
    const [siteProduct, setSiteProduct] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (siteProductId > 0) {
            setLoading(true)
            productService.getSiteProductById(appSiteId, siteProductId).then((x) => { 
                setLoading(false)
                setSiteProduct(x)
            });
        }
        
    }, [siteProductId]);  

    return (
        <Container fluid>
            <ul className="breadcrumb">
            <li className="breadcrumb-item"><Link to={`/`}>Home</Link></li>                
                <li className="breadcrumb-item"><Link to={`/admin`}>Admin</Link></li>                
                <li className="breadcrumb-item"><Link to={`/admin/sites`}>Elenco Siti</Link></li>                
                <li className="breadcrumb-item"><Link to={'/admin/sites/siteproducts/'+ appSiteId}>Prodotti del sito</Link></li>                               
                <li className="breadcrumb-item active">
                    Prodotti {siteProduct && <b>{siteProduct.code}</b>}
                </li>
            </ul>
            <div className="shadow rounded-xl mt-2 bg-gray-100 p-4">
                <h1 className="text-blue-900 font-bold">Gestione Prodotti</h1>                                
                <p className="text-muted">Modifica dettagli relativi a prodotto</p>                    
            </div>
            {loading && <div className="text-center mart2">
                <ProgressBar animated now={100} />
            </div>}

            <div className="shadow rounded-xl mt-2 bg-gray-100 p-4">                                
                <Tabs id="siteproduct-tabs">
                    <Tab eventKey="info" title="Informazioni generali">
                        {!loading && <SiteProductAddEdit appSiteId={appSiteId} siteProductId={siteProductId} />}
                    </Tab>
                </Tabs>
            </div>
        </Container>
    );
}

export { SiteProductDetail }