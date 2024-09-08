import axios from 'axios';
import {API_URL} from "../../config/apiUrl";
import {
    CategoriesPageResponse,
    Channel,
    ChannelVideosLoad,
    VideoListPageResponse
} from "../../types/generatedTypes";

export function callGetCategory(categoryName: string): Promise<VideoListPageResponse> {
    return axios.get(API_URL + '/api/youtube/categories/'+categoryName).then(res => {
        return res.data;
    })
}

export function callGetContinueWatchingVideos(): Promise<VideoListPageResponse> {
    return axios.get(API_URL + '/api/youtube/videos/continue-watching').then(res => {
        return res.data;
    })
}

export function callGetRecommendedVideos(videoYoutubeId: string): Promise<VideoListPageResponse> {
    return axios.get(API_URL + '/api/youtube/recommended/videos/'+videoYoutubeId).then(res => {
        return res.data;
    })
}

export function callGetNewVideos(): Promise<VideoListPageResponse> {
    return axios.get(API_URL + '/api/youtube/videos/new').then(res => {
        return res.data;
    })
}

export function callGetNotesPage(): Promise<VideoListPageResponse> {
    return axios.get(API_URL + '/api/youtube/videos/notes').then(res => {
        return res.data;
    })
}

export function callGetChannelPage(channelId: string): Promise<VideoListPageResponse>{
    return axios.get(API_URL + '/api/youtube/channels/'+channelId).then(res => {
        return res.data;
    })
}

export function callGetChannelLoadById(channelId: string): Promise<ChannelVideosLoad>{
    return axios.get(API_URL + '/api/youtube/channels/'+channelId + "/load").then(res => {
        return res.data;
    })
}

export function callReloadChannelImage(channelId: string): Promise<string>{
    return axios.post(API_URL + '/api/youtube/channels/'+channelId + "/reload-image").then(res => {
        return res.data;
    })
}

export function callGetRecommendedChannels(){

    return axios.get(API_URL + '/api/youtube/channels/recommended').then(res => {
        return res.data;
    })
}

export function callGetCategoriesPage(): Promise<CategoriesPageResponse>{

    return axios.get(API_URL + '/api/youtube/categories').then(res => {
        return res.data;
    })
}

export type addChannelToCategoryFunction = (categoryName: string, channel: string) => any;

export function callAddChannelToCategory(categoryName: string, channelUrl: string): Promise<Channel>{
    return axios.post(API_URL + '/api/youtube/categories/'+categoryName, {channelUrl}).then(res =>{
        return res.data;
    });
}

export function callAddCategory(categoryName: string){
    return axios.post(API_URL + '/api/youtube/categories/', {categoryName});
}

export function callRemoveCategory(categoryName: string){
    return axios.delete(API_URL + '/api/youtube/categories/'+categoryName);
}

export function callRenameCategory(oldCategoryName: string, newName){
    return axios.put(API_URL + '/api/youtube/categories/'+oldCategoryName, {newName});
}

export function callRemoveChannelFromCategory(categoryName: string, channelName: string){
    return axios.delete(API_URL + '/api/youtube/categories/'+categoryName +"/"+channelName).then(res => {
        return res.data;
    })
}

export function callStopRecommendingChannel(channelName: string){
    return axios.delete(API_URL + '/api/youtube/recommended/channels/'+channelName).then(res => {
        return res.data;
    })
}

export function callMarkAsFinished(videoId){
    return axios.post(API_URL + '/api/youtube/videos/'+videoId + "/finished").then(res => {
        return res.data;
    })
}

export function callMarkAsNotStarted(videoId){
    return axios.post(API_URL + '/api/youtube/videos/'+videoId + "/not-started").then(res => {
        return res.data;
    })
}

export function callStopRecommendingVideo(videoId){
    return axios.delete(API_URL + '/api/youtube/recommended/videos/'+videoId);
}

export function callGetVideo(videoId){
    console.log("calling callGetToWatched");
    return axios.get(API_URL + '/api/youtube/videos/'+videoId).then(res => {
        return res.data;
    })
}

export function callUpdateNote(videoId, note){
    return axios.put(API_URL + '/api/youtube/videos/'+videoId+"/note", {note}).then(res => {
        return res.data;
    })
}

export function callUpdateTimeWatched(videoId, timeWatched){
    return axios.put(API_URL + '/api/youtube/videos/'+videoId+"/time-watched", {timeWatched}).then(res => {
        return res.data;
    })
}

export function callUpdateBookmarks(videoId, bookmarks){
    return axios.put(API_URL + '/api/youtube/videos/'+videoId+"/bookmarks", {bookmarks}).then(res => {
        return res.data;
    })
}