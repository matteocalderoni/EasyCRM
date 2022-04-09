import React from 'react';
import { productService, alertService } from '../../../_services';
import { Form, Button, Card, ProgressBar,Image } from 'react-bootstrap'
import { FaSave } from 'react-icons/fa';
import { LanguageEditor, Uploader } from '../../../_components'
import { CompactPicker,SliderPicker } from 'react-color';
import { fetchWrapper } from '../../../_helpers/fetch-wrapper'
import { SiteProductTypeSelect } from '../../../_components/Select/SiteProductTypeSelect';
import { FooterNav } from '../../../_components/FooterNav';

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

    handleChangeSiteProductTypeId(siteProductTypeId) {
        this.setState({ siteProduct: { ...this.state.siteProduct, siteProductTypeId: siteProductTypeId } });
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

    handleLanguageChange = (code) => {
        this.setState({languageCode: code})
    }
    
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
        const fileName = (this.state.siteProduct.appSiteId + '/' || '') + new Date().getTime() + '.jpeg';            
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
                            
                            <div>
                                {this.state.siteProduct && this.state.siteProduct.siteProductId > 0 && 
                                    !this.state.loading && 
                                <div className='md:flex md:space-x-2'>
                                    <div className="flex-1 text-center flex-row space-x-2">
                                        <Form.Label className="font-bold">Immagine del prodotto</Form.Label>
                                        {this.state.siteProduct.imageUrl &&
                                        <div className='mt-2'>
                                            <div className='flex items-center justify-center'>
                                                <Image className='w-48' src={baseImageUrl+this.state.siteProduct.imageUrl} fluid />
                                            </div>
                                            <Button onClick={() => this.handleFieldRemove('imageUrl')} className="mt-2 w-10/12  bg-red-400">
                                                    Rimuovi immagine
                                            </Button>
                                        </div>}                                    
                                        {this.state.siteProduct.imageUrl == null &&
                                        <Uploader prefix={this.state.siteProduct.appSiteId} fileName={this.state.siteProduct.imageUrl} onFileNameChange={this.handleFileName} />}
                                        <small>Utilizzare immagini con formato ottimizzate per il web.</small>  
                                    </div>                                    
                                    
                                    <Form.Group className="text-center flex-1 flex flex-col mt-2">
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
                                    </Form.Group>  
                                </div>}
                                
                                <div className='md:flex md:space-x-2'>
                                    <Form.Group className='flex-1'>
                                        <Form.Label>Codice interno</Form.Label>
                                        <input type="text" className="form-control" name="internalCode" value={this.state.siteProduct.internalCode} onChange={this.handleChange} />
                                        <Form.Text className="text-muted">
                                            Codice univoco per uso interno.
                                        </Form.Text>
                                    </Form.Group> 

                                    <Form.Group className='flex-1'>
                                        <Form.Label>Codice</Form.Label>
                                        <input type="text" className="form-control" name="code" value={this.state.siteProduct.code} onChange={this.handleChange} />
                                        <Form.Text className="text-muted">
                                            Codice pubblico del prodotto.
                                        </Form.Text>
                                    </Form.Group> 

                                    <Form.Group className='flex-1'>
                                        <Form.Label>Tipo</Form.Label>
                                        <SiteProductTypeSelect appSiteId={this.state.appSiteId} siteProductTypeId={this.state.siteProduct.siteProductTypeId} onChange={(_siteProductTypeId) => this.handleChangeSiteProductTypeId(_siteProductTypeId)} />
                                        <Form.Text className="text-muted">
                                            Tipo del prodotto.
                                        </Form.Text>
                                    </Form.Group>
                                </div>
                            </div>

                            {this.state.siteProduct.siteProductId > 0 && 
                            <Form.Group className="mt-2">
                                <Form.Label className="text-xl">Descrizione</Form.Label>                                
                                <div className="border rounded-lg p-1">                                
                                    <LanguageEditor 
                                        appSiteId={this.state.siteProduct.appSiteId} 
                                        originalText={this.state.siteProduct.description}
                                        onChange={(content) => this.handleDescriptionEditorChange(content)}
                                        code={this.state.languageCode}
                                        labelKey={`SITEPRODUCT_${this.state.siteProduct.appSiteId}_${this.state.siteProduct.siteProductId}-Description`}
                                        inline={false} />                                                                  
                                </div>
                                <Form.Text className="text-muted">
                                    Descrizione.                                    
                                </Form.Text>
                            </Form.Group>}
                                                        
                            {this.state.siteProduct.siteProductId > 0 && 
                            <div className='md:flex md:space-x-2'>                            
                                <Form.Group className='flex-1'>
                                    <Form.Label>Disponibilità</Form.Label>
                                    <input type="number" className="form-control" name="stockQuantity" value={this.state.siteProduct.stockQuantity} onChange={this.handleChangeNumber} />
                                    <Form.Text className="text-muted">
                                        Quantità disponibile. Lasciare a -1 per non mettere limiti.
                                    </Form.Text>
                                </Form.Group> 

                                <Form.Group className='flex-1'>
                                    <Form.Label>Prezzo</Form.Label>
                                    <input type="number" className="form-control" name="price" value={this.state.siteProduct.price} onChange={this.handleChangeNumber} />
                                    <Form.Text className="text-muted">
                                        Prezzo di vendità. Lasciare a 0 per non visualizzarlo nel contenitore.
                                    </Form.Text>
                                </Form.Group> 
                            </div>}

                        </Form>
                    </div>}
                </Card.Body>    
            </Card>                    

            <div className='relative'>
                <div className={`fixed bottom-16 right-2`}>
                    <Button onClick={() => this.onSubmit()} 
                        className="text-white flex items-center px-4 w-auto h-12 bg-green-600 rounded-full hover:bg-green-700 border-green-500 active:shadow-lg mouse shadow transition ease-in duration-200 focus:outline-none">
                        <FaSave className="md:mr-2" /> 
                        <span className='hidden md:block'>Salva</span>
                    </Button>                                         
                </div>
            </div>

            <FooterNav appSiteId={this.state.appSiteId} languageCode={this.state.languageCode} onLanguageChange={(code) => this.handleLanguageChange(code)} />

          </>          
        );
    }
}

export { SiteProductAddEdit }