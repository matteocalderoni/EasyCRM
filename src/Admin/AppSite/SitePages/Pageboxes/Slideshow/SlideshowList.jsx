import React from 'react';
import { Container, ProgressBar } from 'react-bootstrap';
import { appSiteService } from '../../../../../_services';
import { SlideshowAddEdit } from './SlideshowAddEdit';
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
            loading: false,
            currentSlide: 0,
            paused: false
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

    nextSlide() {
        let newSlide =
            this.state.currentSlide === this.state.slideshows.length - 1
            ? 0
            : this.state.currentSlide + 1;
        this.setState({ currentSlide: newSlide });
    };
    
    prevSlide = () => {
        let newSlide =
            this.state.currentSlide === 0
            ? this.state.slideshows.length - 1
            : this.state.currentSlide - 1;
        this.setState({ currentSlide: newSlide });
    };

    setCurrentSlide = (index) => {
        this.setState({ currentSlide: index });
    };

    handleAddEdit = (appSiteId, sitePageId, pageBoxId) => {
        this.getSlideshows(appSiteId, sitePageId, pageBoxId);
    }
    
    render() {
        return (
            <Container fluid> 
                <SlideshowAddEdit appSiteId={this.state.appSiteId} sitePageId={this.state.sitePageId} pageBoxId={this.state.pageBoxId} slideshowId={0} handleAddEdit={this.handleAddEdit} />
                {this.state.loading && <div className="text-center mart2">
                    <ProgressBar animated now={100} />
                </div>}
                <div className="mt-8 mb-8">
                    <div className="h-96 flex overflow-hidden relative">
                        {this.state.slideshows && !this.state.loading  && this.state.slideshows.map((slideshow, index) =>                
                        <img 
                            key={index} 
                            src={baseImageUrl+slideshow.imageUrl} 
                            className={ index === this.state.currentSlide ? "block w-full h-auto object-cover" : "hidden" }
                            alt={slideshow.title} />                                            
                        )}
                    </div>                
                    <div className="absolute w-full flex justify-center bottom-0">
                    {this.state.slideshows && !this.state.loading  && this.state.slideshows.map((element, index) => {
                        return (
                        <div
                            className={
                            index === this.state.currentSlide
                                ? "h-2 w-2 bg-blue-700 rounded-full mx-2 mb-2 cursor-pointer"
                                : "h-2 w-2 bg-white rounded-full mx-2 mb-2 cursor-pointer"
                            }
                            key={index}
                            onClick={() => {
                            this.setCurrentSlide(index);
                            }}
                        ></div>
                        );
                    })}
                    </div>
                </div>                
            </Container>
        );
    }

}

export { SlideshowList };