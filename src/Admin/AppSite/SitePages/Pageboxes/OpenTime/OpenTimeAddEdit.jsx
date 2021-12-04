import React from 'react';
import { TimePicker } from 'antd';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import * as moment from 'moment'
import { appSiteService, alertService } from '../../../../../_services';
import { Form, Button, Modal } from 'react-bootstrap'
import { CardSizes } from '../../../../../_helpers/cardSize';

const weekDays = [
    { value: 1, label: 'Lunedì'},
    { value: 2, label: 'Martedì' },
    { value: 3, label: 'Mercoledì' },
    { value: 4, label: 'Giovedì' },
    { value: 5, label: 'Venerdì' },
    { value: 6, label: 'Sabato' },
    { value: 7, label: 'Domenica' }
]

const currentUnixTime = new Date().getTime();

class OpenTimeAddEdit extends React.Component {   

    constructor(props) {
        super(props);
        this.state = {   
            setShow: false, 
            setNew: (this.props.weekDay === 0),
            appSiteId: this.props.appSiteId || 0,         
            sitePageId: this.props.sitePageId || 0,
            pageBoxId: this.props.pageBoxId || 0,
            weekDay: this.props.weekDay || 0,
            startTime: currentUnixTime,
            pauseTime: currentUnixTime,
            resumeTime: currentUnixTime,
            endTime: currentUnixTime,
            cardSize: 4
        };                

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeNumber = this.handleChangeNumber.bind(this);
    }

    handleChange(evt) {
        const value = parseFloat(evt.target.value);
        this.setState({
          [evt.target.name]: value
        });
    }

    handleChangeNumber(evt) {
        const value = parseInt(evt.target.value);
        this.setState({
            [evt.target.name]: value         
        });
    }

    handleTimeChange(time,name) {
        const value = time.unix() * 1000;
        //console.log(time.unix());
        this.setState({
          [name]: value
        });
    }

    handleShow = () => {
        if (this.props.appSiteId > 0 && this.props.sitePageId > 0 && this.props.pageBoxId > 0 && this.props.weekDay > 0) {
            appSiteService.getOpenTimeById(this.props.appSiteId, this.props.sitePageId, this.props.pageBoxId, this.props.weekDay)
                .then(openTime => {                    
                    this.setState({
                        appSiteId: openTime['appSiteId'] || 0,
                        sitePageId: openTime['sitePageId'] || 0,
                        pageBoxId: openTime['pageBoxId'] || 0,
                        weekDay: openTime['weekDay'] || 0,
                        startTime: openTime['startTime'] || currentUnixTime,
                        pauseTime: openTime['pauseTime'] || currentUnixTime,
                        resumeTime: openTime['resumeTime'] || currentUnixTime,
                        endTime: openTime['endTime'] || currentUnixTime,
                        cardSize: parseInt(openTime['cardSize'] || 4)
                    });
                });
        }         

        this.setState({
            setShow: true
        });        
    }

    handleClose = () => {
        this.setState({
            setShow: false
        });
    }
    
    onSubmit = () => {
        if (!this.state.setNew) {
            this.updateOpenTime();
        } else {
            this.createOpenTime();            
        }
    }

    createOpenTime() {
        appSiteService.createOpenTime({ openTime: this.state })
            .then(() => {
                alertService.success('Giorno di attività aggiunto con successo', { keepAfterRouteChange: true });
                this.handleClose();
                this.props.handleAddEdit(this.state.appSiteId, this.state.sitePageId, this.state.pageBoxId);                
            })
            .catch(error => {
                alertService.error(error);
            });
    }

    updateOpenTime() {
        appSiteService.updateOpenTime({ openTime: this.state })
            .then(() => {
                alertService.success('Aggiornamento riuscito', { keepAfterRouteChange: true });
                this.handleClose();
                this.props.handleAddEdit(this.state.appSiteId, this.state.sitePageId, this.state.pageBoxId);            
            })
            .catch(error => {
                alertService.error(error);
            });
    }

    render() {
        return (            
          <>
            <Button variant="primary" className="mr-1" onClick={this.handleShow}>
                {this.state.weekDay > 0 ? 'Modifica' : 'Nuovo'} Giorno
            </Button>

            <Modal
                show={this.state.setShow}
                onHide={this.handleClose}
                backdrop="static"
                size="lg"
                keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.state.weekDay > 0 ? 'Modifica' : 'Nuovo'} Giorno</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Giorno della settimana</Form.Label>
                        <Form.Control as="select" value={this.state.weekDay} name="weekDay" onChange={this.handleChange}>
                            <option value={0}>Seleziona un giorno</option>
                            {weekDays && weekDays.map(weekDay =>
                                <option key={weekDay.value} value={weekDay.value}>{weekDay.label}</option>
                            )}   
                        </Form.Control>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Apertura</Form.Label>
                        <TimePicker name="startTime" className="form-control" value={moment(this.state.startTime)} onChange={(time) => { this.handleTimeChange(time,'startTime') }} />                                              
                        <Form.Text className="text-muted">
                            Ora di inizio mattino.
                        </Form.Text>
                    </Form.Group>         

                    <Form.Group>
                        <Form.Label>Pausa</Form.Label>
                        <TimePicker name="pauseTime" className="form-control" value={moment(this.state.pauseTime)} onChange={(time) => { this.handleTimeChange(time,'pauseTime') }} />                                                   
                        <Form.Text className="text-muted">
                            Ora di fine turno mattino.
                        </Form.Text>
                    </Form.Group>                    

                    <Form.Group>
                        <Form.Label>Ripresa</Form.Label>
                        <TimePicker name="resumeTime" className="form-control" value={moment(this.state.resumeTime)} onChange={(time) => { this.handleTimeChange(time,'resumeTime') }} />                                                   
                        <Form.Text className="text-muted">
                            Ora di inizio turno pomeriggio.
                        </Form.Text>
                    </Form.Group>   

                    <Form.Group>
                        <Form.Label>Chiusura</Form.Label>
                        <TimePicker name="endTime" className="form-control" value={moment(this.state.endTime)} onChange={(time) => { this.handleTimeChange(time,'endTime') }} />                                                   
                        <Form.Text className="text-muted">
                            Ora di chiusura turno pomeriggio.
                        </Form.Text>
                    </Form.Group>       

                    <Form.Group>
                        <Form.Label>Dimensione</Form.Label>
                        <Form.Control as="select" value={this.state.cardSize} name="cardSize" onChange={this.handleChangeNumber}>
                            <option value={0}>Seleziona una dimensione</option>
                            {CardSizes && CardSizes.map(cardSize =>
                                <option key={cardSize.value} value={parseInt(cardSize.value)}>{cardSize.label}</option>
                            )}   
                        </Form.Control>
                        <Form.Text className="text-muted">
                            I tipi servono per impostare il formato e le proprietà del contenitore.
                        </Form.Text>
                    </Form.Group>             
                                        
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.onSubmit} variant="success">
                        Salva le modifiche
                    </Button> 
                    <Button onClick={this.handleClose} variant="default" className="mr-1">
                        annulla e chiudi
                    </Button> 
                </Modal.Footer>
            </Modal>              
          </>          
        );
    }
}

export { OpenTimeAddEdit }