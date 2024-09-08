import history from "../utils/history";
import {
    callChangeEmail,
    callChangePageSize,
    callChangePassword, callChangeRememberFilters,
    callChangeUsername,
    callForgotPassword,
    callGetUserInfo,
    callLogin,
    callLogout,
    callResetPassword,
    callSignup
} from "./api/userApi";
import {toast} from 'react-toastify';
import {clearToken, saveApiToken} from "./auth/axiosUtils";
import {saveState} from "../utils/localStorage";
import {ActionType} from "../types/ActionTypes";
import {UserState} from "../types/UserState";
import {
    ChangePageSizeAction,
    ChangePasswordAction,
    LoginUserAction,
    ChangeUserEmailAction,
    ChangeUserNameAction, ChangeRememberFiltersAction
} from "../types/UserActionsTypes";
import {AppState} from "../store/rootReducer";
import State from "../types/State";
import {UserSettings} from "../types/generatedTypes";

// ACTION CREATORS
export const loginUserAction = (userSettings: UserSettings): LoginUserAction => ({
    type: ActionType.LOGIN_USER,
    payload: {
        userSettings
    }
});

export const changePasswordAction = (): ChangePasswordAction => ({
    type: ActionType.CHANGE_PASSWORD
});

export const changeUserEmailAction = (email:string): ChangeUserEmailAction => ({
    type: ActionType.CHANGE_USER_EMAIL,
    payload: {
        email
    }
});

export const changeUserNameAction = (name: string): ChangeUserNameAction => ({
    type: ActionType.CHANGE_USER_NAME,
    payload: {
        name
    }
});


export const changePageSizeAction = (pageSize: number): ChangePageSizeAction => ({
    type: ActionType.CHANGE_PAGE_SIZE,
    payload: {
        pageSize
    }
});

export const changeRememberFiltersAction = (remember: boolean): ChangeRememberFiltersAction => ({
    type: ActionType.CHANGE_REMEMBER_FILTERS,
    payload: {
        remember
    }
});

const logoutUserAction = () => ({
    type: ActionType.LOGOUT
});

export const resetStoreAction = () => ({
    type: ActionType.RESET_STORE
});

// BUSINESS LOGIC
export const logout = () => (dispatch) => {
    localStorage.clear();

        callLogout().then((response) => {
            clearToken();

            console.log("logout success");
        }).catch(error => {
            console.log("logout error", error);
            // throw handleError(error);
        }).finally(()=>{
            dispatch(logoutUserAction());
            dispatch(loginAsVisitor());
        });

    history.push("/");
    toast.success("You've been logged out!");
};

export const getUserInfo = () => (dispatch) => {
    callGetUserInfo().then(
        (data) => {
            dispatch(loginUserAction(data));
        }
    ).catch(() => {
        dispatch(logout());
    });
};

export const VISITOR_ROLE = "VISITOR";

export const loginAsVisitor = () => (dispatch) => {
    const user: UserState = {
        role: VISITOR_ROLE,
        pageSize: 30,
        state: State.OK,
        apiToken: null,
        email: null,
        hasPassword: null,
        name: null,
        rememberFilters: false
    };
    dispatch(loginUserAction({user, tags: []}));
};


export const login = (email, password) => (dispatch, getState) => {
    return callLogin(email, password).then((response: UserSettings) => {
        dispatch(afterLoginOrSignup(response));
        return response;
    })
};

export const signUp = (name, email, password) => (dispatch) => {
    return callSignup(name, email, password).then((response) => {
        dispatch(afterLoginOrSignup(response));
        return response;
    })
};

export const changePageSize = (pageSize) => (dispatch, getState: () => AppState) => {
    console.log("pageSize", pageSize);
    if(isNaN(pageSize)){
        pageSize=0;
    }else{
        pageSize=Number(pageSize);
    }
    dispatch(changePageSizeAction(pageSize));
    callChangePageSize(pageSize);

};

export const changeRememberFilters = (remeber: boolean) => (dispatch, getState: () => AppState) => {
    dispatch(changeRememberFiltersAction(remeber));
    callChangeRememberFilters(remeber);
};

const afterLoginOrSignup = (response: UserSettings) =>{
    return (dispatch, getState) => {
        console.log("response", response);
        saveApiToken(response.user.apiToken);
        dispatch(loginUserAction(response));
        history.push('/');

    }
};

export const saveStore = () => (dispatch, getState) => {
    console.log("saving store");
    saveState(getState())
};

export const changePassword = (currentPassword, newPassword) => {
    return (dispatch, getState) => {
        return callChangePassword(currentPassword, newPassword).then(() => {
            // toast.success("Password was successfully changed.");
            dispatch(changePasswordAction());
        })
    }
};

export const changeEmail = (currentPassword, email) => {
    return (dispatch) => {
        return callChangeEmail(currentPassword, email).then(
            () => {
                dispatch(changeUserEmailAction(email));
            }
        )
    }
};

export const changeUsername = (name) => {
    return (dispatch) => {
        return callChangeUsername(name)
            .then(() => {
                dispatch(changeUserNameAction(name));
                return null;
            })
    }
};

// after clicking link
export const resetPassword = (token, email, password) => {
    return (dispatch) => {
        return callResetPassword(token, email, password);
    }
};

export const afterLoginAction = (token) => {
    return (dispatch, getState) => {
        saveApiToken(token);
        dispatch(getUserInfo());
    }
};

export const forgotPassword = (email) => {
    return (dispatch) => {
        return callForgotPassword(email);
    }
};