import React from 'react';
import { Link } from 'react-router-dom';
import { appSiteService, alertService, languageService } from '../../_services';
import { LanguageEditor, Uploader } from '../../_components'
import { Image, Row, Col, Form, Card, Container, ProgressBar } from 'react-bootstrap'
import { FcHome } from 'react-icons/fc';
import { FooterNav } from '../../_components/FooterNav';

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
        this.setState({ appSite: { ...this.state.appSite, [evt.target.name]: evt.target.value } })
    }

    handleChangeNumber(evt) {        
        this.setState({ appSite: { ...this.state.appSite, [evt.target.name]: parseFloat(evt.target.value) } })
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

            {this.state.loading && this.state.appSite.appSiteId > 0 &&
            <Row className="m-4 mb-4">
                <Col className="text-center rounded bg-blue-400 text-white mt-2 p-2">
                    Caricamento dettagli del sito in corso... Attende prego...
                    <ProgressBar animated now={this.state.loadingProgress} />
                </Col>
            </Row>}                         
            <div className="shadow rounded-xl mt-2 bg-gray-100 p-4">
                <p className='text-gray-500'>Le informazioni principali del sito vengono utilizzate in tutte le pagine. Il logo viene inserito nel menù di navigazione e i riferimenti nel fondo pagina.</p>
            </div>
              <div className="shadow rounded-xl mt-2 bg-gray-100 p-4">                        
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
                        {!this.state.loading && 
                        <LanguageEditor 
                            appSiteId={this.state.appSite.appSiteId} 
                            originalText={this.state.appSite.description}
                            onChange={(content) => this.handleEditorChange(content)}
                            code={this.state.languageCode}
                            labelKey={`APPSITE_${this.state.appSite.appSiteId}-Description`}
                            inline={false} />}                        
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

            <Card className="shadow rounded-xl mt-4 bg-gray-100">
            <Card.Header className="bg-blue-200">
                    <h3><b>Utenti e Shop</b> del Sito</h3>
                    <small>Tramite questa sezione si attiva gestiscono le funzioni interattive del sito.</small>
                </Card.Header>                            
                <Card.Body>
                <div className="md:flex">
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
                    <div className="md:flex">
                        <Form.Group className="flex-1 mt-2">
                            <Form.Check type="checkbox" label="Pagamento opzionale" name="optionalPay" checked={this.state.appSite.optionalPay} onChange={this.handleChangeBool} />
                            <Form.Text>
                                Con questa opzione si attiva il bottone per pagare alla consegna (saltando paga online).
                            </Form.Text>
                        </Form.Group>
                        <Form.Group className="flex-1 mt-2">
                            <Form.Check type="checkbox" label="Attivo Whatsapp" name="whatsappEnabled" checked={this.state.appSite.whatsappEnabled} onChange={this.handleChangeBool} />
                            <Form.Text>
                                Con questa opzione si attiva il bottone Whatsapp alla fine di ordine.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="flex-1 mt-2">
                            <Form.Check type="checkbox" label="Attiva Telefono" name="phoneEnabled" checked={this.state.appSite.phoneEnabled} onChange={this.handleChangeBool} />
                            <Form.Text>
                                Con questa opzione si attiva il bottone telefono alla fine di ordine.
                            </Form.Text>
                        </Form.Group>
                    </div>}

                    {this.state.appSite.shopEnabled && 
                    <div className='md:flex space-x-2'>
                        <Form.Group className='flex-1'>
                            <Form.Label>Stripe Secret Key</Form.Label>
                            <input type="password" className="form-control" name="stripeSecretKey" value={this.state.appSite.stripeSecretKey} onChange={this.handleChange} />
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
                </Card.Body>
            </Card>      
            
            <FooterNav appSiteId={this.state.appSite.appSiteId} onSave={() => this.onSubmit()} onLanguageChange={this.handleLanguageCode} />
            
          </Container>
          
        );
    }
}

export { AddEdit }