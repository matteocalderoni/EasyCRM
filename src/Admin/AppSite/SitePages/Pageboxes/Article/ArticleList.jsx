import React from 'react';
import { Container, Jumbotron, Card, Button, Row, Col, Image } from 'react-bootstrap';
import { articleService } from '../../../../../_services';
import { ArticleAddEdit } from './ArticleAddEdit';
import { CategoryList } from './CategoryList';
import parse from 'html-react-parser';

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
                <Jumbotron>
                    <h2>Contenitore <b>Articoli</b></h2>
                </Jumbotron>
                
                <ArticleAddEdit appSiteId={this.state.appSiteId} sitePageId={this.state.sitePageId} pageBoxId={this.state.pageBoxId} articleId={0} handleAddEdit={(rId,sId,pId) => this.handleAddEdit(rId,sId,pId)} />
                <CategoryList />
                
                <Row>
                {this.state.articles && this.state.articles.map(article =>                                    
                    <Col sm={parseInt(article.cardSize)} key={article.articleId}>
                        <Card className="mart2 text-center">
                            <Card.Body>                            
                                <Card.Title>
                                    {article.title}
                                </Card.Title>                                                                                                               
                                <Row className="justify-content-md-center">
                                    <Col sm={4}>
                                        <Image src={baseImageUrl+article.imageUrl} roundedCircle fluid />
                                    </Col>
                                    <Col sm={4}>
                                    <p>{parse(article.description)}</p>
                                    </Col>
                                    <Col sm={4}>
                                        <p>{parse(article.markdown)}</p>
                                        <hr />
                                        <p>{parse(article.html)}</p>
                                    </Col>
                                </Row>      
                                <ArticleAddEdit appSiteId={article.appSiteId} sitePageId={article.sitePageId} pageBoxId={article.pageBoxId} articleId={article.articleId} handleAddEdit={(rId,sId,pId) => this.handleAddEdit(rId,sId,pId)} />
                                <Button variant="danger" onClick={() => this.deleteArticle(article)}>elimina</Button>
                            </Card.Body>
                        </Card>    
                    </Col>                                        
                )}                    
                {!this.state.articles &&                
                    <Col className="text-center">
                        <span className="spinner-border spinner-border-lg align-center"></span>
                    </Col>
                }             
                </Row>   
            </Container>
        );
    }

}

export { ArticleList };