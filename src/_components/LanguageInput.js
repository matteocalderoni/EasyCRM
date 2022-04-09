import React, { useEffect, useState } from 'react'; 
import { languageService, alertService } from '../_services'
import { Button, ProgressBar, Form } from 'react-bootstrap'

function LanguageInput({appSiteId, code, labelKey, originalText, onChange}) { 
  
  const [labelValue, setLabelValue] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
      if (code && code !== '') {
        setLoading(true)
        languageService.getSiteLabelById(appSiteId,code,labelKey)
          .then(_siteLabel => {
            if (_siteLabel && _siteLabel.labelValue !== '') 
              setLabelValue(_siteLabel.labelValue)           
            setLoading(false)
          })
      }
  }, [appSiteId, code, labelKey]);
      
  const handleChange = (evt) => setLabelValue(evt.target.value)
  
  const handleSubmit = () => {
    if (labelValue != null && labelValue !== '') {
      languageService.createOrUpdateSiteLabel({ appSiteId: appSiteId, code: code, labelKey: labelKey, labelValue: labelValue })
        .then(result => {
          if (result.hasErrors) 
              alertService.error('Problemi durante il salvataggio', { keepAfterRouteChange: true });
          else 
              alertService.success('Etichetta aggiunta con successo', { keepAfterRouteChange: true });                  
      }).catch(error => alertService.error(error))
    } 
  }
    
  return ( 
    <div>     
      
      {loading && 
      <div className="text-center mart2">
        <h5>Caricamento etichetta...</h5>
        <ProgressBar animated now={100} />
      </div>}

      {(code == null || code === '') &&
      <Form.Group>
        <input type="text" className="form-control" name="title" value={labelValue} onChange={onChange} maxLength={200} />                
      </Form.Group>}

      {code && code !== '' &&
      <Form.Group>
        <Form.Label>Testo per {code}</Form.Label>
        <input type="text" className="form-control" name="title" value={labelValue} onChange={handleChange} maxLength={200} />                
        <Button onClick={handleSubmit} variant="success">
            Salva etichetta
        </Button> 
      </Form.Group>}
    </div> 
  );      
} 
  
export { LanguageInput };