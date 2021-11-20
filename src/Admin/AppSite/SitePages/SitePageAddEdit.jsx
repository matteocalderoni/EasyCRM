import React from 'react';
import { Link } from 'react-router-dom';
import { appSiteService, alertService } from '../../../_services';
import { Uploader,LanguageSelect,LanguageEditor,PositionSelect } from '../../../_components'
import { Form, Button, Card, ProgressBar,Navbar, Nav, Image, Row, Col } from 'react-bootstrap'
import { Editor } from "@tinymce/tinymce-react";
import { FaSave, FaLanguage, FaBoxes} from 'react-icons/fa';
import {menuSettings,pluginsSettings,toolbarSettings } from '../../../_helpers/tinySettings';
import { fetchWrapper } from '../../../_helpers/fetch-wrapper';

const baseUrl = `${process.env.REACT_APP_API_URL}/upload`;
const baseImageUrl = `${process.env.REACT_APP_STORAGE_URL}/`;
class SitePageAddEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {   
            sitePage: {
                appSiteId: this.props.appSiteId,                         
                sitePageId: this.props.sitePageId,
                parentPageId: this.props.parentPageId,
                imageUrl: 'grey-background.jpg',
                title: '',
                titleUrl: '',
                titleNav: '',
                description: '',
                slideText: '',
                sortId: 1,
                isPublished: true,
                logoPosition: 1
            },
            companyLogo: '', 
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
                    sitePages: x.result.filter((i) => i.sitePageId !== this.state.sitePage.sitePageId),
                    loadingPages: false
                })
            } else {
                // Empty
                this.setState({sitePages: [], loadingPages: false})
            }
        });

        appSiteService.getAppSiteById(this.props.appSiteId)
            .then((x) => {
                this.setState({companyLogo: x.companyLogo})
            })
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

    tiny_image_upload_handler = (blobInfo, success, failure, progress) => {
        const fileName = (this.state.sitePage.appSiteId + '/' || '') + new Date().getTime() + '.jpeg';
    
        // Request made to the backend api 
        // Send formData object 
        fetchWrapper.postFile(`${baseUrl}/CloudUpload`, blobInfo.blob(), fileName)
            .then((result) => {
                success(`${baseImageUrl}${result.fileName}`);                
            });         
      };                  

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
                        <div className="flex p-2 border rounded content-center">
                            <label className="text-xl">Immagine di sfondo:</label>
                            <div>
                                <Image className="border rounded w-32" src={baseImageUrl+this.state.sitePage.imageUrl} />
                                <Uploader prefix={this.state.sitePage.appSiteId} fileName={this.state.sitePage.imageUrl} onFileNameChange={this.handleFileName} />      
                            </div>
                            <small>Questa immagine viene utilizzate come sfondo della pagina: su desktop rimane fissa, su mobile scorre. E' consigliato utilizzare un immagine con formato 1920 X 1080 px.</small>
                        </div>}
                        <div className="p-2 border rounded mt-2">                            
                            {this.state.sitePage && this.state.sitePages && !this.state.loadingPages && <Form.Group>
                                <Form.Label className="text-xl">Sotto pagina di:</Form.Label>
                                <Form.Control as="select" value={this.state.sitePage.parentPageId} name="parentPageId" onChange={this.handleChangeNumber}>
                                    <option value={undefined}>Radice</option>
                                    {this.state.sitePages && this.state.sitePages.map(parentPage =>
                                        <option key={parentPage.sitePageId} value={parseInt(parentPage.sitePageId)}>{parentPage.titleUrl}</option>
                                    )}   
                                </Form.Control>
                                <Form.Text className="text-muted">
                                    Utilizzare la funzione 'Sotto-Pagine' per creare dei gruppi nel menù di navigazione ed estendere i contenuti del sito.
                                    Selezionare il valore 'radice' per impostare la pagina nel primo livello del menù. 
                                    Non ci sono limiti ai sotto livelli che è possibile creare (Radice, livello 1, livello 2, livello N)
                                </Form.Text>
                            </Form.Group>}
                            <div className="flex">
                                <Form.Group className="m-2">
                                    <Form.Label className="text-xl">Valore per Ordinamento</Form.Label>
                                    <input type="number" className="form-control" name="sortId" value={this.state.sitePage.sortId} onChange={this.handleChangeNumber}  />
                                    <Form.Text className="text-muted">
                                        Le pagine vengono visualizzate in ordine crescente.
                                    </Form.Text>
                                </Form.Group> 
                                <Form.Group className="m-2">
                                    <Form.Label className="text-xl"><b>Titolo</b> della pagina</Form.Label>
                                    <input type="text" className="form-control" name="titleUrl" value={this.state.sitePage.titleUrl} onChange={this.handleChange} maxLength={200} />
                                    <Form.Text className="text-muted">
                                        Titolo della pagina per selezione: non viene visualizzato nel sito, viene utilizzato solo per identificare la pagina (ad esempio in selezione sottopagine).
                                    </Form.Text>
                                </Form.Group>
                            </div>
                            
                            {!this.state.loading && this.state.languageCode == '' && 
                            <Form.Group>
                                <Form.Label className="text-xl"><b>Titolo</b> per Menù Navigazione</Form.Label>                                
                                <div className="editor-inline">
                                    <Editor
                                        apiKey={process.env.REACT_APP_TINTMCE_KEY}
                                        initialValue={this.state.sitePage.titleNav}                                
                                        inline={true}
                                        init={{
                                            height: 500,                                        
                                            menubar: menuSettings,
                                            plugins: pluginsSettings,
                                            toolbar: toolbarSettings,
                                            font_formats: "Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Montserrat=montserrat; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats",
                                            content_style: "@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@200&display=swap');",
                                            images_upload_handler: this.tiny_image_upload_handler
                                        }}
                                        onEditorChange={this.handleTitleNavEditorChange}
                                        >
                                    </Editor> 
                                </div>
                                <Form.Text className="text-muted">
                                    Titolo della pagina per il menù di navigazione: viene visualizzato nel menù di navigazione in alto nella pagina.                                    
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
                                Posizione del logo nella slide della pagina. Ogni pagina dispone della sua slide ed è possibile creare delle varianti in base al contesto della pagina.
                            </Form.Text>

                        </div>
                    </div>    

                    
                    <div style={{backgroundImage: `url(${baseImageUrl+this.state.sitePage.imageUrl})`}} className="fixed-background border rounded mt-2 p-2">
                        <Row>
                            {(this.state.sitePage.logoPosition == 1 || this.state.sitePage.logoPosition == 2) && 
                            <Col sm={this.state.sitePage.logoPosition == 1 ? 12 : 6} className="text-center">
                                <Image className="slide-logo" src={baseImageUrl+this.state.companyLogo}></Image>
                            </Col>}
                            <Col sm={(this.state.sitePage.logoPosition == 2 || this.state.sitePage.logoPosition == 4) ? 6 : 12}>
                                
                            {!this.state.loading && this.state.languageCode == '' && 
                            <Form.Group>
                            <Form.Label className="text-xl">Titolo della Slide</Form.Label>
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
                                        toolbar: toolbarSettings,
                                        font_formats: "Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Montserrat=montserrat; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats",
                                        content_style: "@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@200&display=swap');",
                                        images_upload_handler: this.tiny_image_upload_handler
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

                        {!this.state.loading && this.state.sitePage.sitePageId > 0 && this.state.languageCode == '' &&
                            <div>
                                <label className="text-xl">Testo della Slide</label>
                                <div className="editor-inline">
                                    <Editor
                                        apiKey={process.env.REACT_APP_TINTMCE_KEY}
                                        initialValue={this.state.sitePage.slideText}      
                                        inline={true}                          
                                        init={{
                                            height: 500,
                                            menubar: menuSettings,
                                            plugins: pluginsSettings,
                                            toolbar: toolbarSettings,
                                            font_formats: "Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Montserrat=montserrat; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats",
                                            content_style: "@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@200&display=swap');",
                                            images_upload_handler: this.tiny_image_upload_handler
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

                            </Col>
                            {(this.state.sitePage.logoPosition == 3 || this.state.sitePage.logoPosition == 4) && <Col sm={this.state.sitePage.logoPosition == 3 ? 12 : 6} className="text-centet">
                                <Image className="slide-logo" src={baseImageUrl+this.state.companyLogo}></Image>
                            </Col>}
                        </Row>     

                        
                    </div>
                    
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
                    <Button onClick={() => this.onSubmit()} className="w-1/2 flex items-center justify-center rounded-md bg-green-500">
                        <FaSave className="mr-2" /> Salva
                    </Button> 
                    {this.state.sitePage.sitePageId > 0 && 
                    <Link title="Vai a gestione contenuti della pagina" to={`/admin/sites/sitepages/pageboxes/${this.state.sitePage.appSiteId}/${this.state.sitePage.sitePageId}`} 
                        className="w-1/2 flex items-center justify-center rounded-md  bg-blue-400 text-white p-2 ml-5">
                        <FaBoxes className="mr-2" /> Gestione Contenitori
                    </Link>}
                    {this.state.sitePage.sitePageId > 0 && 
                    <Link to={`/admin/sites/edit/${this.state.sitePage.appSiteId}`}
                        className="w-1/2 flex items-center justify-center rounded-md  bg-blue-500 text-white p-2">
                        <FaLanguage className="mr-2" /> modifica sito
                    </Link>}
                </Nav>
                <Form inline>
                    {!this.state.loading &&
                    <LanguageSelect appSiteId={this.state.sitePage.appSiteId} onLanguageChange={(code) => this.handleLanguageCode(code)} />}
                </Form>
            </Navbar>                
          </>          
        );
    }
}

export { SitePageAddEdit }