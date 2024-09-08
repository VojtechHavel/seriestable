// import { ISetUsername } from '../actions';
import {UserState} from '../types/UserState';
import {Reducer} from 'redux';
import {ActionType} from "../types/ActionTypes";
import {
    ChangePageSizeAction,
    ChangePasswordAction,
    LoginUserAction,
    ChangeUserEmailAction,
    ChangeUserNameAction, ChangeRememberFiltersAction
} from "../types/UserActionsTypes";
import State from "../types/State";


export const initialState: UserState = {
    state: State.INITIAL,
    apiToken: null,
    email: null,
    hasPassword: null,
    name: null,
    role: null,
    pageSize: 0,
    rememberFilters: false
};

// Unfortunately, typing of the `action` parameter seems to be broken at the moment.
// This should be fixed in Redux 4.x, but for now, just augment your types.

type UserAction = LoginUserAction | ChangeUserNameAction | ChangeUserEmailAction | ChangePageSizeAction | ChangePasswordAction | ChangeRememberFiltersAction;


const userReducer: Reducer<UserState> = (state: UserState = initialState, action: UserAction):UserState => {
    // We'll augment the action type on the switch case to make sure we have
    // all the cases handled.

        switch (action.type) {
            case ActionType.LOGIN_USER:
                return {
                    ...action.payload.userSettings.user,
                    state: State.OK
                };
            case ActionType.CHANGE_USER_EMAIL:
                return {
                    ...state,
                    email: action.payload.email
                };
            case ActionType.CHANGE_USER_NAME:
                return {
                    ...state,
                    name: action.payload.name
                };
            case ActionType.CHANGE_PASSWORD:
                return {
                    ...state,
                    hasPassword: true
                };
            case ActionType.CHANGE_PAGE_SIZE:
                return {
                    ...state,
                    pageSize: action.payload.pageSize
                };
            case ActionType.CHANGE_REMEMBER_FILTERS:
                return {
                    ...state,
                    rememberFilters: action.payload.remember
                };
            default:
                return state;
        }
};

export default userReducer;