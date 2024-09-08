import axios from 'axios';
import {API_URL} from "../../config/apiUrl";

export function sendFeedback(email, body){
    const data = {
        email,body
    };
    return axios.post(API_URL + '/api/feedback', data)
}