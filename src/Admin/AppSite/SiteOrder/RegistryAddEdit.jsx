import React, { useEffect, useState } from 'react';
import { orderService, alertService } from '../../../_services';
import { Form, Button, Card, ProgressBar,Navbar, Nav } from 'react-bootstrap'
import { FaSave } from 'react-icons/fa';

function RegistryAddEdit ({registryId})
{
    const [registry, setRegistry] = useState()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (registryId > 0) {
            setLoading(true)
            orderService.getRegistryById(registryId)
                .then((_registry) => {                     
                    setRegistry(_registry)
                    setLoading(false)
                })

        }
    },[registryId])    

    const handleChange = (evt) => {
        const value = evt.target.value;
        setRegistry({...registry, [evt.target.name]: value})        
    }

    const onSubmit = () => {
        if (registryId > 0) 
            updateRegistry();
        else
            createRegistry();                    
    }
    
    const createRegistry = () => {        
        orderService.createRegistry(registry)
            .then(onSucces)
            .catch(error => {
                alertService.error(error);
            });
    }

    const updateRegistry = () => {
        orderService.updateRegistry(registry)
            .then(onSucces)
            .catch(error => {
                alertService.error(error);
            });
    } 
    
    const onSucces = (result) => {
        if (result.hasErrors) 
            alertService.error('Problemi durante il salvataggio', { keepAfterRouteChange: true });
        else
            alertService.success('Aggiornamento riuscito', { keepAfterRouteChange: true }); 
    }

    return (            
        <>
        <Card>                
            <Card.Body className="home container-fluid">                    
                {loading && 
                <div className="text-center mart2">
                    <ProgressBar animated now={100} />
                </div>}
                {!loading && registry && 
                <div className="p-2 border rounded-b-lg">                            
                    <Form onSubmit={() => onSubmit()}>
                        
                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <input type="text" className="form-control" name="email" value={registry.email} onChange={handleChange} />
                            <Form.Text className="text-muted">
                                Indirizzo email di cliente (attenzione collegato ad eventuale account registrato).
                            </Form.Text>
                        </Form.Group> 

                        <Form.Group>
                            <Form.Label>Nome</Form.Label>
                            <input type="text" className="form-control" name="name" value={registry.name} onChange={handleChange} />
                            <Form.Text className="text-muted">
                                Nome del cliente.
                            </Form.Text>
                        </Form.Group> 

                        <Form.Group>
                            <Form.Label>Telefono</Form.Label>
                            <input type="text" className="form-control" name="phone" value={registry.phone} onChange={handleChange} />
                            <Form.Text className="text-muted">
                                Numero di telefono.
                            </Form.Text>
                        </Form.Group> 

                        <Form.Group>
                            <Form.Label>Indirizzo</Form.Label>
                            <input type="text" className="form-control" name="address" value={registry.address} onChange={handleChange} />
                            <Form.Text className="text-muted">
                                Indirizzo per consegne.
                            </Form.Text>
                        </Form.Group> 

                        <Form.Group>
                            <Form.Label>Città</Form.Label>
                            <input type="text" className="form-control" name="city" value={registry.city} onChange={handleChange} />
                            <Form.Text className="text-muted">
                                Città per consegne.
                            </Form.Text>
                        </Form.Group> 

                        <Form.Group>
                            <Form.Label>Note</Form.Label>
                            <input type="text" className="form-control" name="registryNote" value={registry.registryNote} onChange={handleChange} />
                            <Form.Text className="text-muted">
                                Note del cliente.
                            </Form.Text>
                        </Form.Group> 
                        
                    </Form>
                </div>}
            </Card.Body>    
        </Card>                    
        <Navbar fixed="bottom" className="flex bg-blue-800">
            <Nav className="flex space-x-3 text-sm font-medium mr-auto">
                <Button onClick={() => onSubmit()} className="flex items-center justify-center rounded-full bg-green-500">
                    <FaSave className="mr-2" /> Salva modifiche a cliente
                </Button>                                         
            </Nav>                
        </Navbar>                
        </>          
    );    
}

export { RegistryAddEdit }