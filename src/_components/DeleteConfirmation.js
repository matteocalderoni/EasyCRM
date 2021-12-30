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
            <Button title="Elimina" className="btn bg-red-500 border-0 hover:bg-red-600 rounded-full ml-1" onClick={() => setIsOpen(true)}>
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
                    <Button className="btn bg-red-600" onClick={() => onSubmit(1)}>
                        conferma
                    </Button> 
                    <Button className="btn bg-gray-400" onClick={() => onSubmit(0)}>
                        annulla
                    </Button> 
                </Modal.Footer>
            </Modal>
        </>
    );
}

export { DeleteConfirmation };