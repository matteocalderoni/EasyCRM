import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Card, Button, ProgressBar, Row, Col, Accordion, Navbar, Nav } from 'react-bootstrap';
import { appSiteService } from '../../../../_services';
import { PageBoxModal } from './PageBoxModal';
import { EmployeeList } from './Employee/EmployeeList';
import { TopServiceList } from './TopService/TopServiceList';
import { SlideshowList } from './Slideshow/SlideshowList';
import { OpenTimeList } from './OpenTime/OpenTimeList';
import { ProductList } from './Product';
import { ArticleList } from './Article';
import { BoxTextEditor, SimpleMap } from '../../../../_components';
import parse from 'html-react-parser';
import { BsPencil,BsFillEyeFill} from 'react-icons/bs';
import { FcHome } from 'react-icons/fc';
import { FaLanguage, FaRoad } from 'react-icons/fa';
import { BoxTypes } from '../../../../_helpers'
import { DeleteConfirmation,FacebookFeed,InstagramFeed,YoutubeVideo } from '../../../../_components';
import { SiteSurveyBox } from '../../SiteSurvey/SiteSurveyBox/SiteSurveyBox';


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
                <li className="breadcrumb-item"><Link to={`/admin/sites/edit/${appSiteId}`}>Sito <b>{appSite && appSite.name}</b></Link></li>                
                <li className="breadcrumb-item">
                    <Link to={'/admin/sites/sitepages/'+ appSiteId}>Pagine del Sito {appSite && <b>{appSite.name}</b>}</Link>                    
                </li>                
                <li className="breadcrumb-item"><Link to={`/admin/sites/sitepages/edit/${appSiteId}/${pageId}`}>Pagina <b>{sitePage && sitePage.title && parse(sitePage.titleUrl)}</b></Link></li>                
                <li className="breadcrumb-item active">
                    Contenitori della Pagina <b>{sitePage && sitePage.title && parse(sitePage.titleUrl)}</b>
                </li>
            </ul>
            <div className="shadow rounded-top mt-2 bg-gray-100 p-8">
                <small>Gestione <b>Contenuti della pagina</b></small>   
                {sitePage && <h1 className="text-xl">{sitePage.title && parse(sitePage.titleUrl)}</h1>}
                <p className="text-muted text-sm">
                    Tramite questa sezione è possibile gestire i contenitori della pagina. Si possono creare, modificare o eliminare diverse tipologie di contenitori.<br />
                    Sotto viene visualizzata un anteprima dei contenitori aggiunti (anche quelli non pubblici).<br />                    
                    Utilizzare immagini ottimizzate per un caricamento rapido.
                </p>
            </div>
            
            {sitePage && 
            <div style={{backgroundImage: `url(${baseImageUrl+sitePage.imageUrl})`}} className="fixed-background page-boxes rounded-bottom mb-4">
                {(!pageBoxes || loading) &&               
                    <div className="text-center mt-1">
                        <ProgressBar animated now={100} />
                    </div>
                }
                <Row>
                {pageBoxes && pageBoxes.map(pageBox =>                                    
                <Col sm={parseInt(pageBox.cardSize)} className="page-box"  key={pageBox.pageBoxId}>
                    <Accordion defaultActiveKey="0">
                        <Card style={{backgroundColor: pageBox.boxColor}}>
                            <Card.Header>                            
                                <div className="flex flex-row">
                                    <div className="flex-grow">
                                        {BoxTypes && BoxTypes[pageBox.boxType - 1].label}
                                        <Card.Title className="flex">
                                            {pageBox.sortId}° <span className="ml-2">{pageBox.title && parse(pageBox.title)}</span>
                                        </Card.Title>     
                                    </div>
                                    <div className="flex-none">
                                        {pageBox.landingPageId > 0 &&
                                        <div className="bg-white p-2 rounded-full mr-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" title="Pagina collegata">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </div>}
                                    </div>
                                    <div className="flex-none align-middle mt-1">                                    
                                        <PageBoxModal appSiteId={pageBox.appSiteId} sitePageId={pageBox.sitePageId} pageBoxId={pageBox.pageBoxId} sortId={pageBox.sortId} handleAddEdit={(appSiteId, sitePageId) => handleAddEdit(appSiteId, sitePageId)} />                                
                                        <Accordion.Toggle title="Anteprima" className="bg-yellow-500 rounded-full ml-1" as={Button} eventKey={pageBox.pageBoxId}>
                                            <BsFillEyeFill />
                                        </Accordion.Toggle>
                                        <DeleteConfirmation onConfirm={() => deleteBox(pageBox)} />
                                    </div>
                                </div>                        
                            </Card.Header>
                            <Accordion.Collapse eventKey={pageBox.pageBoxId}>
                                <Card.Body>
                                {pageBox.boxType && (parseInt(pageBox.boxType) === 8 || parseInt(pageBox.boxType) === 9) &&
                                    <Card.Img variant="top" src={baseImageUrl+pageBox.imageUrl} />
                                }                                                
                                {pageBox.boxType && (parseInt(pageBox.boxType) === 1 || parseInt(pageBox.boxType) === 9) &&                                                                        
                                    <BoxTextEditor prefix={pageBox.appSiteId} pageBox={pageBox} handleSaved={handleAddEdit}></BoxTextEditor>
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
                                {pageBox.boxType && parseInt(pageBox.boxType) === 14 &&
                                    <SiteSurveyBox appSiteId={pageBox.appSiteId} siteSurveyId={pageBox.siteSurveyId} />
                                }   
                                {pageBox.boxType && parseInt(pageBox.boxType) === 15 &&
                                    <SlideshowList appSiteId={pageBox.appSiteId} sitePageId={pageBox.sitePageId} pageBoxId={pageBox.pageBoxId} />                                                
                                }    
                                </Card.Body>                     
                            </Accordion.Collapse>
                        </Card>                                            
                    </Accordion> 
                </Col>
                )}                              
                </Row>
            </div>}

            <Navbar fixed="bottom" className="flex bg-blue-800">
                <Nav className="mr-auto">
                    <Link className="flex items-center justify-center rounded-full  bg-blue-400 text-white p-2 ml-5" to={`/admin/sites/sitepages/edit/${appSiteId}/${pageId}`} title="Modifica la pagina">
                        <BsPencil className="mr-2" /> Modifica Pagina
                    </Link>
                    <Link className="flex items-center justify-center rounded-full  bg-blue-400 text-white p-2 ml-2" to={`/admin/sites/sitelanguages/${appSiteId}`} title="Gestione lingue del sito">
                        <FaLanguage className="mr-2" /> Lingue
                    </Link>
                    <Link className="flex items-center justify-center rounded-full  bg-blue-400 text-white p-2 ml-2" to={`/admin/sites/sitesurveys/${appSiteId}`} title="Gestione percorsi del sito">
                        <FaRoad className="mr-2" /> percorsi
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