import React from 'react';
import { Button, Modal } from 'react-bootstrap'
import { BsPlus,BsPencil } from 'react-icons/bs';
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
    
    handleShow = () => this.setState({ setShow: true });            
    handleClose = () => this.setState({ setShow: false });    

    handleSaved = () => {
        this.setState({ setShow: false });
        this.props.handleAddEdit(this.state.appSiteId);
    }

    render() {
        return (            
          <div className='relative'>
            <div className={`fixed ${(this.props.pageBoxId > 0 ? 'bottom-2' : 'bottom-20 md:bottom-16')} right-2`}>
                <Button variant="primary" className="text-white px-4 w-auto h-16 bg-green-600 rounded-full hover:bg-green-700 border-green-500 active:shadow-lg mouse shadow transition ease-in duration-200 focus:outline-none" onClick={this.handleShow}>
                    {this.state.siteProduct.siteProductId > 0 && <BsPencil title="Modifica prodotto" />} 
                    {this.state.siteProduct.siteProductId === 0 && <BsPlus title="Aggiungi prodotto" />}                                                        
                </Button>
            </div>
            <Modal show={this.state.setShow} size="lg" onHide={this.handleClose} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.state.siteProduct.siteProductId > 0 ? 'Modifica prodotto' : 'Aggiungi prodotto'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.state.setShow &&
                    <SiteProductAddEdit appSiteId={this.state.appSiteId} siteProductId={this.state.siteProduct.siteProductId} handleSaved={this.handleSaved} />}                    
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

export { SiteProductModal }