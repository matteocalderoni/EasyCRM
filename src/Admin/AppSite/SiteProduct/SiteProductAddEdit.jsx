import React from 'react';
import { productService, alertService } from '../../../_services';
import { Form, Button, Card, ProgressBar,Navbar, Nav, Image } from 'react-bootstrap'
import { FaSave } from 'react-icons/fa';
import { LanguageEditor, Uploader } from '../../../_components'
import { Editor } from "@tinymce/tinymce-react";
import { CompactPicker,SliderPicker } from 'react-color';
import {menuSettings,pluginsSettings,toolbarSettings,fontSettings,styleSettings } from '../../../_helpers/tinySettings';
import { fetchWrapper } from '../../../_helpers/fetch-wrapper'

const baseUrl = `${process.env.REACT_APP_API_URL}/upload`;
const baseImageUrl = `${process.env.REACT_APP_STORAGE_URL}/`;

class SiteProductAddEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {   
            appSiteId: +props.appSiteId,
            siteProduct: {
                appSiteId: +props.appSiteId | 0,
                siteProductId: +props.siteProductId | 0,
                internalCode: '',
                code: '',                         
                description: '',
                price: 0
            },
            siteProducts: [],
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
        this.setState({ siteProduct: { ...this.state.siteProduct, [evt.target.name]: value } });
    }

    handleChangeNumber(evt) {
        const value = +evt.target.value;
        this.setState({ siteProduct: { ...this.state.siteProduct, [evt.target.name]: value } });
    }

    handleChangeBool(evt) {  
        this.setState({ siteProduct: { ...this.state.siteProduct, [evt.target.name]: evt.target.checked } });
    }

    handleFileName = (fileName) => {        
        this.setState({ siteProduct: { ...this.state.siteProduct, imageUrl: fileName } });        
    }

    handleDescriptionEditorChange = (content, editor) => {
        this.setState({ siteProduct: { ...this.state.siteProduct, description: content } });
    }

    handleFieldRemove = (field) => {
        this.setState({ siteProduct: { ...this.state.siteProduct, [field]: '' } });
    }

    handleColorChange = (color) => {
        this.setState({ siteProduct: { ...this.state.siteProduct, boxColor: color.hex } });
    };
    
    handleOpen() {    
        if (this.props.siteProductId > 0) {
            this.setState({loading: true})
            productService.getSiteProductById(this.state.appSiteId, this.state.siteProduct.siteProductId)
                .then(_siteProduct => {                    
                    this.setState({ siteProduct: _siteProduct, loading: false })                    
                });
        }         
    }

    tiny_image_upload_handler = (blobInfo, success, failure, progress) => {
        const fileName = (this.state.sitePage.appSiteId + '/' || '') + new Date().getTime() + '.jpeg';            
        fetchWrapper.postFile(`${baseUrl}/CloudUpload`, blobInfo.blob(), fileName)
            .then((result) => success(`${baseImageUrl}${result.fileName}`));         
      };                  
    
    onSubmit = () => {
        if (this.state.siteProduct.siteProductId > 0) 
            this.updateSiteProduct();
        else
            this.createSiteProduct();                    
    }
    
    createSiteProduct() {
        productService.createSiteProduct(this.state.siteProduct)
            .then(result => {
                if (result.hasErrors) 
                    alertService.error('Problemi durante il salvataggio', { keepAfterRouteChange: true });
                else
                    alertService.success('Prodotto aggiunta con successo', { keepAfterRouteChange: true });         
                if (this.props.handleSaved)    
                    this.props.handleSaved(this.state.appSiteId);                
            })
            .catch(error => alertService.error(error));
    }

    updateSiteProduct() {
        productService.updateSiteProduct(this.state.siteProduct)
            .then(result => {
                if (result.hasErrors)
                    alertService.error('Problemi durante il salvataggio', { keepAfterRouteChange: true });
                else
                    alertService.success('Aggiornamento riuscito', { keepAfterRouteChange: true });

                if (this.props.handleSaved)                                
                    this.props.handleSaved(this.state.appSiteId);                
            })
            .catch(error => alertService.error(error));
    }     

    render() {
        return (            
          <>
            <Card>                
                <Card.Body className="home container-fluid">                    
                    {this.state.loading && 
                    <div className="text-center mart2">
                        <ProgressBar animated now={100} />
                    </div>}
                    {!this.state.loading && 
                    <div className="p-2 bg-white shadow rounded-xl mt-2">                            
                        <Form onSubmit={() => this.onSubmit()}>
                            
                            <div className='flex'>
                                <div className="text-center flex-row space-x-2">
                                    <Image className='w-48' src={baseImageUrl+this.state.siteProduct.imageUrl} fluid />                    
                                    <Uploader prefix={this.state.siteProduct.appSiteId} fileName={this.state.siteProduct.imageUrl} onFileNameChange={this.handleFileName} />      
                                    <small>Utilizzare immagini con formato ottimizzate per il web.</small>  
                                    <Button onClick={() => this.handleFieldRemove('imageUrl')} className="mt-2 w-10/12  bg-red-400">
                                            Rimuovi immagine
                                    </Button>        
                                </div>                                    
                                
                                <div className='flex-1'>
                                    <Form.Group>
                                        <Form.Label>Codice interno</Form.Label>
                                        <input type="text" className="form-control" name="internalCode" value={this.state.siteProduct.internalCode} onChange={this.handleChange} />
                                        <Form.Text className="text-muted">
                                            Codice univoco per uso interno.
                                        </Form.Text>
                                    </Form.Group> 

                                    <Form.Group>
                                        <Form.Label>Codice</Form.Label>
                                        <input type="text" className="form-control" name="code" value={this.state.siteProduct.code} onChange={this.handleChange} />
                                        <Form.Text className="text-muted">
                                            Codice pubblico del prodotto.
                                        </Form.Text>
                                    </Form.Group> 
                                </div>
                            </div>


                            {this.state.languageCode == '' && 
                            <Form.Group className="mt-2">
                                <Form.Label className="text-xl">Descrizione</Form.Label>                                
                                <div className="border rounded-lg p-1">
                                    <Editor
                                        apiKey={process.env.REACT_APP_TINTMCE_KEY}
                                        initialValue={this.state.siteProduct.description}                                                                        
                                        init={{
                                            height: 500,                                        
                                            menubar: menuSettings,
                                            plugins: pluginsSettings,
                                            toolbar: toolbarSettings,
                                            font_formats: fontSettings,
                                            content_style: styleSettings,
                                            images_upload_handler: this.tiny_image_upload_handler
                                        }}
                                        onEditorChange={this.handleDescriptionEditorChange}
                                        >
                                    </Editor> 
                                </div>
                                <Form.Text className="text-muted">
                                    Descrizione.                                    
                                </Form.Text>
                            </Form.Group>}

                            {this.state.languageCode && this.state.languageCode !== '' &&
                            <div>
                                <LanguageEditor 
                                    originalText={this.state.siteProduct.description}
                                    appSiteId={this.state.siteProduct.appSiteId} 
                                    code={this.state.languageCode}
                                    inline={true}
                                    labelKey={`SITEPRODUCT_${this.state.siteProduct.appSiteId}_${this.state.siteProduct.siteProductId}-Description`}>                                    
                                </LanguageEditor>                                
                            </div>} 

                            {/* <Form.Group>
                                <Form.Label>Descrizione</Form.Label>
                                <input type="text" className="form-control" name="description" value={this.state.siteProduct.description} onChange={this.handleChange} />
                                <Form.Text className="text-muted">
                                    Descrizione estesa del prodotto.
                                </Form.Text>
                            </Form.Group>  */}

                            <div className='flex'>
                                {this.state.siteProduct && !this.state.loading && 
                                <Form.Group className="flex-1 flex flex-col mt-2">
                                    <Form.Label className="font-bold">Colore di Sfondo</Form.Label>
                                    <div className="flex flex-col md:flex:row">                            
                                        <div className="flex-none m-2 mt-0">
                                            <CompactPicker                                        
                                                color={ this.state.siteProduct.boxColor }
                                                onChangeComplete={ (color) => this.handleColorChange(color) } />
                                        </div>                                
                                        <div className="flex-grow m-2">
                                            <SliderPicker
                                                color={ this.state.siteProduct.boxColor }
                                                onChangeComplete={ (color) => this.handleColorChange(color) } />
                                        </div>                                                                                                    
                                    </div>                            
                                    <Form.Text className="text-muted">
                                        Colore di sfondo per i contenitori di testo. Attenzione scegliere colori contrastanti tra sfondo e testo per una buona leggibilità dei contenuti.
                                    </Form.Text>
                                </Form.Group>}    

                                <Form.Group className='flex-1'>
                                    <Form.Label>Prezzo</Form.Label>
                                    <input type="number" className="form-control" name="price" value={this.state.siteProduct.price} onChange={this.handleChangeNumber} />
                                    <Form.Text className="text-muted">
                                        Prezzo di vendità. Lasciare a 0 per non visualizzarlo nel contenitore.
                                    </Form.Text>
                                </Form.Group> 
                            </div>

                            
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

export { SiteProductAddEdit }