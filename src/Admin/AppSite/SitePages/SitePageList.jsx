import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Jumbotron, Card, Button, Row, Col, ProgressBar, Navbar, Nav } from 'react-bootstrap';
import { appSiteService } from '../../../_services';
import { SitePageModal } from './SitePageModal';
import { FcHome } from 'react-icons/fc';
import { BsPencil,BsTrash } from 'react-icons/bs';
import { FaBoxes, FaLanguage } from 'react-icons/fa';

const baseImageUrl = `${process.env.REACT_APP_STORAGE_URL}/`;

function SitePageList (props){
    //const { path } = match;
    const appSiteId = parseInt(props.appSiteId)
    const parentPageId = parseInt(props.parentPageId)
    const [sitePages, setSitePages] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getSitePages()
        // appSiteService.getPagesOfAppSite(appSiteId,0).then((x) => { 
        //     setLoading(false)
        //     setSitePages(x.result)}
        // );
    }, [appSiteId,props.isChanged]);     
    
    function deleteSitePage(sitePage) {
        setLoading(true)
        setSitePages(sitePages.map(x => {
            if (x.appSiteId === appSiteId && x.sitePageId === sitePage.sitePageId) { x.isDeleting = true; }
            return x;
        }));
        appSiteService.deleteSitePage(appSiteId, sitePage.sitePageId).then(() => {
            //setLoading(false)
            //appSiteService.getPagesOfAppSite(appSiteId,0).then(x => setSitePages(x.result));
            getSitePages()
        });                
    }

    function getSitePages() {
        setLoading(true)
        appSiteService.getPagesOfAppSite(appSiteId,parentPageId).then((x) => { 
            setLoading(false)
            setSitePages(x.result)
        });
    }
    
    return (
        <Container fluid>
            {loading && <Col className="text-center mart2">
                <ProgressBar animated now={100} />
            </Col>}
            <Row>
            {sitePages && sitePages.map(sitePage =>                                    
                <Col sm={6} md={4} key={sitePage.sitePageId}>
                    <Card className="mart2 text-center" bg="dark" text="white">
                        <Card.Header>
                            <Card.Title>
                                #{sitePage.sortId} {sitePage.title} 
                            </Card.Title>                                                        
                        </Card.Header>
                        <Card.Img variant="top" src={baseImageUrl+sitePage.imageUrl} />
                        <Card.Body>                                                            
                            <Card.Text>                                
                                {sitePage.description}
                            </Card.Text>                            
                            <Link title="Modifica la pagina" to={`/admin/sites/sitepages/edit/${sitePage.appSiteId}/${sitePage.sitePageId}`} className="btn btn-primary mr-1">
                                <BsPencil />
                            </Link>
                            <Link title="Gestione contenuti della pagina" to={`/admin/sites/sitepages/pageboxes/${sitePage.appSiteId}/${sitePage.sitePageId}`} className="btn btn-primary mr-1">
                                <FaBoxes />
                            </Link>
                            {sitePage.sitePageId > 1 &&
                            <Button title="Elimina Pagina" variant="danger" onClick={() => deleteSitePage(sitePage)}>
                                <BsTrash />
                            </Button>}
                        </Card.Body>
                    </Card>                                            
                </Col>                    
            )}                                                
            </Row>                
            {parentPageId > 0 &&
            <Navbar fixed="bottom" variant="dark" bg="dark">
                <Nav className="mr-right">
                    <SitePageModal appSiteId={appSiteId} sitePageId={0} parentPageId={parentPageId} handleAddEdit={(appSiteId) => getSitePages()} />
                </Nav>
            </Navbar>}
        </Container>
    );

}

export { SitePageList };