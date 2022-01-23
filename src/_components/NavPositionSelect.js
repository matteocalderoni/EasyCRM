import React,{Component} from 'react'; 
import { Form } from 'react-bootstrap'

class NavPositionSelect extends Component { 
  
    constructor(props) {
      super(props);
      this.state = {         
        positions: [
          {label: 'Nascosto', value: -1},
          {label: 'Fisso Sopra', value: 1},
          {label: 'Sopra', value: 2},
          {label: 'Fisso Sotto', value: 3}          
        ],
        label: props.label || '',
        selectedNavPosition: props.position || 1               
      };                   
    }    
    
    handleChange = (evt) => {
        this.setState({
            selectedNavPosition: +evt.target.value 
        })        
        // Return value on parent
        this.props.onPositionChange(+evt.target.value)
    }    
         
    render() {      
      return ( 
        <>
        {this.state.selectedNavPosition && <Form.Group>
            <Form.Control as="select" value={this.state.selectedNavPosition} name="selectedNavPosition" onChange={this.handleChange}>
                {this.state.positions && this.state.positions.map(pos =>
                    <option key={pos.value} value={pos.value}>{pos.label}</option>
                )}   
            </Form.Control>                
        </Form.Group>}
        </>
      ); 
    } 
  } 
  
  export { NavPositionSelect };