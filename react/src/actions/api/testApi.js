import axios from 'axios';

export function getPreviewApi(url) {
    return axios.get(url).then(res => {
        // console.log("note read", res.data);
        return res;
    }).catch(function (error) {
        // getPanelsNotLoggedIn();
    });
}