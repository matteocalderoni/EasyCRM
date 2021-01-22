import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Jumbotron, Card, Button, Breadcrumb, ProgressBar, Row, Col, Accordion } from 'react-bootstrap';
import { appSiteService } from '../../../../_services';
import { PageBoxModal } from './PageBoxModal';
import { EmployeeList } from './EmployeeList';
import { TopServiceList } from './TopServiceList';
import { OpenTimeList } from './OpenTimeList';
import { ProductList } from './Product';
import { ArticleList } from './Article';
import { SimpleMap } from '../../../../_components';
import parse from 'html-react-parser';
import { BsPencil,BsTrash,BsFillEyeFill} from 'react-icons/bs';
import { FcHome } from 'react-icons/fc';

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

    
    function deletePageBox(pageBox) {
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
                    <Link to={'/admin/sites/sitepages/'+ appSiteId}>Sito {appSite && <b>{appSite.name}</b>}</Link>                    
                </li>                
                <li className="breadcrumb-item active">
                    Pagina {sitePage && <b>{sitePage.title}</b>}
                </li>
            </ul>
            <Jumbotron className="small-jumbotron">
                <Row>
                    <Col sm={6}>
                        <h5>Gestione <b>Contenuti della pagina</b></h5>   
                        {sitePage && <h1>{sitePage.title}</h1>}
                        <p>
                            Tramite questa sezione si configurano i contenuti della pagina.
                            Utilizzare immagini ottimizzate per un caricamento rapido.
                        </p>
                    </Col>
                    <Col sm={6} className="text-right">
                        {sitePage && 
                        <>                 
                            <div>                                
                                <Link className="btn btn-primary" to={`/admin/sites/sitepages/edit/${appSiteId}/${pageId}`}>
                                    <BsPencil /> modifica la pagina
                                </Link>
                            </div>                                                               
                            <div className="mart2">
                                <PageBoxModal appSiteId={appSiteId} sitePageId={pageId} pageBoxId={0} handleAddEdit={(appSiteId, sitePageId) => handleAddEdit(appSiteId, sitePageId) } />
                            </div>
                        </>
                        }
                    </Col>
                </Row>
                
            </Jumbotron>
            
            {(!pageBoxes || loading) &&               
                <div className="text-center mart2">
                    <ProgressBar animated now={100} />
                </div>
            }
            <Accordion defaultActiveKey="0">
            {pageBoxes && pageBoxes.map(pageBox =>                                    
                <Card className="mart2" key={pageBox.pageBoxId}>
                    <Card.Header>
                        <Row>
                            <Col sm={6} className="text-left">
                                <Card.Title>#{pageBox.sortId} <b>{pageBox.title}</b></Card.Title>       
                            </Col>
                            <Col sm={6} className="text-right">
                                <PageBoxModal appSiteId={pageBox.appSiteId} sitePageId={pageBox.sitePageId} pageBoxId={pageBox.pageBoxId} handleAddEdit={(appSiteId, sitePageId) => handleAddEdit(appSiteId, sitePageId)} />
                                <Accordion.Toggle className="btn btn-default" as={Button} variant="link" eventKey={pageBox.pageBoxId}>
                                    <BsFillEyeFill />
                                </Accordion.Toggle>
                                <Button title="Elimina contenitore" variant="danger" onClick={() => deletePageBox(pageBox)}>
                                    <BsTrash />
                                </Button>
                            </Col>
                        </Row>                        
                    </Card.Header>
                    <Accordion.Collapse eventKey={pageBox.pageBoxId}>
                        <Card.Body>
                        {pageBox.boxType && (parseInt(pageBox.boxType) === 8 || parseInt(pageBox.boxType) === 9) &&
                            <Card.Img variant="top" src={baseImageUrl+pageBox.imageUrl} />
                        }                                                
                        {pageBox.boxType && (parseInt(pageBox.boxType) === 1 || parseInt(pageBox.boxType) === 9) &&                                                 
                        <div>{parse(pageBox.description)}</div>
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
                        </Card.Body>                     
                    </Accordion.Collapse>
                </Card>                                            
            )}                              
            </Accordion>  
        </Container>
    );

}

export { PageBoxList };