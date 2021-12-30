import React, { useEffect, useState } from 'react';
import { surveyService } from '../../../../_services';
import parse from 'html-react-parser';
import { Form } from 'react-bootstrap';

function SiteSurveyBoxQuestion ({appSiteId, siteSurveyId, surveyStepId, stepQuestionId}) {
    
    const [questionAnswers, setQuestionAnswers] = useState([]);
    const [stepQuestion, setStepQuestion] = useState({});

    useEffect(() => {
        getStepQuenstion()
        getQuestionAnswers()
    },[appSiteId, siteSurveyId, surveyStepId, stepQuestionId])

    const getStepQuenstion = () => {
        surveyService.getStepQuestionById(appSiteId,siteSurveyId,surveyStepId, stepQuestionId)
            .then((x) => { 
                setStepQuestion(x)                
            });
    }
        
    const getQuestionAnswers = () => {        
        surveyService.getAnswersOfQuestion(appSiteId,siteSurveyId,surveyStepId, stepQuestionId)
            .then((x) => { 
                setQuestionAnswers(x.result)                
            });
    }
    
    return (
        <div className="mt-2">
            <ul className="flex space-x-2">
            {questionAnswers && questionAnswers.length > 0 && 
            questionAnswers.map(questionAnswer =>
                <li 
                    key={questionAnswer.questionAnswerId}
                    className={`block px-4 py-2 rounded ` + (questionAnswer.endSurvey ? ' bg-green-500' : '')}
                    style={{backgroundColor: questionAnswer.boxColor}}>
                    <label className="inline-flex items-center">
                        {stepQuestion && stepQuestion.questionStyle !== 2 &&
                        <>
                            {!stepQuestion.multipleChoice && 
                            <input type="radio" className="form-radio" name="questionAnswer" value={questionAnswer.questionAnswerId} />}
                            {stepQuestion.multipleChoice && 
                            <input type="checkbox" className="form-checkbox" name="questionAnswer" value={questionAnswer.questionAnswerId} />}
                        </>
                        }
                        <div className="ml-2">{questionAnswer.answerText && parse(questionAnswer.answerText)}</div>
                    </label>
                    {questionAnswer.price > 0 && <><br /><b>€ {questionAnswer.price}</b></>}
                    {questionAnswer.withComment && 
                    <Form.Group>
                        <Form.Label>Risposta</Form.Label>
                        <input type="text" className="form-control focus:ring-2 focus:ring-blue-600" />                        
                    </Form.Group>}
                </li>)
            }
            </ul>
        </div>
    )
}

export { SiteSurveyBoxQuestion };