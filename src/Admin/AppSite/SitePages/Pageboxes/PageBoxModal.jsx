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
          <div className='relative'>
            <div className={`fixed ${(this.props.pageBoxId > 0 ? 'bottom-2' : 'bottom-16')} right-2`}>
                <Button className="text-white flex items-center space-x-2 px-4 w-auto h-16 bg-green-600 rounded-full hover:bg-green-700 border-green-500 active:shadow-lg mouse shadow transition ease-in duration-200 focus:outline-none" onClick={this.handleShow}>
                    {this.props.pageBoxId > 0 && <BsPencil className='h-6 w-6' title="Modifica il contenitore" />} 
                    {this.props.pageBoxId === 0 && <BsPlus className='h-8 w-8' title="Aggiungi un nuovo contenitore" />}                
                    <span className='hidden md:block'>
                        {this.props.pageBoxId === 0 && <span>Aggiungi contenitore</span>}                                    
                        {this.props.pageBoxId > 0 && <span>Modifica</span>}                                    
                    </span>
                </Button>
            </div>
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
          </div>          
        );
    }
}

export { PageBoxModal }