// ACTION CREATORS
import {ActionType} from "../types/ActionTypes";
import {AppState} from "../store/rootReducer";
import {
    SetFilterByVideoStateAction,
    SetFilterAddTagInclusionAction,
    SetFilterSearchByTitleAction,
    SetFilterSortByAction, SetFilterAction, SetFilterRemoveTagInclusionAction, ClearFilterAction, SetSearchByTypeAction
} from "../types/FilterActionsTypes";
import {Filter, InclusionType, SortByOption, VideoListType, VideoSearchBy, VideoState} from "../types/generatedTypes";
import {
    callAddTagInclusion,
    callClearFilter,
    callRemoveTagInclusion,
    callSetSortBy, callSetVideoSearchBy,
    callSetVideoState
} from "./api/filterApi";
import {VISITOR_ROLE} from "./userActions";


// ACTION CREATORS
export const setFilterByVideoStateAction = (show: boolean, videoState: VideoState): SetFilterByVideoStateAction => ({
    type: ActionType.SET_FILTER_BY_VIDEO_STATE,
    payload: {
        show,
        videoState
    }
});

export const setSearchByTypeAction = (show: boolean, videoSearchBy: VideoSearchBy): SetSearchByTypeAction => ({
    type: ActionType.SET_SEARCH_BY_TYPE,
    payload: {
        show,
        videoSearchBy
    }
});

// ACTION CREATORS
export const setFilterSortByAction = (sortByOption: SortByOption): SetFilterSortByAction => ({
    type: ActionType.SET_FILTER_SORT_BY,
    payload: {
        sortByOption
    }
});

export const setFilterSearchByValueAction = (title: string): SetFilterSearchByTitleAction => ({
    type: ActionType.SET_FILTER_SEARCH_BY_TITLE,
    payload: {
        title
    }
});

export const setFilterAction = (filter: Filter): SetFilterAction => ({
    type: ActionType.SET_FILTER,
    payload: {
        filter
    }
});

export const setFilterAddTagInclusion = (tag: string, inclusionType: InclusionType): SetFilterAddTagInclusionAction => ({
    type: ActionType.SET_FILTER_ADD_TAG_INCLUSION,
    payload: {
        tag,
        inclusionType
    }
});

export const clearFilterAction = (videoListType: VideoListType): ClearFilterAction => ({
    type: ActionType.CLEAR_FILTER,
    payload: {
        videoListType
    }
});

export const setFilterRemoveTagInclusion = (tag: string, inclusionType: InclusionType): SetFilterRemoveTagInclusionAction => ({
    type: ActionType.SET_FILTER_REMOVE_TAG_INCLUSION,
    payload: {
        tag,
        inclusionType
    }
});

// BUSINESS LOGIC

function shouldCallRest(getState: () => AppState) {
    if(getState().userState.role===VISITOR_ROLE){
        return false;
    }else{
        return getState().userState.rememberFilters;
    }
}

export const setVideoState = (videoState: VideoState, show: boolean) => (dispatch, getState: () => AppState) => {
    if(shouldCallRest(getState)) {
        callSetVideoState(getState().videoListState.videoListType, getState().videoListState.id, videoState, show);
    }
    dispatch(setFilterByVideoStateAction(show, videoState))
};

export const setSortBy = (sortByOption: SortByOption) => (dispatch, getState: () => AppState) => {
    if(shouldCallRest(getState)) {
        callSetSortBy(getState().videoListState.videoListType, getState().videoListState.id, sortByOption);
    }
    dispatch(setFilterSortByAction(sortByOption))
};



export const setSearchByType = (videoSearchBy: VideoSearchBy, show: boolean) => (dispatch, getState: () => AppState) => {
    if(shouldCallRest(getState)) {
        callSetVideoSearchBy(getState().videoListState.videoListType, getState().videoListState.id, videoSearchBy, show);
    }
    dispatch(setSearchByTypeAction(show, videoSearchBy))
};

export const setSearchByValue = (title: string) => (dispatch, getState: () => AppState) => {
    dispatch(setFilterSearchByValueAction(title))
};

export const addTagInclusion = (tag: string, inclusionType: InclusionType) => (dispatch, getState: () => AppState) => {
    if(shouldCallRest(getState)) {
        callAddTagInclusion(getState().videoListState.videoListType, getState().videoListState.id, inclusionType, tag);
    }
    dispatch(setFilterAddTagInclusion(tag, inclusionType))
};

export const clearFilter = () => (dispatch, getState: () => AppState) => {
    console.log("clear filter");
    if(shouldCallRest(getState)) {
        callClearFilter(getState().videoListState.videoListType, getState().videoListState.id);
    }
    dispatch(clearFilterAction(getState().videoListState.videoListType))
};

export const removeTagInclusion = (tag: string, inclusionType: InclusionType) => (dispatch, getState: () => AppState) => {
    if(shouldCallRest(getState)) {
        callRemoveTagInclusion(getState().videoListState.videoListType, getState().videoListState.id, inclusionType, tag);
    }
    dispatch(setFilterRemoveTagInclusion(tag, inclusionType))
};