import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { SiteProductTypeAddEdit } from './SiteProductTypeAddEdit'
import { Tabs, Tab, Container,ProgressBar } from 'react-bootstrap'
import { productService } from '../../../../_services/product.service'

function SiteProductTypeDetail({ match }) {
    const { appSiteId, siteProductTypeId } = match.params;  
    const [siteProductType, setSiteProductType] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (siteProductTypeId > 0) {
            setLoading(true)
            productService.getSiteProductTypeById(appSiteId, siteProductTypeId).then((x) => { 
                setLoading(false)
                setSiteProductType(x)
            });
        }
        
    }, [siteProductTypeId]);  

    return (
        <Container fluid>
            <ul className="breadcrumb">
            <li className="breadcrumb-item"><Link to={`/`}>Home</Link></li>                
                <li className="breadcrumb-item"><Link to={`/admin`}>Admin</Link></li>                
                <li className="breadcrumb-item"><Link to={`/admin/sites`}>Elenco Siti</Link></li>                
                <li className="breadcrumb-item"><Link to={'/admin/sites/siteproducts/'+ appSiteId}>Prodotti del sito</Link></li>                               
                <li className="breadcrumb-item"><Link to={'/admin/sites/siteproducts/siteproducttypes/'+ appSiteId}>Tipi Prodotti</Link></li>                               
                <li className="breadcrumb-item active">
                    Tipo Prodotto {siteProductType && <b>{siteProductType.code}</b>}
                </li>
            </ul>
            <div className="shadow rounded-xl mt-2 bg-gray-100 p-4">
                <h1 className="text-blue-900 font-bold">Gestione Tipi Prodotti</h1>                                
                <p className="text-muted">Modifica dettagli relativi a tipo prodotto</p>                    
            </div>
            {loading && <div className="text-center mart2">
                <ProgressBar animated now={100} />
            </div>}

            <div className="shadow rounded-xl mt-2 bg-gray-100 p-4">                                
                <Tabs id="siteproduct-tabs">
                    <Tab eventKey="info" title="Informazioni generali">
                        {!loading && <SiteProductTypeAddEdit appSiteId={appSiteId} siteProductTypeId={siteProductTypeId} />}
                    </Tab>
                </Tabs>
            </div>
        </Container>
    );
}

export { SiteProductTypeDetail }