import React from 'react';
import { Link } from 'react-router-dom';
import { appSiteService, alertService, languageService } from '../../_services';
import { Uploader } from '../../_components'
import { Image, Row, Col, Form, Button, Card, Container, ProgressBar,Navbar, Nav } from 'react-bootstrap'
import { LanguageSelect } from '../../_components/Select/LanguageSelect';
import { FcHome } from 'react-icons/fc';
import { Editor } from "@tinymce/tinymce-react";
import {menuSettings,pluginsSettings,toolbarSettings,fontSettings,styleSettings } from '../../_helpers/tinySettings';
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
                isDefault: false,
                loginEnabled: false,
                shopEnabled: false
            },
            languages: [],
            languageCode: '',
            sitePages: [],
            loading: true,
            loadingProgress: 0, 
            loadingPages: true                                       
         };
 
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeNumber = this.handleChangeNumber.bind(this);
        this.handleChangeBool = this.handleChangeBool.bind(this);
    }

    componentDidMount() {
        this.getSite()        
    }   
    
    getSite() {
        if (this.props.match.params.appSiteId) {            
            appSiteService.getAppSiteById(this.props.match.params.appSiteId)
                .then(_appSite => {     
                    this.setState({ ...this.state, appSite: _appSite, loadingProgress: 100/3 });           
                    // Get Pages for Privacy         
                    this.getPagesOfSite();
                });
        }
    }

    getPagesOfSite() {
        appSiteService.getPagesOfAppSite('',this.props.match.params.appSiteId,-1,-1).then((x) => { 
            if (x.totalCount > 0) this.setState({ sitePages: x.result, loadingPages: false, loadingProgress: 200/3 })
            else this.setState({sitePages: [], loadingPages: false, loadingProgress: 100 })            
            // Get Languages for text
            this.getLanguages();
        });
    }

    getLanguages() {
        if (this.props.match.params.appSiteId) {
            languageService.getlanguagesOfSite(this.props.match.params.appSiteId)
                .then(_codes => {
                    this.setState({ ...this.state, languages: _codes, loading: false, loadingProgress: 100 })
                });
        }
    }

    handleChange(evt) {
        const value = evt.target.value;
        this.setState({ appSite: { ...this.state.appSite, [evt.target.name]: value } })
    }

    handleChangeNumber(evt) {
        const value = parseFloat(evt.target.value);
        this.setState({ appSite: { ...this.state.appSite, [evt.target.name]: value } })
    }

    handleEditorChange = (content, editor) => {
        this.setState({ appSite: { ...this.state.appSite, description: content } })
    }

    handleChangeBool(evt) {  
        this.setState({ appSite: { ...this.state.appSite, [evt.target.name]: evt.target.checked } })
    }

    handleFileName = (fileName) => {        
        this.setState({ appSite: { ...this.state.appSite, companyLogo: fileName } })      
    }

    handleLanguageCode = (code) => {        
        this.setState({ languageCode: code })     
    }
    
    onSubmit = () => {
        if (this.state.appSite.appSiteId > 0) this.updateAppSite()
        else this.createAppSite()            
    }

    // Upload image for text area
    tiny_image_upload_handler = (blobInfo, success, failure, progress) => {
        const fileName = (this.state.appSite.appSiteId + '/' || '') + new Date().getTime() + '.jpeg';            
        fetchWrapper.postFile(`${baseUrl}/CloudUpload`, blobInfo.blob(), fileName)
            .then((result) => {
                success(`${baseImageUrl}${result.fileName}`);                
            });         
      };                  

    createAppSite() {
        appSiteService.createAppSite({ appSite: this.state.appSite })
            .then(result => {
                if (result.hasErrors) 
                    alertService.success('Problemi durante il salvataggio. Modifica i valori e riprova.', { keepAfterRouteChange: true });
                else
                    alertService.success('Sito creato con successo', { keepAfterRouteChange: true });                             
            })
            .catch(error => alertService.error(error));
    }

    updateAppSite() {
        appSiteService.updateAppSite({ appSite: this.state.appSite })
            .then(result => {
                if (result.hasErrors) 
                    alertService.success('Problemi durante il salvataggio. Modifica i valori e riprova.', { keepAfterRouteChange: true });
                else
                    alertService.success('Update successful', { keepAfterRouteChange: true });                             
            })
            .catch(error => alertService.error(error));
    }

    render() {
        return (            
          <Container fluid className="pb-2">
              <ul className="breadcrumb">
                <li className="breadcrumb-item"><Link to={`/`}><FcHome /></Link></li>                
                <li className="breadcrumb-item"><Link to={`/admin`}>Dashboard</Link></li>          
                <li className="breadcrumb-item"><Link to={`/admin/sites`}>Elenco Siti</Link></li>                                      
                <li className="breadcrumb-item active">Sito <b>{this.state.appSite.name}</b></li>
            </ul>

            {this.state.loading &&
            <Row className="m-4 mb-4">
                <Col className="text-center rounded bg-blue-400 text-white mt-2 p-2">
                    Caricamento dettagli del sito in corso... Attende prego...
                    <ProgressBar animated now={this.state.loadingProgress} />
                </Col>
            </Row>}                         
            <div className="shadow rounded-xl mt-2 bg-gray-100 p-8">
                <p>Le informazioni principali del sito vengono utilizzate in tutte le pagine. Il logo viene inserito nel menù di navigazione e i riferimenti nel fondo pagina.</p>
            </div>
              <div className="shadow rounded-xl mt-2 bg-gray-100 p-8">                        
                <Row className="mt-2">
                    <Col sm={4}>
                        <Image src={baseImageUrl+this.state.appSite.companyLogo} className="rounded-xl border" fluid />                    
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
                                Il nome del sito viene visualizzato nel titolo di tutte le pagine. 
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
                        {!this.state.loading && (this.state.languageCode === undefined || this.state.languageCode === '') && 
                        <Editor
                            apiKey={process.env.REACT_APP_TINTMCE_KEY}
                            initialValue={this.state.appSite.description}
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
                        />}       
                        <Form.Text className="text-muted">
                            Questo testo è molto importante perchè viene riportato su tutte le pagine del sito, nel fondo pagina. Utilizzare parole utili per la visibilità nei motori di ricerca.
                            
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
                    <div className="flex">
                        <Form.Group className="flex-1 mt-2">
                            <Form.Check type="checkbox" label="Attivo login" name="loginEnabled" checked={this.state.appSite.loginEnabled} onChange={this.handleChangeBool} />
                            <Form.Text>
                                Con questa opzione si attiva la possibilità di registrarsi e accedere al sito. Questa funzione è utile per la gestione di percorsi collegati agli utenti.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="flex-1 mt-2">
                            <Form.Check type="checkbox" label="Attiva Shop" name="shopEnabled" checked={this.state.appSite.shopEnabled} onChange={this.handleChangeBool} />
                            <Form.Text>
                                Con questa opzione si attiva la possibilità di effettuare ordini dal sito: viene visualizzato il carello di utente.
                            </Form.Text>
                        </Form.Group>
                    </div>

                    {this.state.appSite.shopEnabled && 
                    <div className='flex space-x-2'>
                        <Form.Group className='flex-1'>
                            <Form.Label>Stripe Secret Key</Form.Label>
                            <input type="text" className="form-control" name="stripeSecretKey" value={this.state.appSite.stripeSecretKey} onChange={this.handleChange} />
                            <Form.Text className="text-muted">
                                Inserire la chiave secreta collegata ad account Stripe per pagamenti. Attenzione non mostrare a nessuna questa chiave.
                            </Form.Text>
                        </Form.Group>
                        <Form.Group className='flex-1'>
                            <Form.Label>Stripe Public Key</Form.Label>
                            <input type="text" className="form-control" name="stripePublicKey" value={this.state.appSite.stripePublicKey} onChange={this.handleChange} />
                            <Form.Text className="text-muted">
                                Inserire la chiave pubblica collegata ad account Stripe per pagamenti. Attenzione non mostrare a nessuna questa chiave.
                            </Form.Text>
                        </Form.Group>
                    </div>}

                    {this.state.appSite && this.state.sitePages && !this.state.loadingPages && <Form.Group>
                        <Form.Label>Pagina per la privacy policy:</Form.Label>
                        <Form.Control as="select" value={this.state.appSite.privacyPageId} name="privacyPageId" onChange={this.handleChangeNumber}>
                            <option value={0}>Non disponibile</option>
                            {this.state.sitePages && this.state.sitePages.map(privacyPage =>
                                <option key={privacyPage.sitePageId} value={parseInt(privacyPage.sitePageId)}>{privacyPage.titleUrl}</option>
                            )}   
                        </Form.Control>
                        <Form.Text className="text-muted">
                            Selezionare tra le pagine disponibile quella da utilizzare per la privacy policy (normative GDPR). Creare una pagina PRIVACY con tutti i riferimenti su utilizzo dei dati di utenti (per ulteriori dettagli contattare Amministratore di sito).
                        </Form.Text>
                    </Form.Group>}                                
                </Card.Body>
            </Card>          
            <Navbar fixed="bottom" className="flex bg-blue-800">
                <Nav className="flex space-x-2 text-sm font-medium mr-auto">
                    <Button onClick={() => this.onSubmit()} className="flex items-center justify-center rounded-full bg-green-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                        </svg>
                        Salva
                    </Button> 
                    <Link to={`/admin/sites/sitepages/${this.state.appSite.appSiteId}`} title="Pagine del sito" 
                        className="flex items-center justify-center rounded-full bg-blue-200 p-1 text-blue-900">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                        </svg>
                        Pagine
                    </Link>
                    <Link to={`/admin/sites/sitelanguages/${this.state.appSite.appSiteId}`} title="Lingue del sito" className="flex items-center justify-center rounded-full bg-blue-200 p-1 text-blue-900">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                        </svg>
                        Lingue
                    </Link>
                    <Link to={`/admin/sites/sitelanguages/${this.state.appSite.appSiteId}`} title="Lingue del sito" className="flex items-center justify-center rounded-full bg-blue-200 p-1 text-blue-900">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        Percorsi
                    </Link>
                    <Link to={`/admin/sites/siteproducts/${this.state.appSite.appSiteId}`} title="Prodotti del sito" className="flex items-center justify-center rounded-full bg-blue-200 p-1 text-blue-900">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        Prodotti
                    </Link>
                    <Link to={`/admin/sites/siteorders/${this.state.appSite.appSiteId}`} title="Ordini del sito" className="flex items-center justify-center rounded-full bg-blue-200 p-1 text-blue-900">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                        </svg>
                        Ordini
                    </Link>
                </Nav>
                <Form inline className="flex items-center justify-center md:block">
                    <LanguageSelect appSiteId={this.state.appSite.appSiteId} onLanguageChange={this.handleLanguageCode} />      
                </Form>                
            </Navbar>          
          </Container>
          
        );
    }
}

export { AddEdit }