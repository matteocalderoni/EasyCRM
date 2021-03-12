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
import { BoxTextEditor, SimpleMap } from '../../../../_components';
import parse from 'html-react-parser';
import { BsPencil,BsFillEyeFill} from 'react-icons/bs';
import { FcHome } from 'react-icons/fc';
import { FaLanguage } from 'react-icons/fa';
import { BoxTypes } from '../../../../_helpers'
import { DeleteConfirmation,FacebookFeed,InstagramFeed,YoutubeVideo } from '../../../../_components';


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
                {/* <li className="breadcrumb-item active">
                    Contenitori della Pagina {sitePage && sitePage.title && parse(sitePage.title)}
                </li> */}
            </ul>
            <Jumbotron className="small-jumbotron">
                <small>Gestione <b>Contenuti della pagina</b></small>   
                {sitePage && <h1>{sitePage.title && parse(sitePage.title)}</h1>}
                <p className="text-muted">
                    Tramite questa sezione è possibile gestire i contenitori della pagina. Si possono creare, modificare o eliminare diverse tipologie di contenitori.<br />
                    Sotto viene visualizzata un anteprima dei contenitori aggiunti (anche quelli non pubblici).<br />
                    Cliccare su <BsFillEyeFill /> per visualizzare il contenitore e modificare i testi (valido per contenitori di testo).<br />                    
                    Utilizzare immagini ottimizzate per un caricamento rapido.
                </p>
            </Jumbotron>
            
            {sitePage && 
            <div style={{backgroundImage: `url(${baseImageUrl+sitePage.imageUrl})`}} className="fixed-background page-boxes">
                {(!pageBoxes || loading) &&               
                    <div className="text-center mt-1">
                        <ProgressBar animated now={100} />
                    </div>
                }
                <Accordion className="mart2" defaultActiveKey="0">
                <Row>
                {pageBoxes && pageBoxes.map(pageBox =>                                    
                <Col sm={parseInt(pageBox.cardSize)} className="page-box"  key={pageBox.pageBoxId}>
                    <Card style={{backgroundColor: pageBox.boxColor}}>
                        <Card.Header>
                            <Row>
                                <Col md={8}>
                                    {BoxTypes && BoxTypes[pageBox.boxType - 1].label}<br />
                                    <Card.Title>{pageBox.sortId}° <b>{pageBox.title && parse(pageBox.title)}</b></Card.Title>     
                                </Col>
                                <Col md={4} className="text-right mt-1">
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
                                <BoxTextEditor pageBox={pageBox} handleSaved={handleAddEdit}></BoxTextEditor>
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
                            {/* {pageBox.boxType && parseInt(pageBox.boxType) === 12 &&
                                <InstagramFeed userName={pageBox.boxEmail} className="Feed" classNameLoading="Loading" limit="8" />
                            }    */}
                            {pageBox.boxType && parseInt(pageBox.boxType) === 13 &&
                                <YoutubeVideo videoUrl={pageBox.boxEmail} title={pageBox.title} boxColor={pageBox.boxColor} />
                            }   
                            </Card.Body>                     
                        </Accordion.Collapse>
                    </Card>                                            
                </Col>
                )}                              
                </Row>
                </Accordion> 
            </div>}

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