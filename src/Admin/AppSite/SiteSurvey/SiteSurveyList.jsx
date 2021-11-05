import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Card, Row, Col, ProgressBar } from 'react-bootstrap';
import { surveyService, appSiteService } from '../../../_services';
import { SiteSurveyModal } from './SiteSurveyModal';
import { FcHome } from 'react-icons/fc';
import { DeleteConfirmation } from '../../../_components/DeleteConfirmation';

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
        <Container fluid>
            <ul className="breadcrumb">
                <li className="breadcrumb-item"><Link to={`/`}><FcHome /></Link></li>                
                <li className="breadcrumb-item"><Link to={`/admin`}>Dashboard</Link></li>                
                <li className="breadcrumb-item"><Link to={`/admin/sites`}>Elenco Siti</Link></li>                
                <li className="breadcrumb-item"><Link to={`/admin/sites/edit/${appSiteId}`}>Sito <b>{appSite && appSite.name}</b></Link></li>                
                <li className="breadcrumb-item"><Link to={`/admin/sites/sitepages/${appSiteId}`}>Pagine del Sito <b>{appSite && appSite.name}</b></Link></li>                
                <li className="breadcrumb-item active">
                    Percorsi del Sito <b>{appSite && appSite.name}</b>
                </li>
            </ul>
            <div className="shadow rounded-xl mt-2 bg-gray-100 p-8">
                <Row>
                    <Col sm={8}>
                        <h1 className="text-blue-900 font-bold">Gestione <b>Percorsi del Sito</b></h1>
                        {appSite && <h1>{appSite.name}</h1>}                
                        <p className="text-muted">Tramite questa sezione si configurano i percorsi del sito relative al sito.</p>
                    </Col>
                    <Col sm={2} className="flex">
                        <Link to={`/admin/sites/sitesurveys/outcometypes/${appSiteId}`} className="btn btn-primary mr-1">Esiti percorsi</Link>
                    </Col>
                    <Col sm={2} className="flex text-right">
                        <SiteSurveyModal appSiteId={appSiteId} siteSurveyId={0} handleAddEdit={(appSiteId) => handleAddEdit(appSiteId)} />
                    </Col>
                </Row>                
            </div>            
            {loading && <Col className="text-center mart2">
                <ProgressBar animated now={100} />
            </Col>}
            <Row>
            {siteSurveys && siteSurveys.map(siteSurvey =>                                    
                <Col sm={6} md={4} key={siteSurvey.siteSurveyId}>
                    <Card className="mart2 shadow">
                        <Card.Body style={{backgroundColor: siteSurvey.boxColor}}>                                
                            <Card.Title>
                                {siteSurvey.siteSurveyName} 
                            </Card.Title>                           
                            <Link to={`edit/${siteSurvey.appSiteId}/${siteSurvey.siteSurveyId}`} className="btn btn-primary mr-1">dettagli</Link>
                            {/* <Button variant="danger" onClick={() => deleteSiteSurvey(siteSurvey)}>elimina</Button> */}
                            <DeleteConfirmation onConfirm={() => deleteSiteSurvey(siteSurvey)} />
                        </Card.Body>
                    </Card>                                            
                </Col>                    
            )}                                                
            </Row>                
        </Container>
    );

}

export { SiteSurveyList };