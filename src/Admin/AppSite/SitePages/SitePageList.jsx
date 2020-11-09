import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Jumbotron, Card, Button, Row, Col, Breadcrumb } from 'react-bootstrap';
import { appSiteService } from '../../../_services';
import { SitePageModal } from './SitePageModal';

const baseImageUrl = `${process.env.REACT_APP_API_URL}/Resources/Images/`;

function SitePageList ({ match }){
    const appSiteId = parseInt(match.params.appSiteId);
    const [sitePages, setSitePages] = useState(null);

    useEffect(() => {
        appSiteService.getPagesOfAppSite(appSiteId).then(x => setSitePages(x.result));
    }, []);    
    
    function deleteSitePage(sitePage) {
        setSitePages(sitePages.map(x => {
            if (x.appSiteId === appSiteId && x.sitePageId === sitePage.sitePageId) { x.isDeleting = true; }
            return x;
        }));
        appSiteService.deleteAppSite(appSiteId, sitePage.sitePageId).then(() => {
            appSiteService.getPagesOfAppSite(appSiteId).then(x => setSitePages(x.result || []));
        });        
    }

    function handleAddEdit(appSiteId) {
        appSiteService.getPagesOfAppSite(appSiteId).then(x => setSitePages(x.result));
    }
    
    return (
        <Container>
            <Breadcrumb>
                <Breadcrumb.Item href="/">Home</Breadcrumb.Item>                
                <Breadcrumb.Item href="/admin">Admin</Breadcrumb.Item>                
                <Breadcrumb.Item href="/admin/sites">Siti</Breadcrumb.Item>                
                <Breadcrumb.Item active>Sito {appSiteId}</Breadcrumb.Item>
            </Breadcrumb>
            <Jumbotron>
                <h2>Gestione <b>Pagine del Sito</b></h2>
                <p>
                    Tramite questa sezione si configurano le pagine del sito relative al ristorante.<br />
                    Utilizzare immagini ottimizzate per un caricamento rapido.
                </p>
            </Jumbotron>
            <SitePageModal appSiteId={appSiteId} sitePageId={0} handleSaved={(appSiteId) => handleAddEdit(appSiteId)} />
            
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
            {!sitePages &&                
                <Col className="text-center">
                    <span className="spinner-border spinner-border-lg align-center"></span>
                </Col>
            }
            </Row>                
        </Container>
    );

}

export { SitePageList };