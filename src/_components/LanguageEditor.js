import React, { useEffect, useState } from 'react'; 
import { languageService, alertService } from '../_services'
import { Editor } from "@tinymce/tinymce-react";
import { Button,ProgressBar, Col, Form, Navbar,Nav } from 'react-bootstrap'
import parse from 'html-react-parser';
import {menuSettings,pluginsSettings,toolbarSettings,fontSettings,styleSettings } from '../_helpers/tinySettings';
import { fetchWrapper } from '../_helpers';

const baseUrl = `${process.env.REACT_APP_API_URL}/upload`;
const baseImageUrl = `${process.env.REACT_APP_STORAGE_URL}/`;

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

  const tiny_image_upload_handler = (blobInfo, success, failure, progress) => {
    const fileName = (props.appSiteId + '/' || '') + new Date().getTime() + '.jpeg';

    // Request made to the backend api 
    // Send formData object 
    fetchWrapper.postFile(`${baseUrl}/CloudUpload`, blobInfo.blob(), fileName)
        .then((result) => {
            success(`${baseImageUrl}${result.fileName}`);                
        });         
  };                  
  
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
      <Form.Group>
        <Form.Label>Testo per lingua <b>{props.code}</b> (digitare il testo tradotto)</Form.Label>
        {!loading &&           
            <Editor
                apiKey={process.env.REACT_APP_TINTMCE_KEY}
                initialValue={labelValue}
                inline={props.inline ? props.inline : false}
                init={{
                    height: 500,
                    menubar: menuSettings, // 'file edit view insert format tools table tc help',
                    plugins: pluginsSettings, // baseEditorPlugins,
                    toolbar: toolbarSettings, // fullEditorToolbar
                    font_formats: fontSettings,
                    content_style: styleSettings,
                    images_upload_handler: tiny_image_upload_handler
                }}
                onEditorChange={(content, editor) => { handleEditorChange(content, editor) }}                
            />}
          <Form.Text className="text-muted">
            <div className="mart2">
              <b>Testo originale</b>
              <div>            
                {props.originalText && parse(props.originalText)}
              </div>
            </div>
          </Form.Text>
      </Form.Group>
      <Navbar variant="dark" bg="dark">
        <Nav className="mr-auto">
          <Button onClick={handleSubmit} variant="success">
              Salva etichetta
          </Button> 
        </Nav>
      </Navbar>      
    </div> 
  );      
} 
  
export { LanguageEditor };