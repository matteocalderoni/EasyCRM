//import { config } from 'config';
import { fetchWrapper } from '../_helpers';

const baseUrl = `${process.env.REACT_APP_API_URL}/Product`;

export const productService = {
    getSiteProducts,
    getProductsOfBox,
    getProductTypes,
    getSiteProductById,
    getProductById,
    getProductTypeById,
    createSiteProduct,
    createProduct,
    createProductType,
    updateSiteProduct,
    updateProduct,
    updateProductType,
    deleteSiteProduct,
    deleteProduct,
    deleteProductType
};

function getSiteProducts(search, page, count, appSiteId) {
    return fetchWrapper.post(`${baseUrl}/SearchSiteProducts`, { search, page, count, appSiteId });
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

function getProductById(appSiteId, pageId, boxId, productId) {
    return fetchWrapper.get(`${baseUrl}/GetProduct/${appSiteId}/${pageId}/${boxId}/${productId}`);
}

function getProductTypeById(productTypeId) {
    return fetchWrapper.get(`${baseUrl}/GetProductType/${productTypeId}`);
}

function createSiteProduct(siteProduct) {
    return fetchWrapper.post(`${baseUrl}/CreateSiteProduct`, { siteProduct });
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

function updateProduct(product) {
    return fetchWrapper.post(`${baseUrl}/UpdateProduct`, product);
}

function updateProductType(productType) {
    return fetchWrapper.post(`${baseUrl}/UpdateProductType`, productType);
}

function deleteSiteProduct(appSiteId, siteProductId) {
    return fetchWrapper.get(`${baseUrl}/DeleteSiteProduct/${appSiteId}/${siteProductId}`);
}

function deleteProduct(appSiteId, pageId, boxId, productId) {
    return fetchWrapper.get(`${baseUrl}/DeleteProduct/${appSiteId}/${pageId}/${boxId}/${productId}`);
}

function deleteProductType(productTypeId) {
    return fetchWrapper.get(`${baseUrl}/DeleteProductType/${productTypeId}`);
}