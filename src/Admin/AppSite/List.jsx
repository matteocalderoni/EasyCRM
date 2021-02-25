import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Jumbotron, Image, Container,ProgressBar, Row, Col, Button, Navbar, Nav} from 'react-bootstrap';
import { appSiteService, accountService } from '../../_services';
import { Role } from '../../_helpers';
import parse from 'html-react-parser';
import { BsPencil,BsTrash } from 'react-icons/bs';
import { IoDocumentsOutline } from 'react-icons/io5';
import { FcHome } from 'react-icons/fc';
import { IoMdAddCircle } from 'react-icons/io';
import { FaLanguage} from 'react-icons/fa';

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
            if (x.totalCount > 0)
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
                <li className="breadcrumb-item"><Link to={`/`}><FcHome /></Link></li>                
                <li className="breadcrumb-item"><Link to={`/admin`}>Dashboard</Link></li>                
                <li className="breadcrumb-item active">Elenco Siti</li>
            </ul>
            <Jumbotron className="small-jumbotron">
                <h1>Gestione Siti</h1>
                <p className="text-muted">In questa sezione puoi visualizzare i tuoi siti.<br />
                Tramite la sezione 'Dettagli' puoi modificare le informazioni relative ai tuoi riferimenti.<br />
                Tramite la sezione 'Lingue' puoi visualizzare, modificare e aggiungere le lingue del relativo sito.<br />
                Tramite la sezione 'Pagine' puoi visualizzare, modificare e aggiungere le pagine del relativo sito.</p>
            </Jumbotron>
            
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
                    <Col sm={2}><Image src={baseImageUrl+appSite.companyLogo} className="logo" fluid /></Col>
                    <Col sm={6}>
                        <b>{appSite.name}</b><br />
                        {appSite.description && parse(appSite.description)}
                    </Col>
                    <Col sm={4} style={{ whiteSpace: 'nowrap' }} className="mart2 text-right">
                        <Link to={`${path}/edit/${appSite.appSiteId}`} title="Modifica sito" className="btn btn-primary mr-1">
                            <BsPencil />
                        </Link>
                        <Link to={`${path}/sitepages/${appSite.appSiteId}`} title="Pagine del sito" className="btn btn-primary mr-1">
                            <IoDocumentsOutline />
                        </Link>
                        <Link to={`${path}/sitelanguages/${appSite.appSiteId}`} title="Lingue del sito" className="btn btn-primary mr-1">
                            <FaLanguage />
                        </Link>
                        <Button onClick={() => deleteAppSite(appSite.appSiteId)} title="Elimina sito" className="btn btn-danger" disabled={appSite.isDeleting}>
                            {appSite.isDeleting 
                                ? <span className="spinner-border spinner-border-sm"></span>
                                : <span><BsTrash /></span>
                            }
                        </Button>
                    </Col>
                </Row>
            )}
            {user.role === Role.Admin && <Navbar fixed="bottom" variant="dark" bg="dark">
                <Nav className="mr-auto">
                    <Link to={`${path}/add/0`} className="btn btn-success">
                        <IoMdAddCircle /> Crea un nuovo Sito
                    </Link>
                </Nav>              
            </Navbar>}
        </Container>
    );
}

export { List };