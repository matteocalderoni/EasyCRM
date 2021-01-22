import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Jumbotron, Card, Button, Row, Col, ProgressBar } from 'react-bootstrap';
import { appSiteService } from '../../../_services';
import { SitePageModal } from './SitePageModal';
import { FcHome } from 'react-icons/fc';
import { BsPencil,BsTrash } from 'react-icons/bs';
import { FaBoxes } from 'react-icons/fa';

const baseImageUrl = `${process.env.REACT_APP_STORAGE_URL}/`;

function SitePageList ({ match }){
    const { path } = match;
    const appSiteId = parseInt(match.params.appSiteId);
    const [appSite, setAppSite] = useState(null)
    const [sitePages, setSitePages] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        appSiteService.getPagesOfAppSite(appSiteId).then((x) => { 
            setLoading(false)
            setSitePages(x.result)}
        );
    }, [appSiteId]);    
    
    useEffect(() => {
        setLoading(true)
        appSiteService.getAppSiteById(appSiteId).then((x) => { 
            setLoading(false)
            setAppSite(x)
        });
    }, [appSiteId]);    
    
    function deleteSitePage(sitePage) {
        setLoading(true)
        setSitePages(sitePages.map(x => {
            if (x.appSiteId === appSiteId && x.sitePageId === sitePage.sitePageId) { x.isDeleting = true; }
            return x;
        }));
        appSiteService.deleteSitePage(appSiteId, sitePage.sitePageId).then(() => {
            setLoading(false)
            appSiteService.getPagesOfAppSite(appSiteId).then(x => setSitePages(x.result || []));
        });        
    }

    function handleAddEdit(appSiteId) {
        appSiteService.getPagesOfAppSite(appSiteId).then(x => setSitePages(x.result));
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
                            <SitePageModal appSiteId={appSiteId} sitePageId={0} handleAddEdit={(appSiteId) => handleAddEdit(appSiteId)} />
                        </div>
                    </Col>
                </Row>
                
            </Jumbotron>
            
            {loading && <Col className="text-center mart2">
                <ProgressBar animated now={100} />
            </Col>}
            <Row>
            {sitePages && sitePages.map(sitePage =>                                    
                <Col sm={6} md={4} key={sitePage.sitePageId}>
                    <Card className="mart2 text-center" bg="dark" text="white">
                        <Card.Header>
                            <Card.Title>
                                #{sitePage.sortId} {sitePage.title} 
                            </Card.Title>                                                        
                        </Card.Header>
                        <Card.Img variant="top" src={baseImageUrl+sitePage.imageUrl} />
                        <Card.Body>                                                            
                            <Card.Text>                                
                                {sitePage.description}
                            </Card.Text>                            
                            <Link title="Modifica" to={`edit/${sitePage.appSiteId}/${sitePage.sitePageId}`} className="btn btn-primary mr-1">
                                <BsPencil />
                            </Link>
                            <Link title="Gestione contenuti della pagina" to={`pageboxes/${sitePage.appSiteId}/${sitePage.sitePageId}`} className="btn btn-primary mr-1">
                                <FaBoxes />
                            </Link>
                            {sitePage.sitePageId > 1 &&
                            <Button title="Elimina Pagina" variant="danger" onClick={() => deleteSitePage(sitePage)}>
                                <BsTrash />
                            </Button>}
                        </Card.Body>
                    </Card>                                            
                </Col>                    
            )}                                                
            </Row>                
        </Container>
    );

}

export { SitePageList };