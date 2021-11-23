import React,{Component} from 'react'; 
import { Form } from 'react-bootstrap'

class PageTypeSelect extends Component { 
  
    constructor(props) {
      super(props);
      this.state = {         
        pageTypes: [
          {label: 'Default', value: 0},
          {label: 'Privacy', value: 1},
          {label: 'Landing', value: 2}
        ],
        label: props.label | '',
        selectedPageType: props.pageType | 0             
      };                   
    }    
    
    handleChange = (evt) => {
        this.setState({
            selectedPageType: +evt.target.value 
        })        
        // Return value on parent
        this.props.onPageTypeChange(+evt.target.value)
    }    
         
    render() {      
      return ( 
        <>
        <Form.Group>
            <Form.Control as="select" value={this.state.selectedPageType} name="selectedPageType" onChange={this.handleChange}>
              <Form.Label>{this.state.label}</Form.Label>
                {this.state.pageTypes && this.state.pageTypes.map(pageType =>
                    <option key={pageType.value} value={pageType.value}>{pageType.label}</option>
                )}   
            </Form.Control>                
        </Form.Group>
        </>
      ); 
    } 
  } 
  
  export { PageTypeSelect };