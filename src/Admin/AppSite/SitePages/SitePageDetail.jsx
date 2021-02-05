import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SitePageAddEdit } from './SitePageAddEdit';
import { Jumbotron, Container, Row,Col } from 'react-bootstrap'
import { appSiteService } from '../../../_services';
import { FaBoxes } from 'react-icons/fa';
import { FcHome } from 'react-icons/fc';

function SitePageDetail({ match }) {
    const { appSiteId, pageId } = match.params;  
    const [appSite, setAppSite] = useState(null)
    const [sitePage, setSitePage] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        appSiteService.getAppSiteById(appSiteId).then((x) => { 
            setLoading(false)
            setAppSite(x)
        });
    }, [appSiteId]);  
    
    useEffect(() => {
        if (pageId > 0) {
            setLoading(true)
            appSiteService.getSitePageById(appSiteId, pageId).then((x) => { 
                setLoading(false)
                setSitePage(x)
            });
        }
        
    }, [appSiteId, pageId]);  

    return (
        <Container fluid>
            <ul className="breadcrumb">
            <li className="breadcrumb-item"><Link to={`/`}><FcHome /></Link></li>                
                <li className="breadcrumb-item"><Link to={`/admin`}>Admin</Link></li>                
                <li className="breadcrumb-item"><Link to={`/admin/sites`}>Elenco Siti</Link></li>                
                <li className="breadcrumb-item">
                    <Link to={'/admin/sites/sitepages/'+ appSiteId}>Pagine del sito {appSite && <b>{appSite.name}</b>}</Link>                    
                </li>                
                <li className="breadcrumb-item active">
                    Pagina {sitePage && <b>{sitePage.title}</b>}
                </li>
            </ul>
            <Jumbotron className="small-jumbotron">
                <Row>
                    <Col sm={8}>
                    <h5>Gestione della pagina</h5>                
                    {sitePage && !loading && <h1>{sitePage.title}</h1>}
                    <p>Modifica dettagli relativi alla pagine: modifica immagine di sfondo, il titolo per il menù di navigazione e il testo per la slide.</p>                    
                    </Col>
                    <Col sm={4} className="text-right">
                    {sitePage && !loading && 
                    <>                        
                        <Link title="Vai a gestione contenuti della pagina" to={`/admin/sites/sitepages/pageboxes/${appSiteId}/${pageId}`} className="btn btn-primary">
                            <FaBoxes /> Contenitori della pagina
                        </Link>
                    </>}
                    </Col>
                </Row>                
                
            </Jumbotron>
            <SitePageAddEdit appSiteId={appSiteId} sitePageId={pageId} />
        </Container>
    );
}

export { SitePageDetail }