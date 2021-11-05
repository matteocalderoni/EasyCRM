import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Card, Row, Col, ProgressBar } from 'react-bootstrap';
import { surveyService, appSiteService } from '../../../../_services';
import { OutcomeTypeModal } from './OutcomeTypeModal';
import { FcHome } from 'react-icons/fc';
import { DeleteConfirmation } from '../../../../_components/DeleteConfirmation';

function OutcomeTypeList ({ match }){
    const appSiteId = parseInt(match.params.appSiteId);
    const [appSite, setAppSite] = useState(null)
    const [outcomeTypes, setOutcomeTypes] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        surveyService.getOutcomeTypesOfAppSite(appSiteId,'',0,0).then((x) => { 
            setLoading(false)
            setOutcomeTypes(x.result)}
        );
    }, [appSiteId]);    
    
    useEffect(() => {
        setLoading(true)
        appSiteService.getAppSiteById(appSiteId).then((x) => { 
            setLoading(false)
            setAppSite(x)
        });
    }, [appSiteId]);    
    
    function deleteOutcomeType(outcomeType) {
        setLoading(true)
        setOutcomeTypes(outcomeTypes.map(x => {
            if (x.appSiteId === appSiteId && x.outcomeTypeId === outcomeType.outcomeTypeId) { x.isDeleting = true; }
            return x;
        }));
        surveyService.deleteOutcomeType(appSiteId, outcomeType.outcomeTypeId).then(() => {
            setLoading(false)
            surveyService.getOutcomeTypesOfAppSite(appSiteId).then(x => setOutcomeTypes(x.result || []));
        });        
    }

    function handleAddEdit(appSiteId) {
        surveyService.getOutcomeTypesOfAppSite(appSiteId).then(x => setOutcomeTypes(x.result));
    }
    
    return (
        <Container fluid>
            <ul className="breadcrumb">
                <li className="breadcrumb-item"><Link to={`/`}><FcHome /></Link></li>                
                <li className="breadcrumb-item"><Link to={`/admin`}>Dashboard</Link></li>                
                <li className="breadcrumb-item"><Link to={`/admin/sites`}>Elenco Siti</Link></li>                
                <li className="breadcrumb-item"><Link to={`/admin/sites/edit/${appSiteId}`}>Sito <b>{appSite && appSite.name}</b></Link></li>                
                <li className="breadcrumb-item"><Link to={`/admin/sites/sitepages/${appSiteId}`}>Pagine del Sito <b>{appSite && appSite.name}</b></Link></li>
                <li className="breadcrumb-item"><Link to={`/admin/sites/sitesurveys/${appSiteId}`}>Percorsi del Sito <b>{appSite && appSite.name}</b></Link></li>                                
                <li className="breadcrumb-item active">
                    Esiti del sito {appSite && <b>{appSite.name}</b>}                
                </li>
            </ul>
            <div className="shadow rounded-xl mt-2 bg-gray-100 p-8">
                <Row>
                    <Col sm={8}>
                        <h1 className="text-blue-900 font-bold">Gestione <b>Esiti del Sito</b></h1>
                        {appSite && <h1>{appSite.name}</h1>}                
                        <p className="text-muted">Tramite questa sezione si configurano gli esiti dei percorsi del sito.</p>
                    </Col>
                    <Col sm={4} className="text-right">
                        <OutcomeTypeModal appSiteId={appSiteId} outcomeTypeId={0} handleAddEdit={(appSiteId) => handleAddEdit(appSiteId)} />
                    </Col>
                </Row>                
            </div>            
            {loading && <Col className="text-center mart2">
                <ProgressBar animated now={100} />
            </Col>}
            <Row>
            {outcomeTypes && outcomeTypes.map(outcomeType =>                                    
                <Col sm={6} md={4} key={outcomeType.outcomeTypeId}>
                    <Card className="mart2 text-center">
                        <Card.Body style={{backgroundColor: outcomeType.boxColor}}>                                
                            <Card.Title>
                                {outcomeType.description} 
                            </Card.Title>                           
                            <Link to={`edit/${outcomeType.appSiteId}/${outcomeType.outcomeTypeId}`} className="btn btn-primary mr-1">dettagli</Link>
                            <DeleteConfirmation onConfirm={() => deleteOutcomeType(outcomeType)} />
                        </Card.Body>
                    </Card>                                            
                </Col>                    
            )}                                                
            </Row>                
        </Container>
    );

}

export { OutcomeTypeList };