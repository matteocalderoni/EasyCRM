import React,{Component} from 'react'; 
import { Form } from 'react-bootstrap'

class AnswerTypeSelect extends Component { 
  
    constructor(props) {
      super(props);
      this.state = {         
        answerTypes: [
          {label: 'Seleziona', value: 0},
          {label: 'Testo', value: 1},
          {label: 'Numero', value: 2},
          {label: 'File upload', value: 3}
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
            <Form.Label>{this.state.label}</Form.Label>
            <Form.Control as="select" value={this.state.selectedAnswerType} name="selectedAnswerType" onChange={this.handleChange}>
                {this.state.answerTypes && this.state.answerTypes.map(answerType =>
                    <option key={answerType.value} value={answerType.value}>{answerType.label}</option>
                )}   
            </Form.Control>                
        </Form.Group>
      ); 
    } 
  } 
  
  export { AnswerTypeSelect };