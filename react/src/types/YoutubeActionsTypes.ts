import {Action} from "redux";
import {ActionType} from "./ActionTypes";
import {VideoListState} from "./VideoListState";
import {Filter} from "./generatedTypes";

export interface GetVideosPayload{
    videoListState: VideoListState,
    filter: Filter | null
}

export interface GetVideosAction extends Action {
    type: ActionType.GET_VIDEOS
    payload: GetVideosPayload
}

export interface MarkAsNotStartedAction extends Action {
    type: ActionType.MARK_AS_NOT_STARTED
    payload: {
        videoId: string
    }
}

export interface StopRecommendingVideoAction extends Action {
    type: ActionType.STOP_RECOMMENDING_VIDEO
    payload: {
        videoId: string
    }
}

export interface MarkAsFinishedAction extends Action {
    type: ActionType.MARK_AS_FINISHED
    payload: {
        videoId: string
    }
}

export interface UpdateTimeWatchedAction extends Action {
    type: ActionType.UPDATE_TIME_WATCHED
    payload: {
        videoId: string,
        timeWatched: number
    }
}

export interface UpdateNoteAction extends Action {
    type: ActionType.UPDATE_NOTE
    payload: {
        videoId: string,
        note: string
    }
}

export interface RemoveTagFromVideoAction extends Action {
    type: ActionType.REMOVE_TAG_FROM_VIDEO
    payload: {
        tag: string,
        videoId: string
    }
}

export interface AddTagToVideoAction extends Action {
    type: ActionType.ADD_TAG_TO_VIDEO
    payload: {
        tag: string,
        videoId: string
    }
}

export interface AddTagToVideosAction extends Action {
    type: ActionType.ADD_TAG_TO_VIDEOS
    payload: {
        tag: string,
        videoIds: string[]
    }
}