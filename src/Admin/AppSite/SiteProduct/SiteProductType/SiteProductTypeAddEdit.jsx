import React from 'react';
import { productService, alertService } from '../../../../_services';
import { Form, Button, Card, ProgressBar,Navbar, Nav } from 'react-bootstrap'
import { FaSave } from 'react-icons/fa';
import { LanguageEditor } from '../../../../_components'
import { Editor } from "@tinymce/tinymce-react";
import {menuSettings,pluginsSettings,toolbarSettings,fontSettings,styleSettings } from '../../../../_helpers/tinySettings';
import { fetchWrapper } from '../../../../_helpers/fetch-wrapper'
import { SiteProductCategorySelect } from '../../../../_components/Select/SiteProductCategorySelect';

const baseUrl = `${process.env.REACT_APP_API_URL}/upload`;
const baseImageUrl = `${process.env.REACT_APP_STORAGE_URL}/`;

class SiteProductTypeAddEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {   
            appSiteId: +props.appSiteId,
            siteProductType: {
                appSiteId: +props.appSiteId | 0,
                siteProductTypeId: +props.siteProductTypeId | 0,
                code: '',                         
                description: ''
            },
            siteProductTypes: [],
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
        this.setState({ siteProductType: { ...this.state.siteProductType, [evt.target.name]: value } });
    }

    handleChangeNumber(evt) {
        const value = +evt.target.value;
        this.setState({ siteProductType: { ...this.state.siteProductType, [evt.target.name]: value } });
    }

    handleChangeBool(evt) {  
        this.setState({ siteProductType: { ...this.state.siteProductType, [evt.target.name]: evt.target.checked } });
    }
    
    handleDescriptionEditorChange = (content, editor) => {
        this.setState({ siteProductType: { ...this.state.siteProductType, description: content } });
    }

    handleChangeCategory = (_category) => {
        this.setState({ siteProductType: { ...this.state.siteProductType, category: _category } });
    }

    handleFieldRemove = (field) => {
        this.setState({ siteProductType: { ...this.state.siteProductType, [field]: '' } });
    }
    
    handleOpen() {    
        if (this.props.siteProductTypeId > 0) {
            this.setState({loading: true})
            productService.getSiteProductTypeById(this.state.appSiteId, this.state.siteProductType.siteProductTypeId)
                .then(_siteProductType => {                    
                    this.setState({ siteProductType: _siteProductType, loading: false })                    
                });
        }         
    }

    tiny_image_upload_handler = (blobInfo, success, failure, progress) => {
        const fileName = (this.state.siteProductType.appSiteId + '/' || '') + new Date().getTime() + '.jpeg';            
        fetchWrapper.postFile(`${baseUrl}/CloudUpload`, blobInfo.blob(), fileName)
            .then((result) => success(`${baseImageUrl}${result.fileName}`));         
      };                  
    
    onSubmit = () => {
        if (this.state.siteProductType.siteProductTypeId > 0) 
            this.updateSiteProductType();
        else
            this.createSiteProductType();                    
    }
    
    createSiteProductType() {
        productService.createSiteProductType(this.state.siteProductType)
            .then(result => {
                if (result.hasErrors) 
                    alertService.error('Problemi durante il salvataggio', { keepAfterRouteChange: true });
                else
                    alertService.success('Tipo Prodotto aggiunta con successo', { keepAfterRouteChange: true });         
                if (this.props.handleSaved)    
                    this.props.handleSaved(this.state.appSiteId);                
            })
            .catch(error => alertService.error(error));
    }

    updateSiteProductType() {
        productService.updateSiteProductType(this.state.siteProductType)
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
                                <div className='flex-1'>
                                    <Form.Group>
                                        <Form.Label>Codice</Form.Label>
                                        <input type="text" className="form-control" name="code" value={this.state.siteProductType.code} onChange={this.handleChange} />
                                        <Form.Text className="text-muted">
                                            Codice pubblico del tipo prodotto.
                                        </Form.Text>
                                    </Form.Group> 
                                </div>
                            </div>

                            <Form.Group>
                                <Form.Label className="text-lg"><b>Categoria</b> del tipo</Form.Label>
                                <SiteProductCategorySelect category={this.state.siteProductType.category} onCategoryChange={(category) => this.handleChangeCategory(+category)} label={'Categoria'} />
                                <Form.Text className="text-muted text-xs">
                                    La categoria serve per definire lo scopo del prodotto: shop per acquisto mostra il prezzo e bottone per acquisto, brand e persona servono per raccogliere i prodotti in gruppi.
                                </Form.Text>
                            </Form.Group>

                            {this.state.languageCode == '' && 
                            <Form.Group className="mt-2">
                                <Form.Label className="text-xl">Descrizione</Form.Label>                                
                                <div className="border rounded-lg p-1">
                                    <Editor
                                        apiKey={process.env.REACT_APP_TINTMCE_KEY}
                                        initialValue={this.state.siteProductType.description}                                                                        
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
                                    originalText={this.state.siteProductType.description}
                                    appSiteId={this.state.siteProductType.appSiteId} 
                                    code={this.state.languageCode}
                                    inline={true}
                                    labelKey={`SITEPRODUCTTYPE_${this.state.siteProductType.appSiteId}_${this.state.siteProductType.siteProductTypeId}-Description`}>                                    
                                </LanguageEditor>                                
                            </div>} 

                            {/* <Form.Group>
                                <Form.Label>Descrizione</Form.Label>
                                <input type="text" className="form-control" name="description" value={this.state.siteProductType.description} onChange={this.handleChange} />
                                <Form.Text className="text-muted">
                                    Descrizione estesa del prodotto.
                                </Form.Text>
                            </Form.Group>  */}                            
                            
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

export { SiteProductTypeAddEdit }