import React from 'react';
import { appSiteService, alertService, languageService } from '../../_services';
import { Uploader } from '../../_components'
import { Image, Row, Col, Form, Button, Jumbotron, Card, Container, ProgressBar,Navbar } from 'react-bootstrap'
import { Editor } from "@tinymce/tinymce-react";
import { Link } from 'react-router-dom';
import { LanguageSelect } from '../../_components/LanguageSelect';
import { LanguageEditor } from '../../_components/LanguageEditor';
import { AiFillSave } from 'react-icons/ai';
import { FcHome } from 'react-icons/fc';
import { IoDocumentsOutline } from 'react-icons/io5';
import { FaLanguage } from 'react-icons/fa';
import { BsTrash } from 'react-icons/bs';
import {menuSettings,pluginsSettings,toolbarSettings } from '../../_helpers/tinySettings';

const baseImageUrl = `${process.env.REACT_APP_STORAGE_URL}/`;

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
            },
            languages: [],
            languageCode: '',
            loading: false              
         };
 
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeNumber = this.handleChangeNumber.bind(this);
        this.handleChangeBool = this.handleChangeBool.bind(this);
    }

    componentDidMount() {
        this.getLanguages()
        this.getSite()
    }    

    getLanguages() {
        if (this.props.match.params.appSiteId) {
            languageService.getlanguagesOfSite(this.props.match.params.appSiteId)
                .then(_codes => {
                    this.setState({
                        ...this.state,
                        languages: _codes
                    })
                })
        }
    }

    getSite() {
        if (this.props.match.params.appSiteId) {
            this.setState({ loading: true })
            appSiteService.getAppSiteById(this.props.match.params.appSiteId)
                .then(_appSite => {     
                    this.setState({
                        ...this.state,
                        appSite: _appSite,
                        loading: false
                    });                                 
                });
        }
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

    handleLanguageCode = (code) => {        
        this.setState({ 
            languageCode: code
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
                    alertService.success('Sito creato con successo', { keepAfterRouteChange: true });
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
                alertService.success('Sito impostato come default con successo', { keepAfterRouteChange: true });
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
          <Container fluid>
              <ul className="breadcrumb">
                <li className="breadcrumb-item"><Link to={`/`}><FcHome /></Link></li>                
                <li className="breadcrumb-item"><Link to={`/admin`}>Dashboard</Link></li>          
                <li className="breadcrumb-item"><Link to={`/admin/sites`}>Elenco Siti</Link></li>                                      
                <li className="breadcrumb-item active">Sito <b>{this.state.appSite.name}</b></li>
            </ul>

            {this.state.loading &&
                <Row>
                    <Col className="text-center mart2">
                        <ProgressBar animated now={100} />
                    </Col>
                </Row>
            }                         
              <Jumbotron className="small-jumbotron">
                <h3>Gestione dati del <b>Sito</b></h3>                
                <Row>
                    <Col sm={2}>
                        <Image src={baseImageUrl+this.state.appSite.companyLogo} fluid />                    
                    </Col>
                    <Col sm={6}>
                        <Form.Group>
                            <Form.Label>Nome del Sito</Form.Label>
                            <Form.Control type="text" size="lg" className="form-control" name="name" value={this.state.appSite.name} onChange={this.handleChange} maxLength={200} />
                            <Form.Text className="text-muted">
                                Ragione sociale della tua attività (max 200 caratteri).
                            </Form.Text>
                        </Form.Group>
                    </Col>
                    <Col sm={4} className="text-right">
                        <div>
                            <Button onClick={this.onSubmit} variant="success">
                                <AiFillSave /> Salva modifiche
                            </Button> 
                        </div>
                        <div className="mart2">
                            <Link to={`/admin/sites/sitepages/${this.state.appSite.appSiteId}`} title="Pagine del sito" className="btn btn-secondary mr-1">
                                <IoDocumentsOutline /> Pagine del sito
                            </Link>
                        </div>
                        <div className="mart2">
                            <Link to={`/admin/sites/sitelanguages/${this.state.appSite.appSiteId}`} title="Lingue del sito" className="btn btn-secondary mr-1">
                                <FaLanguage /> Modifica Lingue
                            </Link>
                        </div>
                    </Col>
                </Row>              
                <div className="mart1">
                    Carica il logo del tuo sito:
                    <Uploader prefix={this.state.appSite.appSiteId} fileName={this.state.appSite.companyLogo} onFileNameChange={this.handleFileName} />                                               
                </div>                
              </Jumbotron>

            <Card>
                <Card.Header>
                    <h3><b>Riferimenti</b> del Sito</h3>
                    <small>Queste informazioni vengono visualizzate in fondo alle pagine del sito.</small>
                </Card.Header>                            
                <Card.Body>
                        
                    <Form.Group>
                        <Form.Label>Indirizzo del locale</Form.Label>
                        <input type="text" className="form-control" name="address" value={this.state.appSite.address} onChange={this.handleChange} />
                        <Form.Text className="text-muted">
                            Via, Corso, Piazza.
                        </Form.Text>
                    </Form.Group>
                    
                    <Row>
                        <Col>                        
                            <Form.Group>
                                <Form.Label>Citta</Form.Label>
                                <input type="text" className="form-control" name="city" value={this.state.appSite.city} onChange={this.handleChange} />
                                <Form.Text className="text-muted">
                                    Città o Paese.
                                </Form.Text>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group>
                                <Form.Label>CAP</Form.Label>
                                <input type="text" className="form-control" name="postalCode" value={this.state.appSite.postalCode} onChange={this.handleChange} />
                                <Form.Text className="text-muted">
                                    Codice postale.
                                </Form.Text>
                            </Form.Group>
                        </Col>
                    </Row>

                    
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label>Numero di telefono</Form.Label>
                                <input type="text" className="form-control" name="phone" value={this.state.appSite.phone} onChange={this.handleChange} />
                                <Form.Text className="text-muted">
                                    Telefono di riferimento per contatti.
                                </Form.Text>
                            </Form.Group>    
                        </Col>
                        <Col>
                            <Form.Group>
                                <Form.Label>Indirizzo email</Form.Label>
                                <input type="text" className="form-control" name="email" value={this.state.appSite.email} onChange={this.handleChange} />
                                <Form.Text className="text-muted">
                                    Email di riferimento per contatti. Utilizzata per contenitore di invio richieste.
                                </Form.Text>
                            </Form.Group>
                        </Col>
                    </Row>
                    
                    <LanguageSelect appSiteId={this.state.appSite.appSiteId} onLanguageChange={this.handleLanguageCode} />      

                    <div>
                        <label>Testo per fondo pagina: 'Su di noi'</label>
                        {!this.state.loading && this.state.languageCode == '' && <Editor
                            apiKey={process.env.REACT_APP_TINTMCE_KEY}
                            initialValue={this.state.appSite.description}
                            init={{
                            height: 500,
                            menubar: menuSettings,  
                            plugins: pluginsSettings, 
                            toolbar: toolbarSettings, 
                            }}
                            onEditorChange={this.handleEditorChange}
                        />}                                            
                    </div>

                    {this.state.languageCode && this.state.languageCode != '' &&
                    <div>
                        <LanguageEditor 
                            originalText={this.state.appSite.description}
                            appSiteId={this.state.appSite.appSiteId} 
                            code={this.state.languageCode}
                            labelKey={`APPSITE_${this.state.appSite.appSiteId}-Description`}>                                    
                        </LanguageEditor>
                    </div>}
                    
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label>Latitudine</Form.Label>
                                <input type="number" className="form-control" name="latitude" value={this.state.appSite.latitude} onChange={this.handleChangeNumber} />
                                <Form.Text className="text-muted">
                                    Latitudine utilizzata per contenitore Mappa.
                                </Form.Text>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group>
                                <Form.Label>Longitudine</Form.Label>
                                <input type="number" className="form-control" name="longitude" value={this.state.appSite.longitude} onChange={this.handleChangeNumber} />
                                <Form.Text className="text-muted">
                                    Longitudine utilizzata per contenitore Mappa.
                                </Form.Text>
                            </Form.Group>
                        </Col>
                    </Row>
                    
                    <Form.Group>
                        <Form.Check type="checkbox" label="Pubblico" name="isDefault" checked={this.state.appSite.isDefault} onChange={this.handleChangeBool} />
                        <Form.Text>
                            Il Sito di default viene utilizzato per i contenuti del sito.
                        </Form.Text>
                    </Form.Group>

                    {/* {this.state.appSite && this.state.appSite.appSiteId > 0 && !this.state.appSite.isDefault &&
                    <div>
                        <Button onClick={this.setDefaultAppSite} variant="success">
                            Imposta come Sito di Default
                        </Button> 
                    </div>} */}                                    
                </Card.Body>
            </Card>          
            <Navbar fixed="bottom" variant="dark" bg="dark">
                <Button onClick={this.onSubmit} variant="success">
                    <AiFillSave /> Salva modifiche
                </Button> 
            </Navbar>          
          </Container>
          
        );
    }
}

export { AddEdit }