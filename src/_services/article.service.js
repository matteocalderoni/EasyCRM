//import { config } from 'config';
import { fetchWrapper } from '../_helpers';

const baseUrl = `${process.env.REACT_APP_API_URL}/article`;

export const articleService = {
    getArticlesOfBox,
    getCategories,
    getArticleById,
    getCategoryById,
    createArticle,
    createCategory,
    updateArticle,
    updateCategory,
    deleteArticle,
    deleteCategory
};

function getArticlesOfBox(appSiteId, pageId, boxId) {
    return fetchWrapper.post(`${baseUrl}/SearchArticlesOfBox`, { appSiteId, pageId, boxId });
}

function getCategories(search,page,count) {
    return fetchWrapper.post(`${baseUrl}/SearchCategories`, { search, page, count });
}

function getArticleById(appSiteId, pageId, boxId, articleId) {
    return fetchWrapper.get(`${baseUrl}/GetArticle/${appSiteId}/${pageId}/${boxId}/${articleId}`);
}

function getCategoryById(categoryId) {
    return fetchWrapper.get(`${baseUrl}/GetCategory/${categoryId}`);
}

function createArticle(article) {
    return fetchWrapper.post(`${baseUrl}/CreateArticle`, article);
}

function createCategory(category) {
    return fetchWrapper.post(`${baseUrl}/CreateCategory`, category);
}

function updateArticle(article) {
    return fetchWrapper.post(`${baseUrl}/UpdateArticle`, article);
}

function updateCategory(category) {
    return fetchWrapper.post(`${baseUrl}/UpdateCagegory`, category);
}

function deleteArticle(appSiteId, pageId, boxId, articleId) {
    return fetchWrapper.get(`${baseUrl}/DeleteArticle/${appSiteId}/${pageId}/${boxId}/${articleId}`);
}

function deleteCategory(categoryId) {
    return fetchWrapper.get(`${baseUrl}/DeleteCategory/${categoryId}`);
}