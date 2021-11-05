import React,{Component} from 'react'; 
import { Form } from 'react-bootstrap'

class QuestionStyleSelect extends Component { 
  
    constructor(props) {
      super(props);
      this.state = {         
        questionStyles: [
          {label: 'Elenco', value: 1},
          {label: 'Bottone', value: 2}
        ],
        label: props.label | '',
        selectedQuestionStyle: props.value | 1               
      };                   
    }    
    
    handleChange = (evt) => {
        //const value = evt.target.value;
        this.setState({
            selectedQuestionStyle: +evt.target.value 
        })        
        // Return value on parent
        this.props.onChange(+evt.target.value)
    }    
         
    render() {      
      return ( 
        <Form.Group>
            <Form.Control as="select" value={this.state.selectedQuestionStyle} name="selectedQuestionStyle" onChange={this.handleChange}>
              <Form.Label>{this.state.label}</Form.Label>
                {this.state.questionStyles && this.state.questionStyles.map(questionStyle =>
                    <option key={questionStyle.value} value={questionStyle.value}>{questionStyle.label}</option>
                )}   
            </Form.Control>                
        </Form.Group>
      ); 
    } 
  } 
  
  export { QuestionStyleSelect };