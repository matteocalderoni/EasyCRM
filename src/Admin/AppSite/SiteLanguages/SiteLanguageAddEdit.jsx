import React from 'react';
import { languageService, appSiteService, alertService } from '../../../_services';
import { Uploader } from '../../../_components'
import { Form, Button, Card, Image, Row, Col,ProgressBar } from 'react-bootstrap'
import { Editor } from "@tinymce/tinymce-react";

const baseImageUrl = `${process.env.REACT_APP_STORAGE_URL}/`;
const baseEditorPlugins = [
    'advlist autolink lists link image charmap print preview anchor',
    'searchreplace visualblocks code fullscreen',
    'insertdatetime media table paste code help wordcount'
];
const baseEditorToolbar = 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help';

class SiteLanguageAddEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {   
            siteLanguage: {
                appSiteId: this.props.appSiteId,         
                code: this.props.code,
                imageUrl: 'logo.png',
                description: ''                
            },
            loading: false                         
         };

        this.handleChange = this.handleChange.bind(this)
        this.handleChangeNumber = this.handleChangeNumber.bind(this)
        this.handleChangeBool = this.handleChangeBool.bind(this)
    }

    componentDidMount() {
        this.handleOpen()
    }

    handleChange(evt) {
        const value = evt.target.value;
        this.setState({
            siteLanguage: {
                ...this.state.siteLanguage,
                [evt.target.name]: value
            }          
        });
    }

    handleFileName = (fileName) => {        
        this.setState({ 
            siteLanguage: {
                ...this.state.siteLanguage,
                imageUrl: fileName
            }
        });        
    }

    handleChangeNumber(evt) {
        const value = parseInt(evt.target.value);
        this.setState({
            siteLanguage: {
                ...this.state.siteLanguage,
                [evt.target.name]: value                
            }          
        });
    }

    handleChangeBool(evt) {  
        this.setState({
            siteLanguage: {
                ...this.state.siteLanguage,
                [evt.target.name]: evt.target.checked                 
            }          
        });
    }

    handleEditorChange = (content, editor) => {
        this.setState({
            siteLanguage: {
                ...this.state.siteLanguage,
                slideText: content                 
            }          
        });
    }

    handleOpen() {    
        if (this.props.code != '') {
            this.setState({loading: true})
            languageService.getSiteLanguageById(this.props.appSiteId, this.props.code)
                .then(_siteLanguage => {                    
                    this.setState({
                        siteLanguage: _siteLanguage,
                        loading: false
                    })                    
                });
        }         
    }
    
    onSubmit = () => {
        if (this.props.appSiteId > 0 && this.props.code != '') {
            this.updateSiteLanguage();
        } else {
            this.createSiteLanguage();            
        }
    }

    createSiteLanguage() {
        languageService.createSiteLanguage({ siteLanguage: this.state.siteLanguage })
            .then(result => {
                if (result.hasErrors) {
                    alertService.error('Problemi durante il salvataggio', { keepAfterRouteChange: true });
                } else {
                    alertService.success('Pagina aggiunta con successo', { keepAfterRouteChange: true });
                }            
                if (this.props.handleSaved)    
                    this.props.handleSaved(this.state.siteLanguage.appSiteId);                
            })
            .catch(error => {
                alertService.error(error);
            });
    }

    updateSiteLanguage() {
        languageService.updateSiteLanguage({ siteLanguage: this.state.siteLanguage })
            .then(result => {
                if (result.hasErrors) {
                    alertService.error('Problemi durante il salvataggio', { keepAfterRouteChange: true });
                } else {
                    alertService.success('Aggiornamento riuscito', { keepAfterRouteChange: true });
                }    
                if (this.props.handleSaved)                                
                    this.props.handleSaved(this.state.siteLanguage.appSiteId);                
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
                        <Col>
                        {this.state.siteLanguage.code != '' &&                    
                            <div>
                                <Image fluid src={baseImageUrl+this.state.siteLanguage.imageUrl} />
                                <Uploader prefix={this.state.siteLanguage.appSiteId} fileName={this.state.siteLanguage.imageUrl} onFileNameChange={this.handleFileName} />      
                                <small>Questa immagine viene utilizzate come sfondo della pagina. Utilizzare un immagine con formato 1920 X 1080 px.</small>
                            </div>
                        }
                        </Col>
                        <Col>
                            <Form.Group>
                                <Form.Label>Codice della Lingua</Form.Label>
                                <input type="text" className="form-control" name="code" value={this.state.siteLanguage.code} onChange={this.handleChange} maxLength={200} />
                                <Form.Text className="text-muted">
                                    Codice della lingua (max 4 caratteri): visualizzato nel menù di navigazione in alto nella pagina.
                                </Form.Text>
                            </Form.Group>                                                        
                        </Col>
                    </Row>
                    
                    {!this.state.loading && this.state.siteLanguage.code != '' &&
                        <div>
                            <label>Descrizione</label>
                            <Editor
                                apiKey={process.env.REACT_APP_TINTMCE_KEY}
                                initialValue={this.state.siteLanguage.description}
                                init={{
                                height: 500,
                                menubar: false,
                                plugins: baseEditorPlugins,
                                toolbar: baseEditorToolbar
                                }}
                                onEditorChange={this.handleEditorChange}
                            />
                        </div>
                    }                    

                </Card.Body>    
                <Card.Footer>
                    <Button onClick={this.onSubmit} variant="success">
                        Salva le modifiche
                    </Button> 
                </Card.Footer>
            </Card>                    
          </>          
        );
    }
}

export { SiteLanguageAddEdit }