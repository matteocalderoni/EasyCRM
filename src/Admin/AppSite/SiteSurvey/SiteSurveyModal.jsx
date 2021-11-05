import React from 'react';
import { Button, Modal } from 'react-bootstrap'

import { SiteSurveyAddEdit } from './SiteSurveyAddEdit'; 

class SiteSurveyModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {   
            setShow: false,
            siteSurvey: {
                appSiteId: props.appSiteId,                                
                siteSurveyId: props.siteSurveyId
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
        this.props.handleAddEdit(this.state.siteSurvey.appSiteId);
    }

    render() {
        return (            
          <>
            <Button variant="primary" className="mr-1" onClick={this.handleShow}>
                {this.state.siteSurvey.siteSurveyId > 0 ? 'Modifica percorso' : 'Aggiungi percorso'}
            </Button>
            <Modal show={this.state.setShow} size="lg" onHide={this.handleClose} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.state.siteSurvey.siteSurveyId > 0 ? 'Modifica percorso' : 'Aggiungi percorso'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.state.setShow &&
                        <SiteSurveyAddEdit appSiteId={this.state.siteSurvey.appSiteId} siteSurveyId={this.state.siteSurvey.siteSurveyId} handleSaved={this.handleSaved} />
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

export { SiteSurveyModal }