import React,{useState} from 'react'; 
import { Form } from 'react-bootstrap'

function AnswerTypeSelect({ label,answerType,onChange }) { 
  
  const answerTypes = [
    {label: 'Seleziona', value: 0},          
    {label: 'Testo', value: 1},
    {label: 'Numero', value: 2},
    {label: 'File upload', value: 3},
    {label: 'Prodotto', value: 4}
  ];

  const [selectedAnswerType, setSelectedAnswerType] = useState(answerType);
    
  const handleChange = (evt) => {
      setSelectedAnswerType(+evt.target.value)        
      onChange(+evt.target.value)
  }    
         
  return ( 
    <Form.Group>
        <Form.Label>{label}</Form.Label>
        <Form.Control as="select" value={selectedAnswerType} name="selectedAnswerType" onChange={(e) => handleChange(e)}>
            {answerTypes && answerTypes.map(answerType =>
                <option key={answerType.value} value={answerType.value}>{answerType.label}</option>
            )}   
        </Form.Control>                
    </Form.Group>
  ); 
} 
  
export { AnswerTypeSelect };