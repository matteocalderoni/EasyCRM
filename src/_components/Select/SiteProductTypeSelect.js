import React,{useEffect, useState} from 'react'; 
import { productService } from '../../_services'
import { Form } from 'react-bootstrap'

function SiteProductTypeSelect({appSiteId,siteProductTypeId,onChange}) { 
  
  const [productTypes, setProductTypes] = useState([])
  const [selectedSiteProductTypeId,setSelectedSiteProductTypeId] = useState(siteProductTypeId)

  useEffect(() => {
    productService.getSiteProductTypes('', 0, 0, appSiteId)
      .then(_productTypes => {
          if (_productTypes.totalCount > 0) 
              setProductTypes(_productTypes.result)
      })
  },[appSiteId])
    
  const handleChange = (evt) => {
      setSelectedSiteProductTypeId(+evt.target.value)        
      onChange(+evt.target.value)
  }    
        
  return ( 
    <Form.Group>
        {productTypes && 
        <Form.Control as="select" value={selectedSiteProductTypeId} name="siteProductTypeId" onChange={handleChange}>
            <option>Seleziona tipo prodotto</option>
            {productTypes && productTypes.map(siteProductType =>
                <option key={siteProductType.siteProductTypeId} value={siteProductType.siteProductTypeId}>{siteProductType.code}</option>
            )}   
        </Form.Control>}       
    </Form.Group>
  ); 
} 
  
export { SiteProductTypeSelect };