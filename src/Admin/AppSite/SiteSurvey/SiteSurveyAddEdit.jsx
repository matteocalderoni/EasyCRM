import React from 'react';
import { surveyService, alertService } from '../../../_services';
import { Form, Button, Card, ProgressBar } from 'react-bootstrap'
import { CompactPicker } from 'react-color';

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
                price: 0                
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
        const value = parseInt(evt.target.value);
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
                        {this.state.siteSurvey && !this.state.loading && 
                        <Form.Group>
                            <CompactPicker
                                color={ this.state.siteSurvey.boxColor }
                                onChangeComplete={ this.handleColorChange }
                            />
                            <Form.Text className="text-muted">
                                Colore di sfondo per i contenitori di testo. Attenzione scegliere colori contrastanti tra sfondo e testo per una buona leggibilità dei contenuti.
                            </Form.Text>
                        </Form.Group>}    
                        <Form.Group>
                            <Form.Label>Prezzo Percorso</Form.Label>
                            <input type="number" className="form-control focus:ring-2 focus:ring-blue-600" name="price" value={this.state.siteSurvey.price} onChange={this.handleChangeNumber} />
                            <Form.Text className="text-muted">
                                Assegnare un prezzo valido per tutto il percorso. 
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

export { SiteSurveyAddEdit }