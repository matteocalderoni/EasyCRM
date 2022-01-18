import React from 'react';
import { surveyService, alertService } from '../../../../../../_services';
import { Form, Button, Card, ProgressBar, Image } from 'react-bootstrap'
import { Uploader } from '../../../../../../_components';
import { AnswerTypeSelect } from '../../../../../../_components/AnswerTypeSelect'
import { CompactPicker,SliderPicker } from 'react-color';
import { Editor } from "@tinymce/tinymce-react";
import {menuSettings,pluginsSettings,toolbarSettings,fontSettings,styleSettings } from '../../../../../../_helpers/tinySettings';
import { fetchWrapper } from '../../../../../../_helpers/fetch-wrapper';
import { SiteProductPreview } from '../../../../../../_components/SiteProductPreview';

const baseUrl = `${process.env.REACT_APP_API_URL}/upload`;
const baseImageUrl = `${process.env.REACT_APP_STORAGE_URL}/`;

class QuestionAnswerAddEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {   
            questionAnswer: {
                appSiteId: this.props.appSiteId,         
                siteSurveyId: this.props.siteSurveyId,
                surveyStepId: this.props.surveyStepId,
                stepQuestionId: this.props.stepQuestionId,
                questionAnswerId: this.props.questionAnswerId,                
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
            },
            loading: false,
            languageCode: ''                                                  
         };

        this.handleChange = this.handleChange.bind(this)
        this.handleChangeNumber = this.handleChangeNumber.bind(this)
        this.handleChangeBool = this.handleChangeBool.bind(this)
    }

    componentDidMount() {
        this.handleOpen()
    }

    handleChange(evt) {
        const value = evt.target.value;
        this.setState({
            questionAnswer: {
                ...this.state.questionAnswer,
                [evt.target.name]: value
            }          
        });
    }
    
    handleChangeNumber(evt) {
        const value = +evt.target.value;
        this.setState({
            questionAnswer: {
                ...this.state.questionAnswer,
                [evt.target.name]: value                
            }          
        });
    }

    handleChangeBool(evt) {  
        this.setState({
            questionAnswer: {
                ...this.state.questionAnswer,
                [evt.target.name]: evt.target.checked                 
            }          
        });
    }
    
    handleChangeAnswerType(value) {  
        this.setState({
            questionAnswer: {
                ...this.state.questionAnswer,
                answerType: value                 
            }          
        });
    }

    handleColorChange = (color) => {
        this.setState({
            questionAnswer: {
                ...this.state.questionAnswer,
                boxColor: color.hex                 
            }          
        });
        //this.setState({ background: color.hex });
    };

    handleEditorChange = (content, editor) => {
        this.setState({
            questionAnswer: {
                ...this.state.questionAnswer,
                answerText: content                 
            }          
        });
    }

    handleFieldReset = (field) => {
        this.setState({
            questionAnswer: {
                ...this.state.questionAnswer,
                [field]: ''                 
            }          
        });
    }

    handleOpen() {    
        if (this.props.questionAnswerId > 0) {
            this.setState({loading: true})
            surveyService.getQuestionAnswerById(this.props.appSiteId, this.props.siteSurveyId, this.props.surveyStepId, this.props.stepQuestionId, this.props.questionAnswerId)
                .then(_questionAnswer => {                    
                    this.setState({
                        questionAnswer: _questionAnswer,
                        loading: false
                    })                    
                });
        }         
    }
    
    onSubmit = () => {
        if (this.props.questionAnswerId > 0) {
            this.updateQuestionAnswer();
        } else {
            this.createQuestionAnswer();            
        }
    }

    handleFileName = (fileName) => {        
        this.setState({ 
            questionAnswer: {
                ...this.state.questionAnswer,
                imageUrl: fileName
            }
        });        
    }

    handleFieldRemove = (field) => {
        this.setState({
            questionAnswer: {
                ...this.state.questionAnswer,
                [field]: ''                 
            }          
        });
    }

    handleSiteProductId = (_siteProductId) => {        
        this.setState({ 
            questionAnswer: {
                ...this.state.questionAnswer,
                siteProductId: _siteProductId 
            }
        });        
    }

    tiny_image_upload_handler = (blobInfo, success, failure, progress) => {
        const fileName = (this.state.questionAnswer.appSiteId + '/' || '') + new Date().getTime() + '.jpeg';
    
        // Request made to the backend api 
        // Send formData object 
        fetchWrapper.postFile(`${baseUrl}/CloudUpload`, blobInfo.blob(), fileName)
            .then((result) => {
                success(`${baseImageUrl}${result.fileName}`);                
            });         
      };                  

    createQuestionAnswer() {
        surveyService.createQuestionAnswer({ questionAnswer: this.state.questionAnswer })
            .then(result => {
                if (result.hasErrors) {
                    alertService.error('Problemi durante il salvataggio', { keepAfterRouteChange: true });
                } else {
                    alertService.success('Salvataggio riuscito con successo', { keepAfterRouteChange: true });
                }            
                if (this.props.handleSaved)    
                    this.props.handleSaved(this.state.questionAnswer.appSiteId);                
            })
            .catch(error => {
                alertService.error(error);
            });
    }

    updateQuestionAnswer() {
        surveyService.updateQuestionAnswer({ questionAnswer: this.state.questionAnswer })
            .then(result => {
                if (result.hasErrors) {
                    alertService.error('Problemi durante il salvataggio', { keepAfterRouteChange: true });
                } else {
                    alertService.success('Aggiornamento riuscito', { keepAfterRouteChange: true });
                }    
                if (this.props.handleSaved)                                
                    this.props.handleSaved(this.state.questionAnswer.appSiteId);                
            })
            .catch(error => {
                alertService.error(error);
            });
    }

    render() {
        return (            
          <>
            <Card>                
                <Card.Body>                    
                    {this.state.loading && <div className="text-center mart2">
                        <ProgressBar animated now={100} />
                    </div>}
                    <Form onSubmit={this.onSubmit}>
                        <Form.Group>
                            <Form.Label>Posizione Risposta</Form.Label>
                            <input type="number" className="form-control focus:ring-2 focus:ring-blue-600" name="position" value={this.state.questionAnswer.position} onChange={this.handleChangeNumber} />
                            <Form.Text className="text-muted">
                                Ogni domanda può essere avere una o più risposte: la posizione serve per assegnare un ordine.
                            </Form.Text>
                        </Form.Group>              
                        <Form.Group>                            
                            {!this.state.loading && 
                            <AnswerTypeSelect label='Tipo Risposta' answerType={this.state.questionAnswer.answerType} onChange={(value) => this.handleChangeAnswerType(value)} />}
                            <Form.Text className="text-muted">
                                {this.state.questionAnswer.answerType === 1 && <p>Una risposta di <b>testo</b> propone una scelta</p>}
                                {this.state.questionAnswer.answerType === 2 && <p>Una risposta di tipo <b>numero</b> permette di inserire un valore compreso nell'intervallo selezionato</p>}
                                {this.state.questionAnswer.answerType === 3 && <p>Una risposta di tipo <b>upload</b> permette di inviare un file.</p>}
                                {this.state.questionAnswer.answerType === 4 && <p>Una risposta di tipo <b>prodotto</b> permette di selezionare un prodotto da quelli disponibili.</p>}
                            </Form.Text>
                        </Form.Group>    
                        {!this.state.loading && this.state.languageCode == '' &&
                            this.state.questionAnswer && this.state.questionAnswer.answerType === 1 && 
                            <div>
                                <label>Risposta</label>
                                <div>
                                    <Editor
                                        apiKey={process.env.REACT_APP_TINTMCE_KEY}
                                        initialValue={this.state.questionAnswer.answerText}      
                                        inline={false}                          
                                        init={{
                                            height: 500,
                                            menubar: menuSettings,
                                            plugins: pluginsSettings,
                                            toolbar: toolbarSettings,
                                            font_formats: fontSettings,
                                            content_style: styleSettings,
                                            images_upload_handler: this.tiny_image_upload_handler
                                        }}
                                        onEditorChange={this.handleEditorChange}
                                    />
                                </div>
                            </div>
                        }                                        
                        {this.state.questionAnswer && this.state.questionAnswer.answerType === 2 &&                         
                        <div className="flex space-x-2">
                            <Form.Group>
                                <Form.Label>Valore minimo</Form.Label>
                                <input type="number" className="form-control focus:ring-2 focus:ring-blue-600" name="minAnswers" value={this.state.questionAnswer.minAnswers} onChange={this.handleChangeNumber} />
                                <Form.Text className="text-muted">
                                    Valore numerico minimo per  la risposta.
                                </Form.Text>
                            </Form.Group>      
                            <Form.Group>
                                <Form.Label>Valore massimo</Form.Label>
                                <input type="number" className="form-control focus:ring-2 focus:ring-blue-600" name="maxAnswers" value={this.state.questionAnswer.maxAnswers} onChange={this.handleChangeNumber} />
                                <Form.Text className="text-muted">
                                    Valore numerico massimo per la risposta.
                                </Form.Text>
                            </Form.Group>                              
                        </div>}

                        {this.state.questionAnswer && this.state.questionAnswer.answerType === 4 &&
                        <div>
                            <label>Prodotto</label>
                            <SiteProductPreview 
                                appSiteId={this.state.questionAnswer.appSiteId} 
                                siteProductId={this.state.questionAnswer.siteProductId}
                                onChange={this.handleSiteProductId} />                   
                        </div>                            }
                        <div className="flex space-x-5">
                            <Form.Group className="mart2">
                                <Form.Check type="checkbox" label="Commenti" name="withComment" checked={this.state.questionAnswer.withComment} onChange={this.handleChangeBool} />
                                <Form.Text>
                                    Commenti dell'utente: selezionare per permettere ad utente di inserire del testo nella risposta.
                                </Form.Text>
                            </Form.Group>      
                            <Form.Group className="mart2">
                                <Form.Check type="checkbox" label="Fine percorso" name="endSurvey" checked={this.state.questionAnswer.endSurvey} onChange={this.handleChangeBool} />
                                <Form.Text>
                                    Selezionare fine percorso se la risposta conclude il percorso.
                                </Form.Text>
                            </Form.Group>                                               
                        </div>
                        <Form.Group>
                            <Form.Label>Note</Form.Label>
                            <input type="text" className="form-control focus:ring-2 focus:ring-blue-600" name="answerNote" value={this.state.questionAnswer.answerNote} onChange={this.handleChange} maxLength={200} />
                            <Form.Text className="text-muted">s
                                Note visualizzate nel fondo dello risposta: utilizzare per aiutare nella scelta di utente.
                            </Form.Text>
                        </Form.Group>    
                        {this.state.questionAnswer && this.state.questionAnswer.answerType !== 4 &&
                        <div className="flex flex-col space-x-2 mart2">
                            <Form.Label className="font-bold">Immagine</Form.Label>
                            {this.state.questionAnswer.imageUrl &&
                            <Image className="w-32" src={baseImageUrl+this.state.questionAnswer.imageUrl} fluid />}
                            <Uploader prefix={this.state.questionAnswer.appSiteId} fileName={this.state.questionAnswer.imageUrl} onFileNameChange={this.handleFileName} />      
                            <small>Utilizzare immagini ottimizzate per un caricamento rapido.</small>
                            <Button onClick={() => this.handleFieldRemove('imageUrl')} className="mt-2 bg-red-400">
                                    Rimuovi immagine
                            </Button>        
                        </div>}                                 
                        {this.state.questionAnswer && !this.state.loading && 
                        <Form.Group className="flex flex-col mt-2">
                            <Form.Label className="font-bold">Colore di Sfondo</Form.Label>
                            <div className="flex flex-col md:flex:row">                            
                                <div className="flex-none m-2 mt-0">
                                    <CompactPicker                                        
                                        color={ this.state.questionAnswer.boxColor }
                                        onChangeComplete={ (color) => this.handleColorChange(color) } />
                                </div>                                
                                <div className="flex-grow m-2">
                                    <SliderPicker
                                        color={ this.state.questionAnswer.boxColor }
                                        onChangeComplete={ (color) => this.handleColorChange(color) } />
                                </div>                                                                                                    
                            </div>                            
                            <Form.Text className="text-muted">
                                Colore di sfondo per i contenitori di testo. Attenzione scegliere colori contrastanti tra sfondo e testo per una buona leggibilità dei contenuti.
                            </Form.Text>
                        </Form.Group>}    
                        
                        {this.state.questionAnswer && this.state.questionAnswer.answerType !== 4 &&
                        <Form.Group>
                            <Form.Label>Prezzo Risposta</Form.Label>
                            <input type="number" inputMode="decimal" className="form-control focus:ring-2 focus:ring-blue-600" name="price" value={this.state.questionAnswer.price} onChange={this.handleChangeNumber} />
                            <Form.Text className="text-muted">
                                Assegnare un prezzo valido per la risposta: : se utente risponde/seleziona la risposta viene aggiunto il valore al totale finale del percorso. . 
                            </Form.Text>
                        </Form.Group>}
                    </Form>

                </Card.Body>    
                <Card.Footer>
                    <Button onClick={this.onSubmit} variant="success" className='bg-green-500 text-white border-0 hover:bg-green-400'>
                        Salva le modifiche
                    </Button> 
                </Card.Footer>
            </Card>                    
          </>          
        );
    }
}

export { QuestionAnswerAddEdit }