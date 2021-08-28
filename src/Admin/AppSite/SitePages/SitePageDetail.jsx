import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SitePageAddEdit } from './SitePageAddEdit';
import { Jumbotron, Container, Tabs, Tab } from 'react-bootstrap'
import { appSiteService } from '../../../_services';
import { FcHome } from 'react-icons/fc';
import { SitePageList } from './SitePageList';
import parse from 'html-react-parser';

function SitePageDetail({ match }) {
    const { appSiteId, pageId } = match.params;  
    const [appSite, setAppSite] = useState(null)
    const [sitePage, setSitePage] = useState(null)
    const [loading, setLoading] = useState(false)

    const [isChanged, setIsChanged] = useState(0)

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

    useEffect(() => {
        setIsChanged(isChanged+1)
    },[pageId])

    function handleAddEdit(appSiteId) {
        setIsChanged(isChanged+1)
        //sitePagesEl.current.getSitePages()
        //SitePageList.handleAddEdit(appSiteId)
        //appSiteService.getPagesOfAppSite(appSiteId,0).then(x => setSitePages(x.result));
    }

    return (
        <Container fluid className="pb-8">
            <ul className="breadcrumb">
            <li className="breadcrumb-item"><Link to={`/`}><FcHome /></Link></li>                
                <li className="breadcrumb-item"><Link to={`/admin`}>Admin</Link></li>                
                <li className="breadcrumb-item"><Link to={`/admin/sites`}>Elenco Siti</Link></li>                
                <li className="breadcrumb-item">
                    <Link to={'/admin/sites/sitepages/'+ appSiteId}>Pagine del sito {appSite && <b>{appSite.name}</b>}</Link>                    
                </li>                
                {/* <li className="breadcrumb-item active">
                    Pagina {sitePage && sitePage.title && parse(sitePage.title)}
                </li> */}
            </ul>
            <div className="shadow rounded-xl mt-2 bg-gray-100 p-8">
                <small>Gestione della pagina</small>                
                {sitePage && !loading && sitePage.title && parse(sitePage.title)}
                <p className="text-muted">Modifica dettagli relativi alla pagine: modifica immagine di sfondo, il titolo per il menù di navigazione e il testo per la slide.</p>                    
            </div>

            <Tabs id="user-tabs" className="mt-4">
                <Tab eventKey="info" title="Informazioni generali">
                    {!loading &&<SitePageAddEdit appSiteId={appSiteId} sitePageId={pageId}></SitePageAddEdit>}
                </Tab>
                {pageId > 0 && <Tab eventKey="pages" title="Gestione Sotto Pagine" className="mt-2">
                    <SitePageList appSiteId={appSiteId} parentPageId={pageId} isChanged={isChanged}></SitePageList>
                </Tab>}
            </Tabs>
            
        </Container>
    );
}

export { SitePageDetail }