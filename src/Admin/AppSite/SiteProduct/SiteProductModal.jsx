import React from 'react';
import { Button, Modal } from 'react-bootstrap'

import { SiteProductAddEdit } from './SiteProductAddEdit'; 

class SiteProductModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {   
            setShow: false,
            appSiteId: props.appSiteId,                                
            siteProduct: {
                appSiteId: props.appSiteId,
                siteProductId: props.siteProductId
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
                {this.state.siteProduct.siteProductId > 0 ? 'Modifica prodotto' : 'Aggiungi prodotto'}
            </Button>
            <Modal show={this.state.setShow} size="lg" onHide={this.handleClose} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.state.siteProduct.siteProductId > 0 ? 'Modifica prodotto' : 'Aggiungi prodotto'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.state.setShow &&
                        <SiteProductAddEdit appSiteId={this.state.appSiteId} siteProductId={this.state.siteProduct.siteProductId} handleSaved={this.handleSaved} />
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

export { SiteProductModal }