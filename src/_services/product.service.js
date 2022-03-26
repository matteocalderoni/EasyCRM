//import { config } from 'config';
import { fetchWrapper } from '../_helpers';

const baseUrl = `${process.env.REACT_APP_API_URL}/Product`;

export const productService = {
    getSiteProducts,
    getSiteProductTypes,
    getSiteProductChilds,
    getProductsOfBox,
    getProductTypes,
    getSiteProductById,    
    getSiteProductTypeById,
    getSiteProductChildById,
    getProductById,
    getProductTypeById,
    createSiteProduct,
    createSiteProductType,
    createSiteProductChild,
    createProduct,
    createProductType,
    updateSiteProduct,
    updateSiteProductType,
    updateSiteProductChild,
    updateProduct,
    updateProductType,
    deleteSiteProduct,
    deleteSiteProductType,
    deleteSiteProductChild,
    deleteProduct,
    deleteProductType
};

function getSiteProducts(search, page, count, appSiteId) {
    return fetchWrapper.post(`${baseUrl}/SearchSiteProducts`, { search, page, count, appSiteId });
}

function getSiteProductTypes(search, page, count, appSiteId) {
    return fetchWrapper.post(`${baseUrl}/SearchSiteProductTypes`, { search, page, count, appSiteId });
}

function getSiteProductChilds(search, page, count, appSiteId, siteProductId) {
    return fetchWrapper.post(`${baseUrl}/SearchSiteProductChilds`, { search, page, count, appSiteId, siteProductId });
}

function getProductsOfBox(appSiteId, pageId, boxId) {
    return fetchWrapper.post(`${baseUrl}/SearchProductsOfBox`, { appSiteId, pageId, boxId });
}

function getProductTypes(search,page,count, appSiteId, sitePageId, pageBoxId) {
    return fetchWrapper.post(`${baseUrl}/SearchProductTypes`, { search, page, count, appSiteId, sitePageId, pageBoxId });
}

function getSiteProductById(appSiteId, siteProductId) {
    return fetchWrapper.get(`${baseUrl}/GetSiteProduct/${appSiteId}/${siteProductId}`);
}

function getSiteProductTypeById(appSiteId, siteProductTypeId) {
    return fetchWrapper.get(`${baseUrl}/GetSiteProductType/${appSiteId}/${siteProductTypeId}`);
}

function getSiteProductChildById(appSiteId, siteProductId, siteProductChildId) {
    return fetchWrapper.get(`${baseUrl}/GetSiteProductChild/${appSiteId}/${siteProductId}/${siteProductChildId}`);
}

function getProductById(appSiteId, pageId, boxId, productId) {
    return fetchWrapper.get(`${baseUrl}/GetProduct/${appSiteId}/${pageId}/${boxId}/${productId}`);
}

function getProductTypeById(productTypeId) {
    return fetchWrapper.get(`${baseUrl}/GetProductType/${productTypeId}`);
}

function createSiteProduct(siteProduct) {
    return fetchWrapper.post(`${baseUrl}/CreateSiteProduct`, { siteProduct });
}

function createSiteProductType(siteProductType) {
    return fetchWrapper.post(`${baseUrl}/CreateSiteProductType`, { siteProductType });
}

function createSiteProductChild(siteProductChild) {
    return fetchWrapper.post(`${baseUrl}/CreateSiteProductChild`, { siteProductChild });
}

function createProduct(product) {
    return fetchWrapper.post(`${baseUrl}/CreateProduct`, product);
}

function createProductType(productType) {
    return fetchWrapper.post(`${baseUrl}/CreateProductType`, productType);
}

function updateSiteProduct(siteProduct) {
    return fetchWrapper.post(`${baseUrl}/UpdateSiteProduct`, { siteProduct });
}

function updateSiteProductType(siteProductType) {
    return fetchWrapper.post(`${baseUrl}/UpdateSiteProductType`, { siteProductType });
}

function updateSiteProductChild(siteProductChild) {
    return fetchWrapper.post(`${baseUrl}/UpdateSiteProductChild`, { siteProductChild });
}

function updateProduct(product) {
    return fetchWrapper.post(`${baseUrl}/UpdateProduct`, product);
}

function updateProductType(productType) {
    return fetchWrapper.post(`${baseUrl}/UpdateProductType`, productType);
}

function deleteSiteProduct(appSiteId, siteProductId) {
    return fetchWrapper.get(`${baseUrl}/DeleteSiteProduct/${appSiteId}/${siteProductId}`);
}

function deleteSiteProductType(appSiteId, siteProductTypeId) {
    return fetchWrapper.get(`${baseUrl}/DeleteSiteProductType/${appSiteId}/${siteProductTypeId}`);
}

function deleteSiteProductChild(appSiteId, siteProductId, siteProductChildId) {
    return fetchWrapper.get(`${baseUrl}/DeleteSiteProductChild/${appSiteId}/${siteProductId}/${siteProductChildId}`);
}

function deleteProduct(appSiteId, pageId, boxId, productId) {
    return fetchWrapper.get(`${baseUrl}/DeleteProduct/${appSiteId}/${pageId}/${boxId}/${productId}`);
}

function deleteProductType(productTypeId) {
    return fetchWrapper.get(`${baseUrl}/DeleteProductType/${productTypeId}`);
}