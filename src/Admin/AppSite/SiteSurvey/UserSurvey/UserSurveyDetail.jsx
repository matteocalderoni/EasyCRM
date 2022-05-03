import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, Tab, Container,ProgressBar } from 'react-bootstrap'
import { appSiteService, surveyService } from '../../../../_services';
import { UserSurveyBox } from '../../../../_components/Survey/UserSurveyBox'

function UserSurveyDetail({ match }) {
    const { appSiteId, siteSurveyId, userSurveyId } = match.params;  
    const [appSite, setAppSite] = useState(null)
    const [userSurvey, setUserSurvey] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        appSiteService.getAppSiteById(appSiteId).then((x) => { 
            setLoading(false)
            setAppSite(x)
        });
    }, [appSiteId]);  
    
    useEffect(() => {
        if (userSurveyId > 0) {
            setLoading(true)
            surveyService.getUserSurveyById(appSiteId, siteSurveyId, userSurveyId)
            .then((x) => { 
                setLoading(false)
                setUserSurvey(x)
            });
        }        
    }, [appSiteId, siteSurveyId, userSurveyId]);  

    return (
        <Container fluid>
            <ul className="breadcrumb">
            <li className="breadcrumb-item"><Link to={`/`}>Home</Link></li>                
                <li className="breadcrumb-item"><Link to={`/admin`}>Admin</Link></li>                
                <li className="breadcrumb-item"><Link to={`/admin/sites`}>Elenco Siti</Link></li>                
                <li className="breadcrumb-item"><Link to={'/admin/sites/sitesurveys/'+ appSiteId}>Percorsi del sito {appSite && <b>{appSite.name}</b>}</Link></li>                               
                <li className="breadcrumb-item"><Link to={`/admin/sites/sitesurveys/usersurveys/${appSiteId}/${siteSurveyId}`}>Elenco percorsi utente</Link></li>                 
                <li className="breadcrumb-item active">
                    Percorso {userSurvey && <b>{userSurvey.userName}</b>}
                </li>
            </ul>
            <div className="shadow rounded-xl mt-2 bg-gray-100 p-4">
                <h1 className="text-blue-900 font-bold">Gestione del sito</h1>                                
                {appSite && <h1>{appSite.name}</h1>}                                
                <p className="text-muted">Visualizzazione dettagli relativi ad percorso</p>                    
            </div>
            {loading && <div className="text-center mart2">
                <ProgressBar animated now={100} />
            </div>}

            <div className="shadow rounded-xl mt-2 bg-gray-100 p-4">                                
                <Tabs id="user-tabs">
                    <Tab eventKey="info" title="Informazioni generali">
                        {userSurveyId > 0 &&
                        <UserSurveyBox 
                            appSiteId={appSiteId} 
                            siteSurveyId={siteSurveyId}
                            userSurveyId={userSurveyId} />}
                    </Tab>
                </Tabs>
            </div>
        </Container>
    );
}

export { UserSurveyDetail }