import React from 'react';
import { Button, Modal } from 'react-bootstrap'

import { SurveyStepAddEdit } from './SurveyStepAddEdit'; 

class SurveyStepModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {   
            setShow: false,
            surveyStep: {
                appSiteId: props.appSiteId,                                
                siteSurveyId: props.siteSurveyId,
                surveyStepId: props.surveyStepId
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
        this.props.handleAddEdit(this.state.surveyStep.appSiteId);
    }

    render() {
        return (            
          <>
            <Button variant="primary" className="btn-sm mr-1" onClick={this.handleShow}>
                {this.state.surveyStep.surveyStepId > 0 ? 'Modifica step' : 'Aggiungi step'}
            </Button>
            <Modal show={this.state.setShow} size="lg" onHide={this.handleClose} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.state.surveyStep.surveyStepId > 0 ? 'Modifica step' : 'Aggiungi step'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.state.setShow &&
                        <SurveyStepAddEdit appSiteId={this.state.surveyStep.appSiteId} siteSurveyId={this.state.surveyStep.siteSurveyId} surveyStepId={this.state.surveyStep.surveyStepId} handleSaved={this.handleSaved} />
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

export { SurveyStepModal }