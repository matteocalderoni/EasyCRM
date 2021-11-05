import React,{Component} from 'react'; 
import parse from 'html-react-parser';

class SiteSurveyBoxNav extends Component { 
  
    constructor(props) {
      super(props);
      this.state = { 
        surveySteps: props.surveySteps,
        surveyStep: props.surveyStep
      };                   
    }    

    handleChange = (value) => {
        this.setState({
            surveyStep: value
        })        
        // Return value on parent
        this.props.onChange(value)
    }    
         
    render() {      
      return ( 
        <nav className="p-4">
            <ul className="flex space-x-2">
                {this.state.surveySteps && this.state.surveySteps.length > 0 &&  this.state.surveySteps.map(surveyStep =>
                <li 
                    key={surveyStep.surveyStepId}
                    className={`block px-4 py-2 rounded-md ${this.state.surveyStep == surveyStep ? 'bg-blue-500' : ''}`}
                    onClick={() => this.handleChange(surveyStep)}>
                    {surveyStep.description && parse(surveyStep.description)}
                </li>)}
            </ul>
        </nav>
      ); 
    } 
  } 
  
  export { SiteSurveyBoxNav };