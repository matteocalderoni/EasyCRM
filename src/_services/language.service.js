//import { config } from 'config';
import { fetchWrapper } from '../_helpers';

const baseUrl = `${process.env.REACT_APP_API_URL}/AppSite`;

export const languageService = {
    getlanguagesOfSite,
    getSiteLanguageById,
    createSiteLanguage,
    updateSiteLanguage,
    deleteSiteLanguage,
    getSiteLabelById,
    createSiteLabel,
    createOrUpdateSiteLabel,
    deleteSiteLabel
};

function getlanguagesOfSite(appSiteId,search,page,count) {
    return fetchWrapper.post(`${baseUrl}/SearchLanguagesOfAppSite/${appSiteId}`, { search, page, count });
}

function getSiteLanguageById(appSiteId,code) {
    return fetchWrapper.get(`${baseUrl}/GetSiteLanguage/${appSiteId}/${code}`);
}

function createSiteLanguage(siteLanguage) {
    return fetchWrapper.post(`${baseUrl}/CreateSiteLanguage`, siteLanguage);
}

function updateSiteLanguage(siteLanguage) {
    return fetchWrapper.post(`${baseUrl}/UpdateSiteLanguage`, siteLanguage);
}

function deleteSiteLanguage(appSiteId,code) {
    return fetchWrapper.get(`${baseUrl}/DeleteSiteLanguage/${appSiteId}/${code}`);
}

function getSiteLabelById(appSiteId,code,labelKey) {
    return fetchWrapper.get(`${baseUrl}/GetSiteLabel/${appSiteId}/${code}/${labelKey}`);
}

function createSiteLabel(siteLabel) {
    return fetchWrapper.post(`${baseUrl}/CreateSiteLabel`, siteLabel);
}

function createOrUpdateSiteLabel(siteLabel) {
    return fetchWrapper.post(`${baseUrl}/CreateOrUpdateSiteLabel`, { siteLabel: siteLabel });
}

function deleteSiteLabel(appSiteId,code,labelKey) {
    return fetchWrapper.get(`${baseUrl}/DeleteSiteLabel/${appSiteId}/${code}/${labelKey}`);
}
