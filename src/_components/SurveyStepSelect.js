import React,{ useEffect, useState} from 'react'; 
import { surveyService } from '../_services'
import { Form } from 'react-bootstrap'

function SurveyStepSelect ({ appSiteId, siteSurveyId, surveyStepId, onChange}) { 
  
    const [surveySteps, setSurveySteps] = useState([])

    useEffect(() => {
        surveyService.getStepsOfSurvey(appSiteId, siteSurveyId)
            .then(_surveys => {
                if (_surveys.totalCount > 0) 
                    setSurveySteps(_surveys.result)                
            })
    },[appSiteId, siteSurveyId])

    const handleChange = (evt) => {
        const value = +evt.target.value;        
        // Return value on parent
        onChange(value)
    }    
              
    return ( 
    <Form.Group>
        <Form.Control as="select" value={surveyStepId} name="surveyStepId" onChange={handleChange}>
            <option>Seleziona Step</option>
            {surveySteps && surveySteps.map(surveyStep =>
                <option key={surveyStep.surveyStepId} value={surveyStep.surveyStepId}>
                    {surveyStep.description && surveyStep.description.replace(/<[^>]+>/g, '')}
                </option>
            )}   
        </Form.Control>                
    </Form.Group>
    );     
  } 
  
  export { SurveyStepSelect };