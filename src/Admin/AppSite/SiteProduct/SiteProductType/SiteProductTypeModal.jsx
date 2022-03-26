import React from 'react';
import { Button, Modal } from 'react-bootstrap'

import { SiteProductTypeAddEdit } from './SiteProductTypeAddEdit'; 

class SiteProductTypeModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {   
            setShow: false,
            appSiteId: props.appSiteId,                                
            siteProductType: {
                appSiteId: props.appSiteId,
                siteProductTypeId: props.siteProductTypeId
            }
         };
    }
    
    handleShow = () => {    
        this.setState({ setShow: true });        
    }

    handleClose = () => {
        this.setState({ setShow: false });
    }            

    handleSaved = () => {
        this.setState({ setShow: false });
        this.props.handleAddEdit(this.state.appSiteId);
    }

    render() {
        return (            
          <>
            <Button variant="primary" className="mr-1 bg-green-500 border-0 rounded-full" onClick={this.handleShow}>
                {this.state.siteProductType.siteProductTypeId > 0 ? 'Modifica tipo prodotto' : 'Aggiungi tipo prodotto'}
            </Button>
            <Modal show={this.state.setShow} size="lg" onHide={this.handleClose} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.state.siteProductType.siteProductTypeId > 0 ? 'Modifica tipo prodotto' : 'Aggiungi tipo prodotto'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.state.setShow &&
                        <SiteProductTypeAddEdit appSiteId={this.state.appSiteId} siteProductTypeId={this.state.siteProductType.siteProductTypeId} handleSaved={this.handleSaved} />
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

export { SiteProductTypeModal }