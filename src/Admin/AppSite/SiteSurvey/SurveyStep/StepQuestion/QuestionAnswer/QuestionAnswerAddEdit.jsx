import React, { useEffect, useState } from 'react';
import { Form, Button, Card, ProgressBar, Image } from 'react-bootstrap'
import { surveyService, alertService } from '../../../../../../_services';
import { Uploader,StepQuestionSelect,SurveyStepSelect,AnswerTypeSelect } from '../../../../../../_components';
import { SiteProductPreview } from '../../../../../../_components/SiteProductPreview';
import { CompactPicker,SliderPicker } from 'react-color';
import { Editor } from "@tinymce/tinymce-react";
import {menuSettings,pluginsSettings,toolbarSettings,fontSettings,styleSettings } from '../../../../../../_helpers/tinySettings';
import { fetchWrapper } from '../../../../../../_helpers/fetch-wrapper';

const baseUrl = `${process.env.REACT_APP_API_URL}/upload`;
const baseImageUrl = `${process.env.REACT_APP_STORAGE_URL}/`;

function QuestionAnswerAddEdit ({appSiteId, siteSurveyId, surveyStepId, stepQuestionId, questionAnswerId, handleSaved}) {
    
    const [questionAnswer, setQuestionAnswer] = useState({
        appSiteId: appSiteId,         
        siteSurveyId: siteSurveyId,
        surveyStepId: surveyStepId,
        stepQuestionId: stepQuestionId,
        questionAnswerId: questionAnswerId,                
        position: 1,
        answerType: 1,
        answerText: '',
        minValue: 1,
        maxValue: 1,
        withComment: false,
        endSurvey: false,
        answerNote: '',
        boxColor: '#FFFFFF',
        price: 0                
    })

    const [loading, setLoading] = useState(false)
    const [languageCode, setLanguageCode] = useState('')    

    // Handle changes
    const handleChange = (evt) => setQuestionAnswer({ ...questionAnswer, [evt.target.name]: evt.target.value })    
    const handleChangeNumber = (evt) => setQuestionAnswer({ ...questionAnswer, [evt.target.name]: +evt.target.value })
    const handleChangeBool = (evt) => setQuestionAnswer({ ...questionAnswer, [evt.target.name]: evt.target.checked })    
    const handleChangeAnswerType = (value) => setQuestionAnswer({ ...questionAnswer, answerType: value })
    const handleColorChange = (color) => setQuestionAnswer({ ...questionAnswer, boxColor: color.hex })
    const handleEditorChange = (content, editor) => setQuestionAnswer({ ...questionAnswer, answerText: content })
    const handleFileName = (fileName) => setQuestionAnswer({ ...questionAnswer, imageUrl: fileName })
    const handleSiteProductId = (_siteProductId) => setQuestionAnswer({ ...questionAnswer, siteProductId: _siteProductId })
    
    const handleFieldReset = (field) => setQuestionAnswer({ ...questionAnswer, [field]: '' })
    const handleFieldRemove = (field) => setQuestionAnswer({ ...questionAnswer, [field]: '' })
    
    // Navigate survey
    const handleNextStepId = (surveyStepId) => setQuestionAnswer({ ...questionAnswer, nextStepId: surveyStepId })
    const handleNextQuestionId = (stepQuestionId) => setQuestionAnswer({ ...questionAnswer, nextQuestionId: stepQuestionId })

    // Load Answer by Id
    useEffect(() => {    
        if (questionAnswerId > 0) {
            setLoading(true)
            surveyService.getQuestionAnswerById(appSiteId, siteSurveyId, surveyStepId, stepQuestionId, questionAnswerId)
                .then(_questionAnswer => {                    
                    setLoading(false)
                    setQuestionAnswer(_questionAnswer)                    
                });
        }         
    }, [appSiteId, siteSurveyId, surveyStepId, stepQuestionId, questionAnswerId])
    
    const onSubmit = () => {
        if (questionAnswerId > 0) updateQuestionAnswer();
        else createQuestionAnswer();                    
    }    

    const tiny_image_upload_handler = (blobInfo, success, failure, progress) => {
        const fileName = (questionAnswer.appSiteId + '/' || '') + new Date().getTime() + '.jpeg'; 
        fetchWrapper.postFile(`${baseUrl}/CloudUpload`, blobInfo.blob(), fileName)
            .then((result) => {
                success(`${baseImageUrl}${result.fileName}`);                
            });         
      };                  

    const createQuestionAnswer = () => {
        surveyService.createQuestionAnswer({ questionAnswer: questionAnswer })
            .then(result => {
                if (result.hasErrors) 
                    alertService.error('Problemi durante il salvataggio', { keepAfterRouteChange: true });
                else 
                    alertService.success('Salvataggio riuscito con successo', { keepAfterRouteChange: true });                     
                
                if (handleSaved)    
                    handleSaved(questionAnswer.appSiteId);                
            })
            .catch(error => alertService.error(error));
    }

    const updateQuestionAnswer = () => {
        surveyService.updateQuestionAnswer({ questionAnswer: questionAnswer })
            .then(result => {
                if (result.hasErrors) 
                    alertService.error('Problemi durante il salvataggio', { keepAfterRouteChange: true });
                else 
                    alertService.success('Aggiornamento riuscito', { keepAfterRouteChange: true });
                
                if (handleSaved)                                
                    handleSaved(questionAnswer.appSiteId);                
            })
            .catch(error => alertService.error(error));
    }

    return (            
        <>
        <Card>                
            <Card.Body>                    
                {loading && 
                <div className="text-center mart2">
                    <ProgressBar animated now={100} />
                </div>}
                <Form onSubmit={onSubmit}>
                    <Form.Group>
                        <Form.Label>Posizione Risposta</Form.Label>
                        <input type="number" className="form-control focus:ring-2 focus:ring-blue-600" name="position" value={questionAnswer.position} onChange={handleChangeNumber} />
                        <Form.Text className="text-muted">
                            Ogni domanda può essere avere una o più risposte: la posizione serve per assegnare un ordine alle risposte.
                        </Form.Text>
                    </Form.Group>              
                    <Form.Group>                            
                        {!loading && 
                        <AnswerTypeSelect label='Tipo Risposta' answerType={questionAnswer.answerType} onChange={(value) => handleChangeAnswerType(value)} />}
                        <Form.Text className="text-muted">
                            {questionAnswer.answerType === 1 && <p>Una risposta di <b>testo</b> propone una scelta</p>}
                            {questionAnswer.answerType === 2 && <p>Una risposta di tipo <b>numero</b> permette di inserire un valore compreso nell'intervallo selezionato</p>}
                            {questionAnswer.answerType === 3 && <p>Una risposta di tipo <b>upload</b> permette di inviare un file.</p>}
                            {questionAnswer.answerType === 4 && <p>Una risposta di tipo <b>prodotto</b> permette di selezionare un prodotto da quelli disponibili.</p>}
                        </Form.Text>
                    </Form.Group>    
                    {!loading && languageCode == '' && questionAnswer && questionAnswer.answerType === 1 && 
                    <div>
                        <label>Risposta</label>
                        <div>
                            <Editor
                                apiKey={process.env.REACT_APP_TINTMCE_KEY}
                                initialValue={questionAnswer.answerText}      
                                inline={false}                          
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
                    </div>}                                        
                    {questionAnswer && questionAnswer.answerType === 2 &&                         
                    <div className="flex space-x-2">
                        <Form.Group>
                            <Form.Label>Valore minimo</Form.Label>
                            <input type="number" className="form-control focus:ring-2 focus:ring-blue-600" name="minValue" value={questionAnswer.minValue} onChange={handleChangeNumber} />
                            <Form.Text className="text-muted">
                                Valore numerico minimo per  la risposta.
                            </Form.Text>
                        </Form.Group>      
                        <Form.Group>
                            <Form.Label>Valore massimo</Form.Label>
                            <input type="number" className="form-control focus:ring-2 focus:ring-blue-600" name="maxValue" value={questionAnswer.maxValue} onChange={handleChangeNumber} />
                            <Form.Text className="text-muted">
                                Valore numerico massimo per la risposta.
                            </Form.Text>
                        </Form.Group>                              
                    </div>}

                    {questionAnswer && questionAnswer.answerType === 4 &&
                    <>
                        <div>
                            <label>Prodotto</label>
                            <SiteProductPreview 
                                appSiteId={questionAnswer.appSiteId} 
                                siteProductId={questionAnswer.siteProductId}
                                onChange={handleSiteProductId} />                   
                        </div>                        
                    </>}
                    
                    {questionAnswer && (questionAnswer.answerType === 1 || questionAnswer.answerType === 4) &&
                    <div className="flex space-x-2">
                        <Form.Group className='flex-1'>
                            <Form.Label>Quantità minima</Form.Label>
                            <input type="number" className="form-control focus:ring-2 focus:ring-blue-600" name="minValue" value={questionAnswer.minValue} onChange={handleChangeNumber} />
                            <Form.Text className="text-muted">
                                Numero minimo per selezione prodotto.
                            </Form.Text>
                        </Form.Group>      
                        <Form.Group className='flex-1'>
                            <Form.Label>Quantità massima</Form.Label>
                            <input type="number" className="form-control focus:ring-2 focus:ring-blue-600" name="maxValue" value={questionAnswer.maxValue} onChange={handleChangeNumber} />
                            <Form.Text className="text-muted">
                                Numero massimo per selezione prodotto.
                            </Form.Text>
                        </Form.Group>                              
                    </div>}

                    <div className='mt-2'>
                        <label>Prossimo step</label>
                        <SurveyStepSelect 
                            appSiteId={questionAnswer.appSiteId} 
                            siteSurveyId={questionAnswer.siteSurveyId}
                            surveyStepId={questionAnswer.nextStepId}
                            onChange={handleNextStepId} />                   
                            <Form.Text className="text-muted">
                                Selezionando lo step successivo la risposta avanza automaticamente senza dover cliccare su 'continua'
                            </Form.Text>
                    </div>
                    {questionAnswer.nextStepId && 
                    <div>
                        <label>Prossimo domanda</label>
                        <StepQuestionSelect 
                            appSiteId={questionAnswer.appSiteId} 
                            siteSurveyId={questionAnswer.siteSurveyId}
                            surveyStepId={questionAnswer.nextStepId}
                            stepQuestionId={questionAnswer.nextQuestionId}
                            onChange={handleNextQuestionId} />                   
                    </div>}
                    <div className="flex space-x-5">
                        <Form.Group className="mart2">
                            <Form.Check type="checkbox" label="Commenti" name="withComment" checked={questionAnswer.withComment} onChange={handleChangeBool} />
                            <Form.Text>
                                Commenti dell'utente: selezionare per permettere ad utente di inserire del testo nella risposta.
                            </Form.Text>
                        </Form.Group>      
                        <Form.Group className="mart2">
                            <Form.Check type="checkbox" label="Fine percorso" name="endSurvey" checked={questionAnswer.endSurvey} onChange={handleChangeBool} />
                            <Form.Text>
                                Selezionare fine percorso se la risposta conclude il percorso.
                            </Form.Text>
                        </Form.Group>                                               
                    </div>
                    <Form.Group>
                        <Form.Label>Note</Form.Label>
                        <input type="text" className="form-control focus:ring-2 focus:ring-blue-600" name="answerNote" value={questionAnswer.answerNote} onChange={handleChange} maxLength={200} />
                        <Form.Text className="text-muted">s
                            Note visualizzate nel fondo dello risposta: utilizzare per aiutare nella scelta di utente.
                        </Form.Text>
                    </Form.Group>    
                    {questionAnswer && questionAnswer.answerType !== 4 &&
                    <div className="flex flex-col space-x-2 mart2">
                        <Form.Label className="font-bold">Immagine</Form.Label>
                        {questionAnswer.imageUrl &&
                        <Image className="w-32" src={baseImageUrl+questionAnswer.imageUrl} fluid />}
                        <Uploader prefix={questionAnswer.appSiteId} fileName={questionAnswer.imageUrl} onFileNameChange={handleFileName} />      
                        <small>Utilizzare immagini ottimizzate per un caricamento rapido.</small>
                        <Button onClick={() => handleFieldRemove('imageUrl')} className="mt-2 bg-red-400">
                                Rimuovi immagine
                        </Button>        
                    </div>}                                 
                    {questionAnswer && !loading && 
                    <Form.Group className="flex flex-col mt-2">
                        <Form.Label className="font-bold">Colore di Sfondo</Form.Label>
                        <div className="flex flex-col md:flex:row">                            
                            <div className="flex-none m-2 mt-0">
                                <CompactPicker                                        
                                    color={ questionAnswer.boxColor }
                                    onChangeComplete={ (color) => handleColorChange(color) } />
                            </div>                                
                            <div className="flex-grow m-2">
                                <SliderPicker
                                    color={ questionAnswer.boxColor }
                                    onChangeComplete={ (color) => handleColorChange(color) } />
                            </div>                                                                                                    
                        </div>                            
                        <Form.Text className="text-muted">
                            Colore di sfondo per i contenitori di testo. Attenzione scegliere colori contrastanti tra sfondo e testo per una buona leggibilità dei contenuti.
                        </Form.Text>
                    </Form.Group>}    
                    
                    {questionAnswer && questionAnswer.answerType !== 4 &&
                    <Form.Group>
                        <Form.Label>Prezzo Risposta</Form.Label>
                        <input type="number" inputMode="decimal" className="form-control focus:ring-2 focus:ring-blue-600" name="price" value={questionAnswer.price} onChange={handleChangeNumber} />
                        <Form.Text className="text-muted">
                            Assegnare un prezzo valido per la risposta: se utente seleziona la risposta viene aggiunto il valore al totale finale del percorso.
                            In caso di selezione prodotto viene utilizzato il prezzo del prodotto.
                        </Form.Text>
                    </Form.Group>}
                </Form>

            </Card.Body>    
            <Card.Footer>
                <Button onClick={onSubmit} variant="success" className='bg-green-500 text-white border-0 hover:bg-green-400'>
                    Salva le modifiche
                </Button> 
            </Card.Footer>
        </Card>                    
        </>          
    );    
}

export { QuestionAnswerAddEdit }