import {Action} from "redux";
import {ActionType} from "./ActionTypes";
import {UserSettings} from "./generatedTypes";

export interface LoginUserAction extends Action {
    type: ActionType.LOGIN_USER
    payload: { userSettings: UserSettings}
}

export interface ChangeUserEmailAction extends Action {
    type: ActionType.CHANGE_USER_EMAIL
    payload: {
        email: string
    }
}

export interface ChangePasswordAction extends Action {
    type: ActionType.CHANGE_PASSWORD
}

export interface ChangeUserNameAction extends Action {
    type: ActionType.CHANGE_USER_NAME
    payload: {
        name: string
    }
}

export interface ChangePageSizeAction extends Action {
    type: ActionType.CHANGE_PAGE_SIZE
    payload: {
        pageSize: number
    }
}

export interface ChangeRememberFiltersAction extends Action {
    type: ActionType.CHANGE_REMEMBER_FILTERS
    payload: {
        remember: boolean
    }
}
