import React,{Component} from 'react'; 
import { languageService } from '../_services'
import { Form } from 'react-bootstrap'

class LanguageSelect extends Component { 
  
    constructor(props) {
      super(props);
      this.state = { 
        appSiteId: props.appSiteId,
        languages: [],
        code: props.code | ''               
      };                   
    }    

    componentDidMount() {
        languageService.getlanguagesOfSite(this.state.appSiteId)
            .then(_langs => {
                if (_langs.totalCount > 0) {
                    this.setState({ languages: _langs.result })
                }
            })
    }

    handleChange = (evt) => {
        const value = evt.target.value;
        this.setState({
            code: evt.target.value 
        })        
        // Return value on parent
        this.props.onLanguageChange(evt.target.value)
    }    
         
    render() {      
      return ( 
        <Form.Group>
            <Form.Control as="select" value={this.state.code} name="code" onChange={this.handleChange}>
                <option value={''}>Lingua predefinita</option>
                {this.state.languages && this.state.languages.map(lang =>
                    <option key={lang.code} value={lang.code}>{lang.code}</option>
                )}   
            </Form.Control>                
        </Form.Group>
      ); 
    } 
  } 
  
  export { LanguageSelect };