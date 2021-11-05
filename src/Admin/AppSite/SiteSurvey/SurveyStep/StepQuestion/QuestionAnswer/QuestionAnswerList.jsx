import React, { useState, useEffect } from 'react';
import { Container, Card, Navbar, Nav } from 'react-bootstrap';
import { surveyService } from '../../../../../../_services';
import { QuestionAnswerModal } from './QuestionAnswerModal';
import { DeleteConfirmation } from '../../../../../../_components/DeleteConfirmation';
import parse from 'html-react-parser';

//const baseImageUrl = `${process.env.REACT_APP_STORAGE_URL}/`;

function QuestionAnswerList (props){
    //const { path } = match;
    const appSiteId = parseInt(props.appSiteId)
    const siteSurveyId = parseInt(props.siteSurveyId)
    const surveyStepId = parseInt(props.surveyStepId)
    const stepQuestionId = parseInt(props.stepQuestionId)
    const questionAnswerId = parseInt(props.questionAnswerId)
    const [questionAnswers, setQuestionAnswers] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getQuestionAnswers()
    }, [appSiteId,siteSurveyId,surveyStepId,stepQuestionId,questionAnswerId,props.isChanged]);     
    
    function deleteQuestionAnswer(questionAnswer) {
        setLoading(true)
        setQuestionAnswers(questionAnswers.map(x => {
            if (x.appSiteId === questionAnswer.appSiteId && 
                x.siteSurveyId === questionAnswer.siteSurveyId &&
                x.surveyStepId === questionAnswer.surveyStepId &&
                x.stepQuestionId === questionAnswer.stepQuestionId &&
                x.questionAnswerId === questionAnswer.questionAnswerId) { x.isDeleting = true; }
            return x;
        }));
        surveyService.deleteQuestionAnswer(questionAnswer.appSiteId, questionAnswer.siteSurveyId, questionAnswer.surveyStepId, questionAnswer.stepQuestionId, questionAnswer.questionAnswerId)
            .then(() => {            
                getQuestionAnswers()
            });                
    }

    function getQuestionAnswers() {
        setLoading(true)
        surveyService.getAnswersOfQuestion(appSiteId,siteSurveyId,surveyStepId,stepQuestionId)
            .then((x) => { 
                setLoading(false)
                setQuestionAnswers(x.result)
            });
    }
    
    return (
        <Container fluid>            
            <div className="md:flex mt-2">
            {questionAnswers && questionAnswers.map(questionAnswer =>                                    
                <div className="block m-1" key={questionAnswer.questionAnswerId}>
                    <Card>
                        <Card.Header className="bg-blue-300 pl-2 pb-0">
                            <Card.Title className="md:flex">              
                                <div className="flex">
                                    # {questionAnswer.position}
                                </div>                       
                                <div className="flex-grow">
                                    <label className="text-sm">
                                        {questionAnswer.answerText && parse(questionAnswer.answerText)}
                                    </label>
                                </div>                                
                            </Card.Title>                                                        
                        </Card.Header>                        
                        <Card.Body style={{backgroundColor: questionAnswer.boxColor}}>                                                                       
                            <Card.Text>                                
                                <small>{questionAnswer.answerNote && parse(questionAnswer.answerNote)}</small>
                            </Card.Text>                                                                                
                        </Card.Body>
                        <Card.Footer className="flex">
                            <div className="flex">
                                <QuestionAnswerModal appSiteId={appSiteId} siteSurveyId={siteSurveyId} surveyStepId={questionAnswer.surveyStepId} stepQuestionId={questionAnswer.stepQuestionId} questionAnswerId={questionAnswer.questionAnswerId} handleAddEdit={(appSiteId) => getQuestionAnswers()} />                                    
                            </div>
                            <div className="flex">
                                <DeleteConfirmation onConfirm={() => deleteQuestionAnswer(questionAnswer)} />
                            </div>
                        </Card.Footer>
                    </Card>                                            
                </div>                    
            )}                                                
            </div>                
            <Navbar variant="dark" bg="dark">
                <Nav className="mr-right">
                    <QuestionAnswerModal appSiteId={appSiteId} siteSurveyId={siteSurveyId} surveyStepId={surveyStepId} stepQuestionId={stepQuestionId} questionAnswerId={0} handleAddEdit={(appSiteId) => getQuestionAnswers()} />
                </Nav>
            </Navbar>
        </Container>
    );

}

export { QuestionAnswerList };