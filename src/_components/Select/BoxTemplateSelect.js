import React,{useState} from 'react'; 
import { Form } from 'react-bootstrap'

function BoxTemplateSelect({ label, template, onTemplateChange }) { 

  const templates = [
    {label: 'Formato 1 (in linea adattivo)', value: 1 },
    {label: 'Formato 2 (in linea fisso)', value: 2 },
    {label: 'Formato 3 (copertina)', value: 3 },
    {label: 'Formato 4 (colore sfondo)', value: 4 }          
  ];

  const [selectedBoxTemplate, setSelectedBoxTemplate] = useState(template);
  
  const handleChange = (evt) => {
      setSelectedBoxTemplate(+evt.target.value)        
      onTemplateChange(+evt.target.value)
  }    
        
  return ( 
    <>
    <Form.Group>
        <Form.Control as="select" value={+selectedBoxTemplate} name="selectedBoxTemplate" onChange={(e) => handleChange(e)}>
            <option value={-1}>Modello</option>
            {templates && templates.map(_template =>
                <option key={_template.value} value={_template.value}>{_template.label}</option>
            )}   
        </Form.Control>                
    </Form.Group>
    </>
  ); 
} 

export { BoxTemplateSelect };