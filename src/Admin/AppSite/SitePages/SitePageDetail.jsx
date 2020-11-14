import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SitePageAddEdit } from './SitePageAddEdit';
import { Jumbotron, Container, Breadcrumb } from 'react-bootstrap'
import { appSiteService } from '../../../_services';

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
            <Breadcrumb>
                <Breadcrumb.Item href="/">Home</Breadcrumb.Item>                
                <Breadcrumb.Item href="/admin">Admin</Breadcrumb.Item>          
                <Breadcrumb.Item href="/admin/sites">Siti</Breadcrumb.Item>                      
                <Breadcrumb.Item href={'/admin/sites/sitepages/'+ appSiteId}>
                    Pagine del sito {appSite && <b>{appSite.name}</b>}         
                </Breadcrumb.Item>                
                <Breadcrumb.Item active>
                    Pagina {sitePage && <b>{sitePage.title}</b>}
                </Breadcrumb.Item>
            </Breadcrumb>
            <Jumbotron>
                <h5>Gestione della pagina</h5>                
                {sitePage && loading && 
                <>
                    <h1>{sitePage.title}</h1>                      
                    <Link to={`/admin/sites/sitepages/pageboxes/${appSiteId}/${pageId}`}>
                        Contenitori della pagina
                    </Link>
                </>
                }
                <p>Modifica dettagli relativi alla pagine: modifica immagine di sfondo, il titolo per il menù di navigazione e il testo per la slide.</p>                    
            </Jumbotron>
            <SitePageAddEdit appSiteId={appSiteId} sitePageId={pageId} />
        </Container>
    );
}

export { SitePageDetail }