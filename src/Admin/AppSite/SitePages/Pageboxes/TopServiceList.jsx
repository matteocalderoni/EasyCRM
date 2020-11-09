import React from 'react';
import { Container, Jumbotron, Card, Button, Row, Col } from 'react-bootstrap';
import { appSiteService } from '../../../../_services';
import { TopServiceAddEdit } from './TopServiceAddEdit';
import parse from 'html-react-parser';

const baseImageUrl = `${process.env.REACT_APP_API_URL}/Resources/Images/`;

class TopServiceList extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            topServices: null,
            appSiteId: this.props.appSiteId,
            sitePageId: this.props.sitePageId,
            pageBoxId: this.props.pageBoxId
        }

        this.getTopServices(this.props.appSiteId, this.props.sitePageId, this.props.pageBoxId);
    }

    getTopServices(appSiteId, sitePageId, pageBoxId) {            
        appSiteService.getTopServicesOfBox(appSiteId, sitePageId, pageBoxId)
            .then((_topServices) => {
                this.setState({ topServices: (_topServices.totalCount > 0 ? _topServices.result : []) });                
            })
            .catch(() => {});        
    }

    deleteTopService = (topService) => {
        appSiteService.deleteTopService(topService.appSiteId, topService.sitePageId, topService.pageBoxId, topService.topServiceId)
            .then(() => {
                this.getTopServices(this.state.appSiteId, this.state.sitePageId, this.state.pageBoxId);
            });
    }

    handleAddEdit = (appSiteId, sitePageId, pageBoxId) => {
        this.getTopServices(appSiteId, sitePageId, pageBoxId);
    }
    
    render() {
        return (
            <Container>
                <Jumbotron>
                    <h2>Contenitore <b>Servizi</b></h2>
                </Jumbotron>
                <TopServiceAddEdit appSiteId={this.state.appSiteId} sitePageId={this.state.sitePageId} pageBoxId={this.state.pageBoxId} topServiceId={0} handleAddEdit={this.handleAddEdit} />
                <Row className="mart2" >
                {this.state.topServices && this.state.topServices.map(topService =>                
                    <Col sm={parseInt(topService.cardSize)} key={topService.topServiceId}>
                        <Card>
                            <Card.Img variant="top" src={baseImageUrl+topService.imageUrl} />
                            <Card.Body>                                
                                <Card.Title>
                                    {topService.title}
                                </Card.Title>
                                <div>
                                {parse(topService.description)}
                                </div>
                                <TopServiceAddEdit appSiteId={topService.appSiteId} sitePageId={topService.sitePageId} pageBoxId={topService.pageBoxId} topServiceId={topService.topServiceId} handleAddEdit={this.handleAddEdit} />
                                <Button variant="danger" onClick={() => this.deleteTopService(topService)}>elimina</Button>
                            </Card.Body>
                        </Card>                        
                    </Col>                                
                )}                    
                {!this.state.topServices &&                
                    <Col className="text-center">
                        <span className="spinner-border spinner-border-lg align-center"></span>
                    </Col>
                }
                </Row>
            </Container>
        );
    }

}

export { TopServiceList };