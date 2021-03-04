import React, { useEffect, useState } from 'react'; 
import { languageService, alertService } from '../_services'
import { Button,ProgressBar, Form,Card } from 'react-bootstrap'

function LanguageInput(props) { 
  
  const [labelValue, setLabelValue] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
      setLoading(true)
      languageService.getSiteLabelById(props.appSiteId,props.code,props.labelKey)
        .then(_siteLabel => {
          if (_siteLabel && _siteLabel.labelValue !== '') {
            setLabelValue(_siteLabel.labelValue)          
          }
          setLoading(false)
        })
  }, []);
      
  const handleChange = (evt) => {
    const value = evt.target.value;
    setLabelValue(value)
  }    
  
  const handleSubmit = () => {
    if (labelValue != '') {
      languageService.createOrUpdateSiteLabel({ appSiteId: props.appSiteId, code: props.code, labelKey: props.labelKey, labelValue: labelValue })
        .then(result => {
          if (result.hasErrors) {
              alertService.error('Problemi durante il salvataggio', { keepAfterRouteChange: true });
          } else {
              alertService.success('Etichetta aggiunta con successo', { keepAfterRouteChange: true });
          }                      
      })
      .catch(error => {
          alertService.error(error);
      })
    } 
  }
    
  return ( 
    <div>     
      {loading && <div className="text-center mart2">
        <h5>Caricamento etichetta...</h5>
        <ProgressBar animated now={100} />
      </div>}

      <Card bg="primary" text="white">
        <Card.Header>
          <Card.Title>Testo per {props.code}</Card.Title>
        </Card.Header>
        <Card.Body>
          {!loading && 
            <Form.Group>
              <Form.Label></Form.Label>
                  <input type="text" className="form-control" name="title" value={labelValue} onChange={handleChange} maxLength={200} />                
            </Form.Group>}     
            <div className="mart2">
              <b>Testo originale</b>
              <div className="mart2">            
                {props.originalText}
              </div>
            </div>               
        </Card.Body>
        <Card.Footer>
          <Button onClick={handleSubmit} variant="success">
              Salva etichetta
          </Button> 
        </Card.Footer>
      </Card>      
    </div> 
  );      
} 
  
export { LanguageInput };