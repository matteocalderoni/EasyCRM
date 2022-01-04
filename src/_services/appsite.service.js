//import { config } from 'config';
import { fetchWrapper } from '../_helpers';

const baseUrl = `${process.env.REACT_APP_API_URL}/AppSite`;

export const appSiteService = {
    getAppSites,
    getPagesOfAppSite,
    getBoxesOfPage,
    getOpenTimesOfBox,
    getTopServicesOfBox,
    getEmployeesOfBox,
    getAppSiteById,
    getSitePageById,
    getPageBoxById,
    getEmployeeById,
    getOpenTimeById,
    getTopServiceById,
    createAppSite,
    createSitePage,
    createPageBox,
    createOpenTime,
    createEmployee,
    createTopService,
    updateAppSite,
    updateSitePage,
    updatePageBox,
    updateOpenTime,
    updateEmployee,
    updateTopService,    
    deleteAppSite,
    deleteSitePage,
    deletePageBox,
    deleteOpenTime,
    deleteEmployee,
    deleteTopService,
    setDefaultAppSite,
    saveOrderBoxesOfPage,
    getPageLayouts,
    savePageLayouts
};

function getAppSites(search,page,count) {
    return fetchWrapper.post(`${baseUrl}/SearchAppSites`, { search, page, count });
}

function getPagesOfAppSite(search, appSiteId, parentPageId, pageType) {
    return fetchWrapper.post(`${baseUrl}/SearchPagesOfAppSite/${appSiteId}`, { search: search, page: 0, count: 0, parentPageId: parentPageId, pageType: pageType });
}

function getBoxesOfPage(appSiteId, pageId) {
    return fetchWrapper.post(`${baseUrl}/SearchBoxesOfPage/${appSiteId}/${pageId}`, { search: '', page: 0, count: 0});
}

function getOpenTimesOfBox(appSiteId, pageId, boxId) {
    return fetchWrapper.get(`${baseUrl}/SearchOpenTimesOfBox/${appSiteId}/${pageId}/${boxId}`);
}

function getEmployeesOfBox(appSiteId, pageId, boxId) {
    return fetchWrapper.get(`${baseUrl}/SearchEmployeesOfBox/${appSiteId}/${pageId}/${boxId}`);
}

function getTopServicesOfBox(appSiteId, pageId, boxId) {
    return fetchWrapper.get(`${baseUrl}/SearchTopServicesOfBox/${appSiteId}/${pageId}/${boxId}`);
}

function getAppSiteById(appSiteId) {
    return fetchWrapper.get(`${baseUrl}/GetAppSite/${appSiteId}`);
}

function getSitePageById(appSiteId, pageId) {
    return fetchWrapper.get(`${baseUrl}/GetSitePage/${appSiteId}/${pageId}`);
}

function getPageBoxById(appSiteId, pageId, boxId) {
    return fetchWrapper.get(`${baseUrl}/GetPageBox/${appSiteId}/${pageId}/${boxId}`);
}

function getOpenTimeById(appSiteId, pageId, boxId, weekDay) {
    return fetchWrapper.get(`${baseUrl}/GetOpenTime/${appSiteId}/${pageId}/${boxId}/${weekDay}`);
}

function getEmployeeById(appSiteId, pageId, boxId, employeeId) {
    return fetchWrapper.get(`${baseUrl}/GetEmployee/${appSiteId}/${pageId}/${boxId}/${employeeId}`);
}

function getTopServiceById(appSiteId, pageId, boxId, topServiceId) {
    return fetchWrapper.get(`${baseUrl}/GetTopService/${appSiteId}/${pageId}/${boxId}/${topServiceId}`);
}

function createAppSite(appSite) {
    return fetchWrapper.post(`${baseUrl}/CreateAppSite`, appSite);
}

function createSitePage(sitePage) {
    return fetchWrapper.post(`${baseUrl}/CreateSitePage`, sitePage);
}

function createPageBox(pageBox) {
    return fetchWrapper.post(`${baseUrl}/CreatePageBox`, pageBox);
}

function createOpenTime(openTime) {
    return fetchWrapper.post(`${baseUrl}/CreateOpenTime`, openTime);
}

function createEmployee(employee) {
    return fetchWrapper.post(`${baseUrl}/CreateEmployee`, employee);
}

function createTopService(topService) {
    return fetchWrapper.post(`${baseUrl}/CreateTopService`, topService);
}

function updateAppSite(appSite) {
    return fetchWrapper.post(`${baseUrl}/UpdateAppSite`, appSite);
}

function updateSitePage(sitePage) {
    return fetchWrapper.post(`${baseUrl}/UpdateSitePage`, sitePage);
}

function updatePageBox(pageBox) {
    return fetchWrapper.post(`${baseUrl}/UpdatePageBox`, pageBox);
}

function updateOpenTime(openTime) {
    return fetchWrapper.post(`${baseUrl}/UpdateOpenTime`, openTime);
}

function updateEmployee(employee) {
    return fetchWrapper.post(`${baseUrl}/UpdateEmployee`, employee);
}

function updateTopService(topService) {
    return fetchWrapper.post(`${baseUrl}/UpdateTopService`, topService);
}

function deleteAppSite(appSiteId) {
    return fetchWrapper.get(`${baseUrl}/DeleteAppSite/${appSiteId}`);
}

function deleteSitePage(appSiteId, pageId) {
    return fetchWrapper.get(`${baseUrl}/DeleteSitePage/${appSiteId}/${pageId}`);
}

function deletePageBox(appSiteId, pageId, boxId) {
    return fetchWrapper.get(`${baseUrl}/DeletePageBox/${appSiteId}/${pageId}/${boxId}`);
}

function deleteOpenTime(appSiteId, sitePageId, pageBoxId,weekDay) {
    return fetchWrapper.get(`${baseUrl}/DeleteOpenTime/${appSiteId}/${sitePageId}/${pageBoxId}/${weekDay}`);
}

function deleteEmployee(appSiteId, sitePageId, pageBoxId,employeeId) {
    return fetchWrapper.get(`${baseUrl}/DeleteEmployee/${appSiteId}/${sitePageId}/${pageBoxId}/${employeeId}`);
}

function deleteTopService(appSiteId, sitePageId, pageBoxId,topServiceId) {
    return fetchWrapper.get(`${baseUrl}/DeleteTopService/${appSiteId}/${sitePageId}/${pageBoxId}/${topServiceId}`);
}

function setDefaultAppSite(appSiteId) {
    return fetchWrapper.get(`${baseUrl}/SetDefaultAppSite/${appSiteId}`);
}

function saveOrderBoxesOfPage(appSiteId, pageId, ids) {
    return fetchWrapper.post(`${baseUrl}/SaveOrderBoxesOfPage/${appSiteId}/${pageId}`, { ids: ids });
}

function getPageLayouts(appSiteId, pageId) {
    return fetchWrapper.get(`${baseUrl}/GetPageLayouts/${appSiteId}/${pageId}`);
}

function savePageLayouts(appSiteId, pageId, layouts) {
    return fetchWrapper.post(`${baseUrl}/SavePageLayouts/${appSiteId}/${pageId}`, layouts);
}