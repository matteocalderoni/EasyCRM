import React from 'react';
import { articleService } from '../../../../../_services';
import { Form, Button, Modal, Row, Col } from 'react-bootstrap'

class CategoryList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            setShow: false,
            categories: [],
            newCategory: ''
        }     
        
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(evt) {
        const value = evt.target.value;
        this.setState({
          [evt.target.name]: value
        });
    }

    getCategories() { 
        articleService.getCategories('',0,0)
            .then((_categories) => {
                if (_categories.totalCount > 0) {
                    this.setState({
                        categories: _categories.result,
                        newCategory: ''
                    });
                } else {
                    this.setState({
                        categories: []
                    });
                }                
            });
    }    

    createCategory = () => {
        articleService.createCategory({ category: { categoryId: 0, name: this.state.newCategory }})
            .then((_category) => this.getCategories());
    }

    deleteCategory = (category) => {
        articleService.deleteCategory(category.categoryId)
            .then(() => {
                this.getCategories();
            });
    }

    handleShow = () => {
        this.setState({
            setShow: true
        });

        this.getCategories();
    }

    handleClose = () => {
        this.setState({
            setShow: false
        });
    }

    render() {
        return (
            <>
                <Button variant="primary" onClick={this.handleShow}>
                    Aggiungi/Modifica Categoria
                </Button>
                <Modal
                    show={this.state.setShow}
                    onHide={this.handleClose}
                    backdrop="static"
                    keyboard={false}>
                        <Modal.Header closeButton>
                            <Modal.Title>Gestione <b>Categorie articoli</b></Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Row>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>Nuova categoria</Form.Label>
                                        <Form.Control type="text" className="form-control" name="newCategory" value={this.state.newCategory} onChange={this.handleChange} maxLength={100} />
                                        <Form.Text className="text-muted">
                                            Nome della nuova categoria articoli (max 100 caratteri).
                                        </Form.Text>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <div className="mart5">
                                        <Button onClick={this.createCategory} variant="primary" className="mart2">
                                            crea
                                        </Button> 
                                    </div>                                    
                                </Col>
                            </Row>
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th style={{ width: '80%' }}>Nome</th>
                                        <th style={{ width: '20%' }}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.categories && this.state.categories.map(category => 
                                        <tr key={category.categoryId}>
                                            <td>{category.name}</td>
                                            <td style={{ whiteSpace: 'nowrap' }}>                                                
                                                <button onClick={() => this.deleteCategory(category)} className="btn btn-sm btn-danger" style={{ width: '60px' }} disabled={category.isDeleting}>
                                                    {category.isDeleting 
                                                        ? <span className="spinner-border spinner-border-sm"></span>
                                                        : <span>elimina</span>
                                                    }
                                                </button>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={this.handleClose} variant="primary">
                                chiudi
                            </Button> 
                        </Modal.Footer>
                </Modal>
            </>
        );
    }
}

export { CategoryList }