//import { config } from 'config';
import { fetchWrapper } from '../_helpers';

const baseUrl = `${process.env.REACT_APP_API_URL}/user`;

export const userService = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    addUserToRole,
    removeUserFromRole
};

function getUsers(search,page,count,appSiteId) {
    return fetchWrapper.post(`${baseUrl}/GetUsers`, { search, page, count, appSiteId });
}

function getUserById(userId) {
    return fetchWrapper.post(`${baseUrl}/GetUser`, {id: +userId});
}

function createUser(user, appSiteId) {
    return fetchWrapper.post(`${baseUrl}/CreateUser/${appSiteId}`, user);
}

function updateUser(user) {
    return fetchWrapper.post(`${baseUrl}/UpdateUser`, { user: user });
}

function addUserToRole(userName, roleName) {
    return fetchWrapper.post(`${baseUrl}/addUserToRole`, { userName: userName, roleName: roleName });
}

function removeUserFromRole(userName, roleName) {
    return fetchWrapper.post(`${baseUrl}/removeUserFromRole`, { userName, roleName });
}