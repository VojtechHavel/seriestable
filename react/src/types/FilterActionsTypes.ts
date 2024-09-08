import {Action} from "redux";
import {ActionType} from "./ActionTypes";
import {Filter, InclusionType, SortByOption, VideoListType, VideoSearchBy, VideoState} from "./generatedTypes";

export interface SetFilterByVideoStateAction extends Action {
    type: ActionType.SET_FILTER_BY_VIDEO_STATE
    payload: {
        videoState: VideoState,
        show: boolean
    }
}

export interface SetSearchByTypeAction extends Action {
    type: ActionType.SET_SEARCH_BY_TYPE
    payload: {
        videoSearchBy: VideoSearchBy,
        show: boolean
    }
}

export interface SetFilterSortByAction extends Action {
    type: ActionType.SET_FILTER_SORT_BY
    payload: {
        sortByOption: SortByOption
    }
}

export interface SetFilterSearchByTitleAction extends Action {
    type: ActionType.SET_FILTER_SEARCH_BY_TITLE
    payload: {
        title: string
    }
}

export interface SetFilterAction extends Action {
    type: ActionType.SET_FILTER
    payload: {
        filter: Filter
    }
}

export interface SetFilterAddTagInclusionAction extends Action {
    type: ActionType.SET_FILTER_ADD_TAG_INCLUSION
    payload: {
        tag: string,
        inclusionType: InclusionType
    }
}

export interface ClearFilterAction extends Action {
    type: ActionType.CLEAR_FILTER,
    payload: {videoListType: VideoListType}
}

export interface SetFilterRemoveTagInclusionAction extends Action {
    type: ActionType.SET_FILTER_REMOVE_TAG_INCLUSION
    payload: {
        tag: string,
        inclusionType: InclusionType
    }
}