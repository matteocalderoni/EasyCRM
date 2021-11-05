import React,{Component} from 'react'; 
import { Form } from 'react-bootstrap'

class AnswerTypeSelect extends Component { 
  
    constructor(props) {
      super(props);
      this.state = {         
        answerTypes: [
          {label: 'Testo', value: 1},
          {label: 'Numero', value: 2}
        ],
        label: props.label | '',
        selectedAnswerType: props.answerType | 1               
      };                   
    }    
    
    handleChange = (evt) => {
        //const value = evt.target.value;
        this.setState({
            selectedAnswerType: +evt.target.value 
        })        
        // Return value on parent
        this.props.onChange(+evt.target.value)
    }    
         
    render() {      
      return ( 
        <Form.Group>
            <Form.Control as="select" value={this.state.selectedAnswerType} name="selectedAnswerType" onChange={this.handleChange}>
              <Form.Label>{this.state.label}</Form.Label>
                {this.state.answerTypes && this.state.answerTypes.map(answerType =>
                    <option key={answerType.value} value={answerType.value}>{answerType.label}</option>
                )}   
            </Form.Control>                
        </Form.Group>
      ); 
    } 
  } 
  
  export { AnswerTypeSelect };