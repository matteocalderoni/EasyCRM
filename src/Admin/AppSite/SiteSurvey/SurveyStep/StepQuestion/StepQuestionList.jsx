import React, { useState, useEffect } from 'react';
import { Container, Card, Navbar, Nav } from 'react-bootstrap';
import { surveyService } from '../../../../../_services';
import { StepQuestionModal } from './StepQuestionModal';
import { DeleteConfirmation } from '../../../../../_components/DeleteConfirmation';
import parse from 'html-react-parser';
import { QuestionAnswerList } from './QuestionAnswer/QuestionAnswerList';
import { QuestionAnswerModal } from './QuestionAnswer/QuestionAnswerModal';

//const baseImageUrl = `${process.env.REACT_APP_STORAGE_URL}/`;

function StepQuestionList (props){
    //const { path } = match;
    const appSiteId = parseInt(props.appSiteId)
    const siteSurveyId = parseInt(props.siteSurveyId)
    const surveyStepId = parseInt(props.surveyStepId)
    const stepQuestionId = parseInt(props.stepQuestionId)
    const [stepQuestions, setStepQuestions] = useState(null)
    const [loading, setLoading] = useState(false)

    const [isChanged, setIsChanged] = useState(0)

    useEffect(() => {
        getStepQuestions()
    }, [appSiteId,siteSurveyId,surveyStepId,stepQuestionId,props.isChanged]);     
    
    function deleteStepQuestion(stepQuestion) {
        setLoading(true)
        setStepQuestions(stepQuestions.map(x => {
            if (x.appSiteId === stepQuestion.appSiteId && 
                x.siteSurveyId === stepQuestion.siteSurveyId &&
                x.surveyStepId === stepQuestion.surveyStepId &&
                x.stepQuestionId === stepQuestion.stepQuestionId ) { x.isDeleting = true; }
            return x;
        }));
        surveyService.deleteStepQuestion(stepQuestion.appSiteId, stepQuestion.siteSurveyId, stepQuestion.surveyStepId, stepQuestion.stepQuestionId)
            .then(() => {            
                getStepQuestions()
            });                
    }

    function getStepQuestions() {
        setLoading(true)
        surveyService.getQuestionsOfStep(appSiteId,siteSurveyId,surveyStepId)
            .then((x) => { 
                setLoading(false)
                setStepQuestions(x.result)
            });
    }
    
    return (
        <Container fluid>            
            <div className="mt-2">
            {stepQuestions && stepQuestions.map(stepQuestion =>                                    
                <div className="block mt-2" key={stepQuestion.stepQuestionId}>
                    <Card>
                        <Card.Header className="bg-blue-400">
                            <Card.Title className="md:flex">                                       
                                <div className="flex mr-2">
                                    # {stepQuestion.position}
                                </div>
                                <div className="flex-grow">
                                    <label className="text-sm">
                                        {stepQuestion.questionText && parse(stepQuestion.questionText)}
                                    </label><br />
                                    {stepQuestion.multipleChoice && <small>scelta multipla</small>}
                                    {!stepQuestion.multipleChoice && <small>scelta singola</small>}-
                                    {stepQuestion.questionStyle === 1 && <small>elenco</small>}
                                    {stepQuestion.questionStyle === 2 && <small>bottoni</small>}
                                </div>
                                <div>
                                    <StepQuestionModal appSiteId={appSiteId} siteSurveyId={siteSurveyId} surveyStepId={stepQuestion.surveyStepId} stepQuestionId={stepQuestion.stepQuestionId} handleAddEdit={(appSiteId) => getStepQuestions()} />                                    
                                </div>
                                <div>
                                    <QuestionAnswerModal appSiteId={appSiteId} siteSurveyId={siteSurveyId} surveyStepId={stepQuestion.surveyStepId} stepQuestionId={stepQuestion.stepQuestionId} questionAnswerId={0} handleAddEdit={(appSiteId) => getStepQuestions()} />
                                </div>
                                <div>
                                    <DeleteConfirmation onConfirm={() => deleteStepQuestion(stepQuestion)} />
                                </div>
                            </Card.Title>                                                        
                        </Card.Header>                        
                        <Card.Body style={{backgroundColor: stepQuestion.boxColor}}>                                                                       
                            <QuestionAnswerList appSiteId={stepQuestion.appSiteId} siteSurveyId={stepQuestion.siteSurveyId} surveyStepId={stepQuestion.surveyStepId} stepQuestionId={stepQuestion.stepQuestionId} isChanged={isChanged}></QuestionAnswerList>                                                    

                            <div className="border shadow rounded m-3 p-2">
                                {stepQuestion.questionNote && parse(stepQuestion.questionNote)}
                            </div>                                                        
                        </Card.Body>
                    </Card>                                            
                </div>                    
            )}                                                
            </div>                
            <Navbar variant="dark" bg="dark">
                <Nav className="mr-right">
                    <StepQuestionModal appSiteId={appSiteId} siteSurveyId={siteSurveyId} surveyStepId={surveyStepId} stepQuestionId={0} handleAddEdit={(appSiteId) => getStepQuestions()} />
                </Nav>
            </Navbar>
        </Container>
    );

}

export { StepQuestionList };