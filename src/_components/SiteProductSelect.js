import React,{Component} from 'react'; 
import { productService } from '../_services'
import { Form } from 'react-bootstrap'

class SiteProductSelect extends Component { 
  
    constructor(props) {
      super(props);
      this.state = { 
        appSiteId: props.appSiteId,
        siteProducts: [],
        siteProductId: props.siteProductId
      };                   
    }    

    componentDidMount() {
        productService.getSiteProducts('', 0, 0, this.state.appSiteId)
            .then(_products => {
                if (_products.totalCount > 0) {
                    this.setState({ products: _products.result })
                }
            })
    }

    handleChange = (evt) => {
        const value = +evt.target.value;
        this.setState({ siteProductId: value })        
        // Return value on parent
        this.props.onChange(value)
    }    
         
    render() {      
      return ( 
        <Form.Group>
            {this.state.products && 
            <Form.Control as="select" value={this.state.siteProductId} name="siteProductId" onChange={this.handleChange}>
                <option>Seleziona Prodotto</option>
                {this.state.products && this.state.products.map(siteProduct =>
                    <option key={siteProduct.siteProductId} value={siteProduct.siteProductId}>{siteProduct.code}</option>
                )}   
            </Form.Control>}       
        </Form.Group>
      ); 
    } 
  } 
  
  export { SiteProductSelect };