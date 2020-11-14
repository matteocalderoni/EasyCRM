import { fetchWrapper } from '../_helpers';
import React,{Component} from 'react'; 
import { Label } from 'react-bootstrap';

const baseUrl = `${process.env.REACT_APP_API_URL}/upload`;

class Uploader extends Component { 
  
    constructor(props) {
      super(props);
      this.state = { 
        // Initially, no file is selected 
        selectedFile: null,
        fileName: props.fileName,        
        isUploaded: true        
      };                   
    }
     
    // On file select (from the pop up) 
    onFileChange = event => {      
      // Update the state 
      this.setState({ 
        selectedFile: event.target.files[0],
        fileName: event.target.files[0].name,
        isUploaded: false
      });      
    }; 
     
    // On file upload (click the upload button) 
    onFileUpload = event => {  
      this.setState({ 
        selectedFile: event.target.files[0],
        fileName: event.target.files[0].name,
        isUploaded: false
      });                 

      const fileName = (this.props.prefix + '/' || '') + new Date().getTime() + '.jpeg';
      // Request made to the backend api 
      // Send formData object 
      fetchWrapper.postFile(`${baseUrl}/CloudUpload`, event.target.files[0], fileName)
        .then((result) => {
          this.setState({ isUploaded: true });
          //this.props.onFileNameChange(this.state.fileName);
          this.props.onFileNameChange(result.fileName);
        }); 
    };         
     
    render() {      
      return ( 
        <div> 
            <input type="file" onChange={this.onFileUpload} /> 
            {!this.state.isUploaded && 
            <label> 
              <span className="spinner-border spinner-border-lg align-center"></span>
               Caricamento in corso... Attendere il completamento... 
            </label> 
            }            
        </div> 
      ); 
    } 
  } 
  
  export { Uploader };