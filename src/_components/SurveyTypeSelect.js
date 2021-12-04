import React,{Component} from 'react'; 
import { Form } from 'react-bootstrap'

class SurveyTypeSelect extends Component { 
  
    constructor(props) {
      super(props);
      this.state = {         
        surveyTypes: [
          {label: 'Default', value: 0},
          {label: 'Percorso di acquisto', value: 1},
          {label: 'Percorso Presentazione', value: 2},
          {label: 'Modulo personalizzato', value: 3}
        ],
        label: props.label | '',
        selectedSurveyType: props.surveyType | 0             
      };                   
    }    
    
    handleChange = (evt) => {
        this.setState({
            selectedSurveyType: +evt.target.value 
        })        
        // Return value on parent
        this.props.onSurveyTypeChange(+evt.target.value)
    }    
         
    render() {      
      return ( 
        <>
        <Form.Group>            
            <Form.Control as="select" value={this.state.selectedSurveyType} name="selectedPageType" onChange={this.handleChange}>
                {this.state.surveyTypes && this.state.surveyTypes.map(surveyType =>
                    <option key={surveyType.value} value={surveyType.value}>{surveyType.label}</option>
                )}   
            </Form.Control>                
        </Form.Group>
        </>
      ); 
    } 
  } 
  
  export { SurveyTypeSelect };