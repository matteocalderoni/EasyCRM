import React from 'react';
import { Button, Modal } from 'react-bootstrap'

import { SitePageAddEdit } from './SitePageAddEdit'; 

class SitePageModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {   
            setShow: false,
            sitePage: {
                appSiteId: props.appSiteId,                                
                sitePageId: props.sitePageId,
                parentPageId: props.parentPageId > 0 ? parseInt(props.parentPageId) : undefined
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
        this.props.handleAddEdit(this.state.sitePage.appSiteId);
    }

    render() {
        return (            
          <>
            <Button variant="primary" className="mr-1" onClick={this.handleShow}>
                {(this.state.sitePage.sitePageId > 0 ? 'Modifica la ' : 'Crea una nuova ') + (this.state.sitePage.parentPageId > 0 ? 'Sotto-Pagina' : 'Pagina')}
            </Button>
            <Modal show={this.state.setShow} size="lg" onHide={this.handleClose} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>{(this.state.sitePage.sitePageId > 0 ? 'Modifica la ' : 'Crea una nuova ') + (this.state.sitePage.parentPageId > 0 ? 'Sotto-Pagina' : 'Pagina')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.state.setShow &&
                        <SitePageAddEdit appSiteId={this.state.sitePage.appSiteId} sitePageId={this.state.sitePage.sitePageId} parentPageId={this.state.sitePage.parentPageId} handleSaved={this.handleSaved} />
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

export { SitePageModal }