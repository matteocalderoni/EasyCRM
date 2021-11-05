import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { OutcomeTypeAddEdit } from './OutcomeTypeAddEdit';
import { Tabs, Tab, Container,ProgressBar } from 'react-bootstrap'
import { appSiteService, surveyService } from '../../../../_services';

function OutcomeTypeDetail({ match }) {
    const { appSiteId, outcomeTypeId } = match.params;  
    const [appSite, setAppSite] = useState(null)
    const [outcomeType, setOutcomeType] = useState(null)
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
        if (outcomeTypeId > 0) {
            setLoading(true)
            surveyService.getOutcomeTypeById(appSiteId, outcomeTypeId).then((x) => { 
                setLoading(false)
                setOutcomeType(x)
            });
        }
        
    }, [appSiteId, outcomeTypeId]);  

    return (
        <Container fluid>
            <ul className="breadcrumb">
            <li className="breadcrumb-item"><Link to={`/`}>Home</Link></li>                
                <li className="breadcrumb-item"><Link to={`/admin`}>Admin</Link></li>                
                <li className="breadcrumb-item"><Link to={`/admin/sites`}>Elenco Siti</Link></li>                
                <li className="breadcrumb-item"><Link to={'/admin/sites/sitesurveys/'+ appSiteId}>Percorsi del sito {appSite && <b>{appSite.name}</b>}</Link></li>                               
                <li className="breadcrumb-item"><Link to={`/admin/sites/sitesurveys/outcometypes/${appSiteId}`}>Elenco esiti</Link></li>                 
                <li className="breadcrumb-item active">
                    Esito {outcomeType && <b>{outcomeType.description}</b>}
                </li>
            </ul>
            <div className="shadow rounded-xl mt-2 bg-gray-100 p-8">
                <h1 className="text-blue-900 font-bold">Gestione del sito</h1>                                
                {appSite && <h1>{appSite.name}</h1>}                                
                <p className="text-muted">Modifica dettagli relativi a esito</p>                    
            </div>
            {loading && <div className="text-center mart2">
                <ProgressBar animated now={100} />
            </div>}

            <div className="shadow rounded-xl mt-2 bg-gray-100 p-8">                                
                <Tabs id="user-tabs">
                    <Tab eventKey="info" title="Informazioni generali">
                        {!loading && <OutcomeTypeAddEdit appSiteId={appSiteId} outcomeTypeId={outcomeTypeId} />}
                    </Tab>
                </Tabs>
            </div>
        </Container>
    );
}

export { OutcomeTypeDetail }