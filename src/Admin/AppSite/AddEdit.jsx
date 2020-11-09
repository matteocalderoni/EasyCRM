import React from 'react';
import { appSiteService, alertService } from '../../_services';
import { Uploader } from '../../_components'
import { Image, Row, Col, Form, Button, Jumbotron, Card, Container, Breadcrumb } from 'react-bootstrap'
import { Editor } from "@tinymce/tinymce-react";

const baseEditorPlugins = [
    'advlist autolink lists link image charmap print preview anchor',
    'searchreplace visualblocks code fullscreen',
    'insertdatetime media table paste code help wordcount'
];
const baseEditorToolbar = 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help';

// Guarda BOOTSTRAP
//https://react-bootstrap.netlify.app/components/navs/#tabs

const baseImageUrl = `${process.env.REACT_APP_API_URL}/Resources/Images/`;

class AddEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {  
            appSite: {
                appSiteId: parseInt(this.props.match.params.appSiteId || 0),         
                name: '',
                companyLogo: 'logo.png',
                city: '',
                address: '',
                postalCode: '',
                latitude: 0,
                longitude: 0,
                phone: '',
                email: '',
                isDefault: false
            }              
         };

        if (this.props.match.params.appSiteId) {
            appSiteService.getAppSiteById(this.props.match.params.appSiteId)
                .then(_appSite => {     
                    this.setState({
                        appSite: _appSite
                    });                                 
                });
        }
         
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeNumber = this.handleChangeNumber.bind(this);
        this.handleChangeBool = this.handleChangeBool.bind(this);
    }

    handleChange(evt) {
        const value = evt.target.value;
        this.setState({
            appSite: {
                ...this.state.appSite,
                [evt.target.name]: value
            }          
        });
    }

    handleChangeNumber(evt) {
        const value = parseFloat(evt.target.value);
        this.setState({
            appSite: {
                ...this.state.appSite,
                [evt.target.name]: value                
            }          
        });
    }

    handleEditorChange = (content, editor) => {
        this.setState({
            appSite: {
                ...this.state.appSite,
                description: content                 
            }            
        });
    }

    handleChangeBool(evt) {  
        this.setState({
            appSite: {
                ...this.state.appSite,
                [evt.target.name]: evt.target.checked                 
            }          
        });
    }

    handleFileName = (fileName) => {        
        this.setState({ 
            appSite: {
                ...this.state.appSite,
                companyLogo: fileName 
            }            
        });        
    }
    
    onSubmit = () => {
        //if (isAddMode) {
        if (this.state.appSite.appSiteId > 0) {
            this.updateAppSite();
        } else {
            this.createAppSite();            
        }
    }

    createAppSite() {
        appSiteService.createAppSite({ appSite: this.state.appSite })
            .then(result => {
                if (result.hasErrors) {
                    alertService.success('Problemi durante il salvataggio. Modifica i valori e riprova.', { keepAfterRouteChange: true });
                } else {
                    alertService.success('Ristorante creato con successo', { keepAfterRouteChange: true });
                }                
            })
            .catch(error => {
                alertService.error(error);
            });
    }

    updateAppSite() {
        appSiteService.updateAppSite({ appSite: this.state.appSite })
            .then(result => {
                if (result.hasErrors) {
                    alertService.success('Problemi durante il salvataggio. Modifica i valori e riprova.', { keepAfterRouteChange: true });
                } else {
                    alertService.success('Update successful', { keepAfterRouteChange: true });
                }                
            })
            .catch(error => {
                alertService.error(error);
            });
    }

    setDefaultAppSite = () => {        
        appSiteService.setDefaultAppSite(this.state.appSite.appSiteId)
            .then(() => {
                alertService.success('Ristorante impostato come default con successo', { keepAfterRouteChange: true });
                this.setState({
                    appSite:{
                        ...this.state.appSite,
                        isDefault: true
                    }
                })
            });
    }

    render() {
        return (            
          <Container>
              <Breadcrumb>
                <Breadcrumb.Item href="/">Home</Breadcrumb.Item>                
                <Breadcrumb.Item href="/admin">Admin</Breadcrumb.Item>          
                <Breadcrumb.Item href="/admin/sites">Siti</Breadcrumb.Item>                                      
                <Breadcrumb.Item active>Siteo {this.state.appSiteId}</Breadcrumb.Item>
            </Breadcrumb>
              <Jumbotron>
                <h1>Gestione dati del <b>Sito</b></h1>
                <Row>
                    <Col sm={2}>
                        <Image src={baseImageUrl+this.state.appSite.companyLogo} fluid />                    
                    </Col>
                    <Col>
                        <Form.Group>
                            <Form.Label>Nome del Sito</Form.Label>
                            <Form.Control type="text" size="lg" className="form-control" name="name" value={this.state.appSite.name} onChange={this.handleChange} maxLength={200} />
                            <Form.Text className="text-muted">
                                Ragione sociale del Ristorante (max 200 caratteri).
                            </Form.Text>
                        </Form.Group>
                    </Col>
                </Row>              
                <Row>
                    <Col sm={8}>
                        <Uploader fileName={this.state.appSite.companyLogo} onFileNameChange={this.handleFileName} />                                               
                    </Col>
                    <Col className="text-right">
                        <Button onClick={this.onSubmit} variant="success">
                            Salva modifiche
                        </Button> 
                    </Col>
                </Row>                
              </Jumbotron>
              
            <Card>
                <Card.Header><h3><b>Riferimenti</b> del ristorante</h3></Card.Header>                            
                <Card.Body>
                        
                    <Form.Group>
                        <Form.Label>Indirizzo del locale</Form.Label>
                        <input type="text" className="form-control" name="address" value={this.state.appSite.address} onChange={this.handleChange} />
                        <Form.Text className="text-muted">
                            Via, Corso, Piazza.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Citta</Form.Label>
                        <input type="text" className="form-control" name="city" value={this.state.appSite.city} onChange={this.handleChange} />
                        <Form.Text className="text-muted">
                            Città o Paese.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>CAP</Form.Label>
                        <input type="text" className="form-control" name="postalCode" value={this.state.appSite.postalCode} onChange={this.handleChange} />
                        <Form.Text className="text-muted">
                            Codice postale.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Numero di telefono</Form.Label>
                        <input type="text" className="form-control" name="phone" value={this.state.appSite.phone} onChange={this.handleChange} />
                        <Form.Text className="text-muted">
                            Telefono di riferimento per contatti.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Indirizzo email</Form.Label>
                        <input type="text" className="form-control" name="email" value={this.state.appSite.email} onChange={this.handleChange} />
                        <Form.Text className="text-muted">
                            Email di riferimento per contatti.
                        </Form.Text>
                    </Form.Group>

                    <div>
                        <label>Testo per fondo pagina: 'Su di noi'</label>
                        <Editor
                            apiKey={process.env.REACT_APP_TINTMCE_KEY}
                            initialValue={this.state.appSite.description}
                            init={{
                            height: 500,
                            menubar: false,
                            plugins: baseEditorPlugins,
                            toolbar: baseEditorToolbar
                            }}
                            onEditorChange={this.handleEditorChange}
                        />                                            
                    </div>
                    
                    <Form.Group>
                        <Form.Label>Latitudine</Form.Label>
                        <input type="number" className="form-control" name="latitude" value={this.state.appSite.latitude} onChange={this.handleChangeNumber} />
                        <Form.Text className="text-muted">
                            Latitudine utilizzata per contenitore Mappa.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Longitudine</Form.Label>
                        <input type="number" className="form-control" name="longitude" value={this.state.appSite.longitude} onChange={this.handleChangeNumber} />
                        <Form.Text className="text-muted">
                            Longitudine utilizzata per contenitore Mappa.
                        </Form.Text>
                    </Form.Group>
                    
                    <Form.Group>
                        <Form.Check type="checkbox" label="Pubblico" name="isDefault" checked={this.state.appSite.isDefault} onChange={this.handleChangeBool} />
                        <Form.Text>
                            Il ristorante di default viene utilizzato per i contenuti del sito.
                        </Form.Text>
                    </Form.Group>

                    {this.state.appSite && this.state.appSite.appSiteId > 0 && !this.state.appSite.isDefault &&
                    <div>
                        <Button onClick={this.setDefaultAppSite} variant="success">
                            Imposta come Ristorante di Default
                        </Button> 
                    </div>
                    }
                    

                </Card.Body>
                <Card.Footer>
                    <Button onClick={this.onSubmit} variant="success">
                        Salva modifiche
                    </Button> 
                </Card.Footer>
            </Card>                    
          </Container>
          
        );
    }
}

export { AddEdit }