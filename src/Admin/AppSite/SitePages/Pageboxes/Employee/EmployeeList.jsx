import React from 'react';
import { Container, Jumbotron, Card, Image, Row, Col, ProgressBar } from 'react-bootstrap';
import { appSiteService } from '../../../../../_services';
import { EmployeeAddEdit } from './EmployeeAddEdit';
import parse from 'html-react-parser';
import { DeleteConfirmation } from '../../../../../_components/DeleteConfirmation';

const baseImageUrl = `${process.env.REACT_APP_API_URL}/`;

class EmployeeList extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            employees: null,
            appSiteId: this.props.appSiteId,
            sitePageId: this.props.sitePageId,
            pageBoxId: this.props.pageBoxId,
            loading: false
        }
    }
    
    componentDidMount() {
        this.getEmployees(this.props.appSiteId, this.props.sitePageId, this.props.pageBoxId);
    }

    getEmployees(appSiteId, sitePageId, pageBoxId) {     
        this.setState({ loading: true })       
        appSiteService.getEmployeesOfBox(appSiteId, sitePageId, pageBoxId)
            .then((_employees) => {
                this.setState({ employees: (_employees.totalCount > 0 ? _employees.result : []), loading: false });                                                                
            })
            .catch(() => {});        
    }

    deleteEmployee = (employee) => {
        appSiteService.deleteEmployee(employee.appSiteId, employee.sitePageId, employee.pageBoxId ,employee.employeeId)
            .then(() => {
                this.getEmployees(this.state.appSiteId, this.state.sitePageId, this.state.pageBoxId);
            });
    }

    handleAddEdit = (appSiteId, sitePageId, pageBoxId) => {
        this.getEmployees(appSiteId, sitePageId, pageBoxId);
    }
    
    render() {
        return (
            <Container fluid>
                <Jumbotron className="small-jumbotron">
                    <h3>Contenitore <b>Dipendenti</b></h3>
                    <p>Con questo contenitore puoi creare un elenco dei componenti della tua squadra.</p>
                </Jumbotron>
                <EmployeeAddEdit appSiteId={this.state.appSiteId} sitePageId={this.state.sitePageId} pageBoxId={this.state.pageBoxId} employeeId={0} handleAddEdit={this.handleAddEdit} />
                
                <Row>        
                {this.state.loading &&               
                <div className="text-center mart2">
                    <ProgressBar animated now={100} />
                </div>}        
                {this.state.employees && this.state.employees.map(employee =>                                    
                    <Col sm={parseInt(employee.cardSize)} key={employee.employeeId}>
                        <Card className="mart2 text-center" bg="secondary" text="white">
                            <Card.Header>
                                <Card.Title>#{employee.sortId} {employee.firstName} {employee.lastName}</Card.Title>                            
                            </Card.Header>
                            <Card.Body>                                
                                <Row className="justify-content-md-center">
                                    <Col sm={4}>
                                        <Image src={baseImageUrl+employee.imageUrl} roundedCircle fluid />
                                    </Col>
                                </Row>                                                                
                                <div>                                
                                    {employee.description && parse(employee.description)}
                                </div>
                                <EmployeeAddEdit appSiteId={employee.appSiteId} sitePageId={employee.sitePageId} pageBoxId={employee.pageBoxId} employeeId={employee.employeeId} handleAddEdit={this.handleAddEdit} />
                                {/* <Button variant="danger" onClick={() => this.deleteEmployee(employee)}>elimina</Button> */}
                                <DeleteConfirmation onConfirm={() => this.deleteEmployee(employee)} />
                            </Card.Body>
                        </Card>   
                    </Col>                                         
                )}                    
                {!this.state.employees &&                
                    <Col className="text-center">
                        <span className="spinner-border spinner-border-lg align-center"></span>
                    </Col>
                }        
                </Row>        
            </Container>
        );
    }

}

export { EmployeeList };