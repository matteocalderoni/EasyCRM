import React from 'react';
import { appSiteService, alertService } from '../../../../_services';
import { Uploader } from '../../../../_components'
import { Form, Button, Card, Image, ProgressBar,Row,Col } from 'react-bootstrap'
import { BoxTypes,CardSizes } from '../../../../_helpers'
import { Editor } from "@tinymce/tinymce-react";
import { LanguageSelect } from '../../../../_components/LanguageSelect';
import { LanguageEditor } from '../../../../_components/LanguageEditor';
import { LanguageInput } from '../../../../_components/LanguageInput';
import {menuSettings,pluginsSettings,toolbarSettings } from '../../../../_helpers/tinySettings';
import { CompactPicker } from 'react-color';

const baseImageUrl = `${process.env.REACT_APP_STORAGE_URL}/`;

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
                cardSize: 12,
                sortId: 1,
                boxType: 1, 
                boxColor: '#CCCCCC',               
                isPublished: true
            },
            languageCode: '',
            loading: false            
         };

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeNumber = this.handleChangeNumber.bind(this);
        this.handleChangeBool = this.handleChangeBool.bind(this);
    }

    componentDidMount() {
        this.handleOpen()
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
        this.setState({
            pageBox: {
                ...this.state.pageBox,
                description: content                 
            }          
        });
    }

    handleColorChange = (color) => {
        this.setState({
            pageBox: {
                ...this.state.pageBox,
                boxColor: color.hex                 
            }          
        });
        //this.setState({ background: color.hex });
    };

    handleLanguageCode = (code) => {        
        this.setState({ 
            languageCode: code
        });        
    }

    handleOpen = () => {                  
        if (this.props.appSiteId > 0 && this.props.sitePageId > 0 && this.props.pageBoxId > 0) {
            this.setState({loading: true})
            appSiteService.getPageBoxById(this.props.appSiteId, this.props.sitePageId, this.props.pageBoxId)
                .then(_pageBox => { 
                    this.setState({
                        pageBox: _pageBox,
                        loading: false
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
                    {this.state.loading && <div className="text-center mart2">
                        <ProgressBar animated now={100} />
                    </div>}
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
                    </div>}         

                    <LanguageSelect appSiteId={this.state.pageBox.appSiteId} onLanguageChange={this.handleLanguageCode} />                   
                    
                    <Row>
                        <Col sm={4}>
                            <Form.Group>
                                <Form.Label>Ordinamento</Form.Label>
                                <input type="number" className="form-control" name="sortId" value={this.state.pageBox.sortId} onChange={this.handleChangeNumber}  />
                                <Form.Text className="text-muted">
                                    Valore per ordinamento crescente dei contenitori nella pagina.
                                </Form.Text>
                            </Form.Group>      
                        </Col>
                        <Col sm={8}>
                            {this.state.languageCode == '' &&
                            <Form.Group>
                                <Form.Label>Titolo</Form.Label>
                                <input type="text" className="form-control" name="title" value={this.state.pageBox.title} onChange={this.handleChange}  />
                                <Form.Text className="text-muted">
                                    Titolo del contenuto (max 200 caratteri).
                                </Form.Text>
                            </Form.Group>}                                       

                            {this.state.languageCode !== '' &&
                            <div>
                                <LanguageInput 
                                    originalText={this.state.pageBox.title}
                                    appSiteId={this.state.pageBox.appSiteId} 
                                    code={this.state.languageCode}
                                    labelKey={`PAGEBOX_${this.state.pageBox.appSiteId}_${this.state.pageBox.sitePageId}_${this.state.pageBox.pageBoxId}-Title`}>
                                </LanguageInput>
                            </div>}  
                        </Col>
                    </Row>
                    
                    {this.state.pageBox && !this.state.loading && this.state.languageCode === '' && 
                        (this.state.pageBox.boxType === 1 || this.state.pageBox.boxType === 9) &&                 
                    <div>
                        <Form.Group>
                            <Form.Label>Descrizione del contenitore</Form.Label>
                            <Editor
                                apiKey={process.env.REACT_APP_TINTMCE_KEY}
                                initialValue={this.state.pageBox.description}
                                init={{
                                height: 500,
                                menubar: menuSettings,
                                plugins: pluginsSettings,
                                toolbar: toolbarSettings
                                }}
                                onEditorChange={this.handleEditorChange}
                            />
                        </Form.Group>
                    </div>}

                    {this.state.languageCode && this.state.languageCode !== '' &&
                        this.state.pageBox.boxType && (this.state.pageBox.boxType === 1 || this.state.pageBox.boxType === 9) &&
                    <div>
                        <LanguageEditor 
                            originalText={this.state.pageBox.description}
                            appSiteId={this.state.pageBox.appSiteId} 
                            code={this.state.languageCode}
                            labelKey={`PAGEBOX_${this.state.pageBox.appSiteId}_${this.state.pageBox.sitePageId}_${this.state.pageBox.pageBoxId}-Description`}>                                    
                        </LanguageEditor>
                    </div>}              

                    <Row>
                        <Col sm={6}>
                            <Form.Group>
                                <Form.Label>Dimensione</Form.Label>
                                <Form.Control as="select" value={this.state.pageBox.cardSize} name="cardSize" onChange={this.handleChangeNumber}>
                                    <option value={0}>Seleziona una dimensione</option>
                                    {CardSizes && CardSizes.map(cardSize =>
                                        <option key={cardSize.value} value={parseInt(cardSize.value)}>{cardSize.label}</option>
                                    )}   
                                </Form.Control>
                                <Form.Text className="text-muted">
                                    I tipi servono per impostare la dimensionw del contenitore.
                                </Form.Text>
                            </Form.Group>      
                        </Col>
                        <Col sm={6}>
                            {this.state.pageBox && !this.state.loading && <Form.Group>
                                <CompactPicker
                                    color={ this.state.pageBox.boxColor }
                                    onChangeComplete={ this.handleColorChange }
                                />
                                <Form.Text className="text-muted">
                                    Colore di sfondo per i contenitori di testo.
                                </Form.Text>
                            </Form.Group>}
                        </Col>
                    </Row>
                    
                    <Form.Group className="mart2">
                        <Form.Check type="checkbox" label="Pubblico" name="isPublished" checked={this.state.pageBox.isPublished} onChange={this.handleChangeBool} />
                        <Form.Text>
                            Solo i contenuti pubblici vengono visualizzati nel sito. Puoi creare il contenitore e salvarlo come bozza per pubblicarlo al momento opportuno.
                        </Form.Text>
                    </Form.Group>

                </Card.Body>
                <Card.Footer>
                    <Button onClick={this.onSubmit} variant="success" className="mr-1">
                        Salva le modifiche
                    </Button> 
                </Card.Footer>
            </Card>
        );
    }
}

export { PageBoxAddEdit }