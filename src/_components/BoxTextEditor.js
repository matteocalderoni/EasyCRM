import React from 'react';
import { appSiteService, alertService } from '../_services';
import { Form, Button, Card, Image, ProgressBar,Navbar,Nav } from 'react-bootstrap'
import { Editor } from "@tinymce/tinymce-react";
import { LanguageSelect } from './LanguageSelect';
import { LanguageEditor } from './LanguageEditor';
import {menuSettings,pluginsSettings,toolbarSettings } from '../_helpers/tinySettings';

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
                    {this.state.loading && <div className="text-center mart2">
                        <ProgressBar animated now={100} />
                    </div>}
                                                
                    {!this.state.loading && this.state.languageCode == '' &&
                        <Form.Group>
                            <Form.Label>Titolo</Form.Label>
                            <div className="editor-inline">
                                <Editor
                                    apiKey={process.env.REACT_APP_TINTMCE_KEY}
                                    initialValue={this.state.pageBox.title}                                
                                    inline={true}
                                    init={{
                                        height: 500,                                        
                                        menubar: menuSettings,
                                        plugins: pluginsSettings,
                                        toolbar: toolbarSettings
                                    }}
                                    onEditorChange={this.handleTitleEditorChange}
                                    >
                                </Editor>                                 
                            </div>
                            <Form.Text className="text-muted">
                                Titolo del contenuto: possibilità di formattare il testo. Cliccare sopra per iniziare la modifica del testo.
                            </Form.Text>
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
                            <Form.Label>Descrizione del contenitore</Form.Label>
                            <div className="editor-inline">
                                <Editor
                                    apiKey={process.env.REACT_APP_TINTMCE_KEY}
                                    initialValue={this.state.pageBox.description}
                                    inline={true}
                                    init={{
                                        height: 500,
                                        menubar: menuSettings,
                                        plugins: pluginsSettings,
                                        toolbar: toolbarSettings
                                    }}
                                    onEditorChange={this.handleEditorChange}
                                />
                            </div>
                            <Form.Text className="text-muted">
                                Descrizione del contenuto: possibilità di formattare il testo. Cliccare sopra iniziare a modificare il testo.
                            </Form.Text>
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
                <Navbar variant="dark" bg="dark">
                    <Nav className="mr-auto">
                        {this.state.languageCode === '' &&
                            <Button onClick={this.updatePageBox} variant="success" className="mr-1">
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