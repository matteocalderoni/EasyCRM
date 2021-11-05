import React, { useEffect, useState } from 'react';
import { surveyService } from '../../../../_services';
import { Form } from 'react-bootstrap'
import parse from 'html-react-parser';
import { SiteSurveyBoxQuestion } from './SiteSurveyBoxQuestion';

function SiteSurveyBoxStep ({appSiteId, siteSurveyId, surveyStepId,surveyStep}) {
    
    const [stepQuestions, setStepQuestions] = useState([]);

    useEffect(() => {
        getStepQuestions()
    },[appSiteId, siteSurveyId, surveyStepId])
        
    const getStepQuestions = () => {        
        surveyService.getQuestionsOfStep(appSiteId,siteSurveyId,surveyStepId)
            .then((x) => { 
                setStepQuestions(x.result)                
            });
    }
    
    return (
        <div style={{backgroundColor: surveyStep.boxColor}}>
            <ul>
            {stepQuestions && stepQuestions.length > 0 && 
            stepQuestions.map(stepQuestion =>
                <li 
                    key={stepQuestion.stepQuestionId}
                    className={`block px-4 py-2 rounded-md`}>
                    {stepQuestion.questionText && parse(stepQuestion.questionText)}
                    <SiteSurveyBoxQuestion appSiteId={appSiteId} siteSurveyId={siteSurveyId} surveyStepId={surveyStepId} stepQuestionId={stepQuestion.stepQuestionId} />
                    {stepQuestion.withComment && 
                    <Form.Group>
                        <Form.Label>Commenti dell'utente</Form.Label>
                        <input type="text" className="form-control focus:ring-2 focus:ring-blue-600" />                        
                    </Form.Group>}
                    
                    {stepQuestion.questionNote && 
                    <div className="mt-2">
                        {parse(stepQuestion.questionNote)}
                    </div>}
                </li>)
            }
            </ul>
        </div>
    )
}

export { SiteSurveyBoxStep };