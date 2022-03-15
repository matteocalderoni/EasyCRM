import React,{useState} from 'react'; 
import { Form } from 'react-bootstrap'

function PositionSelect({label,position,onPositionChange}) { 
  
  const positions = [
    {label: 'Nascosto', value: -1},
    {label: 'Sopra', value: 1},
    {label: 'Sinistra', value: 2},
    {label: 'Sotto', value: 3},
    {label: 'Destra', value: 4}
  ];

  const [selectedPosition, setSelectedPosition] = useState(position)    
    
  const handleChange = (evt) => {
      setSelectedPosition(+evt.target.value)        
      onPositionChange(+evt.target.value)
  }    
          
  return ( 
    <>
    <Form.Group>
        <Form.Control as="select" value={selectedPosition} name="selectedPosition" onChange={(e) => handleChange(e)}>
            {positions && positions.map(pos =>
                <option key={pos.value} value={pos.value}>{pos.label}</option>
            )}   
        </Form.Control>                
    </Form.Group>
    </>
  ); 
} 

export { PositionSelect };