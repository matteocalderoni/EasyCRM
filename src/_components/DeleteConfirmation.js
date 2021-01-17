import React, { useState } from 'react';
import { Button,Modal } from 'react-bootstrap';

function DeleteConfirmation({ onConfirm }) {
    const [isOpen, setIsOpen] = useState(false);

    const onSubmit = (result) => {
        setIsOpen(false)
        if (result)
            onConfirm()
    }

    return (
        <div>
            <Button variant="primary" className="mr-1" onClick={setIsOpen(true)}>
                Elimina
            </Button>
            <Modal show={isOpen} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Conferma elimina</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Procedere con elimina, azione è irreversibile.            
                </Modal.Body>
                <Modal.Footer>                    
                    <Button className="btn btn-danger" onClick={onSubmit(true)}>
                        conferma
                    </Button> 
                    <Button className="btn btn-default" onClick={onSubmit(false)}>
                        annulla
                    </Button> 
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export { DeleteConfirmation };