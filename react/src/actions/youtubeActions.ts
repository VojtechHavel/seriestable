import {ActionType} from "../types/ActionTypes";
import {
    AddTagToVideoAction, AddTagToVideosAction,
    GetVideosAction,
    MarkAsFinishedAction,
    MarkAsNotStartedAction,
    RemoveTagFromVideoAction, StopRecommendingVideoAction, UpdateNoteAction,
    UpdateTimeWatchedAction
} from "../types/YoutubeActionsTypes";
import State from "../types/State";
import {Filter, Video, VideoListPageResponse, VideoListType} from "../types/generatedTypes";
import {
    callGetCategory,
    callGetChannelPage,
    callGetContinueWatchingVideos, callGetNewVideos,
    callGetNotesPage, callGetRecommendedVideos,
    callMarkAsFinished,
    callMarkAsNotStarted, callStopRecommendingVideo, callUpdateNote,
    callUpdateTimeWatched
} from "./api/youtubeApi";
import {AppState} from "../store/rootReducer";
// @ts-ignore
import {Information} from "../types/VideoListState";
import {
    callAddPlaylistToTag,
    callAddTagToVideo,
    callAddTagToVideos,
    callGetTag,
    callRemoveTagFromVideo
} from "./api/youtubeTagApi";
import {VISITOR_ROLE} from "./userActions";
import {toast} from 'react-toastify';

// ACTION CREATORS
export const getVideosAction = (videos: Video[], filter: Filter | null, state: State, videoListType: VideoListType, id: string, information: Information): GetVideosAction => ({
    type: ActionType.GET_VIDEOS,
    payload: {
        filter,
        videoListState: {
            videos,
            state,
            videoListType,
            id,
            information
        }
    }
});

export const markAsNotStartedAction = (videoId: string): MarkAsNotStartedAction => ({
    type: ActionType.MARK_AS_NOT_STARTED,
    payload: {
        videoId
    }
});

export const stopRecommendingVideoAction = (videoId: string): StopRecommendingVideoAction => ({
    type: ActionType.STOP_RECOMMENDING_VIDEO,
    payload: {
        videoId
    }
});

export const markAsFinishedAction = (videoId: string): MarkAsFinishedAction => ({
    type: ActionType.MARK_AS_FINISHED,
    payload: {
        videoId
    }
});

export const updateTimeWatchedAction = (videoId: string, timeWatched: number): UpdateTimeWatchedAction => ({
    type: ActionType.UPDATE_TIME_WATCHED,
    payload: {
        videoId,
        timeWatched
    }
});

export const updateNoteAction = (videoId: string, note: string): UpdateNoteAction => ({
    type: ActionType.UPDATE_NOTE,
    payload: {
        videoId,
        note
    }
});

export const removeTagFromVideoAction = (videoId: string, tag: string): RemoveTagFromVideoAction => ({
    type: ActionType.REMOVE_TAG_FROM_VIDEO,
    payload: {
        videoId,
        tag
    }
});

export const addTagToVideoAction = (videoId: string, tag: string): AddTagToVideoAction => ({
    type: ActionType.ADD_TAG_TO_VIDEO,
    payload: {
        videoId,
        tag
    }
});

export const addTagToVideosAction = (videoIds: string[], tag: string): AddTagToVideosAction => ({
    type: ActionType.ADD_TAG_TO_VIDEOS,
    payload: {
        videoIds,
        tag
    }
});

// BUSINESS LOGIC
export const getContinueWatchingVideos = () => (dispatch, getState: () => AppState) => {
    if (getState().videoListState.videoListType === VideoListType.CONTINUE_WATCHING) {
        console.log("Page already loaded");
    } else {
        dispatch(getVideosAction([], null, State.INITIAL, VideoListType.CONTINUE_WATCHING, "", {}));

        callGetContinueWatchingVideos().then(
            (data: VideoListPageResponse) => {
                dispatch(getVideosAction(data.videos, data.filter, State.OK, VideoListType.CONTINUE_WATCHING, "", {}));
            }
        )
    }
};

export const getRecommendedVideos = (youtubeId: string) => (dispatch, getState: () => AppState) => {
    dispatch(getVideosAction([], null, State.PROCESSING, VideoListType.RECOMMENDED, "", {}));

    callGetRecommendedVideos(youtubeId).then(
        (data: VideoListPageResponse) => {
            dispatch(getVideosAction(data.videos, data.filter, State.OK, VideoListType.RECOMMENDED, "", {}));
        }
    )
};

export const getNewVideos = () => (dispatch, getState: () => AppState) => {
    if (getState().videoListState.videoListType === VideoListType.NEW) {
        console.log("Page already loaded");
    } else {
        dispatch(getVideosAction([], null, State.INITIAL, VideoListType.NEW, "", {}));

        callGetNewVideos().then(
            (data: VideoListPageResponse) => {
                dispatch(getVideosAction(data.videos, data.filter, State.OK, VideoListType.NEW, "", {}));
            }
        )
    }
};

export const getNotesVideos = () => (dispatch, getState: () => AppState) => {
    if (getState().videoListState.videoListType === VideoListType.NOTES) {
        console.log("Page already loaded");
    } else {
        dispatch(getVideosAction([], null, State.INITIAL, VideoListType.NOTES, "", {}));

        callGetNotesPage().then(
            (data) => {
                dispatch(getVideosAction(data.videos, data.filter, State.OK, VideoListType.NOTES, "", {}));
            }
        )
    }
};

