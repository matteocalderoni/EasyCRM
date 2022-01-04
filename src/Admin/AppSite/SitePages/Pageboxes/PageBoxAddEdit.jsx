import React from 'react';
import { appSiteService, alertService } from '../../../../_services';
import { Uploader } from '../../../../_components'
import { Form, Button, Card, Image, ProgressBar,Row,Col,Navbar,Nav } from 'react-bootstrap'
import { BoxTypes } from '../../../../_helpers'
import { LanguageSelect } from '../../../../_components/LanguageSelect';
import { LanguageEditor } from '../../../../_components/LanguageEditor';
import { CompactPicker,SliderPicker } from 'react-color';
import { FaSave} from 'react-icons/fa';
import { SiteSurveySelect } from '../../../../_components/SiteSurveySelect';
import parse from 'html-react-parser';

const baseImageUrl = `${process.env.REACT_APP_STORAGE_URL}/`;

class PageBoxAddEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {   
            pageBox: {
                appSiteId: this.props.appSiteId,         
                sitePageId: this.props.sitePageId,
                pageBoxId: this.props.pageBoxId,
                imageUrl: 'logo.png',
                title: '',
                description: '',
                cardSize: 12,
                sortId: this.props.sortId | 1,
                boxType: 1, 
                boxColor: '#CCCCCC',   
                boxEmail: '',
                boxLatitude: 0,            
                boxLongitude: 0,
                isPublished: true
            },
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
        // get sub pages 
        appSiteService.getPagesOfAppSite('',this.props.appSiteId,-1,-1).then((x) => { 
            if (x.totalCount > 0) {
                // Filter current page
                this.setState({                
                    sitePages: x.result,
                    loadingPages: false
                })
            } else this.setState({sitePages: [], loadingPages: false})            
        });

