import React from 'react';
import { Button, Modal } from 'react-bootstrap'

import { PageBoxAddEdit } from './PageBoxAddEdit'; 

class PageBoxModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {   
            setShow: false,
            pageBox: {
                appSiteId: props.appSiteId,                
                sitePageId: props.sitePageId,
                pageBoxId: props.pageBoxId                
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
        this.props.handleAddEdit(this.state.pageBox.appSiteId, this.state.pageBox.sitePageId);
        this.handleClose();
    }

    render() {
        return (            
          <>
            <Button variant="primary" className="mr-1" onClick={this.handleShow}>
                {this.state.pageBox.pageBoxId > 0 ? 'Modifica il ' : 'Crea un nuovo '} Contenitore
            </Button>
            <Modal show={this.state.setShow} dialogClassName="modal-90w" onHide={this.handleClose} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.state.pageBox.pageBoxId > 0 ? 'Modifica il ' : 'Crea un nuovo '} Contenitore</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.state.setShow &&
                        <PageBoxAddEdit appSiteId={this.state.pageBox.appSiteId} sitePageId={this.state.pageBox.sitePageId} pageBoxId={this.state.pageBox.pageBoxId} handleSaved={this.handleSaved} />
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

export { PageBoxModal }