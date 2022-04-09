import React, { useState } from 'react';
import { appSiteService, alertService } from '../_services';
import { Button } from 'react-bootstrap'
import { LanguageEditor } from './LanguageEditor';

function BoxTextEditor({pageBox,languageCode,handleSaved}) {

    const [pageBoxData, setPageBoxData] = useState(pageBox)

    const handleTitleEditorChange = (content) => setPageBoxData({...pageBoxData, title: content})        
    const handleEditorChange = (content) => setPageBoxData({...pageBoxData, description: content})
        
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
                
                <LanguageEditor 
                    appSiteId={pageBoxData.appSiteId} 
                    originalText={pageBoxData.title}
                    onChange={(content) => handleTitleEditorChange(content)}
                    code={languageCode}
                    labelKey={`PAGEBOX_${pageBoxData.appSiteId}_${pageBoxData.sitePageId}_${pageBoxData.pageBoxId}-Title`}
                    inline={true} />                                

                {pageBoxData && 
                    (pageBoxData.boxType === 1 || pageBoxData.boxType === 9 || pageBoxData.boxType === 14) &&                                 
                <LanguageEditor 
                    appSiteId={pageBoxData.appSiteId} 
                    originalText={pageBoxData.description}
                    onChange={(content) => handleEditorChange(content)}
                    code={languageCode}
                    labelKey={`PAGEBOX_${pageBoxData.appSiteId}_${pageBoxData.sitePageId}_${pageBoxData.pageBoxId}-Description`}
                    inline={true} />}
                
            </div>

            {(languageCode == null || languageCode === '') &&
            <div className='absolute bottom-2 left-2'>
                <div className="flex-1">                    
                    <Button onClick={() => updatePageBox()} variant="success" className="flex items-center space-x-2 mr-3 h-16 justify-center rounded-full bg-green-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                        </svg>
                        <span className='hidden md:block'>Salva testo</span>
                    </Button>                         
                </div>
            </div>}

        </>          
    );
}

export { BoxTextEditor }