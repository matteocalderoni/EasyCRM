import React from 'react';
import { Button, Modal } from 'react-bootstrap'
import { BsPlus,BsPencil } from 'react-icons/bs';
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
          <div className='relative'>
              <div className="fixed flex items-center bottom-16 right-2">
                <Button variant="primary" className="text-white flex items-center px-2 w-auto h-12 bg-green-600 rounded-full hover:bg-green-700 border-green-500 active:shadow-lg mouse shadow transition ease-in duration-200 focus:outline-none" onClick={this.handleShow}>
                    {this.state.user.id > 0 && <BsPencil className='h-6 w-6' title="Modifica percorso" />} 
                    {this.state.user.id === 0 && <BsPlus className='h-6 w-6' title="Aggiungi percorso" />}                                                    
                    <span className='hidden md:block'>
                        {this.state.user.id > 0 ? 'Modifica utente' : 'Aggiungi utente'}
                    </span>
                </Button>
              </div>
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
          </div>          
        );
    }
}

export { UserModal }