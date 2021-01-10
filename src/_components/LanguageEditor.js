import React, { useEffect, useState } from 'react'; 
import { languageService, alertService } from '../_services'
import { Editor } from "@tinymce/tinymce-react";
import { Button,ProgressBar, Row, Col, Card } from 'react-bootstrap'
import parse from 'html-react-parser';

const baseEditorPlugins = [
  'advlist autolink lists link image charmap print preview anchor',
  'searchreplace visualblocks code fullscreen',
  'insertdatetime media table paste code help wordcount'
];
const baseEditorToolbar = 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help';

function LanguageEditor(props) { 
  
  const [labelValue, setLabelValue] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
      setLoading(true)
      languageService.getSiteLabelById(props.appSiteId,props.code,props.labelKey)
        .then(_siteLabel => {
          if (_siteLabel && _siteLabel.labelValue != '') {
            setLabelValue(_siteLabel.labelValue)          
          }
          setLoading(false)
        })
  }, []);
      
  const handleEditorChange = (content, editor) => {
      setLabelValue(content)
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
      {loading && <Col className="text-center mart2">
          <h5>Caricamento etichetta...</h5>
          <ProgressBar animated now={100} />
      </Col>}

      <Card bg="primary" text="white">
        <Card.Header>
          <Card.Title>
            Testo per {props.code}
          </Card.Title>
        </Card.Header>
        <Card.Body>
          {!loading &&           
            <Editor
                apiKey={process.env.REACT_APP_TINTMCE_KEY}
                initialValue={labelValue}
                init={{
                    height: 500,
                    menubar: false,
                    plugins: baseEditorPlugins,
                    toolbar: baseEditorToolbar
                }}
                onEditorChange={(content, editor) => { handleEditorChange(content, editor) }}
            />}

            <div className="mart2">
              <b>Testo originale</b>
              <div>            
                {parse(props.originalText)}
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
  
export { LanguageEditor };