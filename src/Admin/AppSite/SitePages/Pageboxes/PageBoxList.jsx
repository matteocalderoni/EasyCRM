import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Card, Button, ProgressBar,  Navbar, Nav } from 'react-bootstrap';
import { appSiteService, alertService } from '../../../../_services';
import { PageBoxModal } from './PageBoxModal';
import { EmployeeList } from './Employee/EmployeeList';
import { TopServiceList } from './TopService/TopServiceList';
import { SlideshowList } from './Slideshow/SlideshowList';
import { OpenTimeList } from './OpenTime/OpenTimeList';
import { ProductList } from './Product';
import { ArticleList } from './Article';
import { BoxTextEditor, SimpleMap } from '../../../../_components';
import parse from 'html-react-parser';
import { BsPencil} from 'react-icons/bs';
import { FcHome } from 'react-icons/fc';
import { FaCubes, FaLanguage, FaRoad } from 'react-icons/fa';
import { BoxTypes } from '../../../../_helpers'
import { DeleteConfirmation,FacebookFeed,InstagramFeed,YoutubeVideo } from '../../../../_components';
import { SiteSurveyBox } from '../../SiteSurvey/SiteSurveyBox/SiteSurveyBox';
import { BoxTypeInfo } from '../../../../_components/BoxTypeInfo';

import { Responsive, WidthProvider } from 'react-grid-layout';
import { ProductBox } from './Product/ProductBox';
const ResponsiveGridLayout = WidthProvider(Responsive);

const baseImageUrl = `${process.env.REACT_APP_STORAGE_URL}/`;

