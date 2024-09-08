import {Reducer} from 'redux';
import {ActionType} from "../types/ActionTypes";
import {
    ClearFilterAction,
    SetFilterAddTagInclusionAction,
    SetFilterByVideoStateAction, SetFilterRemoveTagInclusionAction,
    SetFilterSearchByTitleAction,
    SetFilterSortByAction, SetSearchByTypeAction
} from "../types/FilterActionsTypes";
import {GetVideosAction} from "../types/YoutubeActionsTypes";
import {Filter, InclusionType, SortByOption, VideoListType, VideoSearchBy, VideoState} from "../types/generatedTypes";

export const initialState: Filter = {
    finished: true,
    notStarted: true,
    started: true,
    searchByNote: true,
    searchByTitle: false,
    searchByDescription: false,
    title: "",
    sortBy: SortByOption.NEWEST,
    excludeTags: [],
    includeTags: []
};

type FilterAction =
    SetFilterByVideoStateAction
    | SetFilterSortByAction
    | SetFilterSearchByTitleAction
    | SetFilterAddTagInclusionAction
    | SetFilterRemoveTagInclusionAction
    | ClearFilterAction
    | GetVideosAction
    | SetSearchByTypeAction;


const filterReducer: Reducer<Filter> = (state: Filter = initialState, action: FilterAction):Filter => {
    const newState: Filter = {
        ...state
    };
    switch (action.type) {
        case ActionType.SET_FILTER_BY_VIDEO_STATE:
            switch (action.payload.videoState) {
                case VideoState.FINISHED:
                    newState.finished = action.payload.show;
                    break;
                case VideoState.NOT_STARTED:
                    newState.notStarted = action.payload.show;
                    break;
                case VideoState.STARTED:
                    newState.started = action.payload.show;
                    break;
            }
            return newState;
        case ActionType.SET_SEARCH_BY_TYPE:
            switch (action.payload.videoSearchBy) {
                case VideoSearchBy.TITLE:
                    newState.searchByTitle = action.payload.show;
                    break;
                case VideoSearchBy.DESCRIPTION:
                    newState.searchByDescription = action.payload.show;
                    break;
                case VideoSearchBy.NOTE:
                    newState.searchByNote = action.payload.show;
                    break;
            }
            return newState;
        case ActionType.SET_FILTER_SORT_BY:
            newState.sortBy = action.payload.sortByOption;
            return newState;
        case ActionType.SET_FILTER_SEARCH_BY_TITLE:
            newState.title = action.payload.title;
            return newState;
        case ActionType.SET_FILTER_ADD_TAG_INCLUSION:
            if(action.payload.inclusionType===InclusionType.INCLUDE) {
                state.includeTags.push(action.payload.tag);
                newState.includeTags = state.includeTags;
            }else{
                state.excludeTags.push(action.payload.tag);
                newState.excludeTags = state.excludeTags;
            }
            return newState;
        case ActionType.SET_FILTER_REMOVE_TAG_INCLUSION:
            if(action.payload.inclusionType===InclusionType.INCLUDE) {
                newState.includeTags = state.includeTags.filter((tagName)=>tagName!==action.payload.tag);
            }else{
                newState.excludeTags = state.excludeTags.filter((tagName)=>tagName!==action.payload.tag);
            }
            return newState;
        case ActionType.CLEAR_FILTER:
            newState.title = "";
            newState.excludeTags = [];
            newState.includeTags = [];
            newState.finished = true;
            newState.notStarted = true;
            newState.started = true;
            if (action.payload.videoListType === VideoListType.TAG) {
                newState.sortBy = SortByOption.ADDED_FIRST;
            } else if (action.payload.videoListType === VideoListType.CONTINUE_WATCHING) {
                newState.sortBy = SortByOption.WATCHED_FIRST;
            } else {
                newState.sortBy = SortByOption.NEWEST;
            }
            return newState;
        case ActionType.GET_VIDEOS:
            if(action.payload.filter) {
                return action.payload.filter;
            }else{
                return initialState;
            }
        default:
            return state;
    }
};

export default filterReducer;