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
          <>
            <Button variant="primary" className="mr-1" onClick={this.handleShow}>
                {this.state.siteLanguage.code != '' ? 'Modifica la lingua' : 'Aggiungi una lingua'}
            </Button>
            <Modal show={this.state.setShow} size="lg" onHide={this.handleClose} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.state.siteLanguage.code != '' ? 'Modifica la lingua' : 'Aggiungi una lingua'}</Modal.Title>
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
          </>          
        );
    }
}

export { SiteLanguageModal }