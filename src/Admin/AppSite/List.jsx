import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Jumbotron, Image, Container,ProgressBar, Row, Col, Button} from 'react-bootstrap';
import { appSiteService, accountService } from '../../_services';
import { Role } from '../../_helpers';
import parse from 'html-react-parser';

const baseImageUrl = `${process.env.REACT_APP_STORAGE_URL}/`;

function List({ match }) {
    const { path } = match;
    const user = accountService.userValue;
    
    const [appSites, setAppSites] = useState([])    
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
            <ul className="breadcrumb">
                <li className="breadcrumb-item"><Link to={`/`}>Home</Link></li>                
                <li className="breadcrumb-item"><Link to={`/admin`}>Dashboard</Link></li>                
                <li className="breadcrumb-item active">Elenco Siti</li>
            </ul>
            <Jumbotron>
                <h1>Gestione Siti</h1>
                <p>In questa sezione puoi visualizzare i tuoi siti.<br />
                Tramite la sezione 'Dettagli' puoi modificare le informazioni relative ai tuoi riferimenti.<br />
                Tramite la sezione 'Lingue' puoi visualizzare, modificare e aggiungere le lingue del relativo sito.<br />
                Tramite la sezione 'Pagine' puoi visualizzare, modificare e aggiungere le pagine del relativo sito.</p>
            </Jumbotron>
            
            {user.role === Role.Admin &&
                <Link to={`${path}/add/0`} className="btn btn-sm btn-success mb-2">Crea un nuovo Sito</Link>
            }
            
            <Row className="site-list-header">                    
                <Col sm={2}>Logo</Col>
                <Col sm={8}>Nome del Sito e descrizione</Col>
                <Col sm={2} className="text-right">#{appSites.length}</Col>
            </Row>       
            {!appSites && loading &&
                <Row>
                    {loading && <Col className="text-center mart2">
                        <ProgressBar animated now={100} />
                    </Col>}
                </Row>
            }                         
            {appSites && appSites.map(appSite =>
                <Row key={appSite.appSiteId} className="site-list-item">
                    <Col sm={2}><Image src={baseImageUrl+appSite.companyLogo} className="logo" fluid roundedCircle /></Col>
                    <Col sm={6}>
                        <b>{appSite.name}</b><br />
                        {parse(appSite.description)}
                    </Col>
                    <Col sm={4} style={{ whiteSpace: 'nowrap' }} className="mart2 text-right">
                        <Link to={`${path}/edit/${appSite.appSiteId}`} className="btn btn-sm btn-primary mr-1">dettagli</Link>
                        <Link to={`${path}/sitepages/${appSite.appSiteId}`} className="btn btn-sm btn-primary mr-1">pagine</Link>
                        <Link to={`${path}/sitelanguages/${appSite.appSiteId}`} className="btn btn-sm btn-primary mr-1">lingue</Link>
                        <Button onClick={() => deleteAppSite(appSite.appSiteId)} className="btn btn-sm btn-danger" disabled={appSite.isDeleting}>
                            {appSite.isDeleting 
                                ? <span className="spinner-border spinner-border-sm"></span>
                                : <span>elimina</span>
                            }
                        </Button>
                    </Col>
                </Row>
            )}
            
        </Container>
    );
}

export { List };