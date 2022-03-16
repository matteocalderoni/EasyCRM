import React,{useEffect, useState} from 'react'; 
import { productService } from '../../_services'
import { Form } from 'react-bootstrap'

function SiteProductSelect({appSiteId,siteProductId,onChange}) { 
  
  const [products, setProducts] = useState([])
  const [selectedSiteProductId,setSelectedSiteProductId] = useState(siteProductId)

  useEffect(() => {
    productService.getSiteProducts('', 0, 0, appSiteId)
      .then(_products => {
          if (_products.totalCount > 0) 
              setProducts(_products.result)
      })
  },[appSiteId])
    
  const handleChange = (evt) => {
      setSelectedSiteProductId(+evt.target.value)        
      onChange(+evt.target.value)
  }    
        
  return ( 
    <Form.Group>
        {products && 
        <Form.Control as="select" value={selectedSiteProductId} name="siteProductId" onChange={handleChange}>
            <option>Seleziona prodotto</option>
            {products && products.map(siteProduct =>
                <option key={siteProduct.siteProductId} value={siteProduct.siteProductId}>{siteProduct.code}</option>
            )}   
        </Form.Control>}       
    </Form.Group>
  ); 
} 
  
export { SiteProductSelect };