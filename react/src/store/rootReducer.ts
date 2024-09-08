import {combineReducers, Reducer} from 'redux'
import userReducer from "./userReducer";
import {ActionType} from "../types/ActionTypes";
import videoListReducer from "./videoListReducer";
import {VideoListState} from "../types/VideoListState";
import {UserState} from "../types/UserState";
import tagReducer, {TagState} from "./tagReducer";
import filterReducer from "./filterReducer";
import {Filter} from "../types/generatedTypes";

export interface AppState {
    userState: UserState,
    videoListState: VideoListState,
    tagState: TagState,
    filterState: Filter
}

const appReducer: Reducer<AppState> = combineReducers({
    userState: userReducer,
    videoListState: videoListReducer,
    tagState: tagReducer,
    filterState: filterReducer
});

const rootReducer = (state, action) => {
    if (action.type === ActionType.LOGOUT || action.type === ActionType.RESET_STORE) {
        state = undefined
    }

    return appReducer(state, action)
};

export default rootReducer