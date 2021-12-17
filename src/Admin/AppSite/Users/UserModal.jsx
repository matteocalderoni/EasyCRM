import React from 'react';
import { Button, Modal } from 'react-bootstrap'

import { UserAddEdit } from './UserAddEdit'; 

class UserModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {   
            setShow: false,
            appSiteId: props.appSiteId,                                
            user: {
                id: props.id
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
        this.props.handleAddEdit(this.state.appSiteId);
    }

    render() {
        return (            
          <>
            <Button variant="primary" className="mr-1" onClick={this.handleShow}>
                {this.state.user.id > 0 ? 'Modifica utente' : 'Aggiungi utente'}
            </Button>
            <Modal show={this.state.setShow} size="lg" onHide={this.handleClose} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.state.user.id > 0 ? 'Modifica utente' : 'Aggiungi utente'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.state.setShow &&
                        <UserAddEdit appSiteId={this.state.appSiteId} id={this.state.user.id} handleSaved={this.handleSaved} />
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

export { UserModal }