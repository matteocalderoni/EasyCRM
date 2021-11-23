import React from 'react';
import { surveyService, alertService } from '../../../../../../_services';
import { Form, Button, Card, ProgressBar } from 'react-bootstrap'
import { AnswerTypeSelect } from '../../../../../../_components/AnswerTypeSelect'
import { CompactPicker } from 'react-color';
import { Editor } from "@tinymce/tinymce-react";
import {menuSettings,pluginsSettings,toolbarSettings,fontSettings,styleSettings } from '../../../../../../_helpers/tinySettings';
import { fetchWrapper } from '../../../../../../_helpers/fetch-wrapper';

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
        const value = parseInt(evt.target.value);
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
                            <Form.Label>Tipo Risposta</Form.Label>
                            <AnswerTypeSelect value={this.state.questionAnswer.answerType} onChange={(value) => this.handleChangeAnswerType(value)} />
                            <Form.Text className="text-muted">
                                Una risposta di testo propone una scelta, una di numero un valore compreso nell'intervallo selezionato.
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
                        {this.state.questionAnswer && !this.state.loading && 
                        <Form.Group>
                            <CompactPicker
                                color={ this.state.questionAnswer.boxColor }
                                onChangeComplete={ this.handleColorChange }
                            />
                            <Form.Text className="text-muted">
                                Colore di sfondo per i contenitori di testo. Attenzione scegliere colori contrastanti tra sfondo e testo per una buona leggibilità dei contenuti.
                            </Form.Text>
                        </Form.Group>}    
                        <Form.Group>
                            <Form.Label>Prezzo Risposta</Form.Label>
                            <input type="number" className="form-control focus:ring-2 focus:ring-blue-600" name="price" value={this.state.questionAnswer.price} onChange={this.handleChangeNumber} />
                            <Form.Text className="text-muted">
                                Assegnare un prezzo valido per la risposta: : se utente risponde/seleziona la risposta viene aggiunto il valore al totale finale del percorso. . 
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

export { QuestionAnswerAddEdit }