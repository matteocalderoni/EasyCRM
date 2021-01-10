import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Jumbotron, Card, Button, Row, Col, ProgressBar } from 'react-bootstrap';
import { languageService, appSiteService } from '../../../_services';
import { SiteLanguageModal } from './SiteLanguageModal';

const baseImageUrl = `${process.env.REACT_APP_STORAGE_URL}/`;

function SiteLanguageList ({ match }){
    const appSiteId = parseInt(match.params.appSiteId);
    const [appSite, setAppSite] = useState(null)
    const [siteLanguages, setSiteLanguages] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        languageService.getlanguagesOfSite(appSiteId,'',0,0).then((x) => { 
            setLoading(false)
            setSiteLanguages(x.result)}
        );
    }, [appSiteId]);    
    
    useEffect(() => {
        setLoading(true)
        appSiteService.getAppSiteById(appSiteId).then((x) => { 
            setLoading(false)
            setAppSite(x)
        });
    }, [appSiteId]);    
    
    function deleteSiteLanguage(siteLanguage) {
        setLoading(true)
        setSiteLanguages(siteLanguages.map(x => {
            if (x.appSiteId === appSiteId && x.code === siteLanguage.code) { x.isDeleting = true; }
            return x;
        }));
        languageService.deleteSiteLanguage(appSiteId, siteLanguage.code).then(() => {
            setLoading(false)
            languageService.getlanguagesOfSite(appSiteId).then(x => setSiteLanguages(x.result || []));
        });        
    }

    function handleAddEdit(appSiteId) {
        languageService.getlanguagesOfSite(appSiteId).then(x => setSiteLanguages(x.result));
    }
    
    return (
        <Container fluid>
            <Jumbotron>
                <h5>Gestione <b>Lingue del Sito</b></h5>
                {appSite && <h1>{appSite.name}</h1>}                
                <p>
                    Tramite questa sezione si configurano le pagine del sito relative al ristorante.<br />
                    Utilizzare immagini ottimizzate per un caricamento rapido.
                </p>
            </Jumbotron>
            <SiteLanguageModal appSiteId={appSiteId} code={''} handleAddEdit={(appSiteId) => handleAddEdit(appSiteId)} />
            {loading && <Col className="text-center mart2">
                <ProgressBar animated now={100} />
            </Col>}
            <Row>
            {siteLanguages && siteLanguages.map(siteLanguage =>                                    
                <Col sm={6} md={4} key={siteLanguage.code}>
                    <Card className="mart2 text-center">
                        <Card.Img variant="top" src={baseImageUrl+siteLanguage.imageUrl} />
                        <Card.Body>                                
                            <Card.Title>
                                {siteLanguage.code} 
                            </Card.Title>                                                        
                            <Card.Text>                                
                                {siteLanguage.description}
                            </Card.Text>                            
                            <Link to={`edit/${siteLanguage.appSiteId}/${siteLanguage.code}`} className="btn btn-primary mr-1">dettagli</Link>
                            <Button variant="danger" onClick={() => deleteSiteLanguage(siteLanguage)}>elimina</Button>
                        </Card.Body>
                    </Card>                                            
                </Col>                    
            )}                                                
            </Row>                
        </Container>
    );

}

export { SiteLanguageList };