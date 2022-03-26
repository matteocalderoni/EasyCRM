import React,{useState} from 'react'; 
import { Form } from 'react-bootstrap'

function SiteProductCategorySelect({ label, category, onCategoryChange }) { 

  const categories = [
    {label: 'Shop', value: 1 },
    {label: 'Brand', value: 2 },
    {label: 'Persona', value: 3 }          
  ];

  const [selectedSiteProductCategory, setSelectedSiteProductCategory] = useState(category);
  
  const handleChange = (evt) => {
      setSelectedSiteProductCategory(+evt.target.value)        
      onCategoryChange(+evt.target.value)
  }    
        
  return ( 
    <>
    <Form.Group>
        <Form.Control as="select" value={+selectedSiteProductCategory} name="selectedSiteProductCategory" onChange={(e) => handleChange(e)}>
            <option value={-1}>Categoria</option>
            {categories && categories.map(_category =>
                <option key={_category.value} value={_category.value}>{_category.label}</option>
            )}   
        </Form.Control>                
    </Form.Group>
    </>
  ); 
} 

export { SiteProductCategorySelect };