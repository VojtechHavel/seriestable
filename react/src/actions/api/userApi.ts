import axios from "axios/index";
import {API_URL} from "../../config/apiUrl";
import {UserSettings} from "../../types/generatedTypes";

export function callLogin(email, password):Promise<UserSettings> {
    const data = {
        email, password
    };
    return axios.post(API_URL + "/api/login", data).then(res => {
        return res.data;
    })
}

export function callSignup(name, email, password):Promise<UserSettings> {
    const data = {
        name, email, password
    };
    return axios.post(API_URL + '/api/signup', data).then(res => {
        return res.data;

    })
}

export function callGetUserInfo():Promise<UserSettings> {
 return axios.get(API_URL + '/api/users/me').then(res => {
    return res.data;
 })
}

export function callLogout() {
    return axios.post(API_URL + '/api/logout');
}

export function callChangePassword(currentPassword, newPassword){
    const data = {
        currentPassword,
        newPassword
    };
    return axios.put(API_URL + '/api/users/me/password', data);
}

export function callChangePageSize(pageSize){
    const data = {
        pageSize
    };
    return axios.put(API_URL + '/api/users/me/pageSize', data);
}

export function callChangeRememberFilters(remember){
    return axios.put(API_URL + '/api/users/me/remember-filters/'+remember);
}

export function callChangeEmail(currentPassword, email){
    const data = {
        currentPassword,
        email
    };
    return axios.put(API_URL + '/api/users/me/email', data);
}

export function callResetPassword(token, email, password){
    const data = {
        password,
        token,
        email
    };

    return axios.post(API_URL + '/api/users/me/reset-password', data);
}

export function callForgotPassword(email){
    const data = {
        email
    };
    return axios.post(API_URL + '/api/users/me/forgot-password', data);
}

export function callChangeUsername(name){
    const data = {
        name
    };
    return axios.put(API_URL + '/api/users/me/name', data);
}