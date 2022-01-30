import React, { useState, useEffect } from 'react';
import { Container, Card, Navbar, Nav } from 'react-bootstrap';
import { surveyService } from '../../../../../../_services';
import { QuestionAnswerModal } from './QuestionAnswerModal';
import { DeleteConfirmation } from '../../../../../../_components/DeleteConfirmation';
import parse from 'html-react-parser';

const baseImageUrl = `${process.env.REACT_APP_STORAGE_URL}/`;

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
                x.questionAnswerId === questionAnswer.questionAnswerId) { 
                    x.isDeleting = true; 
                }
            return x;
        }));
        surveyService.deleteQuestionAnswer(questionAnswer.appSiteId, questionAnswer.siteSurveyId, questionAnswer.surveyStepId, questionAnswer.stepQuestionId, questionAnswer.questionAnswerId)
            .then(() => getQuestionAnswers());                
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
            <div className="md:flex flex-wrap">
            {!loading && questionAnswers && questionAnswers.map(questionAnswer =>                                    
                <div className="block m-1" key={questionAnswer.questionAnswerId}>
                    <Card>
                        <Card.Header className="bg-blue-300 pl-2 pb-0">
                            <Card.Title className="md:flex">              
                                <div className="bg-white rounded-full p-2 h-10 w-10 text-center">
                                    {questionAnswer.position}
                                </div>                       
                                <div className="flex-grow ml-2">
                                    <label className="text-sm">
                                        {questionAnswer.answerText && parse(questionAnswer.answerText)}
                                    </label>
                                </div>                                
                            </Card.Title>                                                        
                        </Card.Header>                        
                        <Card.Body style={{backgroundColor: questionAnswer.boxColor}}>                                                                       
                            {questionAnswer.siteProduct &&
                            <div className='border flex rounded-lg overflow-hidden w-full'>
                                {questionAnswer.siteProduct.imageUrl &&
                                <div className="w-20">
                                    <img className="h-20 object-cover" src={baseImageUrl+questionAnswer.siteProduct.imageUrl} alt={questionAnswer.siteProduct.code} />
                                </div>}
                                <div className="flex-grow p-3 leading-tight text-black">
                                    <div className='text-lg leading-tight font-medium'>{questionAnswer.siteProduct.code}</div>
                                    <div className='leading-tight text-sm h-24 w-24'>
                                        {questionAnswer.siteProduct.description && parse(questionAnswer.siteProduct.description)}
                                    </div>
                                </div>                                
                                <div className="p-4">
                                    <div className="uppercase tracking-wide font-medium text-indigo-500">
                                        € {questionAnswer.price}
                                    </div>
                                </div>                                                        
                            </div>}
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