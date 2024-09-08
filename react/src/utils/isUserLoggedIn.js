import {SHARE_MODES} from "../config/ShareModes";

export const isUserLoggedIn = (getState) => {
    if (getState().user !== false && getState().user !== null) {
        return true
    }
    else {
        return false;
    }
};


export const canUserEdit = (getState) => {
    return ((isUserLoggedIn(getState) && getState().sharing.shareMode!==SHARE_MODES.READ)|| (getState().sharing.shareMode===SHARE_MODES.EDIT));
};