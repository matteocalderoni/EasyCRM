import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap'
import { BsPlus,BsPencil } from 'react-icons/bs';
import { SiteProductAddEdit } from './SiteProductAddEdit'; 

function SiteProductModal({appSiteId, siteProductId, handleAddEdit}) {    
    
    const [setShow, setShowModal] = useState(false)
        
    const handleSaved = () => {
        setShowModal(false);
        handleAddEdit(appSiteId);
    }

    return (            
        <div className='relative'>
        <div className={`fixed ${(siteProductId > 0 ? 'bottom-2' : 'bottom-20 md:bottom-16')} right-2`}>
            <Button variant="primary" className="text-white flex items-center px-2 w-auto h-12 bg-green-600 rounded-full hover:bg-green-700 border-green-500 active:shadow-lg mouse shadow transition ease-in duration-200 focus:outline-none" onClick={() => setShowModal(true)}>
                {siteProductId > 0 && <BsPencil className='h-8 w-8' title="Modifica prodotto" />} 
                {siteProductId === 0 && <BsPlus className='h-8 w-8' title="Aggiungi prodotto" />} 
                <span className='hidden md:block'>
                    {(siteProductId > 0 ? 'Modifica prodotto' : 'Aggiungi prodotto')}
                </span>
            </Button>
        </div>
        <Modal show={setShow} size="lg" onHide={() => setShowModal(false)} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>{siteProductId > 0 ? 'Modifica prodotto' : 'Aggiungi prodotto'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>                
                <SiteProductAddEdit appSiteId={appSiteId} siteProductId={siteProductId} handleSaved={() => handleSaved()} />                    
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={() => setShowModal(false)} variant="default">
                    chiudi e annulla
                </Button> 
            </Modal.Footer>
        </Modal>              
        </div>          
    );
}

export { SiteProductModal }