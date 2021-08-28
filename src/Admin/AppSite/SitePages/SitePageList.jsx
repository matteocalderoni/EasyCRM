import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Card, Row, Col, ProgressBar, Navbar, Nav } from 'react-bootstrap';
import { appSiteService } from '../../../_services';
import { SitePageModal } from './SitePageModal';
import { BsPencil} from 'react-icons/bs';
import { FaBoxes} from 'react-icons/fa';
import { DeleteConfirmation } from '../../../_components/DeleteConfirmation';
import parse from 'html-react-parser';

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
            <div className="mt-4">
            {sitePages && sitePages.map(sitePage =>                                    
                <div className="block m-2" key={sitePage.sitePageId}>
                    <Card style={{backgroundImage: `url(${baseImageUrl+sitePage.imageUrl})`}} text="white">
                        <Card.Header className="md:container md:mx-auto text-center bg-blue-500">
                            <Card.Title className="md:flex">
                                <div className="flex-none">
                                    # {sitePage.sortId} 
                                </div>                                
                                <div className="flex-grow">
                                    {sitePage.titleUrl}
                                </div>
                            </Card.Title>                                                        
                        </Card.Header>                        
                        <Card.Body>           
                            <div>
                                {sitePage.title && parse(sitePage.title)}
                            </div>                                       
                            <Card.Text>                                
                                {sitePage.slideText && parse(sitePage.slideText)}
                            </Card.Text>                            
                            <Link title="Modifica la pagina" to={`/admin/sites/sitepages/edit/${sitePage.appSiteId}/${sitePage.sitePageId}`} className="flex items-center justify-center rounded-md bg-blue-200 mt-2 p-1 text-blue-900">
                                <BsPencil /> modifica pagina
                            </Link>
                            <Link title="Gestione contenuti della pagina" to={`/admin/sites/sitepages/pageboxes/${sitePage.appSiteId}/${sitePage.sitePageId}`} className="flex items-center justify-center rounded-md bg-blue-200 mt-1 p-1 text-blue-900">
                                <FaBoxes /> gestione contenuti
                            </Link>
                            {sitePage.sitePageId == 1 && 
                            <div className="rounded border mt-2">
                                <p>La pagina iniziale non può essere eliminata.</p>
                            </div>}
                            {/* {sitePage.sitePageId > 1 &&
                            <Button title="Elimina Pagina" variant="danger" onClick={() => deleteSitePage(sitePage)}>
                                <BsTrash />
                            </Button>} */}
                            {sitePage.sitePageId > 1 &&
                            <div className="mt-2 rounded block bg-red-500">
                                <DeleteConfirmation onConfirm={() => deleteSitePage(sitePage)} />
                            </div>}
                        </Card.Body>
                    </Card>                                            
                </div>                    
            )}                                                
            </div>                
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