import React,{useState} from 'react'; 
import { Form } from 'react-bootstrap'

function QuestionStyleSelect({label, value,onChange }) { 

  const questionStyles = [
    {label: 'Seleziona', value: 0},
    {label: 'Elenco', value: 1},
    {label: 'Bottone', value: 2}
  ];

  const [selectedQuestionStyle, setSelectedQuestionStyle] = useState(value || 1)
  
  const handleChange = (evt) => {
      setSelectedQuestionStyle(+evt.target.value)        
      onChange(+evt.target.value)
  }    
         
  return ( 
    <Form.Group>            
        <Form.Control as="select" value={selectedQuestionStyle} name="selectedQuestionStyle" onChange={handleChange}>
            {questionStyles && questionStyles.map(questionStyle =>
                <option key={questionStyle.value} value={questionStyle.value}>{questionStyle.label}</option>
            )}   
        </Form.Control>                
    </Form.Group>
  ); 
} 
  
  export { QuestionStyleSelect };