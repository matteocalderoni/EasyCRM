//import { config } from 'config';
import { fetchWrapper } from '../_helpers';

const baseUrl = `${process.env.REACT_APP_API_URL}/Survey`;

export const surveyService = {
    getSurveysOfAppSite,
    getStepsOfSurvey,
    getQuestionsOfStep,
    getAnswersOfQuestion,
    getOutcomeTypesOfAppSite,    
    getSiteSurveyById,
    getSurveyStepById,
    getStepQuestionById,
    getQuestionAnswerById,
    getOutcomeTypeById,
    getUserSurveyById,
    getUserAnswers,
    createSiteSurvey,
    createSurveyStep,
    createStepQuestion,
    createQuestionAnswer,
    createOutcomeType,
    updateSiteSurvey,
    updateSurveyStep,
    updateStepQuestion,
    updateQuestionAnswer,
    updateOutcomeType,
    deleteSiteSurvey,
    deleteSurveyStep,
    deleteStepQuestion,
    deleteQuestionAnswer,
    deleteOutcomeType
};

function getSurveysOfAppSite(appSiteId, search, page, count) {
    return fetchWrapper.post(`${baseUrl}/SearchSurveysOfAppSite/${appSiteId}`, { search: search, page: page, count: count });
}

function getStepsOfSurvey(appSiteId, siteSurveyId) {
    return fetchWrapper.post(`${baseUrl}/SearchStepsOfSurvey/${appSiteId}/${siteSurveyId}`, { search: '', page: 0, count: 0});
}

function getQuestionsOfStep(appSiteId, siteSurveyId, surveyStepId) {
    return fetchWrapper.post(`${baseUrl}/SearchQuestionsOfStep/${appSiteId}/${siteSurveyId}/${surveyStepId}`, { search: '', page: 0, count: 0});
}

function getAnswersOfQuestion(appSiteId, siteSurveyId, surveyStepId, stepQuestionId) {
    return fetchWrapper.post(`${baseUrl}/SearchAnswersOfQuestion/${appSiteId}/${siteSurveyId}/${surveyStepId}/${stepQuestionId}`, { search: '', page: 0, count: 0});
}

function getOutcomeTypesOfAppSite(appSiteId, search, page, count) {
    return fetchWrapper.post(`${baseUrl}/SearchOutcomeTypesOfAppSite/${appSiteId}`, { search: search, page: page, count: count });
}

function getSiteSurveyById(appSiteId, siteSurveyId) {
    return fetchWrapper.get(`${baseUrl}/GetSiteSurvey/${appSiteId}/${siteSurveyId}`);
}

function getSurveyStepById(appSiteId, siteSurveyId, surveyStepId) {
    return fetchWrapper.get(`${baseUrl}/GetSurveyStep/${appSiteId}/${siteSurveyId}/${surveyStepId}`);
}

function getStepQuestionById(appSiteId, siteSurveyId, surveyStepId, stepQuestionId) {
    return fetchWrapper.get(`${baseUrl}/GetStepQuestion/${appSiteId}/${siteSurveyId}/${surveyStepId}/${stepQuestionId}`);
}

function getQuestionAnswerById(appSiteId, siteSurveyId, surveyStepId, stepQuestionId, questionAnswerId) {
    return fetchWrapper.get(`${baseUrl}/GetQuestionAnswer/${appSiteId}/${siteSurveyId}/${surveyStepId}/${stepQuestionId}/${questionAnswerId}`);
}

function getOutcomeTypeById(appSiteId, outcomeTypeId) {
    return fetchWrapper.get(`${baseUrl}/GetOutcomeType/${appSiteId}/${outcomeTypeId}`);
}

function getUserSurveyById(appSiteId, siteSurveyId, userSurveyId) {
    return fetchWrapper.get(`${baseUrl}/GetUserSurvey/${appSiteId}/${siteSurveyId}/${userSurveyId}`);
}

function getUserAnswers(appSiteId, siteSurveyId, userSurveyId) {
    return fetchWrapper.get(`${baseUrl}/GetUserAnswers/${appSiteId}/${siteSurveyId}/${userSurveyId}`);
}

function createSiteSurvey(siteSurvey) {
    return fetchWrapper.post(`${baseUrl}/CreateSiteSurvey`, siteSurvey);
}

function createSurveyStep(surveyStep) {
    return fetchWrapper.post(`${baseUrl}/CreateSurveyStep`, surveyStep);
}

function createStepQuestion(stepQuestion) {
    return fetchWrapper.post(`${baseUrl}/CreateStepQuestion`, stepQuestion);
}

function createQuestionAnswer(questionAnswer) {
    return fetchWrapper.post(`${baseUrl}/CreateQuestionAnswer`, questionAnswer);
}

function createOutcomeType(outcomeType) {
    return fetchWrapper.post(`${baseUrl}/CreateOutcomeType`, outcomeType);
}

function updateSiteSurvey(siteSurvey) {
    return fetchWrapper.post(`${baseUrl}/UpdateSiteSurvey`, siteSurvey);
}

function updateSurveyStep(surveyStep) {
    return fetchWrapper.post(`${baseUrl}/UpdateSurveyStep`, surveyStep);
}

function updateStepQuestion(stepQuestion) {
    return fetchWrapper.post(`${baseUrl}/UpdateStepQuestion`, stepQuestion);
}

function updateQuestionAnswer(questionAnswer) {
    return fetchWrapper.post(`${baseUrl}/UpdateQuestionAnswer`, questionAnswer);
}

function updateOutcomeType(outcomeType) {
    return fetchWrapper.post(`${baseUrl}/UpdateOutcomeType`, outcomeType);
}

function deleteSiteSurvey(appSiteId, siteSurveyId) {
    return fetchWrapper.get(`${baseUrl}/DeleteSiteSurvey/${appSiteId}/${siteSurveyId}`);
}

function deleteSurveyStep(appSiteId, siteSurveyId, surveyStepId) {
    return fetchWrapper.get(`${baseUrl}/DeleteSurveyStep/${appSiteId}/${siteSurveyId}/${surveyStepId}`);
}

function deleteStepQuestion(appSiteId, siteSurveyId, surveyStepId, stepQuestionId) {
    return fetchWrapper.get(`${baseUrl}/DeleteStepQuestion/${appSiteId}/${siteSurveyId}/${surveyStepId}/${stepQuestionId}`);
}

function deleteQuestionAnswer(appSiteId, siteSurveyId, surveyStepId, stepQuestionId, questionAnswerId) {
    return fetchWrapper.get(`${baseUrl}/DeleteQuestionAnswer/${appSiteId}/${siteSurveyId}/${surveyStepId}/${stepQuestionId}/${questionAnswerId}`);
}

function deleteOutcomeType(appSiteId, outcomeTypeId) {
    return fetchWrapper.get(`${baseUrl}/DeleteOutcomeType/${appSiteId}/${outcomeTypeId}`);
}