import React from 'react';
import { productService, alertService } from '../../../../../_services';
import { Uploader } from '../../../../../_components'
import { Image, Form, Button, Modal } from 'react-bootstrap'
import { Editor } from "@tinymce/tinymce-react";

const baseImageUrl = `${process.env.REACT_APP_API_URL}/Resources/Images/`;
const baseEditorPlugins = [
    'advlist autolink lists link image charmap print preview anchor',
    'searchreplace visualblocks code fullscreen',
    'insertdatetime media table paste code help wordcount'
];
const baseEditorToolbar = 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help';

class ProductAddEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {   
            setShow: false, 
            productTypes: [],
            product: {
                appSiteId: this.props.appSiteId,         
                sitePageId: this.props.sitePageId,
                pageBoxId: this.props.pageBoxId,
                productId: this.props.productId,
                imageUrl: 'logo.png',
                title: '',
                code: '',
                description: '',
                cardSize: 12,
                sortId: 1,
                price: 0,
                discount: 0,
                isPublished: true
            }            
         };        

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeNumber = this.handleChangeNumber.bind(this);
        this.handleChangeBool = this.handleChangeBool.bind(this);
    }

    handleChange(evt) {
        const value = evt.target.value;
        this.setState({
            product: {
                ...this.state.product,
                [evt.target.name]: value
            }          
        });
    }

    handleChangeNumber(evt) {
        const value = parseFloat(evt.target.value || 0);
        this.setState({
            product: {
                ...this.state.product,
                [evt.target.name]: value         
            }
            
        });
    }

    handleFileName = (fileName) => {        
        this.setState({ 
            product: {
                ...this.state.product,
                imageUrl: fileName
            }
        });        
    }

    handleChangeBool(evt) {  
        this.setState({
            product: {
                ...this.state.product,
                [evt.target.name]: evt.target.checked                 
            }          
        });
    }

    handleEditorChange = (content, editor) => {
        console.log('Content was updated:', content);
        this.setState({
            product: {
                ...this.state.product,
                description: content                 
            }            
        });
    }

    getProductTypes() {
        productService.getProductTypes('',0,0)
            .then((_productTypes) => {
                this.setState({ productTypes: (_productTypes.totalCount > 0 ? _productTypes.result : []) })                
            });
    }

    handleShow = () => {    
        this.setState({
            setShow: true
        });        

        this.getProductTypes();

        if (this.props.appSiteId > 0 && this.props.sitePageId > 0 && this.props.pageBoxId > 0 && this.props.productId > 0) {
            productService.getProductById(this.props.appSiteId, this.props.sitePageId, this.props.pageBoxId, this.props.productId)
                .then(_product => { 
                    this.setState({
                        product: _product
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
        if (this.state.product.appSiteId > 0 && this.state.product.sitePageId > 0 && this.state.product.pageBoxId > 0 && this.state.product.productId > 0) {
            this.updateProduct();
        } else {
            this.createProduct();            
        }
    }

    createProduct() {
        productService.createProduct({ product: this.state.product })
            .then(result => {
                if (result.hasErrors) {
                    alertService.error('Problemi durante il salvataggio', { keepAfterRouteChange: true });
                } else {
                    alertService.success('Prodotto aggiunto con successo', { keepAfterRouteChange: true });
                }                
                this.handleClose();  
                this.props.handleAddEdit(this.props.appSiteId, this.props.sitePageId, this.props.pageBoxId);                                              
            })
            .catch(error => {
                alertService.error(error);
            });
    }

    updateProduct() {
        productService.updateProduct({ product: this.state.product })
            .then(result => {
                if (result.hasErrors) {
                    alertService.error('Problemi durante il salvataggio', { keepAfterRouteChange: true });
                } else {
                    alertService.success('Aggiornamento riuscito', { keepAfterRouteChange: true });
                }                                
                this.handleClose();
                this.props.handleAddEdit(this.props.appSiteId, this.props.sitePageId, this.props.pageBoxId);                            
            })
            .catch(error => {
                alertService.error(error);
            });
    }

    render() {
        return (            
          <>
            <Button variant="primary" className="mr-1" onClick={this.handleShow}>
                {this.state.product.productId > 0 ? 'Modifica ' : 'Nuovo '} Prodotto
            </Button>
            <Modal
                show={this.state.setShow}
                onHide={this.handleClose}
                backdrop="static"
                size="lg"
                keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.state.product.productId > 0 ? 'Modifica ' : 'Nuovo '} Prodotto</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <div className="text-center">
                        <Image src={baseImageUrl+this.state.product.imageUrl} fluid />                    
                        <Uploader fileName={this.state.product.imageUrl} onFileNameChange={this.handleFileName} />      
                        <small>Utilizzare immagini con formato 640 X 640 px.</small>
                    </div>                    

                    <Form.Group>
                        <Form.Label>Categoria prodotto</Form.Label>
                        <Form.Control as="select" value={this.state.product.productTypeId} name="productTypeId" onChange={this.handleChangeNumber}>
                            <option value={0}>Seleziona una categoria</option>
                            {this.state.productTypes && this.state.productTypes.map(productType =>
                                <option key={productType.productTypeId} value={parseInt(productType.productTypeId)}>{productType.name}</option>
                            )}   
                        </Form.Control>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Ordinamento</Form.Label>
                        <input type="number" className="form-control" name="sortId" value={this.state.product.sortId} onChange={this.handleChangeNumber}  />
                        <Form.Text className="text-muted">
                            Valore per ordinamento crescente.
                        </Form.Text>
                    </Form.Group>   

                    <Form.Group>
                        <Form.Label>Titolo</Form.Label>
                        <input type="text" className="form-control" name="title" value={this.state.product.title} onChange={this.handleChange} maxLength={200} />
                        <Form.Text className="text-muted">
                            Ruolo svolto dal dipendente (max 200 caratteri).
                        </Form.Text>
                    </Form.Group>                     
                                    
                    <div>
                        <label>Descrizione</label>
                        <Editor
                            apiKey={process.env.REACT_APP_TINTMCE_KEY}
                            initialValue={this.state.product.description}
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
                        <Form.Label>Prezzo</Form.Label>
                        <input type="number" className="form-control" name="price" value={parseFloat(this.state.product.price)} onChange={this.handleChangeNumber} />
                        <Form.Text className="text-muted">
                            Prezzo del prodotto (compresa iva).
                        </Form.Text>
                    </Form.Group>                    

                    <Form.Group>
                        <Form.Check type="checkbox" label="Pubblico" name="isPublished" checked={this.state.product.isPublished} onChange={this.handleChangeBool} />
                        <Form.Text>
                            Solo se il prodotto è pubblico viene visualizzato nel sito.
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

export { ProductAddEdit }