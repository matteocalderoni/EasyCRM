import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Image, Container,ProgressBar, Row, Col, Navbar, Nav} from 'react-bootstrap';
import { appSiteService, accountService } from '../../_services';
import { Role } from '../../_helpers';
import parse from 'html-react-parser';
import { BsPencil } from 'react-icons/bs';
import { IoDocumentsOutline } from 'react-icons/io5';
import { FcHome } from 'react-icons/fc';
import { IoMdAddCircle } from 'react-icons/io';
import { FaRoad, FaLanguage} from 'react-icons/fa';
import { DeleteConfirmation } from '../../_components/DeleteConfirmation';

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
            <div className="shadow rounded-xl mt-2 bg-gray-100 p-8">
                <h1 className="text-blue-900 font-bold">Gestione Siti</h1>
                <p className="text-muted">In questa sezione puoi consultare i tuoi siti: per ogni sito puoi modificare immagini e testi. Per creare un nuovo sito clicca sul bottone in basso (se non visualizzi il bottone non disponi dei permessi necessari).<br />
                Tramite la sezione 'Dettagli' puoi modificare le informazioni relative ai tuoi riferimenti.<br />
                Tramite la sezione 'Lingue' puoi visualizzare, modificare e aggiungere le lingue del relativo sito.<br />
                Tramite la sezione 'Pagine' puoi visualizzare, modificare e aggiungere le pagine del relativo sito.</p>
            </div>
            
            <div className="shadow rounded-xl mt-4 p-4">
                <Row className="bg-blue-400 rounded-top p-2">                    
                    <Col sm={2} className="text-white text-bold">Logo</Col>
                    <Col sm={8} className="text-white text-bold">Nome del Sito e descrizione</Col>
                    <Col sm={2} className="text-white text-bold text-right">#{appSites.length}</Col>
                </Row>       

            {!appSites && loading &&
                <div className="text-center rounded bg-blue-400 text-white mt-2 p-2">
                    <h5 className="text-white text-bold-xl">Caricamento in corso... Attendere prego...</h5>
                    <ProgressBar animated now={100} />
                </div>                
            }                         
            {appSites && appSites.map(appSite =>
                <Row key={appSite.appSiteId} className="site-list-item bg-blue-50 p-2">
                    <Col sm={2}>
                        <Image src={baseImageUrl+appSite.companyLogo} className="logo rounded border" fluid />
                    </Col>
                    <Col sm={6}>
                        <b>{appSite.name}</b><br />
                        {/* <p className="text-grey">{appSite.description && parse(appSite.description)}</p> */}
                    </Col>
                    <Col sm={4} className="mart2 text-center">
                        <Link to={`${path}/edit/${appSite.appSiteId}`} title="Modifica sito" className="flex items-center justify-center rounded-md bg-blue-200 mt-1 p-1 text-blue-900">
                            <BsPencil /> Modifica informazioni generali
                        </Link>
                        <Link to={`${path}/sitepages/${appSite.appSiteId}`} title="Pagine del sito" className="flex items-center justify-center rounded-md bg-blue-200 mt-1 p-1 text-blue-900">
                            <IoDocumentsOutline /> Gestione pagine
                        </Link>
                        <Link to={`${path}/sitelanguages/${appSite.appSiteId}`} title="Lingue del sito" className="flex items-center justify-center rounded-md bg-blue-200 mt-1 p-1 text-blue-900">
                            <FaLanguage /> Gestione lingue
                        </Link>
                        <Link to={`${path}/sitesurveys/${appSite.appSiteId}`} title="Percorsi del sito" className="flex items-center justify-center rounded-md bg-blue-200 mt-1 p-1 text-blue-900">
                            <FaRoad /> Gestione percorsi
                        </Link>
                        <div className="mt-2 rounded block bg-red-500">
                            <DeleteConfirmation onConfirm={() => deleteAppSite(appSite.appSiteId)} />
                            {/* <Button onClick={() => deleteAppSite(appSite.appSiteId)} title="Elimina sito" className="btn btn-danger" disabled={appSite.isDeleting}>
                                {appSite.isDeleting 
                                    ? <span className="spinner-border spinner-border-sm"></span>
                                    : <span><BsTrash /></span>
                                }
                            </Button> */}
                        </div>
                    </Col>
                </Row>
            )}
            </div>
            {user.role === Role.Admin && 
            <Navbar fixed="bottom" className="flex bg-blue-800">
                <Nav className="flex space-x-3 text-sm font-medium mr-auto">
                    <Link to={`${path}/add/0`} className="flex items-center justify-center rounded-md bg-green-200 p-1 text-green-900">
                        <IoMdAddCircle /> Crea un nuovo Sito
                    </Link>
                </Nav>              
            </Navbar>}
        </Container>
    );
}

export { List };