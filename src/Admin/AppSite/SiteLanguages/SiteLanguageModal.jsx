import React from 'react';
import { Button, Modal } from 'react-bootstrap'

import { SiteLanguageAddEdit } from './SiteLanguageAddEdit'; 

class SiteLanguageModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {   
            setShow: false,
            siteLanguage: {
                appSiteId: props.appSiteId,                                
                code: props.code
            }
         };
    }
    
    handleShow = () => {    
        this.setState({
            setShow: true
        });        
    }

    handleClose = () => {
        this.setState({
            setShow: false
        });
    }            

    handleSaved = () => {
        this.setState({ setShow: false });
        this.props.handleAddEdit(this.state.siteLanguage.appSiteId);
    }

    render() {
        return (            
          <div className='relative'>
            <div className="fixed flex items-center bottom-16 right-2">
                <Button variant="primary" className="text-white px-4 w-auto h-16 bg-green-600 rounded-full hover:bg-green-700 border-green-500 active:shadow-lg mouse shadow transition ease-in duration-200 focus:outline-none" onClick={this.handleShow}>                    
                    {(this.state.siteLanguage.code != null && this.state.siteLanguage.code !== '') ? 'Modifica la lingua' : 'Aggiungi una lingua'}
                </Button>
            </div>

            <Modal show={this.state.setShow} size="lg" onHide={this.handleClose} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>{(this.state.siteLanguage.code != null && this.state.siteLanguage.code !== '') ? 'Modifica la lingua' : 'Aggiungi una lingua'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.state.setShow &&
                        <SiteLanguageAddEdit appSiteId={this.state.siteLanguage.appSiteId} code={this.state.siteLanguage.code} handleSaved={this.handleSaved} />
                    }                    
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.handleClose} variant="default">
                        chiudi e annulla
                    </Button> 
                </Modal.Footer>
            </Modal>              
          </div>          
        );
    }
}

export { SiteLanguageModal }