export const getTag = (tag: string) => (dispatch, getState: () => AppState) => {

    if (getState().videoListState.videoListType === VideoListType.TAG && getState().videoListState.id === tag) {
        console.log("Page already loaded");
    } else {
        dispatch(getVideosAction([], null, State.INITIAL, VideoListType.TAG, tag, {}));
        dispatch(loadTag(tag));
    }
};


export const getChannel = (channelId: string) => (dispatch, getState: () => AppState) => {

    if (getState().videoListState.videoListType === VideoListType.CHANNEL && getState().videoListState.id === channelId && getState().videoListState.state !== State.ERROR) {
        console.log("Page already loaded");
        const pageResponse: VideoListPageResponse = {
            videos: getState().videoListState.videos,
            filter: getState().filterState,
            information: getState().videoListState.information
        };

        // return Promise.resolve(pageResponse);

        return new Promise((resolve)=>resolve(pageResponse));
    } else {
        dispatch(getVideosAction([], null, State.PROCESSING, VideoListType.CHANNEL, channelId, {}));
        return callGetChannelPage(channelId).then((page: VideoListPageResponse) => {
            dispatch(getVideosAction(sortChannelVideos(page.videos), page.filter, State.OK, VideoListType.CHANNEL, channelId, page.information));
            return page
        }, () => {
            dispatch(getVideosAction([], null, State.ERROR, VideoListType.CHANNEL, channelId, new class implements Information {
            }));
        });
    }
};
export const reloadChannel = (channelId: string) => (dispatch, getState: () => AppState) => {
    callGetChannelPage(channelId).then((page) => {
        dispatch(getVideosAction(sortChannelVideos(page.videos), page.filter, State.OK, VideoListType.CHANNEL, channelId, page.information));
    });
};

export const getCategory = (categoryName: string) => (dispatch, getState: () => AppState) => {

    if (getState().videoListState.videoListType === VideoListType.CATEGORY && getState().videoListState.id === categoryName) {
        console.log("Page already loaded");
    } else {
        callGetCategory(categoryName).then(page => {
                dispatch(getVideosAction(page.videos, page.filter, State.OK, VideoListType.CATEGORY, categoryName, page.information));
            }
        )
    }
};

const sortChannelVideos = (videos: Video[]) => {

    function compare(a: Video, b: Video) {
        if (a.publishedAt > b.publishedAt) {
            return -1;
        }
        if (a.publishedAt < b.publishedAt) {
            return 1;
        }
        // a must be equal to b
        return 0;
    }

    return videos.sort(compare);
};

export const markAsNotStarted = (videoId: string) => (dispatch) => {
    dispatch(markAsNotStartedAction(videoId));
    return callMarkAsNotStarted(videoId);
};

export const stopRecommending = (videoId: string) => (dispatch) => {
    dispatch(stopRecommendingVideoAction(videoId));
    return callStopRecommendingVideo(videoId);
};

export const markAsFinished = (videoId: string) => (dispatch) => {
    dispatch(markAsFinishedAction(videoId));
    return callMarkAsFinished(videoId);
};

export const updateTimeWatched = (youtubeId: string, timeWatched: number) => (dispatch) => {
    dispatch(updateTimeWatchedAction(youtubeId, timeWatched));
    return callUpdateTimeWatched(youtubeId, timeWatched);
};

export const removeTagFromVideo = (videoId: string, tag: string) => (dispatch) => {
    dispatch(removeTagFromVideoAction(videoId, tag));
    return callRemoveTagFromVideo(videoId, tag);
};

export const addTagToVideo = (videoUrlOrId: string, tag: string) => (dispatch) => {
    dispatch(addTagToVideoAction(videoUrlOrId, tag));
    return callAddTagToVideo(videoUrlOrId, tag).then(() => {
        // toast.success("New video added to tag "+tag);
    });
};

export const addTagToVideos = (videosIds: string[], tag: string) => (dispatch) => {
    dispatch(addTagToVideosAction(videosIds, tag));
    return callAddTagToVideos(videosIds, tag).then(() => {
        toast.success(videosIds.length + " videos were tagged "+tag);
    });
};

export const addPlaylistToTag = (playlistUrlOrId: string, tag: string) => (dispatch, getState: () => AppState) => {
    dispatch(addTagToVideoAction(playlistUrlOrId, tag));
    return callAddPlaylistToTag(playlistUrlOrId, tag).then(() => {
        dispatch(loadTag(tag));
    })
};

export const addVideoToTag = (videoUrlOrId: string, tag: string) => (dispatch, getState: () => AppState) => {
    dispatch(addTagToVideoAction(videoUrlOrId, tag));
    return callAddTagToVideo(videoUrlOrId, tag).then(() => {
        dispatch(loadTag(tag));
    })
};

const loadTag = (tag: string) => (dispatch) => {
    callGetTag(tag).then((page) => {
        dispatch(getVideosAction(page.videos, page.filter, State.OK, VideoListType.TAG, tag, page.information));
    });
};

export type UpdateNoteSignature = (youtubeId: string, note: string) => any;

export const updateNote: UpdateNoteSignature = (youtubeId: string, note: string) => (dispatch, getState: () => AppState) => {
    if(getState().userState.role!==VISITOR_ROLE){
        dispatch(updateNoteAction(youtubeId, note));
        return callUpdateNote(youtubeId, note);
    }else{
        return;
    }
};