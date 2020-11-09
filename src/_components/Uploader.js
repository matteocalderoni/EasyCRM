import { fetchWrapper } from '../_helpers';
import React,{Component} from 'react'; 
import { Button } from 'react-bootstrap';

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
      // Request made to the backend api 
      // Send formData object 
      fetchWrapper.postFile(`${baseUrl}/Upload`, event.target.files[0])
        .then(() => {
          this.setState({ isUploaded: true });
          this.props.onFileNameChange(this.state.fileName);
        }); 
    };         
     
    render() {      
      return ( 
        <div> 
            <input type="file" onChange={this.onFileUpload} /> 
            {!this.state.isUploaded && 
            <Button onClick={this.onFileUpload} variant="success"> 
              carica 
            </Button> 
            }            
        </div> 
      ); 
    } 
  } 
  
  export { Uploader };