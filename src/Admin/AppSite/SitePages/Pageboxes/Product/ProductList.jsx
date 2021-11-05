import React from 'react';
import { Container, Jumbotron, ListGroup, Row,Col,Image, Badge, ProgressBar } from 'react-bootstrap';
import { productService } from '../../../../../_services';
import { ProductAddEdit } from './ProductAddEdit';
import { ProductTypeList } from './ProductTypeList';
import parse from 'html-react-parser';
import { DeleteConfirmation } from '../../../../../_components/DeleteConfirmation';

const baseImageUrl = `${process.env.REACT_APP_STORAGE_URL}/`;

class ProductList extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            products: null,
            appSiteId: this.props.appSiteId,
            sitePageId: this.props.sitePageId,
            pageBoxId: this.props.pageBoxId,
            loading: false
        }
    }
    
    componentDidMount() {        
        this.getProducts(this.props.appSiteId, this.props.sitePageId, this.props.pageBoxId);
    }

    getProducts(appSiteId, sitePageId, pageBoxId) {            
        this.setState({ loading: true })
        productService.getProductsOfBox(appSiteId, sitePageId, pageBoxId)
            .then((_products) => {
                this.setState({ products: (_products.totalCount > 0 ? _products.result : []), loading: false });                                                                
            })
            .catch(() => {});        
    }

    deleteProduct = (product) => {
        productService.deleteProduct(product.appSiteId, product.sitePageId, product.pageBoxId ,product.productId)
            .then(() => {
                this.getProducts(this.state.appSiteId, this.state.sitePageId, this.state.pageBoxId);
            });
    }

    handleAddEdit = (appSiteId, sitePageId, pageBoxId) => {
        this.getProducts(appSiteId, sitePageId, pageBoxId);
    }
    
    render() {
        return (
            <Container fluid>
                <Jumbotron className="small-jumbotron">
                    <h3>Contenitore <b>Prodotti</b></h3>
                    <p>Con questo contenitori puoi creare un menù/catalogo dei tupi prodotti con i relativi prezzi.</p>
                </Jumbotron>

                <ProductAddEdit appSiteId={this.state.appSiteId} sitePageId={this.state.sitePageId} pageBoxId={this.state.pageBoxId} productId={0} handleAddEdit={(appSiteId, sitePageId, pageBoxId) => this.handleAddEdit(appSiteId, sitePageId, pageBoxId)} />
                <ProductTypeList appSiteId={this.state.appSiteId} sitePageId={this.state.sitePageId} pageBoxId={this.state.pageBoxId}  />
                
                {this.state.loading &&               
                <div className="text-center mart2">
                    <ProgressBar animated now={100} />
                </div>}  

                <ListGroup className="text-left mart2">                                    
                {this.state.products && this.state.products.map(product =>                                    
                    <ListGroup.Item key={product.productId}>
                        <Row>
                            <Col sm={2}>
                                <Image src={baseImageUrl+product.imageUrl} fluid />
                            </Col>
                            <Col sm={6}>
                                <h3>({product.sortId}) {product.title} {product.code}</h3>
                                {product.description && parse(product.description)}
                            </Col>
                            <Col sm={2}>
                                <h3><Badge variant="success">{product.price} €</Badge></h3>                                
                            </Col>
                            <Col sm={2}>
                                <ProductAddEdit appSiteId={product.appSiteId} sitePageId={product.sitePageId} pageBoxId={product.pageBoxId} productId={product.productId} handleAddEdit={(rId,sId,pId) => this.handleAddEdit(rId,sId,pId)} />
                                {/* <Button variant="danger" onClick={() => this.deleteProduct(product)}>elimina</Button> */}
                                <DeleteConfirmation onConfirm={() => this.deleteProduct(product)} />
                            </Col>
                        </Row>
                    </ListGroup.Item>
                )}                    
                </ListGroup>
                {!this.state.products &&                
                    <div className="text-center">
                        <span className="spinner-border spinner-border-lg align-center"></span>
                    </div>
                }                
            </Container>
        );
    }

}

export { ProductList };