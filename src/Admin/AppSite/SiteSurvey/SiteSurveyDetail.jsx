import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SiteSurveyAddEdit } from './SiteSurveyAddEdit';
import { Tabs, Tab, Container,ProgressBar } from 'react-bootstrap'
import { appSiteService, surveyService } from '../../../_services';
import { SurveyStepList } from './SurveyStep/SurveyStepList';

function SiteSurveyDetail({ match }) {
    const { appSiteId, siteSurveyId } = match.params;  
    const [appSite, setAppSite] = useState(null)
    const [siteSurvey, setSiteSurvey] = useState(null)
    const [loading, setLoading] = useState(false)

    const [isChanged, setIsChanged] = useState(0)

    useEffect(() => {
        setLoading(true)
        appSiteService.getAppSiteById(appSiteId).then((x) => { 
            setLoading(false)
            setAppSite(x)
        });
    }, [appSiteId]);  
    
    useEffect(() => {
        if (siteSurveyId > 0) {
            setLoading(true)
            surveyService.getSiteSurveyById(appSiteId, siteSurveyId).then((x) => { 
                setLoading(false)
                setSiteSurvey(x)
            });
        }
        
    }, [appSiteId, siteSurveyId]);  

    return (
        <Container fluid>
            <ul className="breadcrumb">
            <li className="breadcrumb-item"><Link to={`/`}>Home</Link></li>                
                <li className="breadcrumb-item"><Link to={`/admin`}>Admin</Link></li>                
                <li className="breadcrumb-item"><Link to={`/admin/sites`}>Elenco Siti</Link></li>                
                <li className="breadcrumb-item"><Link to={`/admin/sites/edit/${appSiteId}`}>Sito <b>{appSite && appSite.name}</b></Link></li>                
                <li className="breadcrumb-item"><Link to={`/admin/sites/sitepages/${appSiteId}`}>Pagine del Sito <b>{appSite && appSite.name}</b></Link></li>                
                <li className="breadcrumb-item">
                    <Link to={'/admin/sites/sitesurveys/'+ appSiteId}>Percorsi del sito {appSite && <b>{appSite.name}</b>}</Link>                    
                </li>                
                <li className="breadcrumb-item active">
                    Percorsi {siteSurvey && <b>{siteSurvey.siteSurveyName}</b>}
                </li>
            </ul>
            <div className="shadow rounded-xl mt-2 bg-gray-100 p-8">
                <h1 className="text-blue-900 font-bold">Gestione dei percorsi</h1>                                
                {appSite && <h1>{appSite.name}</h1>}                                
                <p className="text-muted">Modifica dettagli relativi ai percorsi</p>                    
            </div>
            {loading && <div className="text-center mart2">
                <ProgressBar animated now={100} />
            </div>}

            <div className="shadow rounded-xl mt-2 bg-gray-100 p-8">                                
                <Tabs id="user-tabs">
                    <Tab eventKey="info" title="Informazioni generali">
                        <div className="p-2 bg-white border-l border-r border-bottom shadow">
                            {!loading && <SiteSurveyAddEdit appSiteId={appSiteId} siteSurveyId={siteSurveyId} />}
                        </div>
                    </Tab>
                    {siteSurveyId > 0 && <Tab eventKey="pages" title="Step">
                        <div className="p-2 bg-white border-l border-r border-bottom shadow">
                            <SurveyStepList appSiteId={appSiteId} siteSurveyId={siteSurveyId} isChanged={isChanged}></SurveyStepList>
                        </div>
                    </Tab>}
                </Tabs>
            </div>
        </Container>
    );
}

export { SiteSurveyDetail }