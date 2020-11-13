import React from 'react';
import { SitePageAddEdit } from './SitePageAddEdit';
import { Jumbotron, Container, Breadcrumb } from 'react-bootstrap'

function SitePageDetail({ match }) {
    const { appSiteId, pageId } = match.params;  

    return (
        <Container fluid>
            <Breadcrumb>
                <Breadcrumb.Item href="/">Home</Breadcrumb.Item>                
                <Breadcrumb.Item href="/admin">Admin</Breadcrumb.Item>          
                <Breadcrumb.Item href="/admin/sites">Siti</Breadcrumb.Item>                      
                <Breadcrumb.Item href={'/admin/sites/sitepages/'+ appSiteId}>
                    Pagine del ristorante {appSiteId}         
                </Breadcrumb.Item>                
                <Breadcrumb.Item active>Pagina {pageId}</Breadcrumb.Item>
            </Breadcrumb>
            <Jumbotron>
                <h1>Gestione della pagina</h1>
                <p>Modifica dettagli e gestione contenuti</p>                    
            </Jumbotron>
            <SitePageAddEdit appSiteId={appSiteId} sitePageId={pageId} />
        </Container>
    );
}

export { SitePageDetail }