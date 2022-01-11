import React from 'react';
import { surveyService, alertService } from '../../../../_services';
import { LanguageEditor } from '../../../../_components'
import { Form, Button, Card, ProgressBar } from 'react-bootstrap';
import { CompactPicker,SliderPicker } from 'react-color';
import { Editor } from "@tinymce/tinymce-react";
import {menuSettings,pluginsSettings,toolbarSettings,fontSettings,styleSettings } from '../../../../_helpers/tinySettings';
import { fetchWrapper } from '../../../../_helpers/fetch-wrapper';

const baseUrl = `${process.env.REACT_APP_API_URL}/upload`;
const baseImageUrl = `${process.env.REACT_APP_STORAGE_URL}/`;

class SurveyStepAddEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {   
            surveyStep: {
                appSiteId: this.props.appSiteId,         
                siteSurveyId: this.props.siteSurveyId,
                surveyStepId: this.props.surveyStepId,
                position: 1,
                description: '',
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
            surveyStep: {
                ...this.state.surveyStep,
                [evt.target.name]: value
            }          
        });
    }
    
    handleChangeNumber(evt) {
        const value = +evt.target.value;
        this.setState({
            surveyStep: {
                ...this.state.surveyStep,
                [evt.target.name]: value                
            }          
        });
    }

    handleChangeBool(evt) {  
        this.setState({
            surveyStep: {
                ...this.state.surveyStep,
                [evt.target.name]: evt.target.checked                 
            }          
        });
    }

    handleColorChange = (color) => {
        this.setState({
            surveyStep: {
                ...this.state.surveyStep,
                boxColor: color.hex                 
            }          
        });
        //this.setState({ background: color.hex });
    };

    handleEditorChange = (content, editor) => {
        this.setState({
            surveyStep: {
                ...this.state.surveyStep,
                description: content                 
            }          
        });
    }

    handleOpen() {    
        if (this.props.surveyStepId > 0) {
            this.setState({loading: true})
            surveyService.getSurveyStepById(this.props.appSiteId, this.props.siteSurveyId, this.props.surveyStepId)
                .then(_surveyStep => {                    
                    this.setState({
                        surveyStep: _surveyStep,
                        loading: false
                    })                    
                });
        }         
    }
    
    onSubmit = () => {
        if (this.props.surveyStepId > 0) {
            this.updateSurveyStep();
        } else {
            this.createSurveyStep();            
        }
    }

    tiny_image_upload_handler = (blobInfo, success, failure, progress) => {
        const fileName = (this.state.surveyStep.appSiteId + '/' || '') + new Date().getTime() + '.jpeg';
    
        // Request made to the backend api 
        // Send formData object 
        fetchWrapper.postFile(`${baseUrl}/CloudUpload`, blobInfo.blob(), fileName)
            .then((result) => {
                success(`${baseImageUrl}${result.fileName}`);                
            });         
      };                  

    createSurveyStep() {
        surveyService.createSurveyStep({ surveyStep: this.state.surveyStep })
            .then(result => {
                if (result.hasErrors) {
                    alertService.error('Problemi durante il salvataggio', { keepAfterRouteChange: true });
                } else {
                    alertService.success('Salvataggio riuscito con successo', { keepAfterRouteChange: true });
                }            
                if (this.props.handleSaved)    
                    this.props.handleSaved(this.state.surveyStep.appSiteId);                
            })
            .catch(error => {
                alertService.error(error);
            });
    }

    updateSurveyStep() {
        surveyService.updateSurveyStep({ surveyStep: this.state.surveyStep })
            .then(result => {
                if (result.hasErrors) {
                    alertService.error('Problemi durante il salvataggio', { keepAfterRouteChange: true });
                } else {
                    alertService.success('Aggiornamento riuscito', { keepAfterRouteChange: true });
                }    
                if (this.props.handleSaved)                                
                    this.props.handleSaved(this.state.surveyStep.appSiteId);                
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
                            <Form.Label>Posizione Step</Form.Label>
                            <input type="number" className="form-control focus:ring-2 focus:ring-blue-600" name="position" value={this.state.surveyStep.position} onChange={this.handleChangeNumber} />
                            <Form.Text className="text-muted">
                                Ogni percorso è formato da vari step: la posizione serve per assegnare un ordine ai vari passaggi.
                            </Form.Text>
                        </Form.Group>   

                        {!this.state.loading && this.state.languageCode == '' &&
                            <div>
                                <label>Descrizione</label>
                                <div>
                                    <Editor
                                        apiKey={process.env.REACT_APP_TINTMCE_KEY}
                                        initialValue={this.state.surveyStep.description}      
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

                        {this.state.languageCode && this.state.languageCode !== '' &&
                        <div>
                            <LanguageEditor 
                                originalText={this.state.surveyStep.description}
                                appSiteId={this.state.surveyStep.appSiteId} 
                                code={this.state.languageCode}
                                inline={true}
                                labelKey={`SURVEYSTEP_${this.state.surveyStep.appSiteId}_${this.state.surveyStep.siteSurveyId}-${this.state.surveyStep.surveyStepId}-Description`}>                                    
                            </LanguageEditor>
                        </div>}

                        {/* <Form.Group>
                            <Form.Label>Descrizione</Form.Label>
                            <input type="text" className="form-control" name="description" value={this.state.surveyStep.description} onChange={this.handleChange} maxLength={200} />
                            <Form.Text className="text-muted">
                                La descrizione viene mostrata nello step e serve per presentare il passaggio.
                            </Form.Text>
                        </Form.Group>                 */}
                        {this.state.surveyStep && !this.state.loading && 
                        <Form.Group>
                            <div className="flex flex-col md:flex:row">                            
                                <div className="flex-none m-2 mt-0">
                                    <CompactPicker                                        
                                        color={ this.state.surveyStep.boxColor }
                                        onChangeComplete={ (color) => this.handleColorChange(color) } />
                                </div>                                
                                <div className="flex-grow m-2">
                                    <SliderPicker
                                        color={ this.state.surveyStep.boxColor }
                                        onChangeComplete={ (color) => this.handleColorChange(color) } />
                                </div>                                                                                                    
                            </div>
                            <Form.Text className="text-muted">
                                Colore di sfondo per i contenitori di testo. Attenzione scegliere colori contrastanti tra sfondo e testo per una buona leggibilità dei contenuti.
                            </Form.Text>
                        </Form.Group>}    
                        <Form.Group>
                            <Form.Label>Prezzo Step</Form.Label>
                            <input 
                                type="number" 
                                inputMode="decimal"
                                className="form-control focus:ring-2 focus:ring-blue-600" 
                                name="price" 
                                value={this.state.surveyStep.price} onChange={this.handleChangeNumber} />
                            <Form.Text className="text-muted">
                                Assegnare un prezzo valido per lo Step. 
                            </Form.Text>
                        </Form.Group>                                              
                    </Form>
                    
                </Card.Body>    
                <Card.Footer>
                    <Button onClick={this.onSubmit} variant="success">
                        Salva le modifiche
                    </Button> 
                </Card.Footer>
            </Card>                    
          </>          
        );
    }
}

export { SurveyStepAddEdit }