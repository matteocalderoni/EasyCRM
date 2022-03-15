import React,{useState} from 'react'; 
import { Form } from 'react-bootstrap'

function NavAlignSelect({ label, align, onAlignChange }) { 

  const aligns = [
    {label: 'Sinistra', value: 1 },
    {label: 'Centro', value: 2 },
    {label: 'Destra', value: 3 }          
  ];

  const [selectedNavAlign, setSelectedNavAlign] = useState(align);
  
  const handleChange = (evt) => {
      setSelectedNavAlign(+evt.target.value)        
      onAlignChange(+evt.target.value)
  }    
        
  return ( 
    <>
    <Form.Group>
        <Form.Control as="select" value={+selectedNavAlign} name="selectedNavAlign" onChange={(e) => handleChange(e)}>
            {aligns && aligns.map(align =>
                <option key={align.value} value={align.value}>{align.label}</option>
            )}   
        </Form.Control>                
    </Form.Group>
    </>
  ); 
} 

export { NavAlignSelect };