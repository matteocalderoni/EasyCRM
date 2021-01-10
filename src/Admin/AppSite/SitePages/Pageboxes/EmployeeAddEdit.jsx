import React from 'react';
import { appSiteService, alertService } from '../../../../_services';
import { Uploader } from '../../../../_components'
import { Image, Form, Button, Modal, Row, Col } from 'react-bootstrap'
import { CardSizes } from '../../../../_helpers/cardSize';
import { Editor } from "@tinymce/tinymce-react";
import { LanguageSelect } from '../../../../_components/LanguageSelect';
import { LanguageEditor } from '../../../../_components/LanguageEditor';
import { LanguageInput } from '../../../../_components/LanguageInput';

const baseImageUrl = `${process.env.REACT_APP_STORAGE_URL}/`;
const baseEditorPlugins = [
    'advlist autolink lists link image charmap print preview anchor',
    'searchreplace visualblocks code fullscreen',
    'insertdatetime media table paste code help wordcount'
];
const baseEditorToolbar = 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help';


class EmployeeAddEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {   
            setShow: false, 
            appSiteId: this.props.appSiteId,         
            sitePageId: this.props.sitePageId,
            pageBoxId: this.props.pageBoxId,
            employeeId: this.props.employeeId,
            imageUrl: 'logo.png',
            title: '',
            firstName: '',
            lastName: '',
            description: '',
            cardSize: 4,
            isPublished: true,
            languageCode: '',
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
        this.setState({
            setShow: true
        });        

        if (this.props.appSiteId > 0 && this.props.sitePageId > 0 && this.props.pageBoxId > 0 && this.props.employeeId > 0) {
            appSiteService.getEmployeeById(this.props.appSiteId, this.props.sitePageId, this.props.pageBoxId, this.props.employeeId)
                .then(employee => {                    
                    this.setState({
                        appSiteId: employee['appSiteId'] || 0,
                        sitePageId: employee['sitePageId'] || 0,
                        pageBoxId: employee['pageBoxId'] || 0,
                        employeeId: employee['employeeId'] || 0,
                        imageUrl: employee['imageUrl'] || '',
                        title: employee['title'] || '',
                        firstName: employee['firstName'] || '',
                        lastName: employee['lastName'] || '',
                        description: employee['description'] || '',
                        cardSize: parseInt(employee['cardSize'] || 4),
                        isPublished: employee['isPublished'] || true,
                        sortId: parseInt(employee['sortId'] || 1)
                     });
                });
        }         
    }

    handleClose = () => {
        this.setState({
            setShow: false
        });
    }
    
    onSubmit = () => {
        //if (isAddMode) {
        if (this.state.appSiteId > 0 && this.state.sitePageId > 0 && this.state.pageBoxId > 0 && this.state.employeeId > 0) {
            this.updateEmployee();
        } else {
            this.createEmployee();            
        }
    }

    createEmployee() {
        appSiteService.createEmployee({ employee: this.state })
            .then(() => {
                alertService.success('Dipendente aggiunto con successo', { keepAfterRouteChange: true });
                this.handleClose();
                this.props.handleAddEdit(this.state.appSiteId, this.state.sitePageId, this.state.pageBoxId);                
            })
            .catch(error => {
                alertService.error(error);
            });
    }

    updateEmployee() {
        appSiteService.updateEmployee({ employee: this.state })
            .then(() => {
                alertService.success('Aggiornamento riuscito', { keepAfterRouteChange: true });
                this.handleClose();
                this.props.handleAddEdit(this.state.appSiteId, this.state.sitePageId, this.state.pageBoxId);            
            })
            .catch(error => {
                alertService.error(error);
            });
    }

    render() {
        return (            
          <>
            <Button variant="primary" className="mr-1" onClick={this.handleShow}>
                {this.state.employeeId > 0 ? 'Modifica ' : 'Nuovo '} Dipendente
            </Button>
            <Modal
                show={this.state.setShow}
                onHide={this.handleClose}
                backdrop="static"
                size="lg"
                keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.state.employeeId > 0 ? 'Modifica ' : 'Nuovo '} Dipendente</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    
                    <div className="text-center">
                        <Image src={baseImageUrl+this.state.imageUrl} fluid />                    
                        <Uploader prefix={this.state.appSiteId} fileName={this.state.imageUrl} onFileNameChange={this.handleFileName} />      
                        <small>Utilizzare immagini con formato 640 X 640 px.</small>
                    </div>                    

                    <LanguageSelect appSiteId={this.state.appSiteId} onLanguageChange={this.handleLanguageCode} />                          

                    <Form.Group>
                        <Form.Label>Ordinamento</Form.Label>
                        <input type="number" className="form-control" name="sortId" value={this.state.sortId} onChange={this.handleChangeNumber}  />
                        <Form.Text className="text-muted">
                            Valore per ordinamento crescente.
                        </Form.Text>
                    </Form.Group>   

                    {this.state.languageCode == '' &&
                    <Form.Group>
                        <Form.Label>Titolo</Form.Label>
                        <input type="text" className="form-control" name="title" value={this.state.title} onChange={this.handleChange} maxLength={200} />
                        <Form.Text className="text-muted">
                            Ruolo svolto dal dipendente (max 200 caratteri).
                        </Form.Text>
                    </Form.Group>}

                    {this.state.languageCode !== '' &&
                    <div>
                        <LanguageInput 
                            originalText={this.state.title}
                            appSiteId={this.state.appSiteId} 
                            code={this.state.languageCode}
                            labelKey={`EMPLOYEE_${this.state.appSiteId}_${this.state.sitePageId}_${this.state.pageBoxId}_${this.state.employeeId}-Title`}>
                        </LanguageInput>
                    </div>}                     

                    <Row>
                        <Col sm={6}>
                            <Form.Group>
                                <Form.Label>Nome</Form.Label>
                                <input type="text" className="form-control" name="firstName" value={this.state.firstName} onChange={this.handleChange}  />
                                <Form.Text className="text-muted">
                                    Nome del dipendente.
                                </Form.Text>
                            </Form.Group>                    
                        </Col>
                        <Col sm={6}>
                            <Form.Group>
                                <Form.Label>Cognome</Form.Label>
                                <input type="text" className="form-control" name="lastName" value={this.state.lastName} onChange={this.handleChange}  />
                                <Form.Text className="text-muted">
                                    Nome del dipendente.
                                </Form.Text>
                            </Form.Group>                    
                        </Col>
                    </Row>                           

                    {!this.state.loading && this.state.languageCode === '' && 
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
                    </div>}
                    
                    {this.state.languageCode && this.state.languageCode !== '' &&
                    <div>
                        <LanguageEditor 
                            originalText={this.state.description}
                            appSiteId={this.state.appSiteId} 
                            code={this.state.languageCode}
                            labelKey={`EMPLOYEE_${this.state.appSiteId}_${this.state.sitePageId}_${this.state.pageBoxId}_${this.state.employeeId}-Description`}>                                    
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

                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.onSubmit} variant="success">
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

export { EmployeeAddEdit }