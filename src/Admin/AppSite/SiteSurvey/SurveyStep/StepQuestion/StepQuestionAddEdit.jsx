import React from 'react';
import { surveyService, alertService } from '../../../../../_services';
import { Form, Button, Card, ProgressBar } from 'react-bootstrap'
import { QuestionStyleSelect } from '../../../../../_components/QuestionStyleSelect'
import { CompactPicker,SliderPicker } from 'react-color';
import { Editor } from "@tinymce/tinymce-react";
import {menuSettings,pluginsSettings,toolbarSettings,fontSettings,styleSettings } from '../../../../../_helpers/tinySettings';
import { fetchWrapper } from '../../../../../_helpers/fetch-wrapper';

const baseUrl = `${process.env.REACT_APP_API_URL}/upload`;
const baseImageUrl = `${process.env.REACT_APP_STORAGE_URL}/`;

class StepQuestionAddEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {   
            stepQuestion: {
                appSiteId: this.props.appSiteId,         
                siteSurveyId: this.props.siteSurveyId,
                surveyStepId: this.props.surveyStepId,
                stepQuestionId: this.props.stepQuestionId,
                questionStyle: 2,
                position: 1,
                questionText: '', 
                multipleChoice: false,
                minAnswers: 1,
                maxAnswers: 1,
                withComment: false,
                isOptional: false,
                questionNote: '',
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
            stepQuestion: {
                ...this.state.stepQuestion,
                [evt.target.name]: value
            }          
        });
    }
    
    handleChangeNumber(evt) {
        const value = +evt.target.value;
        this.setState({
            stepQuestion: {
                ...this.state.stepQuestion,
                [evt.target.name]: value                
            }          
        });
    }

    handleChangeBool(evt) {  
        this.setState({
            stepQuestion: {
                ...this.state.stepQuestion,
                [evt.target.name]: evt.target.checked                 
            }          
        });
    }

    handleChangeQuestionStyle(value) {  
        this.setState({
            stepQuestion: {
                ...this.state.stepQuestion,
                questionStyle: value                 
            }          
        });
    }

    handleColorChange = (color) => {
        this.setState({
            stepQuestion: {
                ...this.state.stepQuestion,
                boxColor: color.hex                 
            }          
        });
        //this.setState({ background: color.hex });
    };

    handleEditorChange = (content, editor) => {
        this.setState({
            stepQuestion: {
                ...this.state.stepQuestion,
                questionText: content                 
            }          
        });
    }

    handleNoteEditorChange = (content, editor) => {
        this.setState({
            stepQuestion: {
                ...this.state.stepQuestion,
                questionNote: content                 
            }          
        });
    }

    handleOpen() {    
        if (this.props.stepQuestionId > 0) {
            this.setState({loading: true})
            surveyService.getStepQuestionById(this.props.appSiteId, this.props.siteSurveyId, this.props.surveyStepId, this.props.stepQuestionId)
                .then(_stepQuestion => {                    
                    this.setState({
                        stepQuestion: _stepQuestion,
                        loading: false
                    })                    
                });
        }         
    }
    
    onSubmit = () => {
        if (this.props.stepQuestionId > 0) {
            this.updateStepQuestion();
        } else {
            this.createStepQuestion();            
        }
    }

    tiny_image_upload_handler = (blobInfo, success, failure, progress) => {
        const fileName = (this.state.stepQuestion.appSiteId + '/' || '') + new Date().getTime() + '.jpeg';
    
        // Request made to the backend api 
        // Send formData object 
        fetchWrapper.postFile(`${baseUrl}/CloudUpload`, blobInfo.blob(), fileName)
            .then((result) => {
                success(`${baseImageUrl}${result.fileName}`);                
            });         
      };                  

    createStepQuestion() {
        surveyService.createStepQuestion({ stepQuestion: this.state.stepQuestion })
            .then(result => {
                if (result.hasErrors) {
                    alertService.error('Problemi durante il salvataggio', { keepAfterRouteChange: true });
                } else {
                    alertService.success('Salvataggio riuscito con successo', { keepAfterRouteChange: true });
                }            
                if (this.props.handleSaved)    
                    this.props.handleSaved(this.state.stepQuestion.appSiteId);                
            })
            .catch(error => {
                alertService.error(error);
            });
    }

    updateStepQuestion() {
        surveyService.updateStepQuestion({ stepQuestion: this.state.stepQuestion })
            .then(result => {
                if (result.hasErrors) {
                    alertService.error('Problemi durante il salvataggio', { keepAfterRouteChange: true });
                } else {
                    alertService.success('Aggiornamento riuscito', { keepAfterRouteChange: true });
                }    
                if (this.props.handleSaved)                                
                    this.props.handleSaved(this.state.stepQuestion.appSiteId);                
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
                            <Form.Label>Posizione Domanda</Form.Label>
                            <input type="number" className="form-control focus:ring-2 focus:ring-blue-600" name="position" value={this.state.stepQuestion.position} onChange={this.handleChangeNumber} />
                            <Form.Text className="text-muted">
                                Ogni step può essere formato da varie domande: la posizione serve per assegnare un ordine.
                            </Form.Text>
                        </Form.Group>                                                        
                        {!this.state.loading && this.state.languageCode == '' &&
                        <div>
                            <label>Domanda</label>
                            <div>
                                <Editor
                                    apiKey={process.env.REACT_APP_TINTMCE_KEY}
                                    initialValue={this.state.stepQuestion.questionText}      
                                    inline={false}                          
                                    init={{
                                        height: 200,
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
                        </div>}

                        {this.state.stepQuestion && !this.state.loading && 
                        <Form.Group>
                            <Form.Label>Tipo Risposta</Form.Label>
                            <QuestionStyleSelect value={this.state.stepQuestion.questionStyle} onChange={(value) => this.handleChangeQuestionStyle(value)} />
                            <Form.Text className="text-muted">
                                Bottone per scelta con passaggio domanda successiva o elenco con selezione tramite checkbox.
                            </Form.Text>
                        </Form.Group>}
                        <div className="flex space-x-2">
                            <Form.Group className='flex-1'>
                                <Form.Label>Numero minimo di risposte</Form.Label>
                                <input type="number" className="form-control focus:ring-2 focus:ring-blue-600" name="minAnswers" value={this.state.stepQuestion.minAnswers} onChange={this.handleChangeNumber} />
                                <Form.Text className="text-muted">
                                    Per  domanda opzionale impostare 0 altrimenti almeno 1.
                                </Form.Text>
                            </Form.Group>      
                            <Form.Group className='flex-1'>
                                <Form.Label>Numero massimo di risposte</Form.Label>
                                <input type="number" className="form-control focus:ring-2 focus:ring-blue-600" name="maxAnswers" value={this.state.stepQuestion.maxAnswers} onChange={this.handleChangeNumber} />
                                <Form.Text className="text-muted">
                                    Deve essere maggiore di minimo (lasciare a 0 per non utilizzare).
                                </Form.Text>
                            </Form.Group>      
                        </div>
                        <div className="flex space-x-5">
                            <Form.Group className="flex-1 mart2">
                                <Form.Check type="checkbox" label="Scelta multipla" name="multipleChoice" checked={this.state.stepQuestion.multipleChoice} onChange={this.handleChangeBool} />
                                <Form.Text>
                                    Scelta multipla.
                                </Form.Text>
                            </Form.Group>           
                            <Form.Group className="flex-1 mart2">
                                <Form.Check type="checkbox" label="Commenti" name="withComment" checked={this.state.stepQuestion.withComment} onChange={this.handleChangeBool} />
                                <Form.Text>
                                    Commenti dell'utente.
                                </Form.Text>
                            </Form.Group>                                               
                            <Form.Group className="flex-1 mart2">
                                <Form.Check type="checkbox" label="Opzionale" name="isOptional" checked={this.state.stepQuestion.isOptional} onChange={this.handleChangeBool} />
                                <Form.Text>
                                    Opzionale.
                                </Form.Text>
                            </Form.Group>                                               
                        </div>
                        {!this.state.loading && this.state.languageCode == '' &&
                            <div>
                                <label>Note Aggiuntive</label>
                                <div>
                                    <Editor
                                        apiKey={process.env.REACT_APP_TINTMCE_KEY}
                                        initialValue={this.state.stepQuestion.questionNote}      
                                        inline={false}                          
                                        init={{
                                            height: 200,
                                            menubar: menuSettings,
                                            plugins: pluginsSettings,
                                            toolbar: toolbarSettings,
                                            font_formats: fontSettings,
                                            content_style: styleSettings,
                                            images_upload_handler: this.tiny_image_upload_handler
                                        }}
                                        onEditorChange={this.handleNoteEditorChange}
                                    />
                                </div>
                            </div>
                        }
                        {this.state.stepQuestion && !this.state.loading && 
                        <Form.Group>
                            <div className="flex flex-col md:flex:row">                            
                                <div className="flex-none m-2 mt-0">
                                    <CompactPicker                                        
                                        color={ this.state.stepQuestion.boxColor }
                                        onChangeComplete={ (color) => this.handleColorChange(color) } />
                                </div>                                
                                <div className="flex-grow m-2">
                                    <SliderPicker
                                        color={ this.state.stepQuestion.boxColor }
                                        onChangeComplete={ (color) => this.handleColorChange(color) } />
                                </div>                                                                                                    
                            </div>                            
                            <Form.Text className="text-muted">
                                Colore di sfondo per i contenitori di testo. Attenzione scegliere colori contrastanti tra sfondo e testo per una buona leggibilità dei contenuti.
                            </Form.Text>
                        </Form.Group>}    
                        <Form.Group>
                            <Form.Label>Prezzo Domanda</Form.Label>
                            <input type="number" inputMode="decimal" className="form-control focus:ring-2 focus:ring-blue-600" name="price" value={this.state.stepQuestion.price} onChange={this.handleChangeNumber} />
                            <Form.Text className="text-muted">
                                Assegnare un prezzo valido per tutta la domanda: se utente risponde/seleziona la domanda viene aggiunto il valore al totale finale del percorso. 
                            </Form.Text>
                        </Form.Group>
                    </Form>

                </Card.Body>    
                <Card.Footer>
                    <Button onClick={this.onSubmit} variant="success" className='bg-green-500'>
                        Salva le modifiche
                    </Button> 
                </Card.Footer>
            </Card>                    
          </>          
        );
    }
}

export { StepQuestionAddEdit }