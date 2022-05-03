import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Card, ProgressBar } from 'react-bootstrap';
import { surveyService, appSiteService } from '../../../_services';
import { SiteSurveyModal } from './SiteSurveyModal';
import { FcHome } from 'react-icons/fc';
import { DeleteConfirmation } from '../../../_components/DeleteConfirmation';
import { FooterNav } from '../../../_components/FooterNav';

function SiteSurveyList ({ match }){
    const appSiteId = parseInt(match.params.appSiteId);
    const [appSite, setAppSite] = useState(null)
    const [siteSurveys, setSiteSurveys] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        surveyService.getSurveysOfAppSite(appSiteId,'',0,0).then((x) => { 
            setLoading(false)
            setSiteSurveys(x.result)}
        );
    }, [appSiteId]);    
    
    useEffect(() => {
        setLoading(true)
        appSiteService.getAppSiteById(appSiteId).then((x) => { 
            setLoading(false)
            setAppSite(x)
        });
    }, [appSiteId]);    
    
    function deleteSiteSurvey(siteSurvey) {
        setLoading(true)
        setSiteSurveys(siteSurveys.map(x => {
            if (x.appSiteId === appSiteId && x.siteSurveyId === siteSurvey.siteSurveyId) { x.isDeleting = true; }
            return x;
        }));
        surveyService.deleteSiteSurvey(appSiteId, siteSurvey.siteSurveyId).then(() => {
            setLoading(false)
            surveyService.getSurveysOfAppSite(appSiteId).then(x => setSiteSurveys(x.result || []));
        });        
    }

    function handleAddEdit(appSiteId) {
        surveyService.getSurveysOfAppSite(appSiteId).then(x => setSiteSurveys(x.result));
    }
    
    return (
        <>
            <Container fluid>
                <ul className="breadcrumb">
                    <li className="breadcrumb-item"><Link to={`/`}><FcHome /></Link></li>                
                    <li className="breadcrumb-item"><Link to={`/admin`}>Dashboard</Link></li>                
                    <li className="breadcrumb-item"><Link to={`/admin/sites`}>Elenco Siti</Link></li>                
                    <li className="breadcrumb-item"><Link to={`/admin/sites/edit/${appSiteId}`}>Sito <b>{appSite && appSite.name}</b></Link></li>                
                    <li className="breadcrumb-item active">
                        Percorsi del Sito <b>{appSite && appSite.name}</b>
                    </li>
                </ul>
                <div className="shadow rounded-xl mt-2 bg-gray-100 p-4">
                <h1 className="text-blue-900 font-bold">Gestione <b>Percorsi del Sito</b></h1>
                {appSite && <h1>{appSite.name}</h1>}                
                <p className="text-muted">Tramite questa sezione si configurano i percorsi del sito relative al sito.</p>
                </div>            
                {loading && 
                <div className="text-center mart2">
                    <ProgressBar animated now={100} />
                </div>}
                <div className="mt-2 flex flex-wrap space-x-2">
                {siteSurveys && siteSurveys.map(siteSurvey =>                                    
                    <div className="mt-2 rounded-xl border w-80 mx-auto overflow-hidden" key={siteSurvey.siteSurveyId}>
                        <Card>
                            <Card.Header className='bg-gray-200'>
                                {siteSurvey.siteSurveyName}                                     
                            </Card.Header>
                            <Card.Body className='flex flex-wrap' style={{backgroundColor: siteSurvey.boxColor}}>                                
                                <Link to={`edit/${siteSurvey.appSiteId}/${siteSurvey.siteSurveyId}`} className="btn btn-primary mr-1 rounded-xl">modifica</Link>
                                <Link to={`/admin/sites/sitesurveys/usersurveys/${siteSurvey.appSiteId}/${siteSurvey.siteSurveyId}`} className="btn btn-primary mr-1 rounded-xl">archivio</Link>
                                {/* <Button variant="danger" onClick={() => deleteSiteSurvey(siteSurvey)}>elimina</Button> */}
                                <DeleteConfirmation onConfirm={() => deleteSiteSurvey(siteSurvey)} />
                            </Card.Body>
                        </Card>                                            
                    </div>                    
                )}                                                
                </div>                
            </Container>

            <div className='relative'>
                <div className="fixed flex items-center bottom-20 md:bottom-16 left-2">
                    <Link to={`/admin/sites/sitesurveys/outcometypes/${appSiteId}`} className="text-white flex items-center px-4 w-auto h-12 bg-cyan-500 rounded-full hover:bg-cyan-700 border-cyan-500 active:shadow-lg mouse shadow transition ease-in duration-200 focus:outline-none">Esiti</Link>
                </div>                
                <SiteSurveyModal appSiteId={appSiteId} siteSurveyId={0} handleAddEdit={(appSiteId) => handleAddEdit(appSiteId)} />
            </div>

            <FooterNav appSiteId={appSiteId} />
        </>
    );
}

export { SiteSurveyList };