import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Jumbotron, Card, Button, Row, Col, Breadcrumb, ProgressBar } from 'react-bootstrap';
import { appSiteService } from '../../../_services';
import { SitePageModal } from './SitePageModal';

const baseImageUrl = `${process.env.REACT_APP_STORAGE_URL}/`;

function SitePageList ({ match }){
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
                <li className="breadcrumb-item"><Link to={`/`}>Home</Link></li>                
                <li className="breadcrumb-item"><Link to={`/admin`}>Admin</Link></li>                
                <li className="breadcrumb-item"><Link to={`/admin/sites`}>Elenco Siti</Link></li>                
                <li className="breadcrumb-item active">
                    Sito {appSite && <b>{appSite.name}</b>}                
                </li>
            </ul>
            <Jumbotron>
                <h5>Gestione <b>Pagine del Sito</b></h5>
                {appSite && <h1>{appSite.name}</h1>}                
                <p>
                    Tramite questa sezione si configurano le pagine del sito relative al ristorante.<br />
                    Utilizzare immagini ottimizzate per un caricamento rapido.
                </p>
            </Jumbotron>
            <SitePageModal appSiteId={appSiteId} sitePageId={0} handleAddEdit={(appSiteId) => handleAddEdit(appSiteId)} />
            {loading && <Col className="text-center mart2">
                <ProgressBar animated now={100} />
            </Col>}
            <Row>
            {sitePages && sitePages.map(sitePage =>                                    
                <Col sm={6} md={4} key={sitePage.sitePageId}>
                    <Card className="mart2 text-center">
                        <Card.Img variant="top" src={baseImageUrl+sitePage.imageUrl} />
                        <Card.Body>                                
                            <Card.Title>
                                ({sitePage.sortId}) {sitePage.title} 
                            </Card.Title>                                                        
                            <Card.Text>                                
                                {sitePage.description}
                            </Card.Text>                            
                            <Link to={`edit/${sitePage.appSiteId}/${sitePage.sitePageId}`} className="btn btn-primary mr-1">dettagli</Link>
                            <Link to={`pageboxes/${sitePage.appSiteId}/${sitePage.sitePageId}`} className="btn btn-primary mr-1">contenuti</Link>
                            <Button variant="danger" onClick={() => deleteSitePage(sitePage)}>elimina</Button>
                        </Card.Body>
                    </Card>                                            
                </Col>                    
            )}                                                
            </Row>                
        </Container>
    );

}

export { SitePageList };