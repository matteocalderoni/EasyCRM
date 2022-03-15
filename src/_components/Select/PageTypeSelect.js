import React,{useState} from 'react'; 
import { Form } from 'react-bootstrap'

function PageTypeSelect ({ label, pageType, onPageTypeChange }) { 
  
  const pageTypes = [
    {label: 'Tipo', value: -1},
    {label: 'Default', value: 0},
    {label: 'Privacy', value: 1},
    {label: 'Landing', value: 2}
  ]; 

  const [selectedPageType, setSelectedPageType] = useState(pageType);
    
    const handleChange = (evt) => {
        setSelectedPageType(+evt.target.value)        
        onPageTypeChange(+evt.target.value)
    }    
              
    return ( 
      <Form.Group>
          <Form.Control as="select" value={selectedPageType} name="selectedPageType" onChange={(e) => handleChange(e)}>
              {pageTypes && pageTypes.map(pageType =>
                  <option key={pageType.value} value={pageType.value}>{pageType.label}</option>
              )}   
          </Form.Control>                
      </Form.Group>
    ); 
  } 
  
  export { PageTypeSelect };