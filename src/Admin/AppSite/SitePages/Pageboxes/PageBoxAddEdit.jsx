import React from 'react';
import { appSiteService, alertService } from '../../../../_services';
import { Uploader } from '../../../../_components'
import { Form, Button, Card, Image } from 'react-bootstrap'
import { BoxTypes } from '../../../../_helpers'
import { Editor } from "@tinymce/tinymce-react";

const baseImageUrl = `${process.env.REACT_APP_STORAGE_URL}/`;
const baseEditorPlugins = [
    'advlist autolink lists link image charmap print preview anchor',
    'searchreplace visualblocks code fullscreen',
    'insertdatetime media table paste code help wordcount'
];
const baseEditorToolbar = 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help';

class PageBoxAddEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {   
            pageBox: {
                appSiteId: this.props.appSiteId,         
                sitePageId: this.props.sitePageId,
                pageBoxId: this.props.pageBoxId,
                imageUrl: 'logo.png',
                title: '',
                description: '',
                sortId: 1,
                boxType: 1,
                isPublished: true
            }            
         };

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeNumber = this.handleChangeNumber.bind(this);
         this.handleChangeBool = this.handleChangeBool.bind(this);

        this.handleOpen();
    }

    handleChange(evt) {
        const value = evt.target.value;
        this.setState({
            pageBox: {
                ...this.state.pageBox,
                [evt.target.name]: value
            }          
        });
    }

    handleFileName = (fileName) => {        
        this.setState({ 
            pageBox: {
                ...this.state.pageBox,
                imageUrl: fileName
            }
        });        
    }

    handleChangeNumber(evt) {
        const value = parseInt(evt.target.value);
        this.setState({
            pageBox: {
                ...this.state.pageBox,
                [evt.target.name]: value                
            }          
        });
    }

    handleChangeBool(evt) {  
        this.setState({
            pageBox: {
                ...this.state.pageBox,
                [evt.target.name]: evt.target.checked                 
            }          
        });
    }

    handleEditorChange = (content, editor) => {
        console.log('Content was updated:', content);
        this.setState({
            pageBox: {
                ...this.state.pageBox,
                description: content                 
            }          
        });
    }

    handleOpen = () => {                  

        if (this.props.appSiteId > 0 && this.props.sitePageId > 0 && this.props.pageBoxId > 0) {
            appSiteService.getPageBoxById(this.props.appSiteId, this.props.sitePageId, this.props.pageBoxId)
                .then(_pageBox => { 
                    this.setState({
                        pageBox: _pageBox
                    });      
                });
        }         
    }

    onSubmit = () => {
        if (this.state.pageBox.appSiteId > 0 && this.state.pageBox.sitePageId > 0 && this.state.pageBox.pageBoxId > 0) {
            this.updatePageBox();
        } else {
            this.createPageBox();            
        }
    }

    createPageBox() {
        appSiteService.createPageBox({ pageBox: this.state.pageBox })
            .then((result) => {
                if (result.hasErrors) {
                    alertService.error('Problemi durante salvataggio.', { keepAfterRouteChange: true });
                } else {
                    alertService.success('Pagina aggiunta con successo', { keepAfterRouteChange: true });
                }             
                this.props.handleSaved();                
            })
            .catch(error => {
                alertService.error(error);
            });
    }

    updatePageBox() {
        appSiteService.updatePageBox({ pageBox: this.state.pageBox })
            .then((result) => {
                if (result.hasErrors) {
                    alertService.error('Problemi durante salvataggio.', { keepAfterRouteChange: true });
                } else {
                    alertService.success('Aggiornamento riuscito', { keepAfterRouteChange: true });
                }                
                this.props.handleSaved();            
            })
            .catch(error => {
                alertService.error(error);
            });
    }

    render() {
        return (            
            <Card>
                <Card.Body>
                <Form.Group>
                    <Form.Label>Tipo di contenuto</Form.Label>
                    <Form.Control as="select" disabled={this.state.pageBox.pageBoxId > 0} value={this.state.pageBox.boxType} name="boxType" onChange={this.handleChangeNumber}>
                        <option value={0}>Seleziona un tipo</option>
                        {BoxTypes && BoxTypes.map(boxType =>
                            <option key={boxType.value} value={parseInt(boxType.value)}>{boxType.label}</option>
                        )}   
                    </Form.Control>
                    <Form.Text className="text-muted">
                        I tipi servono per impostare il formato e le proprietà del contenitore.
                    </Form.Text>
                </Form.Group>
                        
                {this.state.pageBox && this.state.pageBox.boxType && (this.state.pageBox.boxType === 8 || this.state.pageBox.boxType === 9) &&
                <div className="text-center mart2">
                    <Image src={baseImageUrl+this.state.pageBox.imageUrl} fluid />
                    <Uploader prefix={this.state.pageBox.appSiteId} fileName={this.state.pageBox.imageUrl} onFileNameChange={this.handleFileName} />      
                    <small>Utilizzare immagini con formato 640 X 640 px.</small>
                </div>
                }                            

                <Form.Group>
                    <Form.Label>Ordinamento</Form.Label>
                    <input type="number" className="form-control" name="sortId" value={this.state.pageBox.sortId} onChange={this.handleChangeNumber}  />
                    <Form.Text className="text-muted">
                        Valore per ordinamento crescente.
                    </Form.Text>
                </Form.Group>      

                
                <Form.Group>
                    <Form.Label>Titolo</Form.Label>
                    <input type="text" className="form-control" name="title" value={this.state.pageBox.title} onChange={this.handleChange}  />
                    <Form.Text className="text-muted">
                        Titolo del contenuto (max 200 caratteri).
                    </Form.Text>
                </Form.Group>                    
                
                {this.state.pageBox && this.state.pageBox.boxType && (this.state.pageBox.boxType === 1 || this.state.pageBox.boxType === 9) &&                 
                <Editor
                    apiKey={process.env.REACT_APP_TINTMCE_KEY}
                    initialValue={this.state.pageBox.description}
                    init={{
                    height: 500,
                    menubar: false,
                    plugins: baseEditorPlugins,
                    toolbar: baseEditorToolbar
                    }}
                    onEditorChange={this.handleEditorChange}
                />                
                }

                <Form.Group>
                    <Form.Check type="checkbox" label="Pubblico" name="isPublished" checked={this.state.pageBox.isPublished} onChange={this.handleChangeBool} />
                    <Form.Text>
                        Solo i contenuti pubblici vengono visualizzati nel sito.
                    </Form.Text>
                </Form.Group>

            </Card.Body>
            <Card.Footer>
                <Button onClick={this.onSubmit} variant="success" className="mr-1">
                    Salva
                </Button> 
            </Card.Footer>
        </Card>
        );
    }
}

export { PageBoxAddEdit }