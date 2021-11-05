import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Jumbotron, Navbar, Nav, ProgressBar } from 'react-bootstrap';
import { appSiteService } from '../../../_services';
import { SitePageModal } from './SitePageModal';
import { FcHome } from 'react-icons/fc';
import { FaLanguage } from 'react-icons/fa';
import { SitePageList } from './SitePageList';

//const baseImageUrl = `${process.env.REACT_APP_STORAGE_URL}/`;

function SitePageNav ({ match }){
    //const { path } = match;
    const appSiteId = parseInt(match.params.appSiteId);
    const [appSite, setAppSite] = useState(null)
    const [loading, setLoading] = useState(false)   

    const [isChanged, setIsChanged] = useState(0)
    
    useEffect(() => {
        setLoading(true)
        appSiteService.getAppSiteById(appSiteId).then((x) => { 
            setLoading(false)
            setAppSite(x)
        });
    }, [appSiteId]);    

    function handleAddEdit(appSiteId) {
        setIsChanged(isChanged+1)
        //sitePagesEl.current.getSitePages()
        //SitePageList.handleAddEdit(appSiteId)
        //appSiteService.getPagesOfAppSite(appSiteId,0).then(x => setSitePages(x.result));
    }
    
    return (
        <Container fluid>
            <ul className="breadcrumb">
                <li className="breadcrumb-item"><Link to={`/`}><FcHome /></Link></li>                
                <li className="breadcrumb-item"><Link to={`/admin`}>Dashboard</Link></li>                
                <li className="breadcrumb-item"><Link to={`/admin/sites`}>Elenco Siti</Link></li>                
                <li className="breadcrumb-item"><Link to={`/admin/sites/edit/${appSiteId}`}>Sito <b>{appSite && appSite.name}</b></Link></li>                
                <li className="breadcrumb-item active">
                    Pagine del Sito <b>{appSite && appSite.name}</b>                
                </li>
            </ul>
            <div className="shadow rounded-xl mt-2 bg-gray-100 p-8">
                <p className="mb-2">Gestione <b>Pagine del Sito</b></p>
                {appSite && <h1 className="text-blue-900 text-xl">{appSite.name}</h1>}                
                <p className="mt-2 text-muted">
                    Tramite questa sezione si configurano le pagine del sito relative al sito. Attenzione la prima pagina dopo la creazione non può essere eliminata.<br />
                    Utilizzare immagini ottimizzate per un caricamento rapido.
                </p>
            </div>

            {loading && 
            <div className="text-center rounded bg-blue-400 text-white mt-2 p-2">
                <h5 className="text-white text-bold-xl">Caricamento in corso... Attendere prego...</h5>
                <ProgressBar animated now={100} />
            </div>}
            
            <SitePageList appSiteId={appSiteId} parentPageId={0} isChanged={isChanged}></SitePageList>

            <Navbar fixed="bottom" className="bg-blue-800">
                <Nav className="flex space-x-3 text-sm font-medium mr-auto">
                    <Link className="flex items-center justify-center rounded-md bg-blue-200 p-1 text-blue-900" to={`/admin/sites/edit/${appSiteId}`}>
                        <FaLanguage /> modifica sito
                    </Link>
                    <Link className="flex items-center justify-center rounded-md bg-blue-200 p-1 text-blue-900" to={`/admin/sites/sitelanguages/${appSiteId}`}>
                        <FaLanguage /> lingue
                    </Link>
                </Nav>     
                <Nav className="mr-left">
                    <SitePageModal appSiteId={appSiteId} sitePageId={0} parentPageId={0} handleAddEdit={(appSiteId) => handleAddEdit(appSiteId)} />
                </Nav>         
            </Navbar>
        </Container>
    );

}

export { SitePageNav };