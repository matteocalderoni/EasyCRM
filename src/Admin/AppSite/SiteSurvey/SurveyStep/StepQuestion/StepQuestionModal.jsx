import React from 'react';
import { Button, Modal } from 'react-bootstrap'

import { StepQuestionAddEdit } from './StepQuestionAddEdit'; 

class StepQuestionModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {   
            setShow: false,
            stepQuestion: {
                appSiteId: props.appSiteId,                                
                siteSurveyId: props.siteSurveyId,
                surveyStepId: props.surveyStepId,
                stepQuestionId: props.stepQuestionId
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
        this.props.handleAddEdit(this.state.stepQuestion.appSiteId);
    }

    render() {
        return (            
          <>
            <Button variant="primary" className="btn-sm mr-1" onClick={this.handleShow}>
                {this.state.stepQuestion.stepQuestionId > 0 ? 'Modifica domanda' : 'Aggiungi domanda'}
            </Button>
            <Modal show={this.state.setShow} size="lg" onHide={this.handleClose} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.state.stepQuestion.stepQuestionId > 0 ? 'Modifica domanda' : 'Aggiungi domanda'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.state.setShow &&
                        <StepQuestionAddEdit appSiteId={this.state.stepQuestion.appSiteId} siteSurveyId={this.state.stepQuestion.siteSurveyId} surveyStepId={this.state.stepQuestion.surveyStepId} stepQuestionId={this.state.stepQuestion.stepQuestionId} handleSaved={this.handleSaved} />
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

export { StepQuestionModal }