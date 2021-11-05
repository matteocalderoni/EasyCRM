import React from 'react';
import { Button, Modal } from 'react-bootstrap'

import { OutcomeTypeAddEdit } from './OutcomeTypeAddEdit'; 

class OutcomeTypeModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {   
            setShow: false,
            outcomeType: {
                appSiteId: props.appSiteId,                                
                outcomeTypeId: props.outcomeTypeId
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
        this.props.handleAddEdit(this.state.outcomeType.outcomeTypeId);
    }

    render() {
        return (            
          <>
            <Button variant="primary" className="mr-1" onClick={this.handleShow}>
                {this.state.outcomeType.outcomeTypeId > 0 ? 'Modifica esito' : 'Aggiungi esito'}
            </Button>
            <Modal show={this.state.setShow} size="lg" onHide={this.handleClose} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.state.outcomeType.outcomeTypeId > 0 ? 'Modifica esito' : 'Aggiungi esito'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.state.setShow &&
                        <OutcomeTypeAddEdit appSiteId={this.state.outcomeType.appSiteId} outcomeTypeId={this.state.outcomeType.outcomeTypeId} handleSaved={this.handleSaved} />
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

export { OutcomeTypeModal }