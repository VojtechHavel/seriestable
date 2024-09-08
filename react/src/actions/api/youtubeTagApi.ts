import axios from "axios";
import {API_URL} from "../../config/apiUrl";
import {Tag, VideoListPageResponse} from "../../types/generatedTypes";

const URL_START = API_URL + '/api/youtube/tags/';

export function callAddTag(name: string) {
    return axios.post(URL_START, {name}).then(res => {
        return res.data;
    })
}

export function callRemoveTag(tag: string) {
    return axios.delete(URL_START + tag).then(res => {
        return res.data;
    })
}

export function callEditTag(newTag: Tag, tag: string) {
    return axios.put(URL_START+tag, {newTag}).then(res => {
        return res.data;
    })
}

export function callGetTag(tag: string): Promise<VideoListPageResponse> {
    return axios.get(URL_START + tag).then(res => {
        return res.data;
    })
}


export function callAddTagToVideo(videoId: string, tagName: string) {
    return axios.post(URL_START + tagName + "/videos", {videoId}).then(res => {
        return res.data;
    })
}

export function callAddTagToVideos(videoIds: string[], tagName: string) {
    return axios.post(URL_START + tagName + "/videos/multiple", {videoIds}).then(res => {
        return res.data;
    })
}

export function callAddPlaylistToTag(playlist: string, tagName: string) {
    console.log("add playlist to tag");
    return axios.post(URL_START + tagName + "/playlist", {playlist}).then(res => {
        return res.data;
    })
}

export function callRemoveTagFromVideo(videoId: string, tagName: string) {
    return axios.delete(URL_START + tagName + "/videos/"+videoId).then(res => {
        return res.data;
    })
}