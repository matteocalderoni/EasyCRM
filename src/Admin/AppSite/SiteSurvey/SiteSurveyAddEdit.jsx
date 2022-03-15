import React from 'react';
import { surveyService, alertService } from '../../../_services';
import { Form, Button, Card, ProgressBar, Image } from 'react-bootstrap'
import { CompactPicker, SliderPicker } from 'react-color';
import { SurveyTypeSelect } from '../../../_components/SurveyTypeSelect';
import { Uploader } from '../../../_components'

const baseImageUrl = `${process.env.REACT_APP_STORAGE_URL}/`;

class SiteSurveyAddEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {   
            siteSurvey: {
                appSiteId: this.props.appSiteId,         
                siteSurveyId: this.props.siteSurveyId,
                imageUrl: 'logo.png',
                description: '',
                boxColor: '#FFFFFF',
                price: 0,
                minAnswers: 0,
                maxAnswers: 0                
            },
            loading: false                         
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
            siteSurvey: {
                ...this.state.siteSurvey,
                [evt.target.name]: value
            }          
        });
    }
    
    handleChangeNumber(evt) {
        const value = +evt.target.value;
        this.setState({
            siteSurvey: {
                ...this.state.siteSurvey,
                [evt.target.name]: value                
            }          
        });
    }

    handleChangeBool(evt) {  
        this.setState({
            siteSurvey: {
                ...this.state.siteSurvey,
                [evt.target.name]: evt.target.checked                 
            }          
        });
    }

    handleSurveyTypeChange(_surveyTypeId) {
        this.setState({
            siteSurvey: {
                ...this.state.siteSurvey,
                surveyTypeId: _surveyTypeId                 
            }          
        });
    }

    handleEditorChange = (content, editor) => {
        this.setState({
            siteSurvey: {
                ...this.state.siteSurvey,
                slideText: content                 
            }          
        });
    }

    handleColorChange = (color) => {
        this.setState({
            siteSurvey: {
                ...this.state.siteSurvey,
                boxColor: color.hex                 
            }          
        });
        //this.setState({ background: color.hex });
    };

    handleFileName = (fileName) => {        
        this.setState({ 
            siteSurvey: {
                ...this.state.siteSurvey,
                imageUrl: fileName
            }
        });        
    }

    handleFieldRemove = (field) => {
        this.setState({ 
            siteSurvey: {
                ...this.state.siteSurvey, 
                [field]: ''
            } 
        });
    }

    handleOpen() {    
        if (this.props.siteSurveyId > 0) {
            this.setState({loading: true})
            surveyService.getSiteSurveyById(this.props.appSiteId, this.props.siteSurveyId)
                .then(_siteSurvey => {                    
                    this.setState({
                        siteSurvey: _siteSurvey,
                        loading: false
                    })                    
                });
        }         
    }
    
    onSubmit = () => {
        if (this.props.siteSurveyId > 0) {
            this.updateSiteSurvey();
        } else {
            this.createSiteSurvey();            
        }
    }

    createSiteSurvey() {
        surveyService.createSiteSurvey({ siteSurvey: this.state.siteSurvey })
            .then(result => {
                if (result.hasErrors) {
                    alertService.error('Problemi durante il salvataggio', { keepAfterRouteChange: true });
                } else {
                    alertService.success('Salvataggio riuscito con successo', { keepAfterRouteChange: true });
                }            
                if (this.props.handleSaved)    
                    this.props.handleSaved(this.state.siteSurvey.appSiteId);                
            })
            .catch(error => {
                alertService.error(error);
            });
    }

    updateSiteSurvey() {
        surveyService.updateSiteSurvey({ siteSurvey: this.state.siteSurvey })
            .then(result => {
                if (result.hasErrors) {
                    alertService.error('Problemi durante il salvataggio', { keepAfterRouteChange: true });
                } else {
                    alertService.success('Aggiornamento riuscito', { keepAfterRouteChange: true });
                }    
                if (this.props.handleSaved)                                
                    this.props.handleSaved(this.state.siteSurvey.appSiteId);                
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
                    {!this.state.loading &&
                        <Form.Group className="md:ml-2">
                            <Form.Label className="text-xl">Tipo di <b>Percorso</b></Form.Label>
                            <SurveyTypeSelect pageType={this.state.siteSurvey.surveyType} onSurveyTypeChange={(surveyType) => this.handleSurveyTypeChange(+surveyType)} label={'Tipo di percorso'} />
                            <Form.Text className="text-muted">
                                Ci sono diversi tipi di pagina: default è per le pagine disponibili nel menù di navigazione, privacy per informativa e landing per pagine di 'approdo' (tramite collegamento).
                            </Form.Text>
                        </Form.Group>}
                        <Form.Group>
                            <Form.Label>Nome Percorso</Form.Label>
                            <input type="text" className="form-control focus:ring-2 focus:ring-blue-600" name="siteSurveyName" value={this.state.siteSurvey.siteSurveyName} onChange={this.handleChange} maxLength={200} />
                            <Form.Text className="text-muted">
                                I percorsi vengono utilizzati per creare dei tour all'interno di un contenitore. 
                                Assegnare un nome per la selezione nel contenitore della pagina.
                            </Form.Text>
                        </Form.Group>                                                        
                        <Form.Group>
                            <Form.Label>Descrizione</Form.Label>
                            <input type="text" className="form-control focus:ring-2 focus:ring-blue-600" name="description" value={this.state.siteSurvey.description} onChange={this.handleChange} maxLength={200} />
                            <Form.Text className="text-muted">
                                La descrizione viene mostrata nello step 0 (iniziale) del percorso e serve per presentare il prodotto agli utenti.
                            </Form.Text>
                        </Form.Group> 
                        {this.state.siteSurvey && !this.state.loading && <div className="text-center flex-1">
                            <Image className='w-48' src={baseImageUrl+this.state.siteSurvey.imageUrl} fluid />                    
                            <Uploader prefix={this.state.siteSurvey.appSiteId} fileName={this.state.siteSurvey.imageUrl} onFileNameChange={this.handleFileName} />      
                            <small>Utilizzare immagini con formato 640 X 640 px.</small>
                            <Button onClick={() => this.handleFieldRemove('imageUrl')} className="mt-2 bg-red-400">
                                    Rimuovi immagine
                            </Button>        
                        </div>}
                        {this.state.siteSurvey && !this.state.loading && 
                        <Form.Group className="flex flex-col">
                            <Form.Label className="text-xl">Colore di <b>Sfondo</b></Form.Label>
                            <div className="flex flex-col md:flex-row ml-2 mt-2">
                                <div className="flex-none m-2 mt-0">
                                    <CompactPicker                                        
                                        color={ this.state.siteSurvey.boxColor }
                                        onChangeComplete={ this.handleColorChange } />
                                </div>                                
                                <div className="flex-grow m-2">
                                    <SliderPicker
                                        color={ this.state.siteSurvey.boxColor }
                                        onChangeComplete={ this.handleColorChange } />
                                </div>
                            </div>
                            <Form.Text className="text-muted">
                                Colore di sfondo per i contenitori di testo. Attenzione scegliere colori contrastanti tra sfondo e testo per una buona leggibilità dei contenuti.
                            </Form.Text>
                        </Form.Group>}    
                        <Form.Group>
                            <Form.Label>Prezzo Percorso</Form.Label>
                            <input 
                                type="number" 
                                inputMode="decimal"
                                className="form-control focus:ring-2 focus:ring-blue-600" 
                                name="price" 
                                value={this.state.siteSurvey.price} onChange={this.handleChangeNumber} />
                            <Form.Text className="text-muted">
                                Assegnare un prezzo valido per tutto il percorso. 
                            </Form.Text>
                        </Form.Group>     

                        <div className='flex space-x-2'>
                            <Form.Group className='flex-1'>
                                <Form.Label>Risposte minime</Form.Label>
                                <input 
                                    type="number" 
                                    className="form-control focus:ring-2 focus:ring-blue-600" 
                                    name="minAnswers" 
                                    value={this.state.siteSurvey.minAnswers} onChange={this.handleChangeNumber} />
                                <Form.Text className="text-muted">
                                    Numero minino di risposte (utilizzare 0 per non impostare un limite minimo). 
                                </Form.Text>
                            </Form.Group>                                              
                            <Form.Group className='flex-1'>
                                <Form.Label>Risposte massime</Form.Label>
                                <input 
                                    type="number" 
                                    className="form-control focus:ring-2 focus:ring-blue-600" 
                                    name="maxAnswers" 
                                    value={this.state.siteSurvey.maxAnswers} onChange={this.handleChangeNumber} />
                                <Form.Text className="text-muted">
                                    Numero minino di risposte (utilizzare 0 per non impostare un limite minimo). 
                                </Form.Text>
                            </Form.Group>                                              
                        </div>                                                                                            
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

export { SiteSurveyAddEdit }