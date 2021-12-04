import React from 'react';
import { Button, Modal } from 'react-bootstrap'
import { BsPlus,BsPencil } from 'react-icons/bs';
import { PageBoxAddEdit } from './PageBoxAddEdit'; 

class PageBoxModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {   
            setShow: false,
            pageBox: {
                appSiteId: props.appSiteId,                
                sitePageId: props.sitePageId,
                pageBoxId: props.pageBoxId,
                sortId: props.sortId
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
            <Button className="bg-blue-500 text-white rounded-full" onClick={this.handleShow}>
                {this.state.pageBox.pageBoxId > 0 && <BsPencil title="Modifica il contenitore" />} 
                {this.state.pageBox.pageBoxId == 0 && <BsPlus title="Aggiungi un nuovo contenitore" />}                
            </Button>
            <Modal show={this.state.setShow} dialogClassName="modal-90w" onHide={this.handleClose} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.state.pageBox.pageBoxId > 0 ? 'Modifica il ' : 'Crea un nuovo '} Contenitore</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.state.setShow &&
                        <PageBoxAddEdit appSiteId={this.state.pageBox.appSiteId} sitePageId={this.state.pageBox.sitePageId} pageBoxId={this.state.pageBox.pageBoxId} sortId={this.state.pageBox.sortId} handleSaved={this.handleSaved} />
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