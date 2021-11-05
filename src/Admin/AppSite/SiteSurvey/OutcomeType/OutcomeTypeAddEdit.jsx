import React from 'react';
import { surveyService, alertService } from '../../../../_services';
import { Form, Button, Card, ProgressBar } from 'react-bootstrap'

class OutcomeTypeAddEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {   
            outcomeType: {
                appSiteId: this.props.appSiteId,         
                outcomeTypeId: this.props.outcomeTypeId,
                description: ''         
            },
            loading: false                         
         };

        this.handleChange = this.handleChange.bind(this)
        this.handleChangeNumber = this.handleChangeNumber.bind(this)
        this.handleChangeBool = this.handleChangeBool.bind(this)
    }

    componentDidMount() {
        this.handleOpen()
    }

    handleChange(evt) {
        const value = evt.target.value;
        this.setState({
            outcomeType: {
                ...this.state.outcomeType,
                [evt.target.name]: value
            }          
        });
    }
    
    handleChangeNumber(evt) {
        const value = parseInt(evt.target.value);
        this.setState({
            outcomeType: {
                ...this.state.outcomeType,
                [evt.target.name]: value                
            }          
        });
    }

    handleChangeBool(evt) {  
        this.setState({
            outcomeType: {
                ...this.state.outcomeType,
                [evt.target.name]: evt.target.checked                 
            }          
        });
    }

    handleEditorChange = (content, editor) => {
        this.setState({
            outcomeType: {
                ...this.state.outcomeType,
                description: content                 
            }          
        });
    }

    handleOpen() {    
        if (this.props.outcomeTypeId > 0) {
            this.setState({loading: true})
            surveyService.getOutcomeTypeById(this.props.appSiteId, this.props.outcomeTypeId)
                .then(_outcomeType => {                    
                    this.setState({
                        outcomeType: _outcomeType,
                        loading: false
                    })                    
                });
        }         
    }
    
    onSubmit = () => {
        if (this.props.outcomeTypeId > 0) {
            this.updateOutcomeType();
        } else {
            this.createOutcomeType();            
        }
    }

    createOutcomeType() {
        surveyService.createOutcomeType({ outcomeType: this.state.outcomeType })
            .then(result => {
                if (result.hasErrors) {
                    alertService.error('Problemi durante il salvataggio', { keepAfterRouteChange: true });
                } else {
                    alertService.success('Salvataggio riuscito con successo', { keepAfterRouteChange: true });
                }            
                if (this.props.handleSaved)    
                    this.props.handleSaved(this.state.outcomeType.appSiteId);                
            })
            .catch(error => {
                alertService.error(error);
            });
    }

    updateOutcomeType() {
        surveyService.updateOutcomeType({ outcomeType: this.state.outcomeType })
            .then(result => {
                if (result.hasErrors) {
                    alertService.error('Problemi durante il salvataggio', { keepAfterRouteChange: true });
                } else {
                    alertService.success('Aggiornamento riuscito', { keepAfterRouteChange: true });
                }    
                if (this.props.handleSaved)                                
                    this.props.handleSaved(this.state.outcomeType.outcomeTypeId);                
            })
            .catch(error => {
                alertService.error(error);
            });
    }

    render() {
        return (            
          <>
            <Card>                
                <Card.Body>                    
                    {this.state.loading && <div className="text-center mart2">
                        <ProgressBar animated now={100} />
                    </div>}
                    <Form onSubmit={this.onSubmit}>
                        <Form.Group>
                            <Form.Label>Descrizione</Form.Label>
                            <input type="text" className="form-control" name="description" value={this.state.outcomeType.description} onChange={this.handleChange} maxLength={200} />
                            <Form.Text className="text-muted">
                                La descrizione di esito.
                            </Form.Text>
                        </Form.Group> 
                    </Form>                    
                </Card.Body>    
                <Card.Footer>
                    <Button onClick={this.onSubmit} variant="success">
                        Salva le modifiche
                    </Button> 
                </Card.Footer>
            </Card>                    
          </>          
        );
    }
}

export { OutcomeTypeAddEdit }