import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SiteLanguageAddEdit } from './SiteLanguageAddEdit';
import { Jumbotron, Container,ProgressBar } from 'react-bootstrap'
import { appSiteService, languageService } from '../../../_services';

function SiteLanguageDetail({ match }) {
    const { appSiteId, code } = match.params;  
    const [appSite, setAppSite] = useState(null)
    const [siteLanguage, setSiteLanguage] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        appSiteService.getAppSiteById(appSiteId).then((x) => { 
            setLoading(false)
            setAppSite(x)
        });
    }, [appSiteId]);  
    
    useEffect(() => {
        if (code != '') {
            setLoading(true)
            languageService.getSiteLanguageById(appSiteId, code).then((x) => { 
                setLoading(false)
                setSiteLanguage(x)
            });
        }
        
    }, [appSiteId, code]);  

    return (
        <Container fluid>
            <ul className="breadcrumb">
            <li className="breadcrumb-item"><Link to={`/`}>Home</Link></li>                
                <li className="breadcrumb-item"><Link to={`/admin`}>Admin</Link></li>                
                <li className="breadcrumb-item"><Link to={`/admin/sites`}>Elenco Siti</Link></li>                
                <li className="breadcrumb-item">
                    <Link to={'/admin/sites/sitelanguages/'+ appSiteId}>Lingue del sito {appSite && <b>{appSite.name}</b>}</Link>                    
                </li>                
                <li className="breadcrumb-item active">
                    Lingue {siteLanguage && <b>{siteLanguage.code}</b>}
                </li>
            </ul>
            <Jumbotron>
                <h5>Gestione della lingua</h5>                                
                <p>Modifica dettagli relativi alle lingue: modifica immagine bandiera e il titolo per il menù di navigazione.</p>                    
            </Jumbotron>
            {loading && <div className="text-center mart2">
                <ProgressBar animated now={100} />
            </div>}
            <SiteLanguageAddEdit appSiteId={appSiteId} code={code} />
        </Container>
    );
}

export { SiteLanguageDetail }