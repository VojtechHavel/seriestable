import axios from "axios";
import {API_URL} from "../../config/apiUrl";
import {InclusionType, SortByOption, VideoListType, VideoSearchBy, VideoState} from "../../types/generatedTypes";

export function callSetSortBy(videoListType: VideoListType, id: string, sortByOption: SortByOption){
    if(!id){
        id="defualt";
    }
    return axios.put(API_URL + '/api/youtube/filters/'+videoListType+'/'+id +"/sort-by/"+sortByOption);
}

export function callSetVideoState(videoListType: VideoListType, id: string, videoState: VideoState, show: boolean){
    if(!id){
        id="defualt";
    }
    return axios.put(API_URL + '/api/youtube/filters/'+videoListType+'/'+id +"/state/"+videoState+"/"+show);
}

export function callSetVideoSearchBy(videoListType: VideoListType, id: string, videoSearchBy: VideoSearchBy, show: boolean){
    if(!id){
        id="defualt";
    }
    return axios.put(API_URL + '/api/youtube/filters/'+videoListType+'/'+id +"/search-by/"+videoSearchBy+"/"+show);
}

export function callAddTagInclusion(videoListType: VideoListType, id: string, inclusionType: InclusionType, tag: string){
    if(!id){
        id="defualt";
    }
    return axios.post(API_URL + '/api/youtube/filters/'+videoListType+'/'+id +"/tags/"+inclusionType+"/"+tag);
}

export function callClearFilter(videoListType: VideoListType, id: string){
    if(!id){
        id="defualt";
    }
    return axios.delete(API_URL + '/api/youtube/filters/'+videoListType+'/'+id);
}

export function callRemoveTagInclusion(videoListType: VideoListType, id: string, inclusionType: InclusionType, tag: string){
    if(!id){
        id="defualt";
    }
    return axios.delete(API_URL + '/api/youtube/filters/'+videoListType+'/'+id +"/tags/"+inclusionType+"/"+tag);
}