        this.handleOpen()
    }

    handleChange(evt) {
        const value = evt.target.value;
        this.setState({
            pageBox: {
                ...this.state.pageBox,
                [evt.target.name]: value
            }          
        });
    }

    handleFileName = (fileName) => {        
        this.setState({ 
            pageBox: {
                ...this.state.pageBox,
                imageUrl: fileName
            }
        });        
    }

    handleChangeNumber(evt) {
        const value = parseInt(evt.target.value);
        this.setState({
            pageBox: {
                ...this.state.pageBox,
                [evt.target.name]: value                
            }          
        });
    }

    handleChangeBool(evt) {  
        this.setState({
            pageBox: {
                ...this.state.pageBox,
                [evt.target.name]: evt.target.checked                 
            }          
        });
    }

    handleEditorChange = (content, editor) => {
        this.setState({
            pageBox: {
                ...this.state.pageBox,
                description: content                 
            }          
        });
    }

    handleColorChange = (color) => {
        this.setState({
            pageBox: {
                ...this.state.pageBox,
                boxColor: color.hex                 
            }          
        });
        //this.setState({ background: color.hex });
    };

    handleSiteSurveyChange = (siteSurveyId) => {
        this.setState({
            pageBox: {
                ...this.state.pageBox,
                siteSurveyId: siteSurveyId                 
            }          
        });
        //this.setState({ background: color.hex });
    };

    handleFieldReset = (field) => {
        this.setState({
            pageBox: {
                ...this.state.pageBox,
                [field]: ''                 
            }          
        });
    }

    handleLanguageCode = (code) => {        
        this.setState({ 
            languageCode: code
        });        
    }

    handleTitleEditorChange = (content, editor) => {
        this.setState({
            pageBox: {
                ...this.state.pageBox,
                title: content                 
            }          
        });
    }

    handleOpen = () => {                  
        if (this.props.appSiteId > 0 && this.props.sitePageId > 0 && this.props.pageBoxId > 0) {
            this.setState({loading: true})
            appSiteService.getPageBoxById(this.props.appSiteId, this.props.sitePageId, this.props.pageBoxId)
                .then(_pageBox => { 
                    this.setState({
                        pageBox: _pageBox,
                        loading: false
                    });      
                });
        }         
    }

    onSubmit = () => {
        if (this.state.pageBox.appSiteId > 0 && this.state.pageBox.sitePageId > 0 && this.state.pageBox.pageBoxId > 0) {
            this.updatePageBox();
        } else {
            this.createPageBox();            
        }
    }

    createPageBox() {
        appSiteService.createPageBox({ pageBox: this.state.pageBox })
            .then((result) => {
                if (result.hasErrors) {
                    alertService.error('Problemi durante salvataggio.', { keepAfterRouteChange: true });
                } else {
                    alertService.success('Pagina aggiunta con successo', { keepAfterRouteChange: true });
                }             
                this.props.handleSaved();                
            })
            .catch(error => {
                alertService.error(error);
            });
    }

    updatePageBox() {
        appSiteService.updatePageBox({ pageBox: this.state.pageBox })
            .then((result) => {
                if (result.hasErrors) {
                    alertService.error('Problemi durante salvataggio.', { keepAfterRouteChange: true });
                } else {
                    alertService.success('Aggiornamento riuscito', { keepAfterRouteChange: true });
                }                
                this.props.handleSaved();            
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
                        <Form.Group>
                            <Form.Label>Tipo di contenuto</Form.Label>
                            <Form.Control as="select" disabled={this.state.pageBox.pageBoxId > 0} value={this.state.pageBox.boxType} name="boxType" onChange={this.handleChangeNumber}>
                                <option value={0}>Seleziona un tipo</option>
                                {BoxTypes && BoxTypes.map(boxType =>
                                    <option key={boxType.value} value={parseInt(boxType.value)}>{boxType.label}</option>
                                )}   
                            </Form.Control>
                            <Form.Text className="text-muted">
                                I tipi servono per impostare il formato e le proprietà del contenitore.
                            </Form.Text>
                        </Form.Group>
                        <div className="flex space-x-4 mt-2">
                            {this.state.pageBox && this.state.pageBox.boxType &&
                            <div className="flex-1">
                                <div className="flex flex-col">
                                    <Form.Label className="font-bold">Seleziona immagine {(this.state.pageBox.boxType !== 8 && this.state.pageBox.boxType !== 9) ? 'di Sfondo' : ''}</Form.Label>
                                    {this.state.pageBox.imageUrl && 
                                    <Image className="w-32" src={baseImageUrl+this.state.pageBox.imageUrl} fluid />}
                                    {this.state.pageBox.imageUrl !== '' &&
                                    <Button onClick={() => this.handleFieldReset('imageUrl')} className="mt-2 bg-red-400">
                                        Rimuovi immagine
                                    </Button>}
                                </div>
                                {this.state.pageBox.imageUrl === '' &&
                                <div>                                    
                                    <Uploader prefix={this.state.pageBox.appSiteId} fileName={this.state.pageBox.imageUrl} onFileNameChange={this.handleFileName} />      
                                    <small>Utilizzare immagini con formato 640 X 640 px.</small>
                                </div>}
                            </div>}                                 

                            {this.state.pageBox && !this.state.loading && 
                            <Form.Group className="flex-1 flex flex-col"> 
                                <Form.Label className="font-bold">Seleziona colore di Sfondo</Form.Label>
                                <div className="flex-none m-2 mt-0">
                                    <CompactPicker                                        
                                        color={ this.state.pageBox.boxColor }
                                        onChangeComplete={ (color) => this.handleColorChange(color) } />
                                </div>                                
                                <div className="flex-grow m-2">
                                    <SliderPicker
                                        color={ this.state.pageBox.boxColor }
                                        onChangeComplete={ (color) => this.handleColorChange(color) } />
                                </div>                                                                        
                                {this.state.pageBox.boxColor !== '' &&
                                <Button onClick={() => this.handleFieldReset('boxColor')} className="mt-2 bg-red-400">
                                    Rimuovi colore
                                </Button>}
                                <Form.Text className="text-muted">
                                    Colore di sfondo per i contenitori di testo. Attenzione scegliere colori contrastanti tra sfondo e testo per una buona leggibilità dei contenuti.
                                </Form.Text>
                            </Form.Group>}
                        </div>
                        
                        <Row>
                            {/* <Col sm={6}>
                                <Form.Group>
                                    <Form.Label className="font-bold">Ordinamento</Form.Label>
                                    <input type="number" className="form-control" name="sortId" value={this.state.pageBox.sortId} onChange={this.handleChangeNumber}  />
                                    <Form.Text className="text-muted">
                                        Valore per ordinamento crescente dei contenitori nella pagina. E' consigliato utilizzare valori con step di 10 (10,10,30,ecc) per avere la possibilità di inserire pagine intermedie in futuro.
                                    </Form.Text>
                                </Form.Group>      
                            </Col> */}
                            <Col sm={12}>
                                {!this.state.loading && this.state.languageCode == '' &&
                                <Form.Group>
                                    <Form.Label className="font-bold">Titolo</Form.Label>                                    
                                    {this.state.pageBox.pageBoxId > 0 && this.state.pageBox.boxType === 1 &&
                                    <div className="ring-2 rounded-lg p-1">
                                        {parse(this.state.pageBox.title)}
                                    </div>}
                                    {(this.state.pageBox.pageBoxId < 1 || this.state.pageBox.boxType !== 1) && 
                                    <input type="text" className="form-control" name="title" value={this.state.pageBox.title} onChange={this.handleChange}  />}
                                    <Form.Text className="text-muted">
                                            Titolo del contenuto. Attenzione una volta creato il contenitore testo le modifiche al titolo sono valide solo da anteprima.
                                    </Form.Text>
                                </Form.Group>}                                       

                                {this.state.languageCode !== '' &&
                                <div>
                                    <LanguageEditor 
                                        originalText={this.state.pageBox.title}
                                        appSiteId={this.state.pageBox.appSiteId} 
                                        code={this.state.languageCode}
                                        inline={true}
                                        labelKey={`PAGEBOX_${this.state.pageBox.appSiteId}_${this.state.pageBox.sitePageId}_${this.state.pageBox.pageBoxId}-Title`}>
                                    </LanguageEditor>
                                </div>}  
                            </Col>
                        </Row>
                                                
                        {/* <Form.Group>
                            <Form.Label>Dimensione</Form.Label>
                            <Form.Control as="select" value={this.state.pageBox.cardSize} name="cardSize" onChange={this.handleChangeNumber}>
                                <option value={0}>Seleziona una dimensione</option>
                                {CardSizes && CardSizes.map(cardSize =>
                                    <option key={cardSize.value} value={parseInt(cardSize.value)}>{cardSize.label}</option>
                                )}   
                            </Form.Control>
                            <Form.Text className="text-muted">
                                I tipi servono per impostare la dimensionw del contenitore.
                            </Form.Text>
                        </Form.Group>       */}
                        
                        {this.state.pageBox && this.state.sitePages && !this.state.loadingPages && 
                        <Form.Group>
                            <Form.Label className="text-xl">Landing Page (pagina di approdo):</Form.Label>
                            <Form.Control as="select" value={this.state.pageBox.landingPageId} name="landingPageId" onChange={this.handleChangeNumber}>
                                <option value={undefined}>Nessun collegamento</option>
                                {this.state.sitePages && this.state.sitePages.map(landingPage =>
                                    <option key={landingPage.sitePageId} value={parseInt(landingPage.sitePageId)}>{landingPage.titleUrl}</option>
                                )}   
                            </Form.Control>
                            <Form.Text className="text-muted">
                                Utilizzare la funzione 'LandingPage' per trasformare il contenitore in un collegamento a una pagina di approdo (sono valide tutte le pagine, non solo le landing page).
                                Selezionare il valore 'Nessun collegamento' per non attivare il collegamento. 
                                Se viene selezionata una pagina il contenitore puntera alla pagina selezionata (viene aggiunto un bottone sul fondo del contenitore): è possibile annidare vari collegamenti creando percorsi all'interno delle pagine del sito basate sulle preferenze di utente.
                            </Form.Text>
                        </Form.Group>}

                        {this.state.pageBox.boxType === 10 && 
                        <Form.Group>
                            <Form.Label>Email di recapito</Form.Label>
                            <input type="text" className="form-control" name="boxEmail" value={this.state.pageBox.boxEmail} onChange={this.handleChange}  />
                            <Form.Text className="text-muted">
                                Indicare un indirizzo email valido a cui recapitare le richieste inviate da questo contenitore (lasciare vuoto per utilizzare la mail principale inserita nei riferimenti del sito).
                            </Form.Text>
                        </Form.Group>} 

                        {this.state.pageBox.boxType === 11 && 
                        <Form.Group>
                            <Form.Label>Indirizzo della pagina Facebook</Form.Label>
                            <input type="text" className="form-control" name="boxEmail" value={this.state.pageBox.boxEmail} onChange={this.handleChange}  />
                            <Form.Text className="text-muted">
                                Indicare url della pagina facebook da visualizzare (esempio https://www.facebook.com/xxxxxxx). Indirizzo deve essere completo. 
                            </Form.Text>
                        </Form.Group>} 

                        {this.state.pageBox.boxType === 12 && 
                        <Form.Group>
                            <Form.Label>Nome utente della pagina Instagram</Form.Label>
                            <input type="text" className="form-control" name="boxEmail" value={this.state.pageBox.boxEmail} onChange={this.handleChange}  />
                            <Form.Text className="text-muted">
                                Indicare nome utente della pagina instagram da visualizzare (esempio xxxxxxx). Il nome utente è contenuto nell'indirizzo della pagina profilo del relativo utente (esempio: https://www.instagram.com/nomeutente).
                            </Form.Text>
                        </Form.Group>} 

                        {this.state.pageBox.boxType === 13 && 
                        <Form.Group>
                            <Form.Label>Video Youtube</Form.Label>
                            <input type="text" className="form-control" name="boxEmail" value={this.state.pageBox.boxEmail} onChange={this.handleChange}  />
                            <Form.Text className="text-muted">
                                Indicare url della pagina facebook da visualizzare (esempio https://www.youtube.com/watch?v=xxxxxxx). Indirizzo della pagina deve essere completo.
                            </Form.Text>
                        </Form.Group>} 

                        {this.state.pageBox.boxType === 7 && 
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Latitudine</Form.Label>
                                    <input type="number" className="form-control" name="boxLatitude" value={this.state.pageBox.boxLatitude} onChange={this.handleChangeNumber} />
                                    <Form.Text className="text-muted">
                                        Latitudine utilizzata per contenitore Mappa (lasciare a 0 per utilizzare valore di sito). Per ottenere le coordinate di un luogo è possibile utilizzare il sito https://www.mapcoordinates.net/it.
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Longitudine</Form.Label>
                                    <input type="number" className="form-control" name="boxLongitude" value={this.state.pageBox.boxLongitude} onChange={this.handleChangeNumber} />
                                    <Form.Text className="text-muted">
                                        Longitudine utilizzata per contenitore Mappa (lasciare a 0 per utilizzare valore di sito).  Per ottenere le coordinate di un luogo è possibile utilizzare il sito https://www.mapcoordinates.net/it.
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                        </Row>}    

                        {this.state.pageBox.boxType === 14 && 
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Percorso del contenitore</Form.Label>
                                    <SiteSurveySelect name="siteSurveyId" appSiteId={this.state.pageBox.appSiteId} siteSurveyId={this.state.pageBox.siteSurveyId} onChange={this.handleSiteSurveyChange} />
                                    <Form.Text className="text-muted">
                                        Seleziona il percorso da inserire nel contenitore.
                                    </Form.Text>
                                </Form.Group>
                            </Col>                            
                        </Row>}                    
                        
                        <Form.Group className="mart2">
                            <Form.Check type="checkbox" label="Pubblico" name="isPublished" checked={this.state.pageBox.isPublished} onChange={this.handleChangeBool} />
                            <Form.Text>
                                Solo i contenuti pubblici vengono visualizzati nel sito. Puoi creare il contenitore e salvarlo come bozza per pubblicarlo al momento opportuno.
                            </Form.Text>
                        </Form.Group>

                    </Card.Body>
                </Card>
                <Navbar fixed="bottom" variant="dark" bg="dark">
                    <Nav className="mr-auto">
                        <Button onClick={this.onSubmit}  className="flex items-center justify-center rounded-full bg-green-500">
                            <FaSave className="mr-2" /> Salva
                        </Button>                         
                    </Nav>
                    <Form inline>
                        <LanguageSelect appSiteId={this.state.pageBox.appSiteId} onLanguageChange={this.handleLanguageCode} />                   
                    </Form>
                </Navbar>                
            </>          
        );
    }
}

export { PageBoxAddEdit }