import React,{Component} from 'react'; 
import { surveyService } from '../_services'
import { Form } from 'react-bootstrap'

class SiteSurveySelect extends Component { 
  
    constructor(props) {
      super(props);
      this.state = { 
        appSiteId: props.appSiteId,
        siteSurveys: [],
        siteSurveyId: props.siteSurveyId
      };                   
    }    

    componentDidMount() {
        surveyService.getSurveysOfAppSite(this.state.appSiteId)
            .then(_surveys => {
                if (_surveys.totalCount > 0) {
                    this.setState({ surveys: _surveys.result })
                }
            })
    }

    handleChange = (evt) => {
        const value = +evt.target.value;
        this.setState({
            siteSurveyId: value 
        })        
        // Return value on parent
        this.props.onChange(value)
    }    
         
    render() {      
      return ( 
        <Form.Group>
            <Form.Control as="select" value={this.state.siteSurveyId} name="siteSurveyId" onChange={this.handleChange}>
                <option>Seleziona percorso</option>
                {this.state.surveys && this.state.surveys.map(siteSurvey =>
                    <option key={siteSurvey.siteSurveyId} value={siteSurvey.siteSurveyId}>{siteSurvey.siteSurveyName}</option>
                )}   
            </Form.Control>                
        </Form.Group>
      ); 
    } 
  } 
  
  export { SiteSurveySelect };