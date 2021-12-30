import React,{Component} from 'react'; 
import { Form } from 'react-bootstrap'

class PositionSelect extends Component { 
  
    constructor(props) {
      super(props);
      this.state = {         
        positions: [
          {label: 'Nascosto', value: -1},
          {label: 'Sopra', value: 1},
          {label: 'Sinistra', value: 2},
          {label: 'Sotto', value: 3},
          {label: 'Destra', value: 4}
        ],
        label: props.label | '',
        selectedPosition: props.position | 1               
      };                   
    }    
    
    handleChange = (evt) => {
        this.setState({
            selectedPosition: +evt.target.value 
        })        
        // Return value on parent
        this.props.onPositionChange(+evt.target.value)
    }    
         
    render() {      
      return ( 
        <>
        {this.state.selectedPosition && <Form.Group>
            <Form.Control as="select" value={this.state.selectedPosition} name="selectedPosition" onChange={this.handleChange}>
                {this.state.positions && this.state.positions.map(pos =>
                    <option key={pos.value} value={pos.value}>{pos.label}</option>
                )}   
            </Form.Control>                
        </Form.Group>}
        </>
      ); 
    } 
  } 
  
  export { PositionSelect };