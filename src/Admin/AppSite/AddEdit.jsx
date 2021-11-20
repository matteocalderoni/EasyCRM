import React from 'react';
import { appSiteService, alertService, languageService } from '../../_services';
import { Uploader } from '../../_components'
import { Image, Row, Col, Form, Button, Card, Container, ProgressBar,Navbar, Nav } from 'react-bootstrap'
import { Editor } from "@tinymce/tinymce-react";
import { Link } from 'react-router-dom';
import { LanguageSelect } from '../../_components/LanguageSelect';
import { AiFillSave } from 'react-icons/ai';
import { FcHome } from 'react-icons/fc';
import { IoDocumentsOutline } from 'react-icons/io5';
import { FaRoad, FaLanguage } from 'react-icons/fa';
import {menuSettings,pluginsSettings,toolbarSettings } from '../../_helpers/tinySettings';
import { fetchWrapper } from '../../_helpers/fetch-wrapper';

const baseUrl = `${process.env.REACT_APP_API_URL}/upload`;
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
            sitePages: [],
            loading: false,
            loadingPages: true                                       
         };
 
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeNumber = this.handleChangeNumber.bind(this);
        this.handleChangeBool = this.handleChangeBool.bind(this);
    }

    componentDidMount() {
        this.getLanguages()
        this.getSite()

        appSiteService.getPagesOfAppSite(this.props.match.params.appSiteId,-1).then((x) => { 
            if (x.totalCount > 0) {                
                this.setState({                
                    sitePages: x.result,
                    loadingPages: false
                })
            } else {
                // Empty
                this.setState({sitePages: [], loadingPages: false})
            }
        });
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

    tiny_image_upload_handler = (blobInfo, success, failure, progress) => {
        const fileName = (this.state.appSite.appSiteId + '/' || '') + new Date().getTime() + '.jpeg';
    
        // Request made to the backend api 
        // Send formData object 
        fetchWrapper.postFile(`${baseUrl}/CloudUpload`, blobInfo.blob(), fileName)
            .then((result) => {
                success(`${baseImageUrl}${result.fileName}`);                
            });         
      };                  

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
          <Container fluid className="pb-4">
              <ul className="breadcrumb">
                <li className="breadcrumb-item"><Link to={`/`}><FcHome /></Link></li>                
                <li className="breadcrumb-item"><Link to={`/admin`}>Dashboard</Link></li>          
                <li className="breadcrumb-item"><Link to={`/admin/sites`}>Elenco Siti</Link></li>                                      
                <li className="breadcrumb-item active">Sito <b>{this.state.appSite.name}</b></li>
            </ul>

            {this.state.loading &&
                <Row className="mb-4">
                    <Col className="text-center rounded bg-blue-400 text-white mt-2 p-2">
                        Caricamento dei contenuti in corso... Attende prego...
                        <ProgressBar animated now={100} />
                    </Col>
                </Row>
            }                         
            <div className="shadow rounded-xl mt-2 bg-gray-100 p-8">
                <p>Le informazioni principali del sito vengono utilizzate in tutte le pagine. Il logo viene inserito nel menù di navigazione e i riferimenti nel fondo pagina.</p>
            </div>
              <div className="shadow rounded-xl mt-2 bg-gray-100 p-8">                        
                <Row className="mt-2">
                    <Col sm={4}>
                        <Image src={baseImageUrl+this.state.appSite.companyLogo} className="rounded border" fluid />                    
                        <div className="mt-1">
                            Carica il logo del tuo sito:
                            <Uploader prefix={this.state.appSite.appSiteId} fileName={this.state.appSite.companyLogo} onFileNameChange={this.handleFileName} />                                               
                        </div>                
                    </Col>
                    <Col sm={8}>
                        <Form.Group>
                            <Form.Label>Nome del tuo Sito</Form.Label>
                            <Form.Control type="text" size="lg" className="form-control" name="name" value={this.state.appSite.name} onChange={this.handleChange} maxLength={200} />
                            <Form.Text className="text-muted">
                                Indicare il nome del tuo sito per ricercarlo in elenco siti.
                            </Form.Text>

                            <Form.Text className="text-muted mt-4">
                                Il logo viene utilizzato in diverse posizioni: utilizzare un immagine con una buona qualità.
                                Viene aggiunto nel menù di navigazione e può essere visualizzato nella slide di apertura delle varie pagine. 
                            </Form.Text>
                        </Form.Group>
                    </Col>                    
                </Row>              
                
              </div>

            <Card className="shadow rounded-xl mt-4 bg-gray-100">
                <Card.Header className="bg-blue-200">
                    <h3><b>Riferimenti</b> del Sito</h3>
                    <small>Queste informazioni vengono visualizzate in fondo alle pagine del sito.</small>
                </Card.Header>                            
                <Card.Body>
                        
                    <Form.Group>
                        <Form.Label>Indirizzo attività</Form.Label>
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

                    <div>
                        <label><b>'Su di noi'</b>: la tua mission o il motto aziendale...</label>
                        {!this.state.loading && this.state.languageCode == '' && <Editor
                            apiKey={process.env.REACT_APP_TINTMCE_KEY}
                            initialValue={this.state.appSite.description}
                            init={{
                                height: 500,
                                menubar: menuSettings,  
                                plugins: pluginsSettings, 
                                toolbar: toolbarSettings, 
                                images_upload_handler: this.tiny_image_upload_handler
                            }}
                            onEditorChange={this.handleEditorChange}
                        />}       
                        <Form.Text className="text-muted">
                            Questo testo è molto importante perchè viene riportato su tutte le pagine del sito. Utilizzare parole utili per la visibilità nei motori di ricerca.
                        </Form.Text>                                     
                    </div>                    
                    
                    <Row className="mt-2">
                        <Col>
                            <Form.Group>
                                <Form.Label>Latitudine</Form.Label>
                                <input type="number" className="form-control" name="latitude" value={this.state.appSite.latitude} onChange={this.handleChangeNumber} />
                                <Form.Text className="text-muted">
                                    Latitudine predefinita utilizzata per contenitore Mappa.
                                </Form.Text>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group>
                                <Form.Label>Longitudine</Form.Label>
                                <input type="number" className="form-control" name="longitude" value={this.state.appSite.longitude} onChange={this.handleChangeNumber} />
                                <Form.Text className="text-muted">
                                    Longitudine predefinita utilizzata per contenitore Mappa.
                                </Form.Text>
                            </Form.Group>
                        </Col>
                    </Row>

                    {this.state.appSite && this.state.sitePages && !this.state.loadingPages && <Form.Group>
                        <Form.Label>Pagina per la privacy policy:</Form.Label>
                        <Form.Control as="select" value={this.state.appSite.privacyPageId} name="privacyPageId" onChange={this.handleChangeNumber}>
                            <option value={0}>Non disponibile</option>
                            {this.state.sitePages && this.state.sitePages.map(privacyPage =>
                                <option key={privacyPage.sitePageId} value={parseInt(privacyPage.sitePageId)}>{privacyPage.title}</option>
                            )}   
                        </Form.Control>
                        <Form.Text className="text-muted">
                            Selezionare tra le pagine disponibile quella da utilizzare per la privacy policy (normative GDPR). Creare una pagina PRIVACY con tutti i riferimenti su utilizzo dei dati di utenti (per ulteriori dettagli contattare Amministratore di sito).
                        </Form.Text>
                    </Form.Group>}
                    
                    {/* <Form.Group>
                        <Form.Check type="checkbox" label="Pubblico" name="isDefault" checked={this.state.appSite.isDefault} onChange={this.handleChangeBool} />
                        <Form.Text>
                            Il Sito di default viene utilizzato per i contenuti del sito.
                        </Form.Text>
                    </Form.Group> */}

                    {/* {this.state.appSite && this.state.appSite.appSiteId > 0 && !this.state.appSite.isDefault &&
                    <div>
                        <Button onClick={this.setDefaultAppSite} variant="success">
                            Imposta come Sito di Default
                        </Button> 
                    </div>} */}                                    
                </Card.Body>
            </Card>          
            <Navbar fixed="bottom" className="flex bg-blue-800">
                <Nav className="flex space-x-2 text-sm font-medium mr-auto">
                    <Button onClick={this.onSubmit} className="w-1/2 flex items-center justify-center rounded-md bg-green-500">
                        <AiFillSave /> Salva Modifiche
                    </Button> 
                    <Link to={`/admin/sites/sitepages/${this.state.appSite.appSiteId}`} title="Pagine del sito" 
                        className="w-1/2 flex items-center justify-center rounded-md bg-blue-200 p-1 text-blue-900">
                        <IoDocumentsOutline className="mr-2" /> Gestione Pagine
                    </Link>
                    <Link to={`/admin/sites/sitelanguages/${this.state.appSite.appSiteId}`} title="Lingue del sito" className="w-1/2 flex items-center justify-center rounded-md bg-blue-200 p-1 text-blue-900">
                        <FaLanguage className="mr-2" /> Gestione Lingue
                    </Link>
                    <Link to={`/admin/sites/sitelanguages/${this.state.appSite.appSiteId}`} title="Lingue del sito" className="w-1/2 flex items-center justify-center rounded-md bg-blue-200 p-1 text-blue-900">
                        <FaRoad className="mr-2" /> Gestione Percorsi
                    </Link>
                </Nav>
                <Form inline className="flex items-center justify-center">
                    <LanguageSelect appSiteId={this.state.appSite.appSiteId} onLanguageChange={this.handleLanguageCode} />      
                </Form>                
            </Navbar>          
          </Container>
          
        );
    }
}

export { AddEdit }