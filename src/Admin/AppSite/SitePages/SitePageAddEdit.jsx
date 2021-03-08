import React from 'react';
import { Link } from 'react-router-dom';
import { appSiteService, alertService } from '../../../_services';
import { Uploader } from '../../../_components'
import { Form, Button, Card, Image, Row, Col,ProgressBar,Navbar, Nav } from 'react-bootstrap'
import { Editor } from "@tinymce/tinymce-react";
import { LanguageSelect } from '../../../_components/LanguageSelect';
import { LanguageEditor } from '../../../_components/LanguageEditor';
import { LanguageInput } from '../../../_components/LanguageInput';
import { FaSave, FaLanguage, FaBoxes} from 'react-icons/fa';
import {menuSettings,pluginsSettings,toolbarSettings } from '../../../_helpers/tinySettings';

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
                description: '',
                slideText: '',
                sortId: 1,
                isPublished: true
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
                <Card.Body>                    
                    {this.state.loading && <div className="text-center mart2">
                        <ProgressBar animated now={100} />
                    </div>}
                    <Row>
                        {this.state.sitePage.sitePageId > 0 &&                    
                        <Col>
                            <div>
                                <Image fluid src={baseImageUrl+this.state.sitePage.imageUrl} />
                                <Uploader prefix={this.state.sitePage.appSiteId} fileName={this.state.sitePage.imageUrl} onFileNameChange={this.handleFileName} />      
                                <small>Questa immagine viene utilizzate come sfondo della pagina: su desktop rimane fissa, su mobile scorre. E' consigliato utilizzare un immagine con formato 1920 X 1080 px.</small>
                            </div>
                        </Col>
                        }
                        <Col>                            

                            {this.state.sitePage && this.state.sitePages && !this.state.loadingPages && <Form.Group>
                                <Form.Label>Sotto pagina di (non selezionare per pagine principali):</Form.Label>
                                <Form.Control as="select" value={this.state.sitePage.parentPageId} name="parentPageId" onChange={this.handleChangeNumber}>
                                    <option value={undefined}>Radice</option>
                                    {this.state.sitePages && this.state.sitePages.map(parentPage =>
                                        <option key={parentPage.sitePageId} value={parseInt(parentPage.sitePageId)}>{parentPage.title}</option>
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

                            {!this.state.loading && this.state.languageCode == '' && 
                            <Form.Group>
                                <Form.Label>Titolo della Pagina</Form.Label>
                                <input type="text" className="form-control" name="title" value={this.state.sitePage.title} onChange={this.handleChange} maxLength={200} />

                                {/* <Editor
                                    apiKey={process.env.REACT_APP_TINTMCE_KEY}
                                    initialValue={this.state.sitePage.title}                                
                                    inline="true"
                                    init={{
                                        height: 500,                                        
                                        menubar: menuSettings,
                                        plugins: pluginsSettings,
                                        toolbar: toolbarSettings
                                    }}
                                    onEditorChange={this.handleTitleEditorChange}
                                    >
                                </Editor> */}

                                <Form.Text className="text-muted">
                                    Titolo della pagina (max 200 caratteri): visualizzato nel menù di navigazione in alto nella pagina.
                                </Form.Text>
                            </Form.Group>}

                            {this.state.languageCode && this.state.languageCode !== '' &&
                            <div>
                                <LanguageInput 
                                    originalText={this.state.sitePage.title}
                                    appSiteId={this.state.sitePage.appSiteId} 
                                    code={this.state.languageCode}
                                    labelKey={`SITEPAGE_${this.state.sitePage.appSiteId}_${this.state.sitePage.sitePageId}-Title`}>
                                </LanguageInput>
                            </div>}                                                    
                        </Col>
                    </Row>                    
                    
                    {!this.state.loading && this.state.sitePage.sitePageId > 0 && this.state.languageCode == '' &&
                        <div>
                            <label>Testo visualizzato nella Slide</label>
                            <Editor
                                apiKey={process.env.REACT_APP_TINTMCE_KEY}
                                initialValue={this.state.sitePage.slideText}                                
                                init={{
                                    height: 500,
                                    menubar: menuSettings,
                                    plugins: pluginsSettings,
                                    toolbar: toolbarSettings
                                }}
                                onEditorChange={this.handleEditorChange}
                            />
                        </div>
                    }

                    {this.state.languageCode && this.state.languageCode !== '' &&
                    <div>
                        <LanguageEditor 
                            originalText={this.state.sitePage.slideText}
                            appSiteId={this.state.sitePage.appSiteId} 
                            code={this.state.languageCode}
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
            <Navbar fixed="bottom" variant="dark" bg="dark">
                <Nav className="mr-auto">
                    <Button onClick={this.onSubmit} variant="success">
                        <FaSave /> Salva
                    </Button> 
                    {this.state.sitePage.sitePageId > 0 && <Link title="Vai a gestione contenuti della pagina" to={`/admin/sites/sitepages/pageboxes/${this.state.sitePage.appSiteId}/${this.state.sitePage.sitePageId}`} className="btn btn-secondary ml-1">
                        <FaBoxes /> Contenitori
                    </Link>}
                    {this.state.sitePage.sitePageId > 0 && <Link className="btn btn-secondary ml-1" to={`/admin/sites/edit/${this.state.sitePage.appSiteId}`}>
                        <FaLanguage /> modifica sito
                    </Link>}
                </Nav>
                <Form inline>
                    <LanguageSelect appSiteId={this.state.sitePage.appSiteId} onLanguageChange={this.handleLanguageCode} />      
                </Form>
            </Navbar>                
          </>          
        );
    }
}

export { SitePageAddEdit }