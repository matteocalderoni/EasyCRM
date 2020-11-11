import React, { useState, useEffect } from 'react';
import { Container, Jumbotron, Card, Button, Breadcrumb } from 'react-bootstrap';
import { appSiteService } from '../../../../_services';
import { PageBoxModal } from './PageBoxModal';
import { EmployeeList } from './EmployeeList';
import { TopServiceList } from './TopServiceList';
import { OpenTimeList } from './OpenTimeList';
import { ProductList } from './Product';
import { ArticleList } from './Article';
import { SimpleMap } from '../../../../_components';
import parse from 'html-react-parser';

const baseImageUrl = `${process.env.REACT_APP_API_URL}/Resources/Images/`;

function PageBoxList({ match }) {
    const appSiteId = parseInt(match.params.appSiteId);
    const pageId = parseInt(match.params.pageId);
    const [pageBoxes, setPageBoxes] = useState(null);

    useEffect(() => {
        appSiteService.getBoxesOfPage(appSiteId, pageId).then(x => setPageBoxes(x.result || []));
    }, [appSiteId, pageId]);  

    
    function deletePageBox(pageBox) {
        appSiteService.deletePageBox(pageBox.appSiteId, pageBox.sitePageId, pageBox.pageBoxId)
            .then(() => {
                appSiteService.getBoxesOfPage(appSiteId, pageId).then(x => setPageBoxes(x.result));
            });
    }

    function handleAddEdit(appSiteId, sitePageId) {
        appSiteService.getBoxesOfPage(appSiteId, sitePageId).then(x => setPageBoxes(x.result));
    }
    
    return (
        <Container>
            <Breadcrumb>
                <Breadcrumb.Item href="/">Home</Breadcrumb.Item>                
                <Breadcrumb.Item href="/admin">Admin</Breadcrumb.Item>          
                <Breadcrumb.Item href="/admin/sites">Siti</Breadcrumb.Item>                      
                <Breadcrumb.Item href={'/admin/sites/sitepages/'+ appSiteId}>
                    Pagine del sito {appSiteId}         
                </Breadcrumb.Item>                
                <Breadcrumb.Item active>Pagina {pageId}</Breadcrumb.Item>
            </Breadcrumb>
            <Jumbotron>
                <h2>Gestione <b>Contenuti della pagina</b></h2>
                <p>
                    Tramite questa sezione si configurano i contenuti della pagina.
                    Utilizzare immagini ottimizzate per un caricamento rapido.
                </p>
            </Jumbotron>
            <PageBoxModal appSiteId={appSiteId} sitePageId={pageId} pageBoxId={0} handleAddEdit={(appSiteId, sitePageId) => handleAddEdit(appSiteId, sitePageId) } />
            
            {pageBoxes && pageBoxes.map(pageBox =>                                    
                <Card className="mart2 text-center" key={pageBox.pageBoxId}>
                    <Card.Body>
                        {pageBox.boxType && (parseInt(pageBox.boxType) === 8 || parseInt(pageBox.boxType) === 9) &&
                            <Card.Img variant="top" src={baseImageUrl+pageBox.imageUrl} />
                        }                        
                        <Card.Title>
                            ({pageBox.sortId}) {pageBox.title} 
                        </Card.Title>       
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
                    <Card.Footer>
                        <PageBoxModal appSiteId={pageBox.appSiteId} sitePageId={pageBox.sitePageId} pageBoxId={pageBox.pageBoxId} handleAddEdit={(appSiteId, sitePageId) => handleAddEdit(appSiteId, sitePageId)} />
                        <Button variant="danger" onClick={() => deletePageBox(pageBox)}>elimina</Button>
                    </Card.Footer>
                </Card>                                            
            )}                    
            {!pageBoxes &&                
                <div className="text-center">
                    <span className="spinner-border spinner-border-lg align-center"></span>
                </div>
            }                
        </Container>
    );

}

export { PageBoxList };