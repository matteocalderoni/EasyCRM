import React from 'react';
import { Container, Jumbotron, Card, Row, Col, Image } from 'react-bootstrap';
import { articleService } from '../../../../../_services';
import { ArticleAddEdit } from './ArticleAddEdit';
import { CategoryList } from './CategoryList';
import parse from 'html-react-parser';
import { DeleteConfirmation } from '../../../../../_components/DeleteConfirmation';

const baseImageUrl = `${process.env.REACT_APP_STORAGE_URL}/`;

class ArticleList extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            articles: null,
            appSiteId: this.props.appSiteId,
            sitePageId: this.props.sitePageId,
            pageBoxId: this.props.pageBoxId
        }

        this.getArticles(this.props.appSiteId, this.props.sitePageId, this.props.pageBoxId);
    }

    getArticles(appSiteId, sitePageId, pageBoxId) {            
        articleService.getArticlesOfBox(appSiteId, sitePageId, pageBoxId)
            .then((_articles) => {
                this.setState({ articles: (_articles.totalCount > 0 ? _articles.result : []) });                                                                
            })
            .catch(() => {});        
    }

    deleteArticle = (article) => {
        articleService.deleteArticle(article.appSiteId, article.sitePageId, article.pageBoxId ,article.articleId)
            .then(() => {
                this.getArticles(this.state.appSiteId, this.state.sitePageId, this.state.pageBoxId);
            });
    }

    handleAddEdit = (appSiteId, sitePageId, pageBoxId) => {
        this.getArticles(appSiteId, sitePageId, pageBoxId);
    }
    
    render() {
        return (
            <Container>
                <Jumbotron className="small-jumbotron">
                    <h3>Contenitore <b>Articoli</b></h3>
                    <p>Il contenitore blog permette di creare articoli per mantenere vivo e dinamico il sito.</p>
                </Jumbotron>
                
                <ArticleAddEdit appSiteId={this.state.appSiteId} sitePageId={this.state.sitePageId} pageBoxId={this.state.pageBoxId} articleId={0} handleAddEdit={(appSiteId, sitePageId, pageBoxId) => this.handleAddEdit(appSiteId, sitePageId, pageBoxId)} />
                <CategoryList />
                {!this.state.articles &&                
                    <Col className="text-center">
                        <span className="spinner-border spinner-border-lg align-center"></span>
                    </Col>
                }             
                <Row>
                {this.state.articles && this.state.articles.map(article =>                                    
                    <Col sm={parseInt(article.cardSize)} key={article.articleId}>
                        <Card className="mart2 text-center" bg="secondary" text="white">
                            <Card.Body>                            
                                <Card.Title>
                                    {article.title}
                                </Card.Title>                                                                                                               
                                <Row className="justify-content-md-center">
                                    <Col sm={4}>
                                        <Image src={baseImageUrl+article.imageUrl} roundedCircle fluid />
                                    </Col>
                                    <Col sm={4}>
                                    {article.description && parse(article.description)}
                                    </Col>
                                    <Col sm={4}>                                        
                                        {article.markdown && parse(article.markdown)}
                                        <hr />
                                        {article.html && parse(article.html)}
                                    </Col>
                                </Row>      
                                <ArticleAddEdit appSiteId={article.appSiteId} sitePageId={article.sitePageId} pageBoxId={article.pageBoxId} articleId={article.articleId} handleAddEdit={(rId,sId,pId) => this.handleAddEdit(rId,sId,pId)} />
                                {/* <Button variant="danger" onClick={() => this.deleteArticle(article)}>elimina</Button> */}
                                <DeleteConfirmation onConfirm={() => this.deleteArticle(article)} />
                            </Card.Body>
                        </Card>    
                    </Col>                                        
                )}                    
                
                </Row>   
            </Container>
        );
    }

}

export { ArticleList };