import React from 'react';
import { appSiteService, alertService } from '../../../_services';
import { Uploader } from '../../../_components'
import { Form, Button, Card } from 'react-bootstrap'
import { Editor } from "@tinymce/tinymce-react";

const baseImageUrl = `${process.env.REACT_APP_STORAGE_URL}/`;
const baseEditorPlugins = [
    'advlist autolink lists link image charmap print preview anchor',
    'searchreplace visualblocks code fullscreen',
    'insertdatetime media table paste code help wordcount'
];
const baseEditorToolbar = 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help';

class SitePageAddEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {   
            sitePage: {
                appSiteId: this.props.appSiteId,         
                sitePageId: this.props.sitePageId,
                imageUrl: 'logo.png',
                title: '',
                description: '',
                slideText: '',
                sortId: 1,
                isPublished: true
            }                        
         };

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeNumber = this.handleChangeNumber.bind(this);
        this.handleChangeBool = this.handleChangeBool.bind(this);

        this.handleOpen();
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
        //console.log('Content was updated:', content);
        this.setState({
            sitePage: {
                ...this.state.sitePage,
                slideText: content                 
            }          
        });
    }

    handleOpen() {    
        if (this.props.appSiteId > 0 && this.props.sitePageId > 0) {
            appSiteService.getSitePageById(this.props.appSiteId, this.props.sitePageId)
                .then(_sitePage => {                    
                    this.setState({
                        sitePage: _sitePage
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
                {this.state.sitePage.sitePageId > 0 &&
                    <Card.Img src={baseImageUrl+this.state.sitePage.imageUrl} />
                }
                <Card.Body>
                    {this.state.sitePage.sitePageId > 0 &&
                        <div>
                            <Uploader prefix={this.state.sitePage.appSiteId} fileName={this.state.sitePage.imageUrl} onFileNameChange={this.handleFileName} />      
                            <small>Questa immagine viene utilizzate come sfondo della pagina. Utilizzare un immagine con formato 1920 X 1080 px.</small>
                        </div>
                    }
                    
                    <Form.Group>
                        <Form.Label>Ordinamento</Form.Label>
                        <input type="number" className="form-control" name="sortId" value={this.state.sitePage.sortId} onChange={this.handleChangeNumber}  />
                        <Form.Text className="text-muted">
                            Le pagine vengono visualizzate in ordine crescente.
                        </Form.Text>
                    </Form.Group>      

                    <Form.Group>
                        <Form.Label>Titolo</Form.Label>
                        <input type="text" className="form-control" name="title" value={this.state.sitePage.title} onChange={this.handleChange} maxLength={200} />
                        <Form.Text className="text-muted">
                            Titolo della pagina (max 200 caratteri): visualizzato nel menù di navigazione in alto nella pagina.
                        </Form.Text>
                    </Form.Group>                                                     

                    {this.state.sitePage.sitePageId > 0 &&
                        <div>
                            <label>Testo per slide</label>
                            <Editor
                                apiKey={process.env.REACT_APP_TINTMCE_KEY}
                                initialValue={this.state.sitePage.slideText}
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

                    <Form.Group>
                        <Form.Check type="checkbox" label="Pubblico" name="isPublished" checked={this.state.sitePage.isPublished} onChange={this.handleChangeBool} />
                        <Form.Text>
                            Solo i contenuti pubblici vengono visualizzati nel sito.
                        </Form.Text>
                    </Form.Group>

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

export { SitePageAddEdit }