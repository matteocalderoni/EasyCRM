import React from 'react';
import { productService, alertService } from '../../../../../_services';
import { Form, Button, Modal, Navbar, Nav } from 'react-bootstrap'
import { LanguageSelect } from '../../../../../_components/LanguageSelect';
import { fetchWrapper } from '../../../../../_helpers/fetch-wrapper';
import { FaSave } from 'react-icons/fa';
import { SiteProductPreview } from '../../../../../_components/SiteProductPreview';

const baseUrl = `${process.env.REACT_APP_API_URL}/upload`;
const baseImageUrl = `${process.env.REACT_APP_STORAGE_URL}/`;

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
                siteProductId: this.props.siteProductId,
                imageUrl: 'logo.png',
                title: '',
                code: '',
                description: '',
                cardSize: 12,
                sortId: 1,
                price: 0,
                discount: 0,
                isPublished: true
            },
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
        this.setState({
            product: {
                ...this.state.product,
                description: content                 
            }            
        });
    }

    handleLanguageCode = (code) => {        
        this.setState({ 
            languageCode: code
        });        
    }

    handleSiteProductId = (_siteProductId) => {        
        this.setState({ 
            product: {
                ...this.state.product,
                siteProductId: _siteProductId 
            }
        });        
    }

    getProductTypes() {
        productService.getProductTypes('',0,0, this.props.appSiteId,this.props.sitePageId,this.props.pageBoxId)
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

    tiny_image_upload_handler = (blobInfo, success, failure, progress) => {
        const fileName = (this.props.appSiteId + '/' || '') + new Date().getTime() + '.jpeg';

        // Request made to the backend api 
        // Send formData object 
        fetchWrapper.postFile(`${baseUrl}/CloudUpload`, blobInfo.blob(), fileName)
            .then((result) => {
                success(`${baseImageUrl}${result.fileName}`);                
            });         
    };

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
            <Button variant="primary" className="mr-1 bg-green-500 rounded-xl border-0 shadow-md hover:bg-green-600" onClick={this.handleShow}>
                {this.state.product.productId === 0 && 
                <div className='grow mx-auto overflow-hidden h-48 w-48'>
                    Aggiungi Prodotto
                </div>}
                {this.state.product.productId > 0 && 'Modifica Prodotto'} 
            </Button>
            <Modal
                show={this.state.setShow}
                onHide={this.handleClose}
                backdrop="static"
                dialogClassName="modal-90w"
                keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.state.product.productId > 0 ? 'Modifica ' : 'Aggiungi '} Prodotto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='md:flex'>
                        <div className='flex-1'>
                            <Form.Group>
                                <Form.Label>Categoria prodotto</Form.Label>
                                <Form.Control as="select" value={this.state.product.productTypeId} name="productTypeId" onChange={this.handleChangeNumber}>
                                    <option value={0}>Seleziona una categoria</option>
                                    {this.state.productTypes && this.state.productTypes.map(productType =>
                                        <option key={productType.productTypeId} value={parseInt(productType.productTypeId)}>{productType.name}</option>
                                    )}   
                                </Form.Control>
                            </Form.Group>
                            
                            <div>
                                <label>Prodotto</label>
                                <SiteProductPreview 
                                    appSiteId={this.state.product.appSiteId} 
                                    siteProductId={this.state.product.siteProductId}
                                    onChange={this.handleSiteProductId} />                   
                            </div>                            
                        </div>
                    </div>                                  
                    
                    <Form.Group className='mt-2'>
                        <Form.Check type="checkbox" label="Pubblico" name="isPublished" checked={this.state.product.isPublished} onChange={this.handleChangeBool} />
                        <Form.Text>
                            Solo se il prodotto è pubblico viene visualizzato nel sito.
                        </Form.Text>
                    </Form.Group>

                </Modal.Body>
                <Modal.Footer>
                    {/* <Button onClick={this.onSubmit} variant="success" className="mr-1">
                        Salva le modifiche
                    </Button>  */}
                    <Button onClick={this.handleClose} variant="default" className="mr-1">
                        annulla e chiudi
                    </Button> 
                </Modal.Footer>
                <Navbar fixed="bottom" variant="dark" bg="dark">
                    <Nav className="mr-auto">
                        <Button onClick={this.onSubmit}  className="flex items-center justify-center rounded-full bg-green-500">
                            <FaSave className="mr-2" /> Salva
                        </Button>                         
                    </Nav>
                    <Form inline>
                        <LanguageSelect appSiteId={this.state.product.appSiteId} onLanguageChange={this.handleLanguageCode} />                   
                    </Form>
                </Navbar>                           
            </Modal>   

          </>          
        );
    }
}

export { ProductAddEdit }