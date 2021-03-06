import React from 'react';
import { appSiteService, alertService } from '../../../../_services';
import { Uploader } from '../../../../_components';
import { Image, Form, Button, Modal } from 'react-bootstrap'
import { CardSizes } from '../../../../_helpers/cardSize';
import { Editor } from "@tinymce/tinymce-react";

const baseImageUrl = `${process.env.REACT_APP_API_URL}/Resources/Images/`;
const baseEditorPlugins = [
    'advlist autolink lists link image charmap print preview anchor',
    'searchreplace visualblocks code fullscreen',
    'insertdatetime media table paste code help wordcount'
];
const baseEditorToolbar = 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help';

class TopServiceAddEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {   
            setShow: false, 
            appSiteId: this.props.appSiteId,  
            sitePageId: this.props.sitePageId,
            pageBoxId: this.props.pageBoxId,       
            topServiceId: this.props.topServiceId,
            imageUrl: 'logo.png',
            title: '',
            description: '',
            cardSize: 4,
            isPublished: true,
            sortId: 1
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
        console.log('Content was updated:', content);
        this.setState({
            description: content           
        });
    }

    handleFileName = (fileName) => {        
        this.setState({ imageUrl: fileName });        
    }

    handleShow = () => {
        if (this.props.appSiteId > 0 && this.props.sitePageId > 0 && this.props.pageBoxId > 0 && this.props.topServiceId > 0) {
            appSiteService.getTopServiceById(this.props.appSiteId, this.props.sitePageId, this.props.pageBoxId, this.props.topServiceId)
                .then(topService => {                    
                    this.setState({
                        appSiteId: parseInt(topService['appSiteId'] || 0),
                        sitePageId: parseInt(topService['sitePageId'] || 0),
                        pageBoxId: parseInt(topService['pageBoxId'] || 0),
                        topServiceId: parseInt(topService['topServiceId'] || 0),
                        imageUrl: topService['imageUrl'] || '',
                        title: topService['title'] || '',
                        description: topService['description'] || '',
                        cardSize: parseInt(topService['cardSize'] || 4),
                        isPublished: topService['isPublished'] || true,
                        sortId: parseInt(topService['sortId'] || 1)
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
            this.updateTopService();
        } else {
            this.createTopService();            
        }
    }

    createTopService() {
        appSiteService.createTopService({ topService: this.state })
            .then(() => {
                alertService.success('Top service aggiunto con successo', { keepAfterRouteChange: true });
                this.props.handleAddEdit(this.state.appSiteId, this.state.sitePageId, this.state.pageBoxId);                
                this.handleClose();                
            })
            .catch(error => {
                alertService.error(error);
            });
    }

    updateTopService() {
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
            <Button variant="primary" className="mr-1" onClick={this.handleShow}>
                {this.state.topServiceId > 0 ? 'modifica' : 'nuovo'} servizio
            </Button>

            <Modal
                show={this.state.setShow}
                onHide={this.handleClose}
                backdrop="static"
                size="lg"
                keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.state.topServiceId > 0 ? 'Modifica ' : 'Nuovo '} Servizio</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    
                    <div className="text-center">
                        <Image src={baseImageUrl+this.state.imageUrl} fluid />                    
                        <Uploader fileName={this.state.imageUrl} onFileNameChange={this.handleFileName} />      
                        <small>Utilizzare immagini con formato 640 X 640 px.</small>
                    </div>

                    <Form.Group>
                        <Form.Label>Ordinamento</Form.Label>
                        <input type="number" className="form-control" name="sortId" value={this.state.sortId} onChange={this.handleChangeNumber}  />
                        <Form.Text className="text-muted">
                            Valore per ordinamento crescente.
                        </Form.Text>
                    </Form.Group>   
                    
                    <Form.Group>
                        <Form.Label>Titolo</Form.Label>
                        <input type="text" className="form-control" name="title" value={this.state.title} onChange={this.handleChange} maxLength={200} />
                        <Form.Text className="text-muted">
                            Titolo del servizio (max 200 caratteri).
                        </Form.Text>
                    </Form.Group>                        

                    <div>
                        <label>Descrizione</label>
                        <Editor
                            apiKey={process.env.REACT_APP_TINTMCE_KEY}
                            initialValue={this.state.description}
                            init={{
                            height: 500,
                            menubar: false,
                            plugins: baseEditorPlugins,
                            toolbar: baseEditorToolbar
                            }}
                            onEditorChange={this.handleEditorChange}
                        />                                            
                    </div>                                    

                    <Form.Group>
                        <Form.Label>Dimensione</Form.Label>
                        <Form.Control as="select" value={this.state.cardSize} name="cardSize" onChange={this.handleChangeNumber}>
                            <option value={0}>Seleziona una dimensione</option>
                            {CardSizes && CardSizes.map(cardSize =>
                                <option key={cardSize.value} value={parseInt(cardSize.value)}>{cardSize.label}</option>
                            )}   
                        </Form.Control>
                        <Form.Text className="text-muted">
                            I tipi servono per impostare il formato e le propriet?? del contenitore.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group>
                        <Form.Check type="checkbox" label="Pubblico" name="isPublished" checked={this.state.isPublished} onChange={this.handleChangeBool} />
                        <Form.Text>
                            Solo i contenuti pubblici vengono visualizzati nel sito.
                        </Form.Text>
                    </Form.Group>

                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.onSubmit} variant="success" className="mr-1">
                        Salva
                    </Button> 
                    <Button onClick={this.handleClose} variant="primary" className="mr-1">
                        annulla
                    </Button> 
                </Modal.Footer>
            </Modal>              
          </>          
        );
    }
}

export { TopServiceAddEdit }