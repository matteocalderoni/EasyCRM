import React,{Component} from 'react'; 
import { Form } from 'react-bootstrap'

class NavAlignSelect extends Component { 
  
    constructor(props) {
      super(props);
      this.state = {         
        aligns: [
          {label: 'Sinistra', value: 1 },
          {label: 'Centro', value: 2 },
          {label: 'Destra', value: 3 }          
        ],
        label: props.label || '',
        selectedNavAlign: props.align || 1               
      };                   
    }    
    
    handleChange = (evt) => {
        this.setState({
            selectedNavAlign: +evt.target.value 
        })        
        // Return value on parent
        this.props.onAlignChange(+evt.target.value)
    }    
         
    render() {      
      return ( 
        <>
        {this.state.selectedNavAlign && 
        <Form.Group>
            <Form.Control as="select" value={+this.state.selectedNavAlign} name="selectedNavAlign" onChange={() => this.handleChange()}>
                {this.state.aligns && this.state.aligns.map(align =>
                    <option key={align.value} value={align.value}>{align.label}</option>
                )}   
            </Form.Control>                
        </Form.Group>}
        </>
      ); 
    } 
  } 
  
  export { NavAlignSelect };