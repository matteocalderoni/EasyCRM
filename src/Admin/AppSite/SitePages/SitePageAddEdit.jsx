import React from 'react';
import { Link } from 'react-router-dom';
import { appSiteService, alertService } from '../../../_services';
import { Uploader,LanguageSelect,LanguageEditor,PositionSelect } from '../../../_components'
import { Form, Button, Card, Navbar, Nav, Image, Row, Col, ProgressBar } from 'react-bootstrap'
import { CompactPicker,SliderPicker } from 'react-color';
import { Editor } from "@tinymce/tinymce-react";
import { FaSave } from 'react-icons/fa';
import {menuSettings,pluginsSettings,toolbarSettings,fontSettings,styleSettings } from '../../../_helpers/tinySettings';
import { fetchWrapper } from '../../../_helpers/fetch-wrapper';
import { PageTypeSelect } from '../../../_components/Select/PageTypeSelect';
import { NavPositionSelect } from '../../../_components/Select/NavPositionSelect';
import { NavAlignSelect } from '../../../_components/Select/NavAlignSelect';
import { FooterNav } from '../../../_components/FooterNav';

const baseUrl = `${process.env.REACT_APP_API_URL}/upload`;
const baseImageUrl = `${process.env.REACT_APP_STORAGE_URL}/`;

class SitePageAddEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {   
            sitePage: this.props.sitePage,
            companyLogo: this.props.appSite ? this.props.appSite.companyLogo : '', 
            languageCode: '',
            sitePages: [],
            loadingPages: true                         
         };

        this.handleChange = this.handleChange.bind(this)
        this.handleChangeNumber = this.handleChangeNumber.bind(this)
        this.handleChangeBool = this.handleChangeBool.bind(this)        
    }

    componentDidMount() {
        // get sub pages 
        appSiteService.getPagesOfAppSite('',this.props.appSiteId,-1,-1).then((x) => { 
            if (x.totalCount > 0) {
                // Filter current page
                this.setState({                
                    sitePages: x.result.filter((i) => i.sitePageId !== this.state.sitePage.sitePageId),
                    loadingPages: false
                })
            } else this.setState({sitePages: [], loadingPages: false})            
        });
    }

    handleChange(evt) {
        const value = evt.target.value;
        this.setState({ sitePage: { ...this.state.sitePage, [evt.target.name]: value } });
    }

    handleFileName = (fileName) => {        
        this.setState({ sitePage: { ...this.state.sitePage, imageUrl: fileName } });        
    }

    handleLanguageCode = (code) => {        
        this.setState({ languageCode: code })
    }

    handleLogoPosition = (position) => {        
        this.setState({ sitePage: { ...this.state.sitePage, logoPosition: position } });        
    }

    handleNavPosition = (position) => {
        this.setState({ sitePage: { ...this.state.sitePage, navPosition: position } });        
    }

    handleNavAlign = (align) => {
        this.setState({ sitePage: { ...this.state.sitePage, navAlign: align } });        
    }

    handleChangeNumber(evt) {
        const value = parseInt(evt.target.value);
        this.setState({ sitePage: { ...this.state.sitePage, [evt.target.name]: value } });
    }

    handleChangeBool(evt) {  
        this.setState({ sitePage: { ...this.state.sitePage, [evt.target.name]: evt.target.checked } });
    }

    handleEditorChange = (content, editor) => {
        this.setState({ sitePage: { ...this.state.sitePage, slideText: content } });
    }

    handleTitleNavEditorChange = (content, editor) => {
        this.setState({ sitePage: { ...this.state.sitePage, titleNav: content } });
    }

    handleTitleEditorChange = (content, editor) => {
        this.setState({ sitePage: { ...this.state.sitePage, title: content } });
    }

    handleColorChange = (color, field) => {
        this.setState({ sitePage: { ...this.state.sitePage, [field]: color.hex } });
    };

    handleColorRemove = (field) => { 
        this.setState({ sitePage: { ...this.state.sitePage, [field]: '' } }); 
    }

    handlePageTypeChange = (pageType) => {
        this.setState({ sitePage: { ...this.state.sitePage, pageType: pageType } });
    }
    
    onSubmit = () => {
        if (this.state.sitePage.appSiteId > 0 && this.state.sitePage.sitePageId > 0) 
            this.updateSitePage();
        else
            this.createSitePage();                    
    }

    tiny_image_upload_handler = (blobInfo, success, failure, progress) => {
        const fileName = (this.state.sitePage.appSiteId + '/' || '') + new Date().getTime() + '.jpeg';    
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
                    this.setState({ 
                        sitePage: result
                    });        
                }            
                if (this.props.handleSaved)    
                    this.props.handleSaved(this.state.sitePage.appSiteId);                
            })
            .catch(error => alertService.error(error));
    }

    updateSitePage() {
        appSiteService.updateSitePage({ sitePage: this.state.sitePage })
            .then(result => {
                if (result.hasErrors) {
                    alertService.error('Problemi durante il salvataggio', { keepAfterRouteChange: true });
                } else {
                    alertService.success('Aggiornamento riuscito', { keepAfterRouteChange: true });
                    this.setState({ 
                        sitePage: result
                    });        
                }    
                if (this.props.handleSaved)                                
                    this.props.handleSaved(this.state.sitePage.appSiteId);                
            })
            .catch(error => alertService.error(error));
    }     

    render() {
        return (            
          <>
            <Card>                
                <Card.Body className='bg-gray-100'>                                        
                    <div>
                        {this.state.loadingPages && 
                        <div className="text-center mb-3">
                            <label>Caricamento in corso...</label>
                            <ProgressBar animated now={100} />
                        </div>}

                        <div className="flex flex-col md:flex-row p-2 rounded-xl shadow-sm content-center bg-white">
                            <div className="flex-1 p-1">
                                {this.state.sitePage && this.state.sitePages && !this.state.loadingPages && 
                                <Form.Group className="flex-1 h-48 lg:h-36">
                                    <Form.Label className="text-xl">Sotto Pagina di:</Form.Label>
                                    <Form.Control as="select" value={this.state.sitePage.parentPageId} name="parentPageId" onChange={this.handleChangeNumber}>
                                        <option value={undefined}>Radice</option>
                                        {this.state.sitePages && this.state.sitePages.map(parentPage =>
                                            <option key={parentPage.sitePageId} value={parseInt(parentPage.sitePageId)}>{parentPage.titleUrl}</option>
                                        )}   
                                    </Form.Control>
                                    <Form.Text className="text-muted text-xs">
                                        Utilizzare la funzione <b>'Sotto-Pagine'</b> per creare gruppi di pagine nel menù di navigazione ed estendere i contenuti del sito.
                                        Selezionare il valore 'radice' per impostare la pagina nel primo livello del menù (sempre visible). 
                                        Non ci sono limiti ai sotto livelli che è possibile creare (Radice, livello 1, livello 2, livello N)
                                    </Form.Text>
                                </Form.Group>}
                                
                                <Form.Group className="flex-1 h-48 lg:h-36">
                                    <Form.Label className="text-xl"><b>Tipo</b> di Pagina</Form.Label>
                                    <PageTypeSelect pageType={this.state.sitePage.pageType} onPageTypeChange={(pageType) => this.handlePageTypeChange(+pageType)} label={'Tipo di pagina'} />
                                    <Form.Text className="text-muted text-xs">
                                        Ci sono diversi tipi di pagina: <b>default</b> è per le pagine disponibili nel menù di navigazione, <b>privacy</b> per 'informativa utilizzo dati'  e <b>landing</b> per pagine di 'approdo' (tramite collegamento).
                                    </Form.Text>
                                </Form.Group>
                            </div>

                            <div className="flex-1 p-1">
                                <Form.Group className="flex-1 h-48 lg:h-36">
                                    <Form.Label className="text-xl">Ordinamento</Form.Label>
                                    <input type="number" className="form-control" name="sortId" value={this.state.sitePage.sortId} onChange={this.handleChangeNumber}  />
                                    <Form.Text className="text-muted text-xs">
                                        Le pagine vengono visualizzate in <b>ordine crescente</b>: inserire il numero corrispondente alla posizione della pagina. 
                                        Anche le sotto-pagine utilizzano lo stesso metodo: la numerazione è relativa al gruppo di pagine.
                                    </Form.Text>
                                </Form.Group> 
                                <Form.Group className="flex-1 h-48 lg:h-36">
                                    <Form.Label className="text-xl"><b>Titolo URL</b> della pagina</Form.Label>
                                    <input type="text" className="form-control" name="titleUrl" value={this.state.sitePage.titleUrl} onChange={this.handleChange} maxLength={200} />
                                    <Form.Text className="text-muted text-xs">
                                        Titolo della pagina per selezione: non viene visualizzato nel sito, viene utilizzato solo per identificare la pagina (ad esempio in selezione sottopagine).
                                        Utilizzare un nome diverso per ogni pagina: viene utilizzato come indirizzo della pagina per indicizzare le ricerche dei motori di ricerca come Google.
                                        <b>Attenzione non utilizzare simboli o spazi.</b>
                                    </Form.Text>
                                </Form.Group>
                            </div>
                        </div>

                        {this.state.sitePage.sitePageId > 0 &&                 
                        <div className="md:flex p-2 mt-2 rounded-xl content-center bg-white shadow-sm">
                            <div className="flex-1 flex flex-col">
                                <label className="text-xl"><b>Immagine</b> di Sfondo:</label>                                
                                {this.state.sitePage && this.state.sitePage.imageUrl != '' &&
                                <Image className="border rounded w-48 mb-2" src={baseImageUrl+this.state.sitePage.imageUrl} />}
                                <Uploader prefix={this.state.sitePage.appSiteId} fileName={this.state.sitePage.imageUrl} onFileNameChange={this.handleFileName} />      
                                <Button onClick={() => this.handleColorRemove('imageUrl')} className="mt-2 bg-red-400">
                                    Rimuovi immagine
                                </Button>                                    
                                <p className="text-muted text-xs">
                                <small>Questa immagine viene utilizzate come sfondo della pagina: su desktop rimane fissa, su mobile scorre. E' consigliato utilizzare un immagine con formato 1920 X 1080 px.
                                    Se viene rimossa immagine viene visualizzato il colore di sfondo.
                                </small>
                                </p>
                            </div>                            
                            <div className="flex-1 flex flex-col">
                            {this.state.sitePage &&
                                <Form.Group className="flex-1 flex flex-col">
                                    <Form.Label className="text-xl"><b>Colore</b> di Sfondo</Form.Label>
                                    <div className="flex-none m-2 mt-0">
                                        <CompactPicker                                        
                                            color={ this.state.sitePage.boxColor }
                                            onChangeComplete={ (color) => this.handleColorChange(color, 'boxColor') } />
                                    </div>                                
                                    <div className="flex-grow m-2">
                                        <SliderPicker
                                            color={ this.state.sitePage.boxColor }
                                            onChangeComplete={ (color) => this.handleColorChange(color, 'boxColor') } />
                                    </div>
                                    {this.state.sitePage && this.state.sitePage.boxColor != '' &&
                                        <Button onClick={() => this.handleColorRemove('boxColor')} className="bg-red-400 m-2">
                                            Rimuovi colore
                                        </Button>                                    
                                    }
                                    <Form.Text className="text-muted text-xs">
                                        Colore di sfondo per la pagina: ogni pagina può avere un colore diverso. Attenzione scegliere colori contrastanti tra sfondo e testo per una buona leggibilità dei contenuti.
                                        Con il bottone rimuovi viene rimosso il colore di sfondo e si utilizza il tema di default.
                                    </Form.Text>
                                </Form.Group>}
                            </div>
                        </div>}

                        {this.state.sitePage.sitePageId > 0 &&                 
                        <div className="p-2 rounded-xl mt-2 shadow-sm bg-white">                            
                                                        
                            <div className="flex flex-col lg:flex-row">

                                <div className="flex-1">
                                    {this.state.sitePage &&
                                    <div className='md:flex'>
                                        <Form.Group className='flex-1'>
                                            <div className="flex flex-col">
                                                <Form.Label className="text-xl">Colore per <b>Navigazione</b></Form.Label><br />
                                                <div className="flex-none m-2 mt-0">
                                                    <CompactPicker                                        
                                                        color={ this.state.sitePage.navColor }
                                                        onChangeComplete={ (color) => this.handleColorChange(color, 'navColor') } />
                                                </div>                                
                                                <div className="flex-grow m-2">
                                                    <SliderPicker
                                                        color={ this.state.sitePage.navColor }
                                                        onChangeComplete={ (color) => this.handleColorChange(color, 'navColor') } />
                                                </div>                                        
                                                {this.state.sitePage && this.state.sitePage.navColor != '' &&
                                                <Button onClick={() => this.handleColorRemove('navColor')} className="bg-red-400 m-2">
                                                    Rimuovi colore
                                                </Button>                                    
                                                }
                                            </div>
                                            <Form.Text className="text-muted text-xs">
                                                Colore di sfondo per il menù di navigazione: ogni pagina può avere un colore diverso. Attenzione scegliere colori contrastanti tra sfondo e testo per una buona leggibilità dei contenuti.
                                                Con il bottone rimuovi la barra di navigazione utilizzi i colori di default o il valore per tutto il sito.
                                            </Form.Text>
                                        </Form.Group>

                                        <Form.Group className='flex-1'>
                                            <div className="flex flex-col">
                                                <Form.Label className="text-xl">Colore per <b>Fondo Pagina</b></Form.Label><br />
                                                <div className="flex-none m-2 mt-0">
                                                    <CompactPicker                                        
                                                        color={ this.state.sitePage.footerColor }
                                                        onChangeComplete={ (color) => this.handleColorChange(color, 'footerColor') } />
                                                </div>                                
                                                <div className="flex-grow m-2">
                                                    <SliderPicker
                                                        color={ this.state.sitePage.footerColor }
                                                        onChangeComplete={ (color) => this.handleColorChange(color, 'footerColor') } />
                                                </div>                                        
                                                {this.state.sitePage && this.state.sitePage.footerColor != '' &&
                                                <Button onClick={() => this.handleColorRemove('footerColor')} className="bg-red-400 m-2">
                                                    Rimuovi colore
                                                </Button>                                    
                                                }
                                            </div>
                                            <Form.Text className="text-muted text-xs">
                                                Colore di sfondo per il fondo pagina: ogni pagina può avere un colore diverso. Attenzione scegliere colori contrastanti tra sfondo e testo per una buona leggibilità dei contenuti.
                                                Con il bottone rimuovi la barra di navigazione utilizzi i colori di default o il valore per tutto il sito.
                                            </Form.Text>
                                        </Form.Group>
                                    </div>
                                    }
                                </div>

                                <div className="flex-1 ml-2">
                                    <Form.Group>
                                        <Form.Label className="text-lg">Posizione <b>Navigazione</b></Form.Label>
                                        <NavPositionSelect position={this.state.sitePage.navPosition} onPositionChange={(position) => this.handleNavPosition(+position)} label={'Posizione Navigazione'} />
                                        <Form.Text className="text-muted text-xs">
                                            Posizione della barra di navigazione: è possibile selezionare il comportamento del menù (fisso o scorrevole). Ogni pagina dispone della sua barra di navigazione ed è possibile creare delle varianti in base al contesto della pagina.
                                        </Form.Text>
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label className="text-lg">Allineamento <b>Navigazione</b></Form.Label>
                                        <NavAlignSelect align={this.state.sitePage.navAlign} onAlignChange={(align) => this.handleNavAlign(+align)} label={'Allineamento Navigazione'} />
                                        <Form.Text className="text-muted text-xs">
                                            Allinemento della barra di navigazione: è possibile selezionare allineamento del menù (sinistra, centro, destra). Ogni pagina dispone della sua barra di navigazione ed è possibile creare delle varianti in base al contesto della pagina.
                                        </Form.Text>
                                    </Form.Group>
                                    
                                    <Form.Group>
                                        <Form.Label className="text-lg">Posizione del <b>Logo nella slide</b></Form.Label>
                                        <PositionSelect position={this.state.sitePage.logoPosition} onPositionChange={(position) => this.handleLogoPosition(+position)} label={'Posizione del logo'} />
                                        <Form.Text className="text-muted text-xs">
                                            Posizione del logo nella slide della pagina. Ogni pagina dispone della sua slide ed è possibile creare delle varianti in base al contesto della pagina.
                                        </Form.Text>
                                    </Form.Group>
                                </div>

                            </div>    
                        </div>}

                    </div>    
                    
                    {this.state.sitePage.sitePageId > 0 &&                 
                    <div>

                        {this.state.languageCode == '' && 
                        <Form.Group className="mt-2">
                            <Form.Label className="text-xl"><b>Titolo</b> per Navigazione</Form.Label>                                
                            <div className="border rounded-lg ring ring-blue-200 p-1" style={{backgroundColor: this.state.sitePage.navColor}}>
                                <Editor
                                    apiKey={process.env.REACT_APP_TINTMCE_KEY}
                                    initialValue={this.state.sitePage.titleNav}                                
                                    inline={true}
                                    init={{
                                        height: 500,                                        
                                        menubar: menuSettings,
                                        plugins: pluginsSettings,
                                        toolbar: toolbarSettings,
                                        font_formats: fontSettings,
                                        content_style: styleSettings,
                                        images_upload_handler: this.tiny_image_upload_handler
                                    }}
                                    onEditorChange={this.handleTitleNavEditorChange}
                                    >
                                </Editor> 
                            </div>
                            <Form.Text className="text-muted text-xs">
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

                        <div style={{ backgroundColor: this.state.sitePage.boxColor, backgroundImage: `url(${baseImageUrl+this.state.sitePage.imageUrl})`}} 
                            className="fixed-background bg-fixed bg-no-repeat bg-contain bg-center border rounded-xl mt-2 p-2">
                            <Row>
                                {(this.state.sitePage.logoPosition === 1 || this.state.sitePage.logoPosition === 2) && 
                                <Col sm={this.state.sitePage.logoPosition === 1 ? 12 : 6} className="text-center">
                                    <Image className="slide-logo" src={baseImageUrl+this.state.companyLogo}></Image>
                                </Col>}
                                <Col sm={(this.state.sitePage.logoPosition === 2 || this.state.sitePage.logoPosition === 4) ? 6 : 12}>
                                    
                                {this.state.languageCode == '' && 
                                <Form.Group>
                                <Form.Label className="text-xl">Titolo della Slide</Form.Label>
                                {/* <input type="text" className="form-control" name="title" value={this.state.sitePage.title} onChange={this.handleChange} maxLength={200} /> */}
                                <div className="border rounded-lg ring ring-blue-200 p-1">
                                    <Editor
                                        apiKey={process.env.REACT_APP_TINTMCE_KEY}
                                        initialValue={this.state.sitePage.title}                                
                                        inline={true}
                                        init={{
                                            height: 500,                                        
                                            menubar: menuSettings,
                                            plugins: pluginsSettings,
                                            toolbar: toolbarSettings,
                                            font_formats: fontSettings,
                                            content_style: styleSettings,
                                            images_upload_handler: this.tiny_image_upload_handler
                                        }}
                                        onEditorChange={this.handleTitleEditorChange}
                                        >
                                    </Editor> 
                                </div>

                                <Form.Text className="text-muted text-xs">
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

                            {this.state.sitePage.sitePageId > 0 && this.state.languageCode == '' &&
                                <div>
                                    <label className="text-xl">Testo della Slide</label>
                                    <div className="border rounded-lg ring ring-blue-200 p-1">
                                        <Editor
                                            apiKey={process.env.REACT_APP_TINTMCE_KEY}
                                            initialValue={this.state.sitePage.slideText}      
                                            inline={true}                          
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
                                {(this.state.sitePage.logoPosition === 3 || this.state.sitePage.logoPosition === 4) && <Col sm={this.state.sitePage.logoPosition === 3 ? 12 : 6} className="text-center">
                                    <Image className="slide-logo" src={baseImageUrl+this.state.companyLogo}></Image>
                                </Col>}
                            </Row>     
                        </div>
                    
                    </div>}

                    <div className='md:flex p-2 mt-2 rounded-xl shadow-sm content-center bg-white'>
                        <div className='flex-1'>
                            <Form.Group className="mt-2">
                                <Form.Check type="checkbox" label="Pubblico" name="isPublished" checked={this.state.sitePage.isPublished} onChange={this.handleChangeBool} />
                                <Form.Text>
                                    Solo i contenuti pubblici vengono visualizzati nel sito. Puoi creare la pagina e salvarla come bozza per pubblicarla al momento opportuno.
                                </Form.Text>
                            </Form.Group>
                        </div>
                        <div className='flex-1'>
                            <Form.Group className="mt-2">
                                <Form.Check type="checkbox" label="Login richiesto" name="loginRequest" checked={this.state.sitePage.loginRequest} onChange={this.handleChangeBool} />
                                <Form.Text>
                                Se richiesto il login la pagina è disponibile solo agli utenti registrati, ad accesso effettuato.
                                </Form.Text>
                            </Form.Group>
                        </div>
                    </div>

                </Card.Body>    
            </Card>     

            <FooterNav appSiteId={this.state.sitePage.appSiteId} sitePageId={this.state.sitePage.sitePageId}
                onSave={() => this.onSubmit()} onLanguageChange={(code) => this.handleLanguageCode(code)} />
                          
          </>          
        );
    }
}

export { SitePageAddEdit }