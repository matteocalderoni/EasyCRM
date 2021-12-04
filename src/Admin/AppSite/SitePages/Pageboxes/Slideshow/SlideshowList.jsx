import React from 'react';
import { Container, Card, Row, Col, ProgressBar } from 'react-bootstrap';
import { appSiteService } from '../../../../../_services';
import { SlideshowAddEdit } from './SlideshowAddEdit';
import parse from 'html-react-parser';
import { DeleteConfirmation } from '../../../../../_components/DeleteConfirmation';

const baseImageUrl = `${process.env.REACT_APP_STORAGE_URL}/`;

class SlideshowList extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            slideshows: null,
            appSiteId: this.props.appSiteId,
            sitePageId: this.props.sitePageId,
            pageBoxId: this.props.pageBoxId,
            loading: false
        }
    }

    componentDidMount() {
        this.getSlideshows(this.props.appSiteId, this.props.sitePageId, this.props.pageBoxId);
    }

    getSlideshows(appSiteId, sitePageId, pageBoxId) {            
        this.setState({ loading: true })
        appSiteService.getTopServicesOfBox(appSiteId, sitePageId, pageBoxId)
            .then((_slideshows) => {
                this.setState({ 
                    loading: false, 
                    slideshows: (_slideshows.totalCount > 0 ? _slideshows.result : []) 
                });                
            })
            .catch(() => {
                this.setState({ loading: true })
            });        
    }

    deleteSlideshow = (slideshow) => {
        this.setState({ loading: true })
        appSiteService.deleteTopService(slideshow.appSiteId, slideshow.sitePageId, slideshow.pageBoxId, slideshow.topServiceId)
            .then(() => {
                this.setState({ loading: false })
                this.getSlideshows(this.state.appSiteId, this.state.sitePageId, this.state.pageBoxId);
            });
    }

    handleAddEdit = (appSiteId, sitePageId, pageBoxId) => {
        this.getSlideshows(appSiteId, sitePageId, pageBoxId);
    }
    
    render() {
        return (
            <Container fluid>
                <div className="border">                    
                    <p className="text-muted">Con questo contenitore puoi creare un elenco di card con immagine e testo.
                    Puoi scegliere la dimensione dei riquadri per creare layout differenti.</p>
                </div>
                <SlideshowAddEdit appSiteId={this.state.appSiteId} sitePageId={this.state.sitePageId} pageBoxId={this.state.pageBoxId} slideshowId={0} handleAddEdit={this.handleAddEdit} />
                {this.state.loading && <div className="text-center mart2">
                    <ProgressBar animated now={100} />
                </div>}
                <Row className="mart2" >
                {this.state.slideshows && !this.state.loading && this.state.slideshows.map(slideshow =>                
                    <Col sm={parseInt(slideshow.cardSize)} key={slideshow.topServiceId}>
                        <Card bg="secondary" text="white">
                            <Card.Header>
                                <Card.Title>
                                    #{slideshow.sortId} {slideshow.title}
                                </Card.Title>
                            </Card.Header>
                            <Card.Img variant="top" src={baseImageUrl+slideshow.imageUrl} />
                            <Card.Body>                                                                
                                <div>
                                {slideshow.description && parse(slideshow.description)}
                                </div>
                                <SlideshowAddEdit appSiteId={slideshow.appSiteId} sitePageId={slideshow.sitePageId} pageBoxId={slideshow.pageBoxId} slideshowId={slideshow.topServiceId} handleAddEdit={this.handleAddEdit} />                                
                                <DeleteConfirmation onConfirm={() => this.deleteSlideshow(slideshow)} />
                            </Card.Body>
                        </Card>                        
                    </Col>                                
                )}   
                </Row>
            </Container>
        );
    }

}

export { SlideshowList };