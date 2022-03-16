import React, { useState } from 'react';
import { appSiteService, alertService } from '../_services';
import { Form, Button } from 'react-bootstrap'
import { Editor } from "@tinymce/tinymce-react";
import { LanguageSelect } from './Select/LanguageSelect';
import { LanguageEditor } from './LanguageEditor';
import {menuSettings,pluginsSettings,toolbarSettings,fontSettings,styleSettings } from '../_helpers/tinySettings';
import { fetchWrapper } from '../_helpers';

const baseUrl = `${process.env.REACT_APP_API_URL}/upload`;
const baseImageUrl = `${process.env.REACT_APP_STORAGE_URL}/`;

function BoxTextEditor({pageBox,prefix,handleSaved}) {

    const [pageBoxData, setPageBoxData] = useState(pageBox)
    const [languageCode, setLanguageCode] = useState('')   

    const handleTitleEditorChange = (content, editor) => setPageBoxData({...pageBoxData, title: content})        
    const handleEditorChange = (content, editor) => setPageBoxData({...pageBoxData, description: content})
    
    const tiny_image_upload_handler = (blobInfo, success, failure, progress) => {
        const fileName = (prefix + '/' || '') + new Date().getTime() + '.jpeg';
        fetchWrapper.postFile(`${baseUrl}/CloudUpload`, blobInfo.blob(), fileName)
            .then((result) => success(`${baseImageUrl}${result.fileName}`));         
    };                  
    
    const updatePageBox = () => {
        appSiteService.updatePageBox({ pageBox: pageBoxData })
            .then((result) => {
                if (result.hasErrors) 
                    alertService.error('Problemi durante salvataggio.', { keepAfterRouteChange: true });
                else {
                    alertService.success('Aggiornamento riuscito', { keepAfterRouteChange: true });
                    handleSaved(result);            
                }                
            }).catch(error => alertService.error(error));
    }

    return (  
        <>                
            <div>                                            
                {languageCode === '' &&
                <Form.Group>                            
                    <div className="border rounded-xl border-blue-500 p-1">
                        <Editor                                    
                            apiKey={process.env.REACT_APP_TINTMCE_KEY}
                            initialValue={pageBoxData.title}                                
                            inline={true}
                            init={{
                                height: 500,                                        
                                menubar: menuSettings,
                                plugins: pluginsSettings,
                                toolbar: toolbarSettings,
                                font_formats: fontSettings,
                                content_style: styleSettings,
                                images_upload_handler: tiny_image_upload_handler
                            }}
                            onEditorChange={handleTitleEditorChange}
                            >
                        </Editor>                                 
                    </div>                        
                </Form.Group>}                                       

                {languageCode !== '' &&
                <div>
                    <LanguageEditor 
                        originalText={pageBoxData.title}
                        appSiteId={pageBoxData.appSiteId} 
                        code={languageCode}
                        inline={true}
                        labelKey={`PAGEBOX_${pageBoxData.appSiteId}_${pageBoxData.sitePageId}_${pageBoxData.pageBoxId}-Title`}>
                    </LanguageEditor>
                </div>}  
                
                {pageBoxData && languageCode === '' && 
                    (pageBoxData.boxType === 1 || pageBoxData.boxType === 9 || pageBoxData.boxType === 14) &&                 
                <div>
                    <Form.Group>
                        {/* <Form.Label className='text-xs'>Descrizione</Form.Label> */}
                        <div className="border rounded-xl ring-blue-700 p-1">
                            <Editor
                                apiKey={process.env.REACT_APP_TINTMCE_KEY}
                                initialValue={pageBoxData.description}
                                inline={true}
                                init={{
                                    height: 500,
                                    menubar: menuSettings,
                                    plugins: pluginsSettings,
                                    toolbar: toolbarSettings,
                                    font_formats: fontSettings,
                                    content_style: styleSettings,
                                    images_upload_handler: tiny_image_upload_handler
                                }}
                                onEditorChange={handleEditorChange}
                            />
                        </div>                        
                    </Form.Group>
                </div>}

                {languageCode && languageCode !== '' &&
                    pageBoxData.boxType && (pageBoxData.boxType === 1 || pageBoxData.boxType === 9 || pageBoxData.boxType === 14) &&
                <LanguageEditor 
                    originalText={pageBoxData.description}
                    appSiteId={pageBoxData.appSiteId} 
                    code={languageCode}
                    inline={true}
                    labelKey={`PAGEBOX_${pageBoxData.appSiteId}_${pageBoxData.sitePageId}_${pageBoxData.pageBoxId}-Description`}>                                    
                </LanguageEditor>}              
                
            </div>
            <div className='flex'>
                <div className="flex-1">
                    {languageCode === '' &&
                    <Button onClick={() => updatePageBox()} variant="success" className="w-full bg-green-600 mr-1 rounded-lg">
                        Salva
                    </Button>}                         
                </div>
                <Form inline className='flex-1'>
                    <LanguageSelect appSiteId={pageBoxData.appSiteId} onLanguageChange={(lang) => setLanguageCode(lang)} />                   
                </Form>
            </div>                             
        </>          
    );
}

export { BoxTextEditor }