import React,{ useState} from 'react'; 
import { Form } from 'react-bootstrap'

function NavPositionSelect ({ label, position, onPositionChange }) { 
  
  const positions = [
    {label: 'Nascosto', value: -1},
    {label: 'Fisso Sopra', value: 1},
    {label: 'Sopra', value: 2},
    {label: 'Fisso Sotto', value: 3}          
  ];

  const [selectedNavPosition, setSelectedNavPosition] = useState(position);

  const handleChange = (evt) => {
      setSelectedNavPosition(+evt.target.value)        
      onPositionChange(+evt.target.value)
  }    
         
  return ( 
    <>
    <Form.Group>
        <Form.Control as="select" value={selectedNavPosition} name="selectedNavPosition" onChange={(e) => handleChange(e)}>
            {positions && positions.map(pos =>
                <option key={pos.value} value={pos.value}>{pos.label}</option>
            )}   
        </Form.Control>                
    </Form.Group>
    </>
  ); 
} 
  
  export { NavPositionSelect };