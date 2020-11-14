import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Jumbotron, Image, Container,Breadcrumb, Row, Col, Button} from 'react-bootstrap';
import { appSiteService, accountService } from '../../_services';
import { Role } from '../../_helpers';
import parse from 'html-react-parser';

const baseImageUrl = `${process.env.REACT_APP_STORAGE_URL}/`;

function List({ match }) {
    const { path } = match;
    const user = accountService.userValue;
    
    const [appSites, setAppSites] = useState(null)    
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        appSiteService.getAppSites('',0,0).then((x) => { 
            setLoading(false)
            setAppSites(x.result)}
        );
    }, []);

    function deleteAppSite(appSiteId) {
        setLoading(true)
        setAppSites(appSites.map(x => {
            if (x.appSiteId === appSiteId) { x.isDeleting = true; }
            return x;
        }));
        appSiteService.deleteAppSite(appSiteId).then(() => {            
            setLoading(false)
            setAppSites(appSites => appSites.filter(x => x.appSiteId !== appSiteId));
        });
    }

    return (
        <Container fluid>
            <Breadcrumb>
                <Breadcrumb.Item href="/">Home</Breadcrumb.Item>                
                <Breadcrumb.Item href="/admin">Admin</Breadcrumb.Item>                
                <Breadcrumb.Item active>Siti</Breadcrumb.Item>
            </Breadcrumb>
            <Jumbotron>
                <h1>Siti</h1>
                <p>In questa sezione puoi visualizzare i tuoi siti.<br />
                Tramite la sezione 'Dettagli' puoi modificare le informazioni relative ai tuoi riferimenti.<br />
                Tramite la sezione 'Pagine' puoi visualizzare, modificare e aggiungere le pagine del relativo sito.</p>
            </Jumbotron>
            
            {user.role === Role.Admin &&
                <Link to={`${path}/add/0`} className="btn btn-sm btn-success mb-2">Crea un nuovo Sito</Link>
            }
            <Row>                    
                <Col sm={2}><h3>Logo</h3></Col>
                <Col sm={10}><h3>Nome del Sito</h3></Col>
            </Row>                
            {appSites && appSites.map(appSite =>
                <Row key={appSite.appSiteId}>
                    <Col sm={2}><Image src={baseImageUrl+appSite.companyLogo} fluid /></Col>
                    <Col sm={6}>
                        <b>{appSite.name}</b><br />
                        {parse(appSite.description)}
                    </Col>
                    <Col sm={4} style={{ whiteSpace: 'nowrap' }}>
                        <Link to={`${path}/edit/${appSite.appSiteId}`} className="btn btn-sm btn-primary mr-1">dettagli</Link>
                        <Link to={`${path}/sitepages/${appSite.appSiteId}`} className="btn btn-sm btn-primary mr-1">pagine</Link>
                        <Button onClick={() => deleteAppSite(appSite.appSiteId)} className="btn btn-sm btn-danger" disabled={appSite.isDeleting}>
                            {appSite.isDeleting 
                                ? <span className="spinner-border spinner-border-sm"></span>
                                : <span>elimina</span>
                            }
                        </Button>
                    </Col>
                </Row>
            )}
            {!appSites && loading &&
                <Row>
                    <Col colSpan="4" className="text-center">
                        <span className="spinner-border spinner-border-lg align-center"></span>
                    </Col>
                </Row>
            }                
        </Container>
    );
}

export { List };