import React from 'react';
import { appSiteService, alertService } from '../../../../../_services';
import { Uploader } from '../../../../../_components';
import { Image, Form, Button, Modal, ProgressBar, Row,Col } from 'react-bootstrap'
import { CardSizes } from '../../../../../_helpers/cardSize';
import { Editor } from "@tinymce/tinymce-react";
import { LanguageSelect } from '../../../../../_components/LanguageSelect';
import { LanguageEditor } from '../../../../../_components/LanguageEditor';
import { LanguageInput } from '../../../../../_components/LanguageInput';
import {menuSettings,pluginsSettings,toolbarSettings,fontSettings,styleSettings } from '../../../../../_helpers/tinySettings';
import { fetchWrapper } from '../../../../../_helpers/fetch-wrapper';

const baseUrl = `${process.env.REACT_APP_API_URL}/upload`;
const baseImageUrl = `${process.env.REACT_APP_STORAGE_URL}/`;
class SlideshowAddEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {   
            setShow: false, 
            appSiteId: this.props.appSiteId,  
            sitePageId: this.props.sitePageId,
            pageBoxId: this.props.pageBoxId,       
            topServiceId: this.props.slideshowId,
            imageUrl: 'logo.png',
            title: '',
            description: '',
            cardSize: 4,
            isPublished: true,
            sortId: 1,
            languageCode: '',
            loading: false
         };        

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeNumber = this.handleChangeNumber.bind(this);
        this.handleChangeBool = this.handleChangeBool.bind(this);
    }

    handleChange(evt) {
        const value = evt.target.value;
        this.setState({
          [evt.target.name]: value
        });
    }

    handleChangeNumber(evt) {
        const value = parseInt(evt.target.value);
        this.setState({
            [evt.target.name]: value         
        });
    }

    handleChangeBool(evt) {  
        this.setState({
            [evt.target.name]: evt.target.checked                           
        });
    }

    handleEditorChange = (content, editor) => {
        this.setState({
            description: content           
        });
    }

    handleFileName = (fileName) => {        
        this.setState({ imageUrl: fileName });        
    }

    handleLanguageCode = (code) => {        
        this.setState({ 
            languageCode: code
        });        
    }

    handleShow = () => {
        if (this.props.appSiteId > 0 && this.props.sitePageId > 0 && this.props.pageBoxId > 0 && this.props.slideshowId > 0) {
            this.setState({loading: true})
            appSiteService.getTopServiceById(this.props.appSiteId, this.props.sitePageId, this.props.pageBoxId, this.props.slideshowId)
                .then(slideshow => {                    
                    this.setState({
                        appSiteId: parseInt(slideshow['appSiteId'] || 0),
                        sitePageId: parseInt(slideshow['sitePageId'] || 0),
                        pageBoxId: parseInt(slideshow['pageBoxId'] || 0),
                        topServiceId: parseInt(slideshow['topServiceId'] || 0),
                        imageUrl: slideshow['imageUrl'] || '',
                        title: slideshow['title'] || '',
                        description: slideshow['description'] || '',
                        cardSize: parseInt(slideshow['cardSize'] || 4),
                        isPublished: slideshow['isPublished'] || true,
                        sortId: parseInt(slideshow['sortId'] || 1),
                        loading: false
                    });
                });
        }         

        this.setState({
            setShow: true
        });        
    }

    handleClose = () => {
        this.setState({
            setShow: false
        });
    }
    
    onSubmit = () => {
        //if (isAddMode) {
        if (this.state.appSiteId > 0 && this.state.sitePageId > 0 && this.state.pageBoxId > 0 && this.state.topServiceId > 0) {
            this.updateSlideshow();
        } else {
            this.createSlideshow();            
        }
    }

    tiny_image_upload_handler = (blobInfo, success, failure, progress) => {
        const fileName = (this.state.appSiteId + '/' || '') + new Date().getTime() + '.jpeg';

        // Request made to the backend api 
        // Send formData object 
        fetchWrapper.postFile(`${baseUrl}/CloudUpload`, blobInfo.blob(), fileName)
            .then((result) => {
                success(`${baseImageUrl}${result.fileName}`);                
            });         
    };

    createSlideshow() {
        appSiteService.createTopService({ topService: this.state })
            .then(() => {
                alertService.success('Slideshow aggiunto con successo', { keepAfterRouteChange: true });
                this.props.handleAddEdit(this.state.appSiteId, this.state.sitePageId, this.state.pageBoxId);                
                this.handleClose();                
            })
            .catch(error => {
                alertService.error(error);
            });
    }

    updateSlideshow() {
        appSiteService.updateTopService({ topService: this.state })
            .then(() => {
                alertService.success('Aggiornamento riuscito', { keepAfterRouteChange: true });
                this.props.handleAddEdit(this.state.appSiteId, this.state.sitePageId, this.state.pageBoxId);            
                this.handleClose();                
            })
            .catch(error => {
                alertService.error(error);
            });
    }

    render() {
        return (            
          <>
            <Button className="bg-green-500 border text-white rounded-full" onClick={this.handleShow}>
                {this.state.topServiceId > 0 ? 'modifica' : 'nuova'} slideshow
            </Button>

            <Modal
                show={this.state.setShow}
                onHide={this.handleClose}
                backdrop="static"                
                dialogClassName="modal-90w"
                keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.state.topServiceId > 0 ? 'Modifica il ' : 'Crea un nuovo '} Slideshow</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.state.loading && <div className="text-center mart2">
                        <ProgressBar animated now={100} />
                    </div>}
                    <Row>
                        <Col md={4}>
                            <div className="text-center">
                                <Image src={baseImageUrl+this.state.imageUrl} fluid />                    
                                <Uploader prefix={this.state.appSiteId} fileName={this.state.imageUrl} onFileNameChange={this.handleFileName} />      
                                <small>Utilizzare immagini con formato 640 X 640 px.</small>
                            </div>
                        </Col>
                        <Col md={8}>

                            <Form.Group>
                                <Form.Label>Ordinamento</Form.Label>
                                <input type="number" className="form-control" name="sortId" value={this.state.sortId} onChange={this.handleChangeNumber}  />
                                <Form.Text className="text-muted">
                                    Valore per ordinamento crescente.
                                </Form.Text>
                            </Form.Group>   

                            {!this.state.loading && this.state.languageCode === '' && 
                            <Form.Group>
                                <Form.Label>Titolo</Form.Label>
                                <input type="text" className="form-control" name="title" value={this.state.title} onChange={this.handleChange} maxLength={200} />
                                <Form.Text className="text-muted">
                                    Titolo del servizio (max 200 caratteri).
                                </Form.Text>
                            </Form.Group>}   

                            {this.state.languageCode && this.state.languageCode !== '' &&
                            <div>
                                <LanguageInput 
                                    originalText={this.state.title}
                                    appSiteId={this.state.appSiteId} 
                                    code={this.state.languageCode}
                                    labelKey={`SLIDESHOW_${this.state.appSiteId}_${this.state.sitePageId}_${this.state.pageBoxId}_${this.state.topServiceId}-Title`}>
                                </LanguageInput>
                            </div>}      

                            <div>
                                {this.props.topServiceId > 0 && !this.state.loading && this.state.languageCode === '' &&
                                <>
                                    <label>Descrizione</label>
                                    <Editor
                                        apiKey={process.env.REACT_APP_TINTMCE_KEY}
                                        initialValue={this.state.description}
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
                                </>}
                            </div>         

                            {this.state.languageCode && this.state.languageCode !== '' &&
                            <div>
                                <LanguageEditor 
                                    originalText={this.state.description}
                                    appSiteId={this.state.appSiteId} 
                                    code={this.state.languageCode}
                                    labelKey={`SLIDESHOW_${this.state.appSiteId}_${this.state.sitePageId}_${this.state.pageBoxId}_${this.state.topServiceId}-Description`}>                                    
                                </LanguageEditor>
                            </div>}                           

                            <Form.Group>
                                <Form.Label>Dimensione</Form.Label>
                                <Form.Control as="select" value={this.state.cardSize} name="cardSize" onChange={this.handleChangeNumber}>
                                    <option value={0}>Seleziona una dimensione</option>
                                    {CardSizes && CardSizes.map(cardSize =>
                                        <option key={cardSize.value} value={parseInt(cardSize.value)}>{cardSize.label}</option>
                                    )}   
                                </Form.Control>
                                <Form.Text className="text-muted">
                                    I tipi servono per impostare il formato e le proprietà del contenitore.
                                </Form.Text>
                            </Form.Group>

                            <Form.Group>
                                <Form.Check type="checkbox" label="Pubblico" name="isPublished" checked={this.state.isPublished} onChange={this.handleChangeBool} />
                                <Form.Text>
                                    Solo i contenuti pubblici vengono visualizzati nel sito.
                                </Form.Text>
                            </Form.Group>
                        </Col>
                    </Row>
                    

                    

                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.onSubmit} variant="success" className="mr-1">
                        Salva le modifiche
                    </Button> 
                    <Button onClick={this.handleClose} variant="default" className="mr-1">
                        annulla e chiudi
                    </Button> 
                </Modal.Footer>
            </Modal>              
          </>          
        );
    }
}

export { SlideshowAddEdit }