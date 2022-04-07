import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Card, Navbar, Nav, Form } from 'react-bootstrap';
import { appSiteService } from '../../../_services';
import { SitePageModal } from './SitePageModal';
import { BsPencil} from 'react-icons/bs';
import { FaBoxes} from 'react-icons/fa';
import { DeleteConfirmation } from '../../../_components/DeleteConfirmation';
import { PageTypeSelect } from '../../../_components/Select/PageTypeSelect';

const baseImageUrl = `${process.env.REACT_APP_STORAGE_URL}/`;

function SitePageList (props)
{
    const appSiteId = parseInt(props.appSiteId)
    const parentPageId = parseInt(props.parentPageId)
    const appSite = props.appSite
    const [searchText, setSearchText] = useState('')
    const [pageType, setPageType] = useState(-1)
    const [sitePages, setSitePages] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getSitePages()
    }, [searchText, pageType, appSiteId, props.isChanged]);     
    
    function deleteSitePage(sitePage) {
        setLoading(true)
        setSitePages(sitePages.map(x => {
            if (x.appSiteId === appSiteId && x.sitePageId === sitePage.sitePageId) 
                x.isDeleting = true; 
            return x;
        }));
        appSiteService.deleteSitePage(appSiteId, sitePage.sitePageId)
            .then(() => getSitePages());                
    }

    function getSitePages() {
        setLoading(true)
        var _parentPageId = parentPageId === 0 ? -1 : parentPageId;
        appSiteService.getPagesOfAppSite(searchText, appSiteId,_parentPageId,pageType)
            .then((x) => { 
                setLoading(false)
                setSitePages(x.result)
            });
    }
    
    return (
        <Container fluid>            
            {parentPageId === 0 && 
            <Form.Group className='rounded-xl space-y-2 border p-1 pt-2 mt-2 md:flex md:space-x-2'>
                <div className='flex-1'>
                    <input type="text" placeholder='Ricerca per titolo' className="form-control" value={searchText} onChange={(e) => setSearchText(e.target.value)}  />
                </div>
                <div className='flex-1'>
                    <PageTypeSelect pageType={pageType} onPageTypeChange={(pageType) => setPageType(+pageType)} label={'Tipo di pagina'} />
                </div>
            </Form.Group>}
            <div className="mt-2">
            {!loading && sitePages && sitePages.map(sitePage =>                                    
                <div className="block mt-1" key={sitePage.sitePageId}>
                    <Card style={{backgroundImage: `url(${baseImageUrl+sitePage.imageUrl})`}} text="white">
                        <Card.Header className="bg-blue-500">
                            <Card.Title className="flex">
                                <div className="flex-none">
                                    <div className='rounded-full bg-blue-800 p-2'># {sitePage.sortId}</div>
                                </div>                                
                                <div className="flex-grow ml-2 p-2">
                                    {sitePage.titleUrl}
                                </div>
                            </Card.Title>                                                        
                        </Card.Header>                        
                        <Card.Body className="mx-full md:flex space-y-2 md:space-x-2">                                       
                            <Link title="Modifica la pagina" to={`/admin/sites/sitepages/edit/${sitePage.appSiteId}/${sitePage.sitePageId}`} className="flex flex-1 items-center justify-center rounded-full bg-blue-200 p-1 text-blue-900">
                                <BsPencil className="mr-2" /> modifica pagina
                            </Link>
                            <Link title="Gestione contenuti della pagina" to={`/admin/sites/sitepages/pageboxes/${sitePage.appSiteId}/${sitePage.sitePageId}`} className="flex flex-1 items-center justify-center rounded-full bg-blue-200 p-1 text-blue-900">
                                <FaBoxes className="mr-2" /> gestione contenuti
                            </Link>
                            {sitePage.sitePageId > 1 &&
                            <div className="mt-2 flex-1 rounded-full block bg-red-500">
                                <DeleteConfirmation onConfirm={() => deleteSitePage(sitePage)} /> Elimina
                            </div>}
                            {sitePage.sitePageId === 1 && 
                            <div className="rounded border mt-2 flex-none">
                                <p className="text-red-400">La pagina iniziale non può essere eliminata.</p>
                            </div>}                            
                        </Card.Body>
                    </Card>                                            
                </div>                    
            )}                                                
            </div>                
            {parentPageId > 0 &&
            <Navbar fixed="bottom" variant="dark" bg="dark">
                <Nav className="mr-right">
                    <SitePageModal appSite={appSite} appSiteId={appSiteId} sitePageId={0} parentPageId={parentPageId} handleAddEdit={(appSiteId) => getSitePages()} />
                </Nav>
            </Navbar>}
        </Container>
    );

}

export { SitePageList };