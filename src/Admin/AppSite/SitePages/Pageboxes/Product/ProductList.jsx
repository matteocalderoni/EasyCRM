import React from 'react';
import { Container, Jumbotron, Button, ListGroup, Row,Col,Image, Badge } from 'react-bootstrap';
import { productService } from '../../../../../_services';
import { ProductAddEdit } from './ProductAddEdit';
import { ProductTypeList } from './ProductTypeList';
import parse from 'html-react-parser';

const baseImageUrl = `${process.env.REACT_APP_STORAGE_URL}/`;

class ProductList extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            products: null,
            appSiteId: this.props.appSiteId,
            sitePageId: this.props.sitePageId,
            pageBoxId: this.props.pageBoxId
        }

        this.getProducts(this.props.appSiteId, this.props.sitePageId, this.props.pageBoxId);
    }

    getProducts(appSiteId, sitePageId, pageBoxId) {            
        productService.getProductsOfBox(appSiteId, sitePageId, pageBoxId)
            .then((_products) => {
                this.setState({ products: (_products.totalCount > 0 ? _products.result : []) });                                                                
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
            <Container>
                <Jumbotron>
                    <h2>Contenitore <b>Prodotti</b></h2>
                </Jumbotron>

                <ProductAddEdit appSiteId={this.state.appSiteId} sitePageId={this.state.sitePageId} pageBoxId={this.state.pageBoxId} productId={0} handleAddEdit={(appSiteId, sitePageId, pageBoxId) => this.handleAddEdit(appSiteId, sitePageId, pageBoxId)} />
                <ProductTypeList appSiteId={this.state.appSiteId} sitePageId={this.state.sitePageId} pageBoxId={this.state.pageBoxId}  />
                
                <ListGroup className="text-left mart2">                                    
                {this.state.products && this.state.products.map(product =>                                    
                    <ListGroup.Item key={product.productId}>
                        <Row>
                            <Col sm={2}>
                                <Image src={baseImageUrl+product.imageUrl} fluid />
                            </Col>
                            <Col sm={6}>
                                <h3>({product.sortId}) {product.title} {product.code}</h3>
                                {parse(product.description)}
                            </Col>
                            <Col sm={2}>
                                <h3><Badge variant="success">{product.price} €</Badge></h3>                                
                            </Col>
                            <Col sm={2}>
                                <ProductAddEdit appSiteId={product.appSiteId} sitePageId={product.sitePageId} pageBoxId={product.pageBoxId} productId={product.productId} handleAddEdit={(rId,sId,pId) => this.handleAddEdit(rId,sId,pId)} />
                                <Button variant="danger" onClick={() => this.deleteProduct(product)}>elimina</Button>
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