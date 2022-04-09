import React from 'react';
import { Button, Modal } from 'react-bootstrap'
import { SitePageAddEdit } from './SitePageAddEdit'; 

class SitePageModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {   
            setShow: false,
            appSite: props.appSite,
            sitePage: {
                appSiteId: props.appSiteId,                                
                sitePageId: props.sitePageId,
                parentPageId: props.parentPageId > 0 ? parseInt(props.parentPageId) : undefined,
                pageType: 0,
                imageUrl: '',
                titleUrl: '',
                titleNav: '',
                title: '',
                description: '',
                slideText: '',
                sortId: 1,
                isPublished: true,
                logoPosition: 1,
                navPosition: 1
            }
         };
    }
    
    handleShow = () => {    
        this.setState({ setShow: true });        
    }

    handleClose = () => {
        this.setState({ setShow: false });
    }            

    handleSaved = () => {
        this.setState({ setShow: false });
        this.props.handleAddEdit(this.state.sitePage.appSiteId);
    }

    render() {
        return (            
          <div className='relative'>
            <div className='fixed bottom-16 right-2'>
                <Button variant="primary" className="text-green-900 flex items-center px-4 w-auto h-16 bg-green-400 rounded-full hover:bg-green-700 border-green-200 active:shadow-lg mouse shadow transition ease-in duration-200 focus:outline-none" 
                    onClick={this.handleShow}>                                    
                    <svg viewBox="0 0 20 20" enableBackground="new 0 0 20 20" className="w-6 h-6 inline-block">
                        <path fill="#FFFFFF" d="M16,10c0,0.553-0.048,1-0.601,1H11v4.399C11,15.951,10.553,16,10,16c-0.553,0-1-0.049-1-0.601V11H4.601
                            C4.049,11,4,10.553,4,10c0-0.553,0.049-1,0.601-1H9V4.601C9,4.048,9.447,4,10,4c0.553,0,1,0.048,1,0.601V9h4.399
                            C15.952,9,16,9.447,16,10z" />                 
                    </svg>
                    <span className='hidden md:block'>
                        {(this.state.sitePage.sitePageId > 0 ? 'Modifica ' : 'Aggiungi ') + (this.state.sitePage.parentPageId > 0 ? 'Sotto-Pagina' : 'Pagina')}
                    </span>
                </Button>
            </div>
            <Modal show={this.state.setShow} size="lg" onHide={this.handleClose} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>{(this.state.sitePage.sitePageId > 0 ? 'Modifica la ' : 'Crea una nuova ') + (this.state.sitePage.parentPageId > 0 ? 'Sotto-Pagina' : 'Pagina')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.state.setShow && this.state.appSite &&
                    <SitePageAddEdit sitePage={this.state.sitePage} appSiteId={this.state.sitePage.appSiteId} sitePageId={this.state.sitePage.sitePageId} parentPageId={this.state.sitePage.parentPageId} appSite={this.state.appSite} handleSaved={this.handleSaved} />
                    }                    
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.handleClose} variant="default">
                        chiudi e annulla
                    </Button> 
                </Modal.Footer>
            </Modal>              
          </div>          
        );
    }
}

export { SitePageModal }