import React from 'react';
import { orderService, alertService } from '../../../_services';
import { Form, Button, Card, ProgressBar,Navbar, Nav } from 'react-bootstrap'
import { FaSave } from 'react-icons/fa';

class SiteOrderAddEdit extends React.Component 
{
    constructor(props) {
        super(props);
        this.state = {   
            appSiteId: +props.appSiteId,
            siteOrder: {
                appSiteId: +props.appSiteId || 0,
                orderYear: +props.orderYear || 0,
                orderId: +props.orderId || 0,
                orderType: 1,
                registryId: +props.registryId || 0,
                paymentMethod: 0,
                orderDate: new Date(),
                orderNote: '',
                orderColor: '#FFFFFF',
                orderTotal: 0,
                orderState: 1
            },
            loading: false,
            languageCode: ''
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
            siteOrder: {
                ...this.state.siteOrder,
                [evt.target.name]: value
            }          
        });
    }

    handleChangeNumber(evt) {
        const value = +evt.target.value;
        this.setState({
            siteOrder: {
                ...this.state.siteOrder,
                [evt.target.name]: value                
            }          
        });
    }

    handleChangeBool(evt) {  
        this.setState({
            siteOrder: {
                ...this.state.siteOrder,
                [evt.target.name]: evt.target.checked                 
            }          
        });
    }

    handleOpen() {    
        if (this.props.orderId > 0) {
            this.setState({loading: true})
            orderService.getSiteOrderById(this.state.appSiteId, this.state.siteOrder.orderYear, this.state.siteOrder.orderId)
                .then(_siteOrder => {                    
                    this.setState({
                        siteOrder: _siteOrder,
                        loading: false
                    })                    
                });
        }         
    }

    onSubmit = () => {
        if (this.state.siteOrder.orderId > 0) 
            this.updateSiteOrder();
        else
            this.createSiteOrder();                    
    }
    
    createSiteOrder() {
        orderService.createSiteOrder(this.state.siteOrder)
            .then(result => {
                if (result.hasErrors) {
                    alertService.error('Problemi durante il salvataggio', { keepAfterRouteChange: true });
                } else {
                    alertService.success('Ordine aggiunto con successo', { keepAfterRouteChange: true });
                }            
                if (this.props.handleSaved)    
                    this.props.handleSaved(this.state.appSiteId);                
            })
            .catch(error => {
                alertService.error(error);
            });
    }

    updateSiteOrder() {
        orderService.updateSiteOrder(this.state.siteOrder)
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
                                <Form.Label>Anno</Form.Label>
                                <input type="number" className="form-control" name="orderYear" value={this.state.siteOrder.orderYear} onChange={this.handleChangeNumber} />
                                <Form.Text className="text-muted">
                                    Anno di ordine.
                                </Form.Text>
                            </Form.Group> 

                            <Form.Group>
                                <Form.Label>Numero ordine</Form.Label>
                                <input type="number" className="form-control" name="orderId" value={this.state.siteOrder.orderId} onChange={this.handleChangeNumber} />
                                <Form.Text className="text-muted">
                                    Numero identificato di ordine.
                                </Form.Text>
                            </Form.Group> 

                            <Form.Group>
                                <Form.Label>Totale</Form.Label>
                                <input type="number" className="form-control" name="orderTotal" value={this.state.siteOrder.orderTotal} onChange={this.handleChangeNumber} />
                                <Form.Text className="text-muted">
                                    Totale di ordine confermato.
                                </Form.Text>
                            </Form.Group> 
                            
                        </Form>
                    </div>}
                </Card.Body>    
            </Card>                    
            <Navbar fixed="bottom" className="flex bg-blue-800">
                <Nav className="flex space-x-3 text-sm font-medium mr-auto">
                    <Button onClick={() => this.onSubmit()} className="flex items-center justify-center rounded-full bg-green-500">
                        <FaSave className="mr-2" /> Salva
                    </Button>                                         
                </Nav>                
            </Navbar>                
          </>          
        );
    }
}

export { SiteOrderAddEdit }