import React from 'react';
import * as moment from 'moment'
import { Container, Jumbotron, Card, Button, Row, Col } from 'react-bootstrap';
import { appSiteService } from '../../../../_services';
import { OpenTimeAddEdit } from './OpenTimeAddEdit';

const weekDays = [
    { value: 1, label: 'Lunedì'},
    { value: 2, label: 'Martedì' },
    { value: 3, label: 'Mercoledì' },
    { value: 4, label: 'Giovedì' },
    { value: 5, label: 'Venerdì' },
    { value: 6, label: 'Sabato' },
    { value: 7, label: 'Domenica' }
]

class OpenTimeList extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            openTimes: null,
            appSiteId: this.props.appSiteId,
            sitePageId: this.props.sitePageId,
            pageBoxId: this.props.pageBoxId
        }

        this.getOpenTimes(this.props.appSiteId, this.props.sitePageId, this.props.pageBoxId);
    }

    getOpenTimes(appSiteId, sitePageId, pageBoxId) {            
        appSiteService.getOpenTimesOfBox(appSiteId, sitePageId, pageBoxId)
            .then((_openTimes) => {
                this.setState({ openTimes: (_openTimes.totalCount > 0 ? _openTimes.result : []) });                                
            })
            .catch(() => {});        
    }

    deleteOpenTime = (openTime) => {
        appSiteService.deleteOpenTime(openTime.appSiteId, openTime.sitePageId, openTime.pageBoxId, openTime.weekDay)
            .then(() => {
                this.getOpenTimes(this.state.appSiteId, this.state.sitePageId,this.state.pageBoxId);
            });
    }

    handleAddEdit = (appSiteId, sitePageId, pageBoxId) => {
        this.getOpenTimes(appSiteId, sitePageId, pageBoxId);
    }
    
    render() {
        return (
            <Container>
                <Jumbotron>
                    <h2>Contenitore <b>Giorni di servizio</b></h2>
                </Jumbotron>
                <OpenTimeAddEdit appSiteId={this.state.appSiteId} sitePageId={this.state.sitePageId} pageBoxId={this.state.pageBoxId} weekDay={0} handleAddEdit={this.handleAddEdit} />
                <Row className="mart2" >
                {this.state.openTimes && this.state.openTimes.map(openTime =>                
                    <Col sm={4} key={openTime.weekDay}>
                        <Card>                            
                            <Card.Header>
                                {weekDays[openTime.weekDay - 1].label}
                            </Card.Header>
                            <Card.Body>                                                                
                                <Card.Text>
                                <b>Pranzo</b>: {moment(openTime.startTime).format('HH:mm')} - {moment(openTime.pauseTime).format('HH:mm')}<br />
                                <b>Cena</b>: {moment(openTime.resumeTime).format('HH:mm')} - {moment(openTime.endTime).format('HH:mm')}
                                </Card.Text>
                                <OpenTimeAddEdit appSiteId={openTime.appSiteId} weekDay={openTime.weekDay} handleAddEdit={this.handleAddEdit} />
                                <Button variant="danger" onClick={() => this.deleteOpenTime(openTime)}>elimina</Button>
                            </Card.Body>
                        </Card>                        
                    </Col>                                
                )}                    
                {!this.state.openTimes &&                
                    <Col className="text-center">
                        <span className="spinner-border spinner-border-lg align-center"></span>
                    </Col>
                }
                </Row>
            </Container>
        );
    }

}

export { OpenTimeList };