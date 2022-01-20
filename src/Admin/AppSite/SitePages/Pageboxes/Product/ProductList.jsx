import React from 'react';
import { Container, ListGroup, Row,Col,Image, Badge, ProgressBar } from 'react-bootstrap';
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
            <div>                                
                <ProductTypeList appSiteId={this.state.appSiteId} sitePageId={this.state.sitePageId} pageBoxId={this.state.pageBoxId}  />
                
                {this.state.loading &&               
                <div className="text-center mart2">
                    <ProgressBar animated now={100} />
                </div>}  

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 space-x-2'>

                    {this.state.products && this.state.products.map(product =>                                    
                        <div key={product.productId} className="mx-auto rounded-xl shadow-md overflow-hidden">
                            {product.siteProduct && 
                            <div>
                                <div className="md:shrink-0">
                                    <img className="h-48 w-full object-cover" src={baseImageUrl+product.siteProduct.imageUrl} alt={product.siteProduct.code} />
                                </div>
                                <div className="p-8">
                                    <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                                        € {product.siteProduct.price}
                                    </div>
                                    <a href="#" className="block mt-1 text-lg leading-tight font-medium text-black hover:underline">
                                        {product.siteProduct.code}
                                    </a>
                                    <div className="mt-2 text-slate-500">
                                        {product.siteProduct.description && parse(product.siteProduct.description)}
                                    </div>
                                </div>
                            </div>}
                            <div className='flex'>                            
                                <div className='bg-green-500'>
                                    <ProductAddEdit appSiteId={product.appSiteId} sitePageId={product.sitePageId} pageBoxId={product.pageBoxId} productId={product.productId} siteProductId={product.siteProductId} handleAddEdit={(rId,sId,pId) => this.handleAddEdit(rId,sId,pId)} />
                                </div>
                                <div className='bg-red-300 flex flex-1 p-1'>
                                    <DeleteConfirmation onConfirm={() => this.deleteProduct(product)} />
                                    <span className='ml-1 text-red-800'>elimina</span>
                                </div>
                            </div>
                        </div>                                    
                    )}

                    <ProductAddEdit appSiteId={this.state.appSiteId} sitePageId={this.state.sitePageId} pageBoxId={this.state.pageBoxId} productId={0} siteProductId={0} handleAddEdit={(appSiteId, sitePageId, pageBoxId) => this.handleAddEdit(appSiteId, sitePageId, pageBoxId)} />

                </div>
                
                {!this.state.products &&                
                    <div className="text-center">
                        <span className="spinner-border spinner-border-lg align-center"></span>
                    </div>
                }                
            </div>
        );
    }

}

export { ProductList };