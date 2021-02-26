import React, { useState } from 'react';
import { Button,Modal } from 'react-bootstrap';
import { BsTrash} from 'react-icons/bs';

function DeleteConfirmation({ onConfirm }) {
    const [isOpen, setIsOpen] = useState(false);

    const onSubmit = (result) => {
        setIsOpen(false)
        if (result > 0)
            onConfirm()
    }

    return (
        <>
            <Button title="Elimina" variant="danger" className="ml-1" onClick={() => setIsOpen(true)}>
                <BsTrash />
            </Button> 
            <Modal show={isOpen} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Conferma elimina</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Procedere con <b>Elimina</b>?</p> 
                    <small className="text-muted">Attenzione questa azione è irreversibile.</small>
                </Modal.Body>
                <Modal.Footer>                    
                    <Button className="btn btn-danger" onClick={() => onSubmit(1)}>
                        conferma
                    </Button> 
                    <Button className="btn btn-default" onClick={() => onSubmit(0)}>
                        annulla
                    </Button> 
                </Modal.Footer>
            </Modal>
        </>
    );
}

export { DeleteConfirmation };