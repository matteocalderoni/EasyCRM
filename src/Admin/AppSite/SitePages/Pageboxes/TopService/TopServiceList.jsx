import React from 'react';
import { Container, Card, Row, Col, ProgressBar } from 'react-bootstrap';
import { appSiteService } from '../../../../../_services';
import { TopServiceAddEdit } from './TopServiceAddEdit';
import parse from 'html-react-parser';
import { DeleteConfirmation } from '../../../../../_components/DeleteConfirmation';

const baseImageUrl = `${process.env.REACT_APP_STORAGE_URL}/`;

class TopServiceList extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            topServices: null,
            appSiteId: this.props.appSiteId,
            sitePageId: this.props.sitePageId,
            pageBoxId: this.props.pageBoxId,
            loading: false
        }
    }

    componentDidMount() {
        this.getTopServices(this.props.appSiteId, this.props.sitePageId, this.props.pageBoxId);
    }

    getTopServices(appSiteId, sitePageId, pageBoxId) {            
        this.setState({ loading: true })
        appSiteService.getTopServicesOfBox(appSiteId, sitePageId, pageBoxId)
            .then((_topServices) => {
                this.setState({ 
                    loading: false, 
                    topServices: (_topServices.totalCount > 0 ? _topServices.result : []) 
                });                
            })
            .catch(() => {
                this.setState({ loading: true })
            });        
    }

    deleteTopService = (topService) => {
        this.setState({ loading: true })
        appSiteService.deleteTopService(topService.appSiteId, topService.sitePageId, topService.pageBoxId, topService.topServiceId)
            .then(() => {
                this.setState({ loading: false })
                this.getTopServices(this.state.appSiteId, this.state.sitePageId, this.state.pageBoxId);
            });
    }

    handleAddEdit = (appSiteId, sitePageId, pageBoxId) => {
        this.getTopServices(appSiteId, sitePageId, pageBoxId);
    }
    
    render() {
        return (
            <Container fluid>
                <div className="border">                    
                    <p className="text-muted">Con questo contenitore puoi creare un elenco di card con immagine e testo.
                    Puoi scegliere la dimensione dei riquadri per creare layout differenti.</p>
                </div>
                <TopServiceAddEdit appSiteId={this.state.appSiteId} sitePageId={this.state.sitePageId} pageBoxId={this.state.pageBoxId} topServiceId={0} handleAddEdit={this.handleAddEdit} />
                {this.state.loading && <div className="text-center mart2">
                    <ProgressBar animated now={100} />
                </div>}
                <Row className="mart2" >
                {this.state.topServices && !this.state.loading && this.state.topServices.map(topService =>                
                    <Col sm={parseInt(topService.cardSize)} key={topService.topServiceId}>
                        <Card bg="secondary" text="white">
                            <Card.Header>
                                <Card.Title>
                                    #{topService.sortId} {topService.title}
                                </Card.Title>
                            </Card.Header>
                            <Card.Img variant="top" src={baseImageUrl+topService.imageUrl} />
                            <Card.Body>                                                                
                                <div>
                                {topService.description && parse(topService.description)}
                                </div>
                                <TopServiceAddEdit appSiteId={topService.appSiteId} sitePageId={topService.sitePageId} pageBoxId={topService.pageBoxId} topServiceId={topService.topServiceId} handleAddEdit={this.handleAddEdit} />
                                {/* <Button variant="danger" onClick={() => this.deleteTopService(topService)}>elimina</Button> */}
                                <DeleteConfirmation onConfirm={() => this.deleteTopService(topService)} />
                            </Card.Body>
                        </Card>                        
                    </Col>                                
                )}   
                </Row>
            </Container>
        );
    }

}

export { TopServiceList };