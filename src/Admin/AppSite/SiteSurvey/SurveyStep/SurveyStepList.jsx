import React, { useState, useEffect } from 'react';
import { Container, Card, Navbar, Nav, ProgressBar } from 'react-bootstrap';
import { surveyService } from '../../../../_services';
import { SurveyStepModal } from './SurveyStepModal';
import { DeleteConfirmation } from '../../../../_components/DeleteConfirmation';
import parse from 'html-react-parser';
import { StepQuestionList } from './StepQuestion/StepQuestionList';
import { StepQuestionModal } from './StepQuestion/StepQuestionModal';

//const baseImageUrl = `${process.env.REACT_APP_STORAGE_URL}/`;

function SurveyStepList (props){
    //const { path } = match;
    const appSiteId = parseInt(props.appSiteId)
    const siteSurveyId = parseInt(props.siteSurveyId)
    const surveyStepId = parseInt(props.surveyStepId)
    const [surveySteps, setSurveySteps] = useState(null)
    const [loading, setLoading] = useState(false)

    const [isChanged, setIsChanged] = useState(0)

    useEffect(() => {
        getSurveySteps()
    }, [appSiteId,siteSurveyId,surveyStepId,props.isChanged]);     
    
    function deleteSurveyStep(surveyStep) {
        setLoading(true)
        setSurveySteps(surveySteps.map(x => {
            if (x.appSiteId === surveyStep.appSiteId && 
                x.siteSurveyId === surveyStep.siteSurveyId &&
                x.surveyStepId === surveyStep.surveyStepId) { x.isDeleting = true; }
            return x;
        }));
        surveyService.deleteSurveyStep(surveyStep.appSiteId, surveyStep.siteSurveyId, surveyStep.surveyStepId)
            .then(() => {            
                getSurveySteps()
            });                
    }

    function getSurveySteps() {
        setLoading(true)
        surveyService.getStepsOfSurvey(appSiteId,siteSurveyId)
            .then((x) => { 
                setLoading(false)
                setSurveySteps(x.result)
            });
    }
    
    return (
        <Container fluid>            
            <div>
            {loading && 
            <div className="text-center rounded bg-blue-400 text-white mt-2 p-2">
                <h5 className="text-white text-bold-xl">Caricamento in corso... Attendere prego...</h5>
                <ProgressBar animated now={100} />
            </div>                
            }
            {surveySteps && surveySteps.map(surveyStep =>                                    
                <div className="mt-1" key={surveyStep.surveyStepId}>
                    <Card>
                        <Card.Header className="bg-blue-500">
                            <Card.Title className="md:flex">                                         
                                <div className="bg-white rounded-full p-2 h-10 w-10 text-center">
                                    {surveyStep.position} 
                                </div>
                                <div className="flex-grow ml-2">
                                    <label className="text-sm mt-2">
                                        {surveyStep.description && parse(surveyStep.description)}
                                    </label>
                                </div>
                                <div className="flex">
                                    <SurveyStepModal appSiteId={appSiteId} siteSurveyId={siteSurveyId} surveyStepId={surveyStep.surveyStepId} handleAddEdit={(appSiteId) => getSurveySteps()} />
                                    {/* <Link title="Modifica lo step" to={`/admin/surveys/surveysteps/edit/${surveyStep.appSiteId}/${surveyStep.siteSurveyId}/${surveyStep.surveyStepId}`} className="flex items-center justify-center rounded-md bg-blue-200 mt-2 p-1 text-blue-900">
                                        <BsPencil /> 
                                    </Link> */}
                                </div>
                                <div className="flex">
                                    <StepQuestionModal appSiteId={appSiteId} siteSurveyId={siteSurveyId} surveyStepId={surveyStep.surveyStepId} stepQuestionId={0} handleAddEdit={(appSiteId) => getSurveySteps()} />
                                </div>
                                <div className="flex">
                                    <DeleteConfirmation onConfirm={() => deleteSurveyStep(surveyStep)} />
                                </div>
                            </Card.Title>                                                        
                        </Card.Header>                        
                        <Card.Body style={{backgroundColor: surveyStep.boxColor}}>                                                                                                                               
                            <StepQuestionList appSiteId={surveyStep.appSiteId} siteSurveyId={surveyStep.siteSurveyId} surveyStepId={surveyStep.surveyStepId} isChanged={isChanged}></StepQuestionList>                            
                        </Card.Body>
                    </Card>                                            
                </div>                    
            )}                                                
            </div>                
            <Navbar fixed="bottom" variant="dark" bg="dark">
                <Nav className="mr-right">
                    <SurveyStepModal appSiteId={appSiteId} siteSurveyId={siteSurveyId} surveyStepId={0} handleAddEdit={(appSiteId) => getSurveySteps()} />
                </Nav>
            </Navbar>
        </Container>
    );

}

export { SurveyStepList };