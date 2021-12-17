//import { config } from 'config';
import { fetchWrapper } from '../_helpers';

const baseUrl = `${process.env.REACT_APP_API_URL}/role`;

export const roleService = {
    getRoles,
    getRoleById,
    createRole,
    deleteRole,
    getUsersOfRole,
    getRolesOfUser    
};

function getRoles() {
    return fetchWrapper.get(`${baseUrl}/GetRoles`);
}

function getRoleById(roleId) {
    return fetchWrapper.post(`${baseUrl}/GetRole`, { id: +roleId });
}

function createRole(role) {
    return fetchWrapper.post(`${baseUrl}/CreateRole`, { roleName: role.roleName });
}

function deleteRole(roleName) {
    return fetchWrapper.get(`${baseUrl}/DeleteRole/${roleName}`);
}

function getUsersOfRole(roleName) {
    return fetchWrapper.get(`${baseUrl}/GetUsersOfRole/${roleName}`);
}

function getRolesOfUser(userName) {
    return fetchWrapper.get(`${baseUrl}/GetRolesOfUser/${userName}`);
}
