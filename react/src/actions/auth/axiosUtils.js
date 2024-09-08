import axios from "axios/index";
import {logout} from "../userActions";
import store from "../../store/store";
import {toast} from 'react-toastify';

export function clearToken() {
    localStorage.removeItem('apiToken');
    delete axios.defaults.headers.common.Authorization;
}

export function saveApiToken(token) {
    localStorage.setItem('apiToken', token);
    setAuthorizationToken(token);
}

export function setAuthorizationToken(token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
}

axios.interceptors.response.use(function (response) {
    return response;
}, function (error) {

    console.log("error", error);

    if(error.response !== undefined && 500 === error.response.status){
        toast.error("System error occurred. Please try again later.");
        console.log("error", error);
    }
    // if (error.response !== undefined && 401 === error.response.status && error.response.data.error === "Unauthenticated.") {
    else if (error.response !== undefined && 403 === error.response.status && error.response.data.error === "Forbidden") {
        console.log("should logout");
        //if apiToken was not deleted yet we can logout - otherwise logout is probably in progress
        if(localStorage.getItem("apiToken")) {
            store.dispatch(logout());
        }
    }
    else if(error.response !== undefined && 400 === error.response.status && error.response.data.message === "reload"){
        console.log("window.location.host", window.location.host);
        // window.location.href = window.location.host+"?error="+error.response.data.errors["reload"][0];
        window.location.search += '&error='+error.response.data.errors.reload[0];
    }
    else if(error.response !== undefined && 400 === error.response.status && error.response.data.message === "global") {
        toast.error(error.response.data.errors.global[0])
    }else if(error.response !== undefined && 400 === error.response.status && error.response.data.message === "info") {
        toast.info(error.response.data.errors.info[0])
    }
    else if(error.response === undefined) {
        toast.error("Network error occurred. Please try again later.");
        console.log("error", error);
    }
        return Promise.reject(error);

});