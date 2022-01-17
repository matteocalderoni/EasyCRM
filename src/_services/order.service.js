//import { config } from 'config';
import { fetchWrapper } from '../_helpers';

const baseUrl = `${process.env.REACT_APP_API_URL}/Order`;

export const orderService = {
    getSiteOrders,
    getSiteOrderById,
    deleteSiteOrder
};

function getSiteOrders(startDate, endDate, search, page, count, appSiteId) {
    return fetchWrapper.post(`${baseUrl}/SearchSiteOrders`, { startDate, endDate, search, page, count, appSiteId });
}

function getSiteOrderById(appSiteId, orderYear, orderId) {
    return fetchWrapper.get(`${baseUrl}/GetSiteOrder/${appSiteId}/${orderYear}/${orderId}`);
}

function deleteSiteOrder(appSiteId, orderYear, orderId) {
    return fetchWrapper.get(`${baseUrl}/DeleteSiteOrder/${appSiteId}/${orderYear}/${orderId}`);
}