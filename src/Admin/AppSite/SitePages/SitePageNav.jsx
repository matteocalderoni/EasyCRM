import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, ProgressBar } from 'react-bootstrap';
import { appSiteService } from '../../../_services';
import { SitePageModal } from './SitePageModal';
import { FcHome } from 'react-icons/fc';
import { SitePageList } from './SitePageList';
import {FooterNav} from '../../../_components/FooterNav';

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
    }
    
    return (
        <Container fluid>
            <ul className="breadcrumb">
                <li className="breadcrumb-item"><Link to={`/`}><FcHome /></Link></li>                
                <li className="breadcrumb-item"><Link to={`/admin`}>Dashboard</Link></li>                
                <li className="breadcrumb-item"><Link to={`/admin/sites`}>Elenco Siti</Link></li>                
                <li className="breadcrumb-item"><Link to={`/admin/sites/edit/${appSiteId}`}>Sito</Link></li>                
                <li className="breadcrumb-item active">
                    Pagine del Sito <b>{appSite && appSite.name}</b>                
                </li>
            </ul>
            <div className="shadow rounded-xl mt-2 bg-gray-100 p-4">
                <p className="mb-2"><b>Pagine del Sito</b></p>
                {appSite && <h1 className="text-blue-900 text-4xl">{appSite.name}</h1>}                
                <p className="mt-2 text-muted">
                    Tramite questa sezione si configurano le pagine del sito relative al sito. Attenzione la prima pagina dopo la creazione non può essere eliminata.
                </p>
            </div>

            {loading && 
            <div className="text-center rounded bg-blue-400 text-white mt-2 p-2">
                <h5 className="text-white text-bold-xl">Caricamento in corso... Attendere prego...</h5>
                <ProgressBar animated now={100} />
            </div>}
            
            <SitePageList appSite={appSite} appSiteId={appSiteId} parentPageId={0} isChanged={isChanged}></SitePageList>            

            {appSite &&
            <SitePageModal appSiteId={appSiteId} sitePageId={0} parentPageId={0} appSite={appSite} handleAddEdit={(appSiteId) => handleAddEdit(appSiteId)} />}            

            <FooterNav appSiteId={appSiteId} />

        </Container>
    );

}

export { SitePageNav };