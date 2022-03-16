import React,{useEffect, useState} from 'react'; 
import { surveyService } from '../../_services'
import { Form } from 'react-bootstrap'

function SiteSurveySelect({appSiteId,siteSurveyId,onChange}) { 
  
  const [siteSurveys,setSiteSurveys] = useState([])
  const [selectedSiteSurveyId, setSelectedSiteSurveyId] = useState(siteSurveyId)

  useEffect(() => {
    surveyService.getSurveysOfAppSite(appSiteId)
      .then(_surveys => {
          if (_surveys.totalCount > 0) 
              setSiteSurveys(_surveys.result)          
      })
  },[appSiteId])

  const handleChange = (evt) => {
      setSelectedSiteSurveyId(+evt.target.value)        
      onChange(+evt.target.value)
  }    
        
  return ( 
    <Form.Group>
        <Form.Control as="select" value={selectedSiteSurveyId} name="siteSurveyId" onChange={handleChange}>
            <option>Seleziona percorso</option>
            {siteSurveys && siteSurveys.map(siteSurvey =>
                <option key={siteSurvey.siteSurveyId} value={siteSurvey.siteSurveyId}>{siteSurvey.siteSurveyName}</option>
            )}   
        </Form.Control>                
    </Form.Group>
  ); 
} 
  
  export { SiteSurveySelect };