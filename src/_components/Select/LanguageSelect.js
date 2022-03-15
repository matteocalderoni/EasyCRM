import React,{useEffect, useState} from 'react'; 
import { languageService } from '../../_services'
import { Form } from 'react-bootstrap'

function LanguageSelect ({ appSiteId, code, onLanguageChange}) { 

  const [languages, setLanguages] = useState();

  useEffect(() => {
    languageService.getlanguagesOfSite(appSiteId)
        .then(_langs => {
            if (_langs.totalCount > 0) 
                setLanguages(_langs.result)            
        })
  },[appSiteId])

  const [selectedCode, setSelectedCode] = useState(code);      

  const handleChange = (evt) => {
      setSelectedCode(evt.target.value)        
      onLanguageChange(evt.target.value)
  }    
        
  return ( 
    <Form.Group>
        <Form.Control as="select" value={selectedCode} name="code" onChange={(e) => handleChange(e)}>
            <option value={''}>Predefinita</option>
            {languages && languages.map(lang =>
                <option key={lang.code} value={lang.code}>{lang.code}</option>
            )}   
        </Form.Control>                
    </Form.Group>
  ); 
} 
  
export { LanguageSelect };