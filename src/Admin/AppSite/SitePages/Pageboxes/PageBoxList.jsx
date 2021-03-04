import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Jumbotron, Card, Button, ProgressBar, Row, Col, Accordion, Navbar, Nav } from 'react-bootstrap';
import { appSiteService } from '../../../../_services';
import { PageBoxModal } from './PageBoxModal';
import { EmployeeList } from './EmployeeList';
import { TopServiceList } from './TopServiceList';
import { OpenTimeList } from './OpenTimeList';
import { ProductList } from './Product';
import { ArticleList } from './Article';
import { SimpleMap } from '../../../../_components';
import parse from 'html-react-parser';
import { BsPencil,BsFillEyeFill} from 'react-icons/bs';
import { FcHome } from 'react-icons/fc';
import { FaLanguage } from 'react-icons/fa';
import { BoxTypes } from '../../../../_helpers'
import { DeleteConfirmation,FacebookFeed } from '../../../../_components';


const baseImageUrl = `${process.env.REACT_APP_STORAGE_URL}/`;

function PageBoxList({ match }) {
    const appSiteId = parseInt(match.params.appSiteId)
    const pageId = parseInt(match.params.pageId)
    const [appSite, setAppSite] = useState(null)
    const [sitePage, setSitePage] = useState(null)
    const [pageBoxes, setPageBoxes] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        appSiteService.getBoxesOfPage(appSiteId, pageId).then((x) => { 
            setLoading(false)
            setPageBoxes(x.result || [])
        });
    }, [appSiteId, pageId]);  

    useEffect(() => {
        setLoading(true)
        appSiteService.getAppSiteById(appSiteId).then((x) => { 
            setLoading(false)
            setAppSite(x)
        });
    }, [appSiteId]);  
    
    useEffect(() => {
        setLoading(true)
        appSiteService.getSitePageById(appSiteId, pageId).then((x) => { 
            setLoading(false)
            setSitePage(x)
        });
    }, [appSiteId, pageId]);   

    const deleteBox = (pageBox) => {
        setLoading(true)
        appSiteService.deletePageBox(pageBox.appSiteId, pageBox.sitePageId, pageBox.pageBoxId)
            .then(() => {
                setLoading(false)
                appSiteService.getBoxesOfPage(appSiteId, pageId).then(x => setPageBoxes(x.result));
            });
    } 

    function handleAddEdit(appSiteId, sitePageId) {
        appSiteService.getBoxesOfPage(appSiteId, sitePageId).then(x => setPageBoxes(x.result));
    }
    
    return (
        <Container fluid>
            <ul className="breadcrumb">
                <li className="breadcrumb-item"><Link to={`/`}><FcHome /></Link></li>                
                <li className="breadcrumb-item"><Link to={`/admin`}>Dashboard</Link></li>          
                <li className="breadcrumb-item"><Link to={`/admin/sites`}>Elenco Siti</Link></li>                      
                <li className="breadcrumb-item">
                    <Link to={'/admin/sites/sitepages/'+ appSiteId}>Pagine del Sito {appSite && <b>{appSite.name}</b>}</Link>                    
                </li>                
                <li className="breadcrumb-item active">
                    Contenitori della Pagina {sitePage && <b>{sitePage.title}</b>}
                </li>
            </ul>
            <Jumbotron className="small-jumbotron">
                <small>Gestione <b>Contenuti della pagina</b></small>   
                {sitePage && <h1>{sitePage.title}</h1>}
                <p className="text-muted">
                    Tramite questa sezione si configurano i contenuti della pagina.
                    Utilizzare immagini ottimizzate per un caricamento rapido.
                </p>
            </Jumbotron>
            
            {(!pageBoxes || loading) &&               
                <div className="text-center mt-1">
                    <ProgressBar animated now={100} />
                </div>
            }
            <Accordion className="mart2" defaultActiveKey="0">
            <Row>
            {pageBoxes && pageBoxes.map(pageBox =>                                    
            <Col sm={parseInt(pageBox.cardSize)}  key={pageBox.pageBoxId}>
                <Card style={{backgroundColor: pageBox.boxColor}}>
                    <Card.Header>
                        <Row>
                            <Col sm={4}>
                            {BoxTypes && BoxTypes[pageBox.boxType - 1].label}   
                            </Col>
                            <Col sm={8}>
                                <Card.Title>{pageBox.sortId}° <b>{pageBox.title}</b></Card.Title>       
                            </Col>
                            <Col sm={12} className="text-right mt-1">
                                <PageBoxModal appSiteId={pageBox.appSiteId} sitePageId={pageBox.sitePageId} pageBoxId={pageBox.pageBoxId} sortId={pageBox.sortId} handleAddEdit={(appSiteId, sitePageId) => handleAddEdit(appSiteId, sitePageId)} />                                
                                <Accordion.Toggle title="Anteprima" className="ml-1" variant="primary" as={Button} eventKey={pageBox.pageBoxId}>
                                    <BsFillEyeFill />
                                </Accordion.Toggle>
                                <DeleteConfirmation onConfirm={() => deleteBox(pageBox)} />
                            </Col>
                        </Row>                        
                    </Card.Header>
                    <Accordion.Collapse eventKey={pageBox.pageBoxId}>
                        <Card.Body>
                        {pageBox.boxType && (parseInt(pageBox.boxType) === 8 || parseInt(pageBox.boxType) === 9) &&
                            <Card.Img variant="top" src={baseImageUrl+pageBox.imageUrl} />
                        }                                                
                        {pageBox.boxType && (parseInt(pageBox.boxType) === 1 || parseInt(pageBox.boxType) === 9) &&                                                 
                        <div>{pageBox.description && parse(pageBox.description)}</div>
                        }
                        {pageBox.boxType && parseInt(pageBox.boxType) === 2 &&
                            <TopServiceList appSiteId={pageBox.appSiteId} sitePageId={pageBox.sitePageId} pageBoxId={pageBox.pageBoxId} />                                                
                        }    
                        {pageBox.boxType && parseInt(pageBox.boxType) === 3 &&
                            <EmployeeList appSiteId={pageBox.appSiteId} sitePageId={pageBox.sitePageId} pageBoxId={pageBox.pageBoxId} />                                                
                        }    
                        {pageBox.boxType && parseInt(pageBox.boxType) === 4 &&
                            <OpenTimeList appSiteId={pageBox.appSiteId} sitePageId={pageBox.sitePageId} pageBoxId={pageBox.pageBoxId} />                                                
                        }                        
                        {pageBox.boxType && parseInt(pageBox.boxType) === 5 &&
                            <ProductList appSiteId={pageBox.appSiteId} sitePageId={pageBox.sitePageId} pageBoxId={pageBox.pageBoxId} />                                                
                        } 
                        {pageBox.boxType && parseInt(pageBox.boxType) === 6 &&
                            <ArticleList appSiteId={pageBox.appSiteId} sitePageId={pageBox.sitePageId} pageBoxId={pageBox.pageBoxId} />                                                
                        }    
                        {pageBox.boxType && parseInt(pageBox.boxType) === 7 &&
                            <SimpleMap appSiteId={pageBox.appSiteId} />                                                
                        }   
                        {pageBox.boxType && parseInt(pageBox.boxType) === 11 &&
                            <FacebookFeed feedUrl={pageBox.boxEmail} title={pageBox.title} boxColor={pageBox.boxColor} />
                        }   
                        </Card.Body>                     
                    </Accordion.Collapse>
                </Card>                                            
            </Col>
            )}                              
            </Row>
            </Accordion> 
            <Navbar fixed="bottom" variant="dark" bg="dark">
                <Nav className="mr-auto">
                    <Link className="btn btn-secondary" to={`/admin/sites/sitepages/edit/${appSiteId}/${pageId}`} title="Modifica la pagina">
                        <BsPencil /> Modifica Pagina
                    </Link>
                    <Link className="btn btn-secondary ml-1" to={`/admin/sites/sitelanguages/edit/${appSiteId}`} title="Gestione lingue del sito">
                        <FaLanguage /> Lingue
                    </Link>
                </Nav>
                <Nav className="mr-left">
                    <PageBoxModal appSiteId={appSiteId} sitePageId={pageId} pageBoxId={0} sortId={1} handleAddEdit={(appSiteId, sitePageId) => handleAddEdit(appSiteId, sitePageId) } />
                </Nav>
            </Navbar> 
        </Container>
    );

}

export { PageBoxList };