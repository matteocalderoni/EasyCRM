//import { config } from 'config';
import { fetchWrapper } from '../_helpers';

const baseUrl = `${process.env.REACT_APP_API_URL}/Product`;

export const productService = {
    getProductsOfBox,
    getProductTypes,
    getProductById,
    getProductTypeById,
    createProduct,
    createProductType,
    updateProduct,
    updateProductType,
    deleteProduct,
    deleteProductType
};

function getProductsOfBox(appSiteId, pageId, boxId) {
    return fetchWrapper.post(`${baseUrl}/SearchProductsOfBox`, { appSiteId, pageId, boxId });
}

function getProductTypes(search,page,count, appSiteId, sitePageId, pageBoxId) {
    return fetchWrapper.post(`${baseUrl}/SearchProductTypes`, { search, page, count, appSiteId, sitePageId, pageBoxId });
}

function getProductById(appSiteId, pageId, boxId, productId) {
    return fetchWrapper.get(`${baseUrl}/GetProduct/${appSiteId}/${pageId}/${boxId}/${productId}`);
}

function getProductTypeById(productTypeId) {
    return fetchWrapper.get(`${baseUrl}/GetProductType/${productTypeId}`);
}

function createProduct(product) {
    return fetchWrapper.post(`${baseUrl}/CreateProduct`, product);
}

function createProductType(productType) {
    return fetchWrapper.post(`${baseUrl}/CreateProductType`, productType);
}

function updateProduct(product) {
    return fetchWrapper.post(`${baseUrl}/UpdateProduct`, product);
}

function updateProductType(productType) {
    return fetchWrapper.post(`${baseUrl}/UpdateProductType`, productType);
}

function deleteProduct(appSiteId, pageId, boxId, productId) {
    return fetchWrapper.get(`${baseUrl}/DeleteProduct/${appSiteId}/${pageId}/${boxId}/${productId}`);
}

function deleteProductType(productTypeId) {
    return fetchWrapper.get(`${baseUrl}/DeleteProductType/${productTypeId}`);
}