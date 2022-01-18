import React from 'react';
import { appSiteService, alertService } from '../_services';
import { Form, Button, ProgressBar,Navbar,Nav } from 'react-bootstrap'
import { Editor } from "@tinymce/tinymce-react";
import { LanguageSelect } from './LanguageSelect';
import { LanguageEditor } from './LanguageEditor';
import {menuSettings,pluginsSettings,toolbarSettings,fontSettings,styleSettings } from '../_helpers/tinySettings';
import { fetchWrapper } from '../_helpers';

const baseUrl = `${process.env.REACT_APP_API_URL}/upload`;
const baseImageUrl = `${process.env.REACT_APP_STORAGE_URL}/`;

class BoxTextEditor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {   
            pageBox: this.props.pageBox,
            languageCode: '',
            loading: false            
         };     
    }
    
    handleTitleEditorChange = (content, editor) => {
        this.setState({
            pageBox: {
                ...this.state.pageBox,
                title: content                 
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
    
    handleLanguageCode = (code) => {        
        this.setState({ 
            languageCode: code
        });        
    }

    tiny_image_upload_handler = (blobInfo, success, failure, progress) => {
        const fileName = (this.props.prefix + '/' || '') + new Date().getTime() + '.jpeg';

        // Request made to the backend api 
        // Send formData object 
        fetchWrapper.postFile(`${baseUrl}/CloudUpload`, blobInfo.blob(), fileName)
            .then((result) => {
                success(`${baseImageUrl}${result.fileName}`);                
            });         
    };                  
    
    updatePageBox = () => {
        appSiteService.updatePageBox({ pageBox: this.state.pageBox })
            .then((result) => {
                if (result.hasErrors) {
                    alertService.error('Problemi durante salvataggio.', { keepAfterRouteChange: true });
                } else {
                    alertService.success('Aggiornamento riuscito', { keepAfterRouteChange: true });
                }                
                this.props.handleSaved(this.state.pageBox.appSiteId,this.state.pageBox.sitePageId);            
            })
            .catch(error => {
                alertService.error(error);
            });
    }

    render() {
        return (  
            <>                
                <div>
                    {this.state.loading && 
                    <div className="text-center">
                        <ProgressBar animated now={100} />
                    </div>}
                                                
                    {!this.state.loading && this.state.languageCode == '' &&
                        <Form.Group>
                            <Form.Label className='text-sm'>Titolo</Form.Label>
                            <div className="border rounded-lg ring-2 ring-blue-200 p-1">
                                <Editor
                                    apiKey={process.env.REACT_APP_TINTMCE_KEY}
                                    initialValue={this.state.pageBox.title}                                
                                    inline={true}
                                    init={{
                                        height: 500,                                        
                                        menubar: menuSettings,
                                        plugins: pluginsSettings,
                                        toolbar: toolbarSettings,
                                        font_formats: fontSettings,
                                        content_style: styleSettings,
                                        images_upload_handler: this.tiny_image_upload_handler
                                    }}
                                    onEditorChange={this.handleTitleEditorChange}
                                    >
                                </Editor>                                 
                            </div>
                            {/* <Form.Text className="text-muted">
                                Titolo del contenuto: possibilità di formattare il testo. Cliccare sopra per iniziare la modifica del testo.
                            </Form.Text> */}
                        </Form.Group>}                                       

                        {this.state.languageCode !== '' &&
                        <div>
                            <LanguageEditor 
                                originalText={this.state.pageBox.title}
                                appSiteId={this.state.pageBox.appSiteId} 
                                code={this.state.languageCode}
                                inline={true}
                                labelKey={`PAGEBOX_${this.state.pageBox.appSiteId}_${this.state.pageBox.sitePageId}_${this.state.pageBox.pageBoxId}-Title`}>
                            </LanguageEditor>
                        </div>}  
                    
                    {this.state.pageBox && !this.state.loading && this.state.languageCode === '' && 
                        (this.state.pageBox.boxType === 1 || this.state.pageBox.boxType === 9) &&                 
                    <div>
                        <Form.Group>
                            <Form.Label className='text-sm'>Descrizione</Form.Label>
                            <div className="border rounded-lg ring-2 ring-blue-200 p-1">
                                <Editor
                                    apiKey={process.env.REACT_APP_TINTMCE_KEY}
                                    initialValue={this.state.pageBox.description}
                                    inline={true}
                                    init={{
                                        height: 500,
                                        menubar: menuSettings,
                                        plugins: pluginsSettings,
                                        toolbar: toolbarSettings,
                                        font_formats: fontSettings,
                                        content_style: styleSettings,
                                        images_upload_handler: this.tiny_image_upload_handler
                                    }}
                                    onEditorChange={this.handleEditorChange}
                                />
                            </div>
                            {/* <Form.Text className="text-muted">
                                Descrizione del contenuto: possibilità di formattare il testo. Cliccare sopra iniziare a modificare il testo.
                            </Form.Text> */}
                        </Form.Group>
                    </div>}

                    {this.state.languageCode && this.state.languageCode !== '' &&
                        this.state.pageBox.boxType && (this.state.pageBox.boxType === 1 || this.state.pageBox.boxType === 9) &&
                    <div>
                        <LanguageEditor 
                            originalText={this.state.pageBox.description}
                            appSiteId={this.state.pageBox.appSiteId} 
                            code={this.state.languageCode}
                            inline={true}
                            labelKey={`PAGEBOX_${this.state.pageBox.appSiteId}_${this.state.pageBox.sitePageId}_${this.state.pageBox.pageBoxId}-Description`}>                                    
                        </LanguageEditor>
                    </div>}              
                    
                </div>
                <Navbar>
                    <Nav className="mr-auto">
                        {this.state.languageCode === '' &&
                        <Button onClick={this.updatePageBox} variant="success" className="bg-green-600 mr-1">
                            Salva le modifiche
                        </Button>}                         
                    </Nav>
                    <Form inline>
                        <LanguageSelect appSiteId={this.state.pageBox.appSiteId} onLanguageChange={this.handleLanguageCode} />                   
                    </Form>
                </Navbar>                             
            </>          
        );
    }
}

export { BoxTextEditor }