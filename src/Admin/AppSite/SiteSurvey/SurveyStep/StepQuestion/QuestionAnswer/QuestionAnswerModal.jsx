import React from 'react';
import { Button, Modal } from 'react-bootstrap'

import { QuestionAnswerAddEdit } from './QuestionAnswerAddEdit'; 

class QuestionAnswerModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {   
            setShow: false,
            questionAnswer: {
                appSiteId: props.appSiteId,                                
                siteSurveyId: props.siteSurveyId,
                surveyStepId: props.surveyStepId,
                stepQuestionId: props.stepQuestionId,
                questionAnswerId: props.questionAnswerId
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
        this.props.handleAddEdit(this.state.questionAnswer.appSiteId);
    }

    render() {
        return (            
          <>
            <Button variant="primary" className="btn-sm mr-1" onClick={this.handleShow}>
                {this.state.questionAnswer.questionAnswerId > 0 ? 'Modifica risposta' : 'Aggiungi risposta'}
            </Button>
            <Modal show={this.state.setShow} size="lg" onHide={this.handleClose} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.state.questionAnswer.questionAnswerId > 0 ? 'Modifica risposta' : 'Aggiungi risposta'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.state.setShow &&
                        <QuestionAnswerAddEdit appSiteId={this.state.questionAnswer.appSiteId} siteSurveyId={this.state.questionAnswer.siteSurveyId} surveyStepId={this.state.questionAnswer.surveyStepId} stepQuestionId={this.state.questionAnswer.stepQuestionId} questionAnswerId={this.state.questionAnswer.questionAnswerId} handleSaved={this.handleSaved} />
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

export { QuestionAnswerModal }