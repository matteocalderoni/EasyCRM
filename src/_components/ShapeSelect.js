import React from 'react'; 
import { Form } from 'react-bootstrap'

function ShapeSelect({label,shape,onChange}) 
{ 
  const shapes = [
    {label: 'Riempi contenitore', value: -1},
    {label: 'Quadrato', value: 1},
    {label: 'Cerchio', value: 2},
    {label: 'Arrotondato', value: 3}
  ]    
            
  return ( 
    <>
    {shapes && 
    <Form.Group>
        <Form.Control as="select" value={shape} name="selectedShape" onChange={(e) => onChange(+e.target.value)}>
            {shapes.map(_shape =>
                <option key={_shape.value} value={_shape.value}>{_shape.label}</option>
            )}   
        </Form.Control>                
    </Form.Group>}
    </>
  );   
} 
  
export { ShapeSelect };