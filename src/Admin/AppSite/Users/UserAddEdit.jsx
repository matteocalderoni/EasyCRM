import React from 'react';
import { Link } from 'react-router-dom';
import { userService, alertService } from '../../../_services';
import { Form, Button, Card, ProgressBar,Navbar, Nav } from 'react-bootstrap'
import { FaSave } from 'react-icons/fa';

class UserAddEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {   
            appSiteId: props.appSiteId,
            user: {
                id: +props.id | 0,
                title: '',                         
                firstName: '',
                lastName: '',
                userName: '',
                email: '',
                password: '',
                confirmPassword: '',
                acceptTerms: '',
                roles: []
            },
            users: [],
            loading: false
         };

        this.handleChange = this.handleChange.bind(this)
        this.handleChangeNumber = this.handleChangeNumber.bind(this)
        this.handleChangeBool = this.handleChangeBool.bind(this)        
    }

    componentDidMount() {
        // Check new or update
        this.handleOpen()        
    }

    handleChange(evt) {
        const value = evt.target.value;
        this.setState({
            user: {
                ...this.state.user,
                [evt.target.name]: value
            }          
        });
    }

    handleChangeNumber(evt) {
        const value = parseInt(evt.target.value);
        this.setState({
            user: {
                ...this.state.user,
                [evt.target.name]: value                
            }          
        });
    }

    handleChangeBool(evt) {  
        this.setState({
            user: {
                ...this.state.user,
                [evt.target.name]: evt.target.checked                 
            }          
        });
    }
    
    handleOpen() {    
        if (this.props.id > 0) {
            this.setState({loading: true})
            userService.getUserById(this.props.id)
                .then(_user => {                    
                    this.setState({
                        user: _user,
                        loading: false
                    })                    
                });
        }         
    }
    
    onSubmit = () => {
        if (this.state.user.id > 0) 
            this.updateUser();
        else
            this.createUser();                    
    }
    
    createUser() {
        userService.createUser(this.state.user, this.state.appSiteId)
            .then(result => {
                if (result.hasErrors) {
                    alertService.error('Problemi durante il salvataggio', { keepAfterRouteChange: true });
                } else {
                    alertService.success('Pagina aggiunta con successo', { keepAfterRouteChange: true });
                }            
                if (this.props.handleSaved)    
                    this.props.handleSaved(this.state.appSiteId);                
            })
            .catch(error => {
                alertService.error(error);
            });
    }

    updateUser() {
        userService.updateUser(this.state.user)
            .then(result => {
                if (result.hasErrors) {
                    alertService.error('Problemi durante il salvataggio', { keepAfterRouteChange: true });
                } else {
                    alertService.success('Aggiornamento riuscito', { keepAfterRouteChange: true });
                }    
                if (this.props.handleSaved)                                
                    this.props.handleSaved(this.state.appSiteId);                
            })
            .catch(error => {
                alertService.error(error);
            });
    }     

    render() {
        return (            
          <>
            <Card>                
                <Card.Body className="home container-fluid">                    
                    {this.state.loading && <div className="text-center mart2">
                        <ProgressBar animated now={100} />
                    </div>}
                    {!this.state.loading && <div className="p-2 border rounded mt-2">                            
                        <Form onSubmit={() => this.onSubmit()}>
                            <Form.Group>
                                <Form.Label>Titolo</Form.Label>
                                <input type="text" className="form-control" name="title" value={this.state.user.title} onChange={this.handleChange} maxLength={200} />
                                <Form.Text className="text-muted">
                                    Titolo.
                                </Form.Text>
                            </Form.Group> 

                            <Form.Group>
                                <Form.Label>Nome</Form.Label>
                                <input type="text" className="form-control" name="firstName" value={this.state.user.firstName} onChange={this.handleChange} maxLength={200} />
                                <Form.Text className="text-muted">
                                    Nome utente.
                                </Form.Text>
                            </Form.Group> 

                            <Form.Group>
                                <Form.Label>Cognome</Form.Label>
                                <input type="text" className="form-control" name="lastName" value={this.state.user.lastName} onChange={this.handleChange} maxLength={200} />
                                <Form.Text className="text-muted">
                                    Cognome utente.
                                </Form.Text>
                            </Form.Group> 

                            <Form.Group>
                                <Form.Label>Email</Form.Label>
                                <input type="text" className="form-control" name="email" value={this.state.user.email} onChange={this.handleChange} maxLength={200} />
                                <Form.Text className="text-muted">
                                    Indirizzo email utente.
                                </Form.Text>
                            </Form.Group> 

                            <Form.Group>
                                <Form.Label>Username</Form.Label>
                                <input type="text" className="form-control" name="userName" value={this.state.user.userName} onChange={this.handleChange} maxLength={200} />
                                <Form.Text className="text-muted">
                                    Nome utente per login.
                                </Form.Text>
                            </Form.Group> 

                            {this.state.user.id === 0 && <Form.Group>
                                <Form.Label>Password</Form.Label>
                                <input type="password" className="form-control" name="password" value={this.state.user.password} onChange={this.handleChange} maxLength={200} />
                                <Form.Text className="text-muted">
                                    Password per login.
                                </Form.Text>
                            </Form.Group>}

                            {this.state.user.id === 0 && <Form.Group>
                                <Form.Label>Conferma password</Form.Label>
                                <input type="password" className="form-control" name="confirmPassword" value={this.state.user.confirmPassword} onChange={this.handleChange} maxLength={200} />
                                <Form.Text className="text-muted">
                                    Conferma Password per login.
                                </Form.Text>
                            </Form.Group> }

                            {this.state.user.id === 0 && <Form.Group className="mt-2">
                                <Form.Check type="checkbox" label="Pubblico" name="acceptTerms" checked={this.state.user.acceptTerms} onChange={this.handleChangeBool} />
                                <Form.Text>
                                    Accetta i termini e le condizioni di utilizzo.
                                </Form.Text>
                            </Form.Group>}
                        </Form>
                    </div>}
                </Card.Body>    
            </Card>                    
            <Navbar fixed="bottom" className="flex bg-blue-800">
                <Nav className="flex space-x-3 text-sm font-medium mr-auto">
                    <Button onClick={() => this.onSubmit()} className="flex items-center justify-center rounded-full bg-green-500">
                        <FaSave className="mr-2" /> Salva
                    </Button> 
                    {this.state.user.id > 0 && 
                    <Link to={`/admin/sites/edit/${this.state.appSiteId}`}
                        className="flex items-center justify-center rounded-full  bg-blue-500 text-white p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Modifica sito
                    </Link>}
                </Nav>                
            </Navbar>                
          </>          
        );
    }
}

export { UserAddEdit }