import React from 'react';
import { productService } from '../../../../../_services';
import { Form, Button, Modal, Row, Col } from 'react-bootstrap'

class ProductTypeList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            setShow: false,
            productTypes: [],
            sortId: 0,
            newProductType: '',
            linkBox: true,
            appSiteId: props.appSiteId,
            sitePageId: props.sitePageId,
            pageBoxId: props.pageBoxId 
        }     
        
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeBool = this.handleChangeBool.bind(this);
    }

    handleChange(evt) {
        const value = evt.target.value;
        this.setState({
          [evt.target.name]: value
        });
    }

    handleChangeBool(evt) {  
        this.setState({
            [evt.target.name]: evt.target.checked                 
        });
    }

    getProductTypes() { 
        productService.getProductTypes('',0,0, this.state.appSiteId,this.state.sitePageId,this.state.pageBoxId)
            .then((_productTypes) => {
                if (_productTypes.totalCount > 0) {
                    this.setState({
                        productTypes: _productTypes.result,
                        newProductType: ''
                    });
                } else {
                    this.setState({
                        productTypes: [],
                        newProductType: ''
                    });
                }                
            });
    }    

    createProductType = () => {
        let _productType = {
            productTypeId: 0, 
            name: this.state.newProductType,
            appSiteId: this.props.appSiteId,
            sitePageId: this.state.linkBox ? this.props.sitePageId : 0,
            pageBoxId: this.state.linkBox ? this.props.pageBoxId : 0
        }
        productService.createProductType({ productType: _productType })
            .then((_productType) => this.getProductTypes());
    }

    deleteProductType = (productTypeId) => {
        productService.deleteProductType(productTypeId)
            .then(() => {
                this.getProductTypes();
            });
    }

    handleShow = () => {
        this.setState({
            setShow: true
        });

        this.getProductTypes();
    }

    handleClose = () => {
        this.setState({
            setShow: false
        });
    }

    handleLinkProductType = (_productType) => {
        if (_productType.pageBoxId > 0) {
            //_productType.appSiteId = 0;
            _productType.sitePageId = 0;
            _productType.pageBoxId = 0;
        } else {
            //_productType.appSiteId = this.props.appSiteId;
            _productType.sitePageId = this.props.sitePageId;
            _productType.pageBoxId = this.props.pageBoxId;
        }
        productService.updateProductType({productType: _productType})
            .then(() => {
                this.getProductTypes();
            });
    }

    handleSortProductType = (sortDir, _productType) => {
        if (sortDir > 0) {
            _productType.sortId += 1;
        } else {
            _productType.sortId -= 1;
        }
        productService.updateProductType({productType: _productType})
            .then(() => {
                this.getProductTypes();
            });
    }

    render() {
        return (
            <>
                <Button variant="secondary" className="mr-1 btn-sm bg-blue-500" onClick={this.handleShow}>
                    Gestione Categoria
                </Button>
                <Modal
                    size="lg"
                    show={this.state.setShow}
                    onHide={this.handleClose}
                    backdrop="static"
                    keyboard={false}>
                        <Modal.Header closeButton>
                            <Modal.Title>Gestione <b>Categorie prodotti</b></Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Row>                                
                                <Col>
                                    <Form.Group>
                                        <Form.Label>Nuova categoria</Form.Label>
                                        <Form.Control type="text" className="form-control" name="newProductType" value={this.state.newProductType} onChange={this.handleChange}  />
                                        <Form.Text className="text-muted">
                                            Nome della nuova categoria dei prodotti.
                                        </Form.Text>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>Collega contenitore</Form.Label>
                                        <Form.Check type="checkbox" label="Collegato" checked={this.state.linkBox} name="linkBox" onChange={this.handleChangeBool} />
                                        <Form.Text className="text-muted">
                                            Per visualizzare solo in contenitore corrente.
                                        </Form.Text>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <div className="mt-5 text-center">
                                        <Button onClick={this.createProductType} variant="primary" className="mr-2 bg-green-500 border-0">
                                            crea
                                        </Button> 
                                    </div>                                    
                                </Col>
                            </Row>
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th colSpan="3" style={{ width: '15%' }}>Ordinamento</th>
                                        <th style={{ width: '50%' }}>Nome</th>
                                        <th style={{ width: '15%' }}>Collegato</th>
                                        <th style={{ width: '20%' }}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.productTypes && this.state.productTypes.map(productType => 
                                        <tr key={productType.productTypeId}>
                                            <td>
                                                <Button size="sm" onClick={() => this.handleSortProductType(-1,productType)} variant="secondary" className="mt-2 bg-blue-400 border-0">
                                                    -
                                                </Button>                                                                                                                                                 
                                            </td>
                                            <td>
                                                {productType.sortId}
                                            </td>
                                            <td>
                                                
                                                <Button size="sm" onClick={() => this.handleSortProductType(1,productType)} variant="secondary" className="mt-2 bg-blue-400 border-0">
                                                    +
                                                </Button>           
                                            </td>
                                            <td>{productType.name}</td>
                                            <td>
                                                <Button size="sm" onClick={() => this.handleLinkProductType(productType)} variant="secondary" className="mt-2 bg-blue-400 border-0">
                                                    {productType.pageBoxId > 0 ? 'SI' : 'NO'}
                                                </Button>                                                 
                                            </td>
                                            <td style={{ whiteSpace: 'nowrap' }}>                                                
                                                <button onClick={() => this.deleteProductType(productType.productTypeId)} className="mt-2 btn btn-sm btn-danger border-0" style={{ width: '60px' }} disabled={productType.isDeleting}>
                                                    {productType.isDeleting 
                                                        ? <span className="spinner-border spinner-border-sm"></span>
                                                        : <span>elimina</span>
                                                    }
                                                </button>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={this.handleClose} variant="primary" className='bg-gray-400 border-0'>
                                chiudi
                            </Button> 
                        </Modal.Footer>
                </Modal>
            </>
        );
    }
}

export { ProductTypeList }