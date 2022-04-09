import React, { useEffect, useState } from 'react'; 
import { languageService, alertService } from '../_services'
import { Editor } from "@tinymce/tinymce-react";
import { Button,ProgressBar, Col, Form } from 'react-bootstrap'
import {menuSettings,pluginsSettings,toolbarSettings,fontSettings,styleSettings } from '../_helpers/tinySettings';
import { fetchWrapper } from '../_helpers';

const baseUrl = `${process.env.REACT_APP_API_URL}/upload`;
const baseImageUrl = `${process.env.REACT_APP_STORAGE_URL}/`;

function LanguageEditor({appSiteId,originalText,onChange,code,labelKey,inline}) { 
  
  const [labelValue, setLabelValue] = useState(originalText);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
      if (code && code !== '') {
        setLoading(true)
        languageService.getSiteLabelById(appSiteId,code,labelKey)
          .then(_siteLabel => {
            if (_siteLabel && _siteLabel.labelValue && _siteLabel.labelValue !== '') 
              setLabelValue(_siteLabel.labelValue)          
            else
              setLabelValue('')
            setLoading(false)
          })
      }
  }, [appSiteId,code,labelKey]);
      
  const handleEditorChange = (content) => setLabelValue(content);

  const tiny_image_upload_handler = (blobInfo, success, failure, progress) => {
    const fileName = (appSiteId + '/' || '') + new Date().getTime() + '.jpeg';
    fetchWrapper.postFile(`${baseUrl}/CloudUpload`, blobInfo.blob(), fileName)
        .then((result) => success(`${baseImageUrl}${result.fileName}`));         
  };                  
  
  const handleSubmit = () => {
    if (labelValue && labelValue !== '') {
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
      <Col className="text-center mt-1">
        <h5>Caricamento etichetta...</h5>
        <ProgressBar animated now={100} />
      </Col>}

      <Form.Group>           
        <div className={`relative border rounded-xl ring-2 ${(code == null || code === '' ? 'ring-blue-700' : 'ring-green-700' )} p-1`}>
          {(code == null || code === '') &&
            <Editor
                apiKey={process.env.REACT_APP_TINTMCE_KEY}
                initialValue={originalText}
                inline={inline ? inline : false}
                init={{
                    height: 300,
                    menubar: menuSettings,      // 'file edit view insert format tools table tc help',
                    plugins: pluginsSettings,   // baseEditorPlugins,
                    toolbar: toolbarSettings,   // fullEditorToolbar
                    font_formats: fontSettings,
                    content_style: styleSettings,
                    images_upload_handler: tiny_image_upload_handler
                }}
                onEditorChange={(content, editor) => { onChange(content) }}                
            />}

            {!loading && code && code !== '' &&
            <Editor
                apiKey={process.env.REACT_APP_TINTMCE_KEY}
                initialValue={labelValue}
                inline={inline ? inline : false}
                init={{
                    height: 300,
                    menubar: menuSettings,      // 'file edit view insert format tools table tc help',
                    plugins: pluginsSettings,   // baseEditorPlugins,
                    toolbar: toolbarSettings,   // fullEditorToolbar
                    font_formats: fontSettings,
                    content_style: styleSettings,
                    images_upload_handler: tiny_image_upload_handler
                }}
                onEditorChange={(content, editor) => { handleEditorChange(content) }}                
            />}

          {!loading && code && code !== '' &&
          <div className='absolute bottom-1 right-0'>
            <Button onClick={() => handleSubmit()} variant="success" className='flex items-center space-x-2 mr-3 h-10 justify-center rounded-full bg-green-500'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
            </Button>
          </div>}
        </div>          
      
      </Form.Group>            
    </div> 
  );      
} 
  
export { LanguageEditor };