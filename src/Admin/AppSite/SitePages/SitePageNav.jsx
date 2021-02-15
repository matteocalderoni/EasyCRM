import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Jumbotron, Row, Col } from 'react-bootstrap';
import { appSiteService } from '../../../_services';
import { SitePageModal } from './SitePageModal';
import { FcHome } from 'react-icons/fc';
import { FaLanguage } from 'react-icons/fa';
import { SitePageList } from './SitePageList';

const baseImageUrl = `${process.env.REACT_APP_STORAGE_URL}/`;

function SitePageNav ({ match }){
    const { path } = match;
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
                <li className="breadcrumb-item active">
                    Pagine del Sito {appSite && <b>{appSite.name}</b>}                
                </li>
            </ul>
            <Jumbotron className="small-jumbotron">
                <Row>
                    <Col md={8}>
                        <h5>Gestione <b>Pagine del Sito</b></h5>
                        {appSite && <h1>{appSite.name}</h1>}                
                        <p>
                            Tramite questa sezione si configurano le pagine del sito relative al sito. Attenzione la prima pagina dopo la creazione non può essere eliminata.<br />
                            Utilizzare immagini ottimizzate per un caricamento rapido.
                        </p>
                    </Col>
                    <Col md={4} className="text-right">
                        <div className="mart2">
                            <Link className="btn btn-secondary" to={`/admin/sites/edit/${appSiteId}`}>
                                <FaLanguage /> modifica sito
                            </Link>
                        </div>
                        <div className="mart2">
                            <Link className="btn btn-secondary" to={`/admin/sites/sitelanguages/edit/${appSiteId}`}>
                                <FaLanguage /> modifica lingue
                            </Link>
                        </div>                        
                        <div className="mart2">
                            <SitePageModal appSiteId={appSiteId} sitePageId={0} parentPageId={0} handleAddEdit={(appSiteId) => handleAddEdit(appSiteId)} />
                        </div>
                    </Col>
                </Row>
                
            </Jumbotron>
            
            <SitePageList appSiteId={appSiteId} parentPageId={0} isChanged={isChanged}></SitePageList>

        </Container>
    );

}

export { SitePageNav };