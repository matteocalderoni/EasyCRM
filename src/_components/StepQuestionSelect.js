import React,{ useEffect, useState} from 'react'; 
import { surveyService } from '../_services'
import { Form } from 'react-bootstrap'

function StepQuestionSelect ({ appSiteId, siteSurveyId, surveyStepId, stepQuestionId, onChange}) { 
  
    const [stepQuestions, setStepQuestions] = useState([])

    useEffect(() => {
        surveyService.getQuestionsOfStep(appSiteId, siteSurveyId, surveyStepId)
            .then(_questions => {
                if (_questions.totalCount > 0) {
                    setStepQuestions(_questions.result)
                }
            })
    },[appSiteId, siteSurveyId, surveyStepId])

    const handleChange = (evt) => {
        const value = +evt.target.value;        
        // Return value on parent
        onChange(value)
    }    
              
    return ( 
    <Form.Group>
        <Form.Control as="select" value={stepQuestionId} name="stepQuestionId" onChange={handleChange}>
            <option>Seleziona Domanda</option>
            {stepQuestions && stepQuestions.map(stepQuestion =>
                <option key={stepQuestion.stepQuestionId} value={stepQuestion.stepQuestionId}>
                    {stepQuestion.questionText && stepQuestion.questionText.replace(/<[^>]+>/g, '')}
                </option>
            )}   
        </Form.Control>                
    </Form.Group>
    );     
  } 
  
  export { StepQuestionSelect };