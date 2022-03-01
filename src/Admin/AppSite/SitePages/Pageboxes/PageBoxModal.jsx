import React from 'react';
import { Button, Modal } from 'react-bootstrap'
import { BsPlus,BsPencil } from 'react-icons/bs';
import { PageBoxAddEdit } from './PageBoxAddEdit'; 
import parse from 'html-react-parser';

class PageBoxModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {   
            setShow: false,
            pageBox: {
                appSiteId: props.appSiteId,                
                sitePageId: props.sitePageId,
                pageBoxId: props.pageBoxId,
                sortId: props.sortId,
                title: props.title
            }
         };
    }
    
    handleShow = () => {    
        this.setState({ setShow: true });        
    }

    handleClose = () => {
        this.setState({ setShow: false });
    }            

    handleSaved = (_pageBox) => {        
        this.props.handleAddEdit(_pageBox);        
        this.handleClose();
    }

    render() {
        return (            
          <>
            <Button className="bg-blue-500 text-white rounded-full" onClick={this.handleShow}>
                {this.props.pageBoxId > 0 && <BsPencil title="Modifica il contenitore" />} 
                {this.props.pageBoxId === 0 && <BsPlus title="Aggiungi un nuovo contenitore" />}                
            </Button>
            <Modal show={this.state.setShow} dialogClassName="modal-90w" onHide={this.handleClose} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {this.state.pageBox.pageBoxId > 0 ? parse(this.state.pageBox.title) : 'Crea un nuovo Contenitore'} 
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.state.setShow &&
                        <PageBoxAddEdit 
                            appSiteId={this.state.pageBox.appSiteId} 
                            sitePageId={this.state.pageBox.sitePageId} 
                            pageBoxId={this.state.pageBox.pageBoxId} 
                            sortId={this.state.pageBox.sortId} 
                            handleSaved={(pageBox) => this.handleSaved(pageBox)} 
                            onClose={() => this.handleClose()} 
                            />
                    }                    
                </Modal.Body>                
            </Modal>              
          </>          
        );
    }
}

export { PageBoxModal }