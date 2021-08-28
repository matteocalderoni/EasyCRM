import React from 'react';
import { Link } from 'react-router-dom';
import { appSiteService, alertService } from '../../../_services';
import { Uploader,LanguageSelect,LanguageEditor,PositionSelect } from '../../../_components'
import { Form, Button, Card, Image, ProgressBar,Navbar, Nav } from 'react-bootstrap'
import { Editor } from "@tinymce/tinymce-react";
import { FaSave, FaLanguage, FaBoxes} from 'react-icons/fa';
import {menuSettings,pluginsSettings,toolbarSettings } from '../../../_helpers/tinySettings';
import parse from 'html-react-parser';

const baseImageUrl = `${process.env.REACT_APP_STORAGE_URL}/`;
class SitePageAddEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {   
            sitePage: {
                appSiteId: this.props.appSiteId,                         
                sitePageId: this.props.sitePageId,
                parentPageId: this.props.parentPageId,
                imageUrl: 'logo.png',
                title: '',
                titleUrl: '',
                titleNav: '',
                description: '',
                slideText: '',
                sortId: 1,
                isPublished: true,
                logoPosition: 1
            },
            languageCode: '',
            sitePages: [],
            loading: false,
            loadingPages: true                         
         };

        this.handleChange = this.handleChange.bind(this)
        this.handleChangeNumber = this.handleChangeNumber.bind(this)
        this.handleChangeBool = this.handleChangeBool.bind(this)
    }

    componentDidMount() {
        this.handleOpen()

        appSiteService.getPagesOfAppSite(this.props.appSiteId,-1).then((x) => { 
            if (x.totalCount > 0) {
                // Filter current page
                this.setState({                
                    sitePages: x.result.filter((i) => i.sitePageId != this.state.sitePage.sitePageId),
                    loadingPages: false
                })
            } else {
                // Empty
                this.setState({sitePages: [], loadingPages: false})
            }
        });
    }

    handleChange(evt) {
        const value = evt.target.value;
        this.setState({
            sitePage: {
                ...this.state.sitePage,
                [evt.target.name]: value
            }          
        });
    }

    handleFileName = (fileName) => {        
        this.setState({ 
            sitePage: {
                ...this.state.sitePage,
                imageUrl: fileName
            }
        });        
    }

    handleLanguageCode = (code) => {        
        this.setState({ 
            languageCode: code
        });        
    }

    handleLogoPosition = (position) => {        
        this.setState({ 
            sitePage: {
                ...this.state.sitePage,
                logoPosition: position                
            }          
        });        
    }

    handleChangeNumber(evt) {
        const value = parseInt(evt.target.value);
        this.setState({
            sitePage: {
                ...this.state.sitePage,
                [evt.target.name]: value                
            }          
        });
    }

    handleChangeBool(evt) {  
        this.setState({
            sitePage: {
                ...this.state.sitePage,
                [evt.target.name]: evt.target.checked                 
            }          
        });
    }

    handleEditorChange = (content, editor) => {
        this.setState({
            sitePage: {
                ...this.state.sitePage,
                slideText: content                 
            }          
        });
    }

    handleTitleNavEditorChange = (content, editor) => {
        this.setState({
            sitePage: {
                ...this.state.sitePage,
                titleNav: content                 
            }          
        });
    }

    handleTitleEditorChange = (content, editor) => {
        this.setState({
            sitePage: {
                ...this.state.sitePage,
                title: content                 
            }          
        });
    }

    handleOpen() {    
        if (this.props.sitePageId > 0) {
            this.setState({loading: true})
            appSiteService.getSitePageById(this.props.appSiteId, this.props.sitePageId)
                .then(_sitePage => {                    
                    this.setState({
                        sitePage: _sitePage,
                        loading: false
                    })                    
                });
        }         
    }
    
    onSubmit = () => {
        if (this.state.sitePage.appSiteId > 0 && this.state.sitePage.sitePageId > 0) {
            this.updateSitePage();
        } else {
            this.createSitePage();            
        }
    }

    createSitePage() {
        appSiteService.createSitePage({ sitePage: this.state.sitePage })
            .then(result => {
                if (result.hasErrors) {
                    alertService.error('Problemi durante il salvataggio', { keepAfterRouteChange: true });
                } else {
                    alertService.success('Pagina aggiunta con successo', { keepAfterRouteChange: true });
                }            
                if (this.props.handleSaved)    
                    this.props.handleSaved(this.state.sitePage.appSiteId);                
            })
            .catch(error => {
                alertService.error(error);
            });
    }

    updateSitePage() {
        appSiteService.updateSitePage({ sitePage: this.state.sitePage })
            .then(result => {
                if (result.hasErrors) {
                    alertService.error('Problemi durante il salvataggio', { keepAfterRouteChange: true });
                } else {
                    alertService.success('Aggiornamento riuscito', { keepAfterRouteChange: true });
                }    
                if (this.props.handleSaved)                                
                    this.props.handleSaved(this.state.sitePage.appSiteId);                
            })
            .catch(error => {
                alertService.error(error);
            });
    }     

    render() {
        return (            
          <>
            <Card>                
                <Card.Body className="home container-fluid">                    
                    {this.state.loading && <div className="text-center mart2">
                        <ProgressBar animated now={100} />
                    </div>}
                    <div>
                        {this.state.sitePage.sitePageId > 0 &&                    
                        <div className="flex-col content-center">
                            <Image className="border rounded" src={baseImageUrl+this.state.sitePage.imageUrl} />
                            <Uploader prefix={this.state.sitePage.appSiteId} fileName={this.state.sitePage.imageUrl} onFileNameChange={this.handleFileName} />      
                            <small>Questa immagine viene utilizzate come sfondo della pagina: su desktop rimane fissa, su mobile scorre. E' consigliato utilizzare un immagine con formato 1920 X 1080 px.</small>
                        </div>}
                        <div>                            
                            {this.state.sitePage && this.state.sitePages && !this.state.loadingPages && <Form.Group>
                                <Form.Label>Sotto pagina di (non selezionare per pagine principali):</Form.Label>
                                <Form.Control as="select" value={this.state.sitePage.parentPageId} name="parentPageId" onChange={this.handleChangeNumber}>
                                    <option value={undefined}>Radice</option>
                                    {this.state.sitePages && this.state.sitePages.map(parentPage =>
                                        <option key={parentPage.sitePageId} value={parseInt(parentPage.sitePageId)}>{parentPage.titleUrl}</option>
                                    )}   
                                </Form.Control>
                                <Form.Text className="text-muted">
                                    Utilizzare le sottopagine per creare dei gruppi nel menù di navigazione ed estendere i contenuti del sito.
                                </Form.Text>
                            </Form.Group>}

                            <Form.Group>
                                <Form.Label>Valore per Ordinamento</Form.Label>
                                <input type="number" className="form-control" name="sortId" value={this.state.sitePage.sortId} onChange={this.handleChangeNumber}  />
                                <Form.Text className="text-muted">
                                    Le pagine vengono visualizzate in ordine crescente.
                                </Form.Text>
                            </Form.Group> 

                            <Form.Group>
                                <Form.Label><b>Titolo</b> della pagina (no formattazione)</Form.Label>
                                <input type="text" className="form-control" name="titleUrl" value={this.state.sitePage.titleUrl} onChange={this.handleChange} maxLength={200} />
                                <Form.Text className="text-muted">
                                    Titolo della pagina per selezione: non visualizzato nel sito, utilizzato solo per identificare la pagina (ad esempio in selezione sottopagine).
                                </Form.Text>
                            </Form.Group>

                            {!this.state.loading && this.state.languageCode == '' && 
                            <Form.Group>
                                <Form.Label>Titolo per Navigazione</Form.Label>                                
                                <div className="editor-inline">
                                    <Editor
                                        apiKey={process.env.REACT_APP_TINTMCE_KEY}
                                        initialValue={this.state.sitePage.titleNav}                                
                                        inline={true}
                                        init={{
                                            height: 500,                                        
                                            menubar: menuSettings,
                                            plugins: pluginsSettings,
                                            toolbar: toolbarSettings
                                        }}
                                        onEditorChange={this.handleTitleNavEditorChange}
                                        >
                                    </Editor> 
                                </div>

                                <Form.Text className="text-muted">
                                    Titolo della pagina per menù di navigazione: visualizzato nel menù di navigazione in alto nella pagina.
                                </Form.Text>
                            </Form.Group>}

                            {this.state.languageCode && this.state.languageCode !== '' &&
                            <div>
                                <LanguageEditor 
                                    originalText={this.state.sitePage.titleNav}
                                    appSiteId={this.state.sitePage.appSiteId} 
                                    code={this.state.languageCode}
                                    inline={true}
                                    labelKey={`SITEPAGE_${this.state.sitePage.appSiteId}_${this.state.sitePage.sitePageId}-TitleNav`}>                                    
                                </LanguageEditor>                                
                            </div>}       

                            {!this.state.loading &&
                            <PositionSelect position={this.state.sitePage.logoPosition} onPositionChange={this.handleLogoPosition} label={'Posizione del logo'} />}  
                            <Form.Text className="text-muted">
                                Posizione del logo nel contenitore
                            </Form.Text>

                            {!this.state.loading && this.state.languageCode == '' && 
                            <Form.Group>
                                <Form.Label>Titolo della Slide</Form.Label>
                                {/* <input type="text" className="form-control" name="title" value={this.state.sitePage.title} onChange={this.handleChange} maxLength={200} /> */}
                                <div className="editor-inline">
                                    <Editor
                                        apiKey={process.env.REACT_APP_TINTMCE_KEY}
                                        initialValue={this.state.sitePage.title}                                
                                        inline={true}
                                        init={{
                                            height: 500,                                        
                                            menubar: menuSettings,
                                            plugins: pluginsSettings,
                                            toolbar: toolbarSettings
                                        }}
                                        onEditorChange={this.handleTitleEditorChange}
                                        >
                                    </Editor> 
                                </div>

                                <Form.Text className="text-muted">
                                    Titolo della Slide: visualizzato sopra testo slide, posizionato in base a logo.
                                </Form.Text>
                            </Form.Group>}

                            {this.state.languageCode && this.state.languageCode !== '' &&
                            <div>
                                <LanguageEditor 
                                    originalText={this.state.sitePage.title}
                                    appSiteId={this.state.sitePage.appSiteId} 
                                    code={this.state.languageCode}
                                    inline={true}
                                    labelKey={`SITEPAGE_${this.state.sitePage.appSiteId}_${this.state.sitePage.sitePageId}-Title`}>                                    
                                </LanguageEditor>                                
                            </div>}                                                    
                        </div>
                    </div>                    
                    
                    {!this.state.loading && this.state.sitePage.sitePageId > 0 && this.state.languageCode == '' &&
                        <div>
                            <label>Testo visualizzato nella Slide</label>
                            <div className="editor-inline">
                                <Editor
                                    apiKey={process.env.REACT_APP_TINTMCE_KEY}
                                    initialValue={this.state.sitePage.slideText}      
                                    inline={true}                          
                                    init={{
                                        height: 500,
                                        menubar: menuSettings,
                                        plugins: pluginsSettings,
                                        toolbar: toolbarSettings
                                    }}
                                    onEditorChange={this.handleEditorChange}
                                />
                            </div>
                        </div>
                    }

                    {this.state.languageCode && this.state.languageCode !== '' &&
                    <div>
                        <LanguageEditor 
                            originalText={this.state.sitePage.slideText}
                            appSiteId={this.state.sitePage.appSiteId} 
                            code={this.state.languageCode}
                            inline={true}
                            labelKey={`SITEPAGE_${this.state.sitePage.appSiteId}_${this.state.sitePage.sitePageId}-SlideText`}>                                    
                        </LanguageEditor>
                    </div>}

                    <Form.Group className="mart2">
                        <Form.Check type="checkbox" label="Pubblico" name="isPublished" checked={this.state.sitePage.isPublished} onChange={this.handleChangeBool} />
                        <Form.Text>
                            Solo i contenuti pubblici vengono visualizzati nel sito. Puoi creare la pagina e salvarla come bozza per pubblicarla al momento opportuno.
                        </Form.Text>
                    </Form.Group>

                </Card.Body>    
            </Card>                    
            <Navbar fixed="bottom" className="flex bg-blue-800">
                <Nav className="flex space-x-3 text-sm font-medium mr-auto">
                    <Button onClick={this.onSubmit} className="w-1/2 flex items-center justify-center rounded-md bg-green-500">
                        <FaSave /> Salva
                    </Button> 
                    {this.state.sitePage.sitePageId > 0 && <Link title="Vai a gestione contenuti della pagina" to={`/admin/sites/sitepages/pageboxes/${this.state.sitePage.appSiteId}/${this.state.sitePage.sitePageId}`} className="flex items-center justify-center rounded-md bg-green-200 p-1 text-green-900">
                        <FaBoxes /> Contenitori
                    </Link>}
                    {this.state.sitePage.sitePageId > 0 && <Link className="flex items-center justify-center rounded-md bg-green-200 p-1 text-green-900" to={`/admin/sites/edit/${this.state.sitePage.appSiteId}`}>
                        <FaLanguage /> modifica sito
                    </Link>}
                </Nav>
                <Form inline>
                    {!this.state.loading &&
                    <LanguageSelect appSiteId={this.state.sitePage.appSiteId} onLanguageChange={this.handleLanguageCode} />}
                </Form>
            </Navbar>                
          </>          
        );
    }
}

export { SitePageAddEdit }