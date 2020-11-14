import React from 'react';
import { articleService } from '../../../../../_services';
import { Form, Button, Modal, Row, Col } from 'react-bootstrap'

class CategoryList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            setShow: false,
            categories: [],
            newCategory: '',
            linkBox: true,
            appSiteId: props.appSiteId,
            sitePageId: props.sitePageId,
            pageBoxId: props.pageBoxId 
        }     
        
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(evt) {
        const value = evt.target.value;
        this.setState({
          [evt.target.name]: value
        });
    }

    handleChangeBool(evt) {  
        this.setState({
            [evt.target.name]: evt.target.checked                 
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
        let _category = {
            categoryId: 0, 
            name: this.state.newCategory,
            appSiteId: this.state.linkBox ? this.props.appSiteId : 0,
            sitePageId: this.state.linkBox ? this.props.sitePageId : 0,
            pageBoxId: this.state.linkBox ? this.props.pageBoxId : 0
        }
        articleService.createCategory({ category: _category})
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

    handleLinkCategory = (_category) => {
        if (_category.pageBoxId > 0) {
            _category.appSiteId = 0;
            _category.sitePageId = 0;
            _category.pageBoxId = 0;
        } else {
            _category.appSiteId = this.props.appSiteId;
            _category.sitePageId = this.props.sitePageId;
            _category.pageBoxId = this.props.pageBoxId;
        }
        articleService.updateCategory({category: _category})
            .then(() => {
                this.getCategories();
            });
    }

    handleSortCategory = (sortDir, _category) => {
        if (sortDir > 0) {
            _category.sortId += 1;
        } else {
            _category.sortId -= 1;
        }
        articleService.updateCategory({category: _category})
            .then(() => {
                this.getCategories();
            });
    }

    render() {
        return (
            <>
                <Button variant="primary" onClick={this.handleShow}>
                    Aggiungi/Modifica Categoria Articoli
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
                                    <Form.Group>
                                        <Form.Label>Collega contenitore</Form.Label>
                                        <Form.Check type="checkbox" label="Collegato" checked={this.state.linkBox} name="linkBox" onChange={this.handleChangeBool} />
                                        <Form.Text className="text-muted">
                                            Per visualizzare solo in contenitore corrente.
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
                                    <th colSpan="3" style={{ width: '15%' }}>Ordinamento</th>
                                        <th style={{ width: '50%' }}>Nome</th>
                                        <th style={{ width: '15%' }}>Collegato</th>
                                        <th style={{ width: '20%' }}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.categories && this.state.categories.map(category => 
                                        <tr key={category.categoryId}>
                                            <td>
                                                <Button size="sm" onClick={() => this.handleSortCategory(-1,category)} variant="secondary" className="mart2">
                                                    -
                                                </Button>                                                                                                                                                 
                                            </td>
                                            <td>
                                                {category.sortId}
                                            </td>
                                            <td>
                                                
                                                <Button size="sm" onClick={() => this.handleSortCategory(1,category)} variant="secondary" className="mart2">
                                                    +
                                                </Button>           
                                            </td>
                                            <td>{category.name}</td>
                                            <td>
                                                <Button size="sm" onClick={() => this.handleLinkCategory(category)} variant="secondary" className="mart2">
                                                    {category.pageBoxId > 0 ? 'SI' : 'NO'}
                                                </Button>                                                 
                                            </td>
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