function PageBoxList({ match }) {
    const appSiteId = parseInt(match.params.appSiteId)
    const pageId = parseInt(match.params.pageId)
    const [appSite, setAppSite] = useState(null)
    const [sitePage, setSitePage] = useState(null)
    const [pageBoxes, setPageBoxes] = useState(null)
    const [loading, setLoading] = useState(false)
    const [loadingLayouts, setLoadingLayouts] = useState(false)

    //const originalLayouts = getFromLS("layouts") || {};

    const [layouts, setLayouts] = useState(null)

    useEffect(() => {
        getBoxes()
    }, [appSiteId, pageId]);  
    
    const getBoxes = () => {
        setLoading(true)
        appSiteService.getBoxesOfPage(appSiteId, pageId).then((x) => {             
            setLoading(false)
            setPageBoxes(x.result || [])
            getLayouts()
        });
    }

    useEffect(() => {
        setLoading(true)
        appSiteService.getAppSiteById(appSiteId).then((x) => { 
            setLoading(false)
            setAppSite(x)            
        });
    }, [appSiteId]);  

    const getLayouts = () => {
        setLoadingLayouts(true)
        appSiteService.getPageLayouts(appSiteId, pageId).then((x) => { 
            setLoadingLayouts(false)            
            setLayouts(x)
        });
    }
    
    useEffect(() => {
        setLoading(true)
        appSiteService.getSitePageById(appSiteId, pageId).then((x) => { 
            setLoading(false)
            setSitePage(x)
        });
    }, [appSiteId, pageId]);   

    const deleteBox = (_pageBox) => {
        setLoading(true)
        appSiteService.deletePageBox(_pageBox.appSiteId, _pageBox.sitePageId, _pageBox.pageBoxId)
            .then(() => {
                setLoading(false)                
                setPageBoxes(pageBoxes.filter((box) => box.pageBoxId !== _pageBox.pageBoxId))
            });
    } 

    function handleAddEdit(_pageBox) {        
        var _pageBoxes = []
        if (pageBoxes && _pageBox)
            _pageBoxes = pageBoxes.filter((box) => box.pageBoxId !== _pageBox.pageBoxId)

        var isUpdate = false;
        if (_pageBoxes.length !== pageBoxes.length)
            isUpdate = true;
            
        _pageBoxes = [..._pageBoxes,_pageBox]
        setPageBoxes(_pageBoxes)

        if (!isUpdate)
            getLayouts()
    }

    const onLayoutChange = (layout, layouts) => {
        //saveToLS("layouts", layouts);
        setLayouts(layouts);
    }

    // function getFromLS(key) {
    //     let ls = {};
    //     if (global.localStorage) {
    //       try {
    //         ls = JSON.parse(global.localStorage.getItem("rgl-8")) || {};
    //       } catch (e) {
    //         /*Ignore*/
    //       }
    //     }
    //     return ls[key];
    // }
      
    // function saveToLS(key, value) {
    //     if (global.localStorage) {
    //       global.localStorage.setItem(
    //         "rgl-8",
    //         JSON.stringify({
    //           [key]: value
    //         })
    //       );
    //     }
    // }

    function savePageLayouts() {
        appSiteService.savePageLayouts(appSiteId, pageId, layouts)
            .then((x) => {
                alertService.success('Aggiornamento riuscito', { keepAfterRouteChange: true });
                setLayouts(x)
            })
    }
    
    return (
        <Container fluid>
            <ul className="breadcrumb">
                <li className="breadcrumb-item"><Link to={`/`}><FcHome /></Link></li>                
                <li className="breadcrumb-item"><Link to={`/admin`}>Dashboard</Link></li>          
                <li className="breadcrumb-item"><Link to={`/admin/sites`}>Elenco Siti</Link></li>                      
                <li className="breadcrumb-item"><Link to={`/admin/sites/edit/${appSiteId}`}>Sito <b>{appSite && appSite.name}</b></Link></li>                
                <li className="breadcrumb-item"><Link to={'/admin/sites/sitepages/'+ appSiteId}>Elenco Pagine</Link></li>
                <li className="breadcrumb-item"><Link to={`/admin/sites/sitepages/edit/${appSiteId}/${pageId}`}>Pagina <b>{sitePage && sitePage.title && parse(sitePage.titleUrl)}</b></Link></li>                
                <li className="breadcrumb-item active">
                    Contenitori della Pagina <b>{sitePage && sitePage.title && parse(sitePage.titleUrl)}</b>
                </li>
            </ul>
            <div className="rounded-t-xl border mt-2 bg-gray-100 p-8 flex">
                <div className='flex-grow'>
                    <small className='font-bold'>Contenuti della pagina</small>   
                    {sitePage && <h1 className="text-xl text-blue-500">{sitePage.title && parse(sitePage.titleUrl)}</h1>}
                    <p className="text-muted text-sm">
                        Tramite questa sezione è possibile gestire i contenitori della pagina. Si possono creare, modificare o eliminare diverse tipologie di contenitori.<br />
                        Sotto viene visualizzata un anteprima dei contenitori aggiunti (anche quelli non pubblici).
                        Puoi <b>trascinare e ridimensionare</b> i contenitori per ottenere il layout che preferisci.                   
                    </p>
                </div>
                <div className='m-2 mt-4 text-center'>
                    <div className='view-xxs font-bold p-2 bg-purple-800 border rounded-lg text-white'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        XXS
                    </div>
                    <div className='view-xs font-bold p-2 bg-orange-800 rounded-lg text-white'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        PHONE
                    </div>
                    <div className='view-sm font-bold p-2 bg-green-800 rounded-lg text-white'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        TABLET
                    </div>
                    <div className='view-md font-bold p-2 bg-pink-800 rounded-lg text-white'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        MD
                    </div>
                    <div className='view-lg font-bold p-2 bg-sky-800 rounded-lg text-white'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>                        
                        PC
                    </div>
                </div>
            </div>
            
            {sitePage &&
            <div style={{backgroundImage: `url(${baseImageUrl+sitePage.imageUrl})`}} className="fixed-background bg-fixed page-boxes rounded-b-xl border mb-4">
                {(!pageBoxes || loading) &&               
                    <div className="text-center mt-1">
                        <ProgressBar animated now={100} />
                    </div>
                }
                {!loadingLayouts && layouts &&
                <ResponsiveGridLayout className="layout"
                    layouts={layouts}
                    autoSize={true}
                    breakpoints={{lg: 1200, sm: 768, xs: 0}}
                    cols={{lg: 12, sm: 6, xs: 4}}
                    onLayoutChange={(layout, layouts) =>
                        onLayoutChange(layout, layouts)
                    }
                    draggableHandle='.drag-btn'
                    >
                {pageBoxes && pageBoxes.map((pageBox,index) =>                                    
                // <div className="page-box rounded-lg border-2 border-gray-400 border-dashed" 
                //     //style={{backgroundColor: pageBox.boxColor}}
                //     key={pageBox.pageBoxId.toString()}
                //     //data-grid={{x: 0, y: (index * 2), w: +pageBox.cardSize, h: 2}}                    
                //     // data-position={index}
                //     // draggable
                //     // onDragStart={onDragStart}
                //     // onDragOver={onDragOver}
                //     // onDrop={onDrop}
                //     // onDragLeave={onDragLeave}
                //     >
                    
                <Card key={pageBox.pageBoxId.toString()} 
                    style={{backgroundImage: `url(${baseImageUrl+((parseInt(pageBox.boxType) !== 8 && parseInt(pageBox.boxType) !== 9) ? pageBox.imageUrl : '')})`, 
                        backgroundColor: (pageBox.sortId < 0 ? pageBox.boxColor : '')}}
                    className="page-box rounded-lg border-2 border-gray-400 border-dashed">
                    <Card.Header 
                        style={{backgroundColor: pageBox.boxColor}}
                        className='absolute w-full hidden box-header z-10 -mt-28 md:-mt-20 h-20 border border-b-0 rounded-t-xl'>                            
                        <div className="flex flex-row">
                            <div className="flex-grow md:flex">
                                <BoxTypeInfo boxType={pageBox.boxType} boxId={pageBox.pageBoxId} />
                                <label className='w-24'>{BoxTypes && BoxTypes[pageBox.boxType - 1].label}</label>
                                {/* <span className="ml-2">{pageBox.title && parse(pageBox.title)}</span>                                         */}
                            </div>
                            <div className="flex-none">
                                {pageBox.landingPageId > 0 &&
                                <div className="p-2 rounded-full mr-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" title="Pagina collegata">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </div>}
                            </div>
                            <div className="flex flex-none align-middle mt-1">                                    
                                <div className='drag-btn p-2 rounded-full bg-violet-400 mr-1'>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                    </svg>
                                </div>
                                <PageBoxModal 
                                    appSiteId={pageBox.appSiteId} 
                                    sitePageId={pageBox.sitePageId} 
                                    pageBoxId={pageBox.pageBoxId} 
                                    sortId={pageBox.sortId} 
                                    title={pageBox.title}
                                    handleAddEdit={(_pageBox) => handleAddEdit(_pageBox)} />                                
                                {/* 
                                <Accordion.Toggle title="Anteprima" className="bg-gray-500 border-0 rounded-full ml-1" as={Button} eventKey={pageBox.pageBoxId}>
                                    <BsFillEyeFill />
                                </Accordion.Toggle> */}
                                <DeleteConfirmation onConfirm={() => deleteBox(pageBox)} />
                            </div>
                        </div>                        
                    </Card.Header>
                    
                    <Card.Body
                        style={{backgroundColor: (pageBox.sortId > 0 ? pageBox.boxColor : '')}} 
                        className={`p-${pageBox.boxPadding} m-${pageBox.boxMargin} ${(pageBox.sortId === 2 ? 'rounded-full' : (pageBox.sortId === 3 ? 'rounded-xl' : 'rounded'))} overflow-hidden`}>
                        {pageBox.boxType && (parseInt(pageBox.boxType) === 8 || parseInt(pageBox.boxType) === 9) &&
                        <div 
                            style={{backgroundColor: (pageBox.sortId > 0 ? pageBox.boxColor : '')}} 
                            className={`${(pageBox.sortId === 2 ? 'rounded-full' : (pageBox.sortId === 3 ? 'rounded-xl' : 'rounded'))}`}>
                            <Card.Img src={baseImageUrl+pageBox.imageUrl} />
                        </div>
                        }                                                
                        {pageBox.boxType && (parseInt(pageBox.boxType) === 1 || parseInt(pageBox.boxType) === 9 || parseInt(pageBox.boxType) === 14) &&
                        <div 
                            style={{backgroundColor: (pageBox.sortId > 0 ? pageBox.boxColor : '')}} 
                            className={`${(pageBox.sortId === 2 ? 'rounded-full' : (pageBox.sortId === 3 ? 'rounded-xl' : 'rounded'))}`}>
                            <BoxTextEditor 
                                prefix={pageBox.appSiteId} 
                                pageBox={pageBox} 
                                handleSaved={(_pageBox) => handleAddEdit(_pageBox)}>                                        
                            </BoxTextEditor>
                        </div>}
                        {pageBox.boxType && parseInt(pageBox.boxType) === 2 &&
                        <TopServiceList appSiteId={pageBox.appSiteId} sitePageId={pageBox.sitePageId} pageBoxId={pageBox.pageBoxId} />}    
                        {pageBox.boxType && parseInt(pageBox.boxType) === 3 &&
                        <EmployeeList appSiteId={pageBox.appSiteId} sitePageId={pageBox.sitePageId} pageBoxId={pageBox.pageBoxId} />}    
                        {pageBox.boxType && parseInt(pageBox.boxType) === 4 &&
                        <OpenTimeList appSiteId={pageBox.appSiteId} sitePageId={pageBox.sitePageId} pageBoxId={pageBox.pageBoxId} />}                        
                        {pageBox.boxType && parseInt(pageBox.boxType) === 5 &&
                        <ProductList appSiteId={pageBox.appSiteId} sitePageId={pageBox.sitePageId} pageBoxId={pageBox.pageBoxId} />} 
                        {pageBox.boxType && parseInt(pageBox.boxType) === 6 &&
                        <ArticleList appSiteId={pageBox.appSiteId} sitePageId={pageBox.sitePageId} pageBoxId={pageBox.pageBoxId} />}    
                        {pageBox.boxType && parseInt(pageBox.boxType) === 7 &&
                        <SimpleMap appSiteId={pageBox.appSiteId} />}   
                        {pageBox.boxType && parseInt(pageBox.boxType) === 11 &&
                        <FacebookFeed feedUrl={pageBox.boxEmail} title={pageBox.title} boxColor={pageBox.boxColor} />}   
                        {/* {pageBox.boxType && parseInt(pageBox.boxType) === 12 &&
                            <InstagramFeed userName={pageBox.boxEmail} className="Feed" classNameLoading="Loading" limit="8" />
                        }    */}
                        {pageBox.boxType && parseInt(pageBox.boxType) === 13 &&
                        <YoutubeVideo videoUrl={pageBox.boxEmail} title={pageBox.title} boxColor={pageBox.boxColor} />}   
                        {pageBox.boxType && parseInt(pageBox.boxType) === 14 &&
                        <SiteSurveyBox appSiteId={pageBox.appSiteId} siteSurveyId={pageBox.siteSurveyId} />}   
                        {pageBox.boxType && parseInt(pageBox.boxType) === 15 &&
                        <SlideshowList appSiteId={pageBox.appSiteId} sitePageId={pageBox.sitePageId} pageBoxId={pageBox.pageBoxId} />}    
                        {pageBox.boxType && parseInt(pageBox.boxType) === 16 &&
                        <iframe className='w-full' height={pageBox.boxLatitude} title={pageBox.titleUrl} src={pageBox.boxEmail}></iframe>}
                        {pageBox.boxType && parseInt(pageBox.boxType) === 17 &&
                        <ProductBox appSiteId={pageBox.appSiteId} siteProductId={pageBox.siteProductId} />}
                        
                    </Card.Body>                     
                    
                </Card>                                            
                                    
                )}                              
                </ResponsiveGridLayout>}
            </div>}

            <Navbar fixed="bottom" className="flex bg-blue-800">
                <Nav className="mr-auto">
                    <Link className="flex items-center justify-center rounded-full  bg-blue-400 text-white p-2 ml-1" to={`/admin/sites/sitepages/edit/${appSiteId}/${pageId}`} title="Modifica la Pagina">
                        <BsPencil className="mr-2" /> Pagina
                    </Link>
                    <Link className="flex items-center justify-center rounded-full  bg-blue-400 text-white p-2 ml-2" to={`/admin/sites/sitelanguages/${appSiteId}`} title="Gestione Lingue del sito">
                        <FaLanguage className="mr-2" /> Lingue
                    </Link>
                    <Link className="flex items-center justify-center rounded-full  bg-blue-400 text-white p-2 ml-2" to={`/admin/sites/siteproducts/${appSiteId}`} title="Gestione Prodotti del sito">
                        <FaCubes className="mr-2" /> Prodotti
                    </Link>
                    <Link className="flex items-center justify-center rounded-full  bg-blue-400 text-white p-2 ml-2" to={`/admin/sites/sitesurveys/${appSiteId}`} title="Gestione Percorsi del sito">
                        <FaRoad className="mr-2" /> Percorsi
                    </Link>
                </Nav>
                <Nav className="mr-left">
                    <Button className="bg-green-500 text-white rounded-full mr-1" onClick={() => savePageLayouts()}>
                        Salva Layout                        
                    </Button>
                    <PageBoxModal 
                        appSiteId={appSiteId} 
                        sitePageId={pageId} 
                        pageBoxId={0} 
                        sortId={1} 
                        title={''}
                        handleAddEdit={(_pageBox) => handleAddEdit(_pageBox) } />
                </Nav>
            </Navbar> 
        </Container>
    );

}

export { PageBoxList };