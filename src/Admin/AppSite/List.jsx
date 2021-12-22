import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Image, Container,ProgressBar, Row, Col, Navbar, Nav} from 'react-bootstrap';
import { appSiteService, accountService } from '../../_services';
import { Role } from '../../_helpers';
import { BsPencil } from 'react-icons/bs';
import { IoDocumentsOutline } from 'react-icons/io5';
import { FcHome } from 'react-icons/fc';
import { FaUser, FaRoad, FaLanguage} from 'react-icons/fa';
import { DeleteConfirmation } from '../../_components/DeleteConfirmation';
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
            <div className="shadow rounded-xl mt-2 bg-gray-100 p-2">
                <h1 className="text-xl text-blue-900 font-bold">Gestione Siti</h1>                
            </div>
            
            <div className="shadow rounded-xl mt-2 p-2">
                <Row className="bg-blue-400 rounded-top p-2">                    
                    <Col sm={2} className="text-white text-bold">Logo</Col>
                    <Col sm={8} className="text-white text-bold">Nome del Sito</Col>
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
                        <div className='h-32 overflow-hidden'>
                            <p className="text-grey">{appSite.description && parse(appSite.description)}</p>
                        </div>
                    </Col>
                    <Col sm={4}>
                        <Link to={`${path}/edit/${appSite.appSiteId}`} title="Modifica sito" className="flex items-center justify-left rounded-full bg-blue-200 mt-1 p-1 text-blue-900">
                            <BsPencil className='bg-white rounded-full ml-2 mr-2 text-xl' /> Informazioni generali
                        </Link>
                        <Link to={`${path}/sitepages/${appSite.appSiteId}`} title="Pagine del sito" className="flex items-center justify-left rounded-full bg-blue-200 mt-1 p-1 text-blue-900">
                            <IoDocumentsOutline className='bg-white rounded-full ml-2 mr-2 text-xl' /> Gestione pagine
                        </Link>
                        <Link to={`${path}/sitelanguages/${appSite.appSiteId}`} title="Lingue del sito" className="flex items-center justify-left rounded-full bg-blue-200 mt-1 p-1 text-blue-900">
                            <FaLanguage className='bg-white rounded-full ml-2 mr-2 text-xl' /> Gestione lingue
                        </Link>
                        <Link to={`${path}/sitesurveys/${appSite.appSiteId}`} title="Percorsi del sito" className="flex items-center justify-left rounded-full bg-blue-200 mt-1 p-1 text-blue-900">
                            <FaRoad className='bg-white rounded-full ml-2 mr-2 text-xl' /> Gestione percorsi
                        </Link>
                        <Link to={`${path}/users/${appSite.appSiteId}`} title="Utenti del sito" className="flex items-center justify-left rounded-full bg-blue-200 mt-1 p-1 text-blue-900">
                            <FaUser className='bg-white rounded-full ml-2 mr-2 text-xl' /> Gestione Utenti
                        </Link>
                        <div className="mt-3 pr-2 rounded-full block bg-red-500 text-white">
                            <DeleteConfirmation onConfirm={() => deleteAppSite(appSite.appSiteId)} /> Elimina
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
            
            <div className='border rounded mt-5 p-2'>
                <p className="text-muted">In questa sezione puoi consultare i tuoi siti: per ogni sito puoi modificare immagini e testi. Per creare un nuovo sito clicca sul bottone in basso (se non visualizzi il bottone non disponi dei permessi necessari).<br />
                Tramite la sezione <b>Dettagli</b> puoi modificare le informazioni relative ai tuoi riferimenti. 
                Tramite la sezione <b>Lingue</b> puoi visualizzare, modificare e aggiungere le lingue del relativo sito. 
                Tramite la sezione <b>Pagine</b> puoi visualizzare, modificare e aggiungere le pagine del relativo sito. 
                Tramite la sezione <b>Percorsi</b> puoi visualizzare, modificare e aggiungere i percorsi da inserire nelle pagine.</p>
            </div>
            {user.roles && user.roles.indexOf(Role.Admin) > -1 && 
            <Navbar fixed="bottom" className="flex bg-blue-800">
                <Nav className="flex space-x-2 text-sm font-medium mr-auto">
                    <Link to={`${path}/add/0`} className="flex text-white p-2 items-center justify-center rounded-full bg-green-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" strokeLinejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Crea Sito
                    </Link>
                </Nav>              
            </Navbar>}
        </Container>
    );
}

export { List };