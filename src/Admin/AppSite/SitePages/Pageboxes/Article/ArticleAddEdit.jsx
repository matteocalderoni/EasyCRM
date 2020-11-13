import React from 'react';
import { articleService, alertService } from '../../../../../_services';
import { Uploader } from '../../../../../_components'
import { Image, Form, Button, Modal, Row, Col } from 'react-bootstrap'
import { Editor } from "@tinymce/tinymce-react";
import './article.css';

const baseImageUrl = `${process.env.REACT_APP_STORAGE_URL}/`;
const baseEditorPlugins = [
    'advlist autolink lists link image charmap print preview anchor',
    'searchreplace visualblocks code fullscreen',
    'insertdatetime media table paste code help wordcount'
];
const baseEditorToolbar = 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help';

class ArticleAddEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {   
            setShow: false, 
            categories: [],
            article: {
                appSiteId: this.props.appSiteId,         
                sitePageId: this.props.sitePageId,
                pageBoxId: this.props.pageBoxId,
                articleId: this.props.articleId,
                imageUrl: 'logo.png',
                title: '',
                description: '',
                cardSize: 12,
                isPublished: true
            }            
         };        

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeNumber = this.handleChangeNumber.bind(this);
        this.handleChangeBool = this.handleChangeBool.bind(this);
    }

    handleChange(evt) {
        const value = evt.target.value;
        this.setState({
            article: {
                ...this.state.article,
                [evt.target.name]: value
            }          
        });
    }

    handleChangeNumber(evt) {
        const value = parseFloat(evt.target.value);
        this.setState({
            article: {
                ...this.state.article,
                [evt.target.name]: value         
            }            
        });
    }

    handleChangeBool(evt) {  
        this.setState({
            article: {
                ...this.state.article,
                [evt.target.name]: evt.target.checked                 
            }          
        });
    }

    handleEditorChangeDescription = (content, editor) => {
        console.log('Content was updated:', content);
        this.setState({
            article: {
                ...this.state.article,
                description: content                 
            }            
        });
    }

    handleEditorChangeMarkdown = (content, editor) => {
        console.log('Content was updated:', content);
        this.setState({
            article: {
                ...this.state.article,
                markdown: content                 
            }            
        });
    }

    handleEditorChangeHtml = (content, editor) => {
        console.log('Content was updated:', content);
        this.setState({
            article: {
                ...this.state.article,
                html: content                 
            }            
        });
    }

    handleFileName = (fileName) => {        
        this.setState({ 
            article: {
                ...this.state.article,
                imageUrl: fileName
            }
        });        
    }

    getCategories() {
        articleService.getCategories('',0,0)
            .then((_categories) => {
                this.setState({ categories: (_categories.totalCount > 0 ? _categories.result : []) })                
            });
    }

    handleShow = () => {    
        this.setState({
            setShow: true
        });        

        this.getCategories();

        if (this.props.appSiteId > 0 && this.props.sitePageId > 0 && this.props.pageBoxId > 0 && this.props.articleId > 0) {
            articleService.getArticleById(this.props.appSiteId, this.props.sitePageId, this.props.pageBoxId, this.props.articleId)
                .then(_article => { 
                    this.setState({
                        article: _article
                    });                                     
                });
        }         
    }

    handleClose = () => {
        this.setState({
            setShow: false
        });
    }
    
    onSubmit = () => {
        if (this.state.article.appSiteId > 0 && this.state.article.sitePageId > 0 && this.state.article.pageBoxId > 0 && this.state.article.articleId > 0) {
            this.updateArticle();
        } else {
            this.createArticle();            
        }
    }

    createArticle() {
        articleService.createArticle({ article: this.state.article })
            .then(result => {
                if (result.hasErrors) {
                    alertService.error('Problemi durante il salvataggio', { keepAfterRouteChange: true });
                } else {
                    alertService.success('Articolo aggiunto con successo', { keepAfterRouteChange: true });
                }                
                this.handleClose();
                this.props.handleAddEdit(this.state.article.appSiteId, this.article.sitePageId, this.article.pageBoxId);                
            })
            .catch(error => {
                alertService.error(error);
            });
    }

    updateArticle() {
        articleService.updateArticle({ article: this.state.article })
            .then(result => {
                if (result.hasErrors) {
                    alertService.error('Problemi durante il salvataggio', { keepAfterRouteChange: true });
                } else {
                    alertService.success('Aggiornamento riuscito', { keepAfterRouteChange: true });
                }                
                this.handleClose();
                this.props.handleAddEdit(this.state.article.appSiteId, this.state.article.sitePageId, this.state.article.pageBoxId);            
            })
            .catch(error => {
                alertService.error(error);
            });
    }

    render() {
        return (            
          <>
            <Button variant="primary" className="mr-1" onClick={this.handleShow}>
                {this.state.article.articleId > 0 ? 'Modifica ' : 'Nuovo '} Articolo
            </Button>
            <Modal
                show={this.state.setShow}
                onHide={this.handleClose}                
                size="lg"
                dialogClassName="modal-90w"                
                keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.state.article.articleId > 0 ? 'Modifica ' : 'Nuovo '} Articolo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col sm={4} className="text-center">
                            <Image src={baseImageUrl+this.state.article.imageUrl} fluid />                    
                            <Uploader prefix={this.state.article.appSiteId} fileName={this.state.article.imageUrl} onFileNameChange={this.handleFileName} />      
                            <small>Utilizzare immagini con formato 640 X 640 px.</small>
                        </Col>
                        <Col sm={4}>

                            <Form.Group>
                                <Form.Label>Categoria prodotto</Form.Label>
                                <Form.Control as="select" value={this.state.article.categoryId} name="categoryId" onChange={this.handleChangeNumber}>
                                    <option value={0}>Seleziona una categoria</option>
                                    {this.state.categories && this.state.categories.map(category =>
                                        <option key={category.categoryId} value={parseInt(category.categoryId)}>{category.name}</option>
                                    )}   
                                </Form.Control>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Titolo</Form.Label>
                                <input type="text" className="form-control" name="title" value={this.state.article.title} onChange={this.handleChange}  />
                                <Form.Text className="text-muted">
                                    Ruolo svolto dal dipendente.
                                </Form.Text>
                            </Form.Group>                     
                                                                        
                            <div>
                                <label>Descrizione per fondo pagina</label>
                                <Editor
                                    apiKey={process.env.REACT_APP_TINTMCE_KEY}
                                    initialValue={this.state.article.description}
                                    init={{
                                    height: 500,
                                    menubar: false,
                                    plugins: baseEditorPlugins,
                                    toolbar: baseEditorToolbar
                                    }}
                                    onEditorChange={this.handleEditorChangeDescription}
                                />                                            
                            </div>
                                                        
                            <Form.Group>
                                <Form.Check type="checkbox" label="Pubblico" name="isPublished" checked={this.state.article.isPublished} onChange={this.handleChangeBool} />
                                <Form.Text>
                                    Solo se articolo è pubblico viene visualizzato nel sito.
                                </Form.Text>
                            </Form.Group>                            

                        </Col>
                        <Col sm={4}>
                            <div>
                                <label>Paragrafo 1</label>
                                <Editor
                                    apiKey={process.env.REACT_APP_TINTMCE_KEY}
                                    initialValue={this.state.article.markdown}
                                    init={{
                                    height: 500,
                                    menubar: false,
                                    plugins: baseEditorPlugins,
                                    toolbar: baseEditorToolbar
                                    }}
                                    onEditorChange={this.handleEditorChangeMarkdown}
                                />                                            
                            </div>

                            <div>
                                <label>Paragrafo 2</label>
                                <Editor
                                    apiKey={process.env.REACT_APP_TINTMCE_KEY}
                                    initialValue={this.state.article.html}
                                    init={{
                                    height: 500,
                                    menubar: false,
                                    plugins: baseEditorPlugins,
                                    toolbar: baseEditorToolbar
                                    }}
                                    onEditorChange={this.handleEditorChangeHtml}
                                />                                            
                            </div>
                        </Col>
                    </Row>                                    

                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.onSubmit} variant="success" className="mr-1">
                        Salva
                    </Button> 
                    <Button onClick={this.handleClose} variant="primary" className="mr-1">
                        annulla
                    </Button> 
                </Modal.Footer>
            </Modal>              
          </>          
        );
    }
}

export { ArticleAddEdit }