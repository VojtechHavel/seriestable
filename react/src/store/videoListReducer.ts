// import { ISetUsername } from '../actions';
import {Reducer} from 'redux';
import {ActionType} from "../types/ActionTypes";
import {VideoListState} from "../types/VideoListState";
import State from "../types/State";
import {
    AddTagToVideoAction, AddTagToVideosAction,
    GetVideosAction,
    MarkAsFinishedAction,
    MarkAsNotStartedAction,
    RemoveTagFromVideoAction, StopRecommendingVideoAction, UpdateNoteAction,
    UpdateTimeWatchedAction
} from "../types/YoutubeActionsTypes";
import {Tag, Video, VideoListType} from "../types/generatedTypes";
import {EditTagAction} from "../types/TagActionsTypes";


export const initialState: VideoListState = {
    state: State.INITIAL,
    videos: [],
    videoListType: VideoListType.INITIAL,
    id: "",
    information: {}
};

type VideoListAction =
    GetVideosAction
    | MarkAsNotStartedAction
    | RemoveTagFromVideoAction
    | MarkAsFinishedAction
    | AddTagToVideoAction
    | EditTagAction
    | StopRecommendingVideoAction
    | UpdateNoteAction
    | AddTagToVideosAction
    | UpdateTimeWatchedAction;

const videoListReducer: Reducer<VideoListState> = (state: VideoListState = initialState, action: VideoListAction):VideoListState => {
    switch (action.type) {
        case ActionType.GET_VIDEOS:
            return {
                videos: action.payload.videoListState.videos,
                state: action.payload.videoListState.state,
                videoListType: action.payload.videoListState.videoListType,
                id: action.payload.videoListState.id,
                information: action.payload.videoListState.information
            };
        case ActionType.MARK_AS_NOT_STARTED:
            return {
                ...state,
                videos: state.videos.filter(video => {
                    return (video.youtubeId !== action.payload.videoId || state.videoListType !== VideoListType.CONTINUE_WATCHING)
                }).map((video):Video => {
                    if (video.youtubeId === action.payload.videoId) {
                        return {...video, finishedAt: null};
                    } else {
                        return video;
                    }
                }),
            };
        case ActionType.MARK_AS_FINISHED:
            return {
                ...state,
                videos: state.videos.filter(video => {
                    return (video.youtubeId !== action.payload.videoId || state.videoListType !== VideoListType.CONTINUE_WATCHING)
                }).map((video: Video):Video => {
                    if (video.youtubeId === action.payload.videoId) {
                        return {...video, finishedAt: new Date().getTime()};
                    } else {
                        return video;
                    }
                }),
            };
        case ActionType.STOP_RECOMMENDING_VIDEO:
            return {
                ...state,
                videos: state.videos.filter(video => {
                    return (video.youtubeId !== action.payload.videoId || state.videoListType !== VideoListType.RECOMMENDED)
                })
            };
        case ActionType.UPDATE_NOTE:
            return {
                ...state,
                videos: state.videos.map(video => {
                    if(video.youtubeId !== action.payload.videoId){
                        return video;
                    }else{
                        video = {...video};
                        video.note = action.payload.note;
                        return video;
                    }
                })
            };
        case ActionType.UPDATE_TIME_WATCHED:
            if(state.videoListType===VideoListType.CONTINUE_WATCHING && !state.videos.some(video => video.youtubeId===action.payload.videoId)){
                // if video list is continue watching and someone just watched video that is not in list - we need to load it
                // but instead we set state to initial so whole page will get loaded
                return initialState;
            }else {
                return {
                    ...state,
                    videos: state.videos.map((video: Video) => {
                        if (video.youtubeId === action.payload.videoId) {
                            return {...video, timeWatched: action.payload.timeWatched};
                        } else {
                            return video;
                        }
                    }),
                };
            }
        case ActionType.REMOVE_TAG_FROM_VIDEO:
            return {
                ...state,
                videos: state.videos.map((video):Video => {
                    if (video.youtubeId === action.payload.videoId) {
                        video.tags = video.tags.filter(tag => {
                            return tag !== action.payload.tag
                        });
                    }
                    return video;
                }).filter(video => {
                    return !(state.videoListType === VideoListType.TAG && state.id === action.payload.tag && video.youtubeId === action.payload.videoId);
                }),
            };
        case ActionType.ADD_TAG_TO_VIDEO:
            return {
                ...state,
                videos: state.videos.map((video):Video  => {
                    if (video.youtubeId === action.payload.videoId) {
                        video.tags.push(action.payload.tag);
                    }
                    return video;
                })
            };
        case ActionType.ADD_TAG_TO_VIDEOS:
            return {
                ...state,
                videos: state.videos.map((video):Video  => {
                    if (action.payload.videoIds.some((videoId)=>videoId===video.youtubeId)) {
                        video.tags.push(action.payload.tag);
                    }
                    return video;
                })
            };
        case ActionType.EDIT_TAG:
            if(state.videoListType!==VideoListType.TAG || state.id!==action.payload.tag){
                return state;
            }else {
                const information: Tag = state.information as Tag;
                information.name = action.payload.newTag.name;
                return {
                    ...state,
                    id: action.payload.newTag.name,
                    information
                };
            }
        default:
            return state;
    }
};

export default videoListReducer;