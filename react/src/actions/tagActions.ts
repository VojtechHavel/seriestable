// ACTION CREATORS
import {ActionType} from "../types/ActionTypes";
import {AddTagAction, RemoveTagAction, EditTagAction} from "../types/TagActionsTypes";
import State from "../types/State";
import {AppState} from "../store/rootReducer";
import {Tag} from "../types/generatedTypes";
import {callAddTag, callEditTag, callRemoveTag} from "./api/youtubeTagApi";


// ACTION CREATORS
export const addTagAction = (state: State, tag: string): AddTagAction => ({
    type: ActionType.ADD_TAG,
    payload: {
        tag,
        addTagState: state
    }
});

export const removeTagAction = (tag: string): RemoveTagAction => ({
    type: ActionType.REMOVE_TAG,
    payload: {
        tag
    }
});

export const editTagAction = (tag: string, newTag: Tag): EditTagAction => ({
    type: ActionType.EDIT_TAG,
    payload: {
        tag,
        newTag
    }
});

// BUSINESS LOGIC
export const addTag = (tag: string) => (dispatch, getState: () => AppState) => {
    dispatch(addTagAction(State.PROCESSING, ""));

    return callAddTag(tag).then(
        (data) => {
            dispatch(addTagAction(State.OK, tag));
        }
    ).catch(e => {
        dispatch(addTagAction(State.ERROR, ""));
    });
};

export const removeTag = (tag: string) => (dispatch, getState: () => AppState) => {
    return callRemoveTag(tag).then(
        (data) => {
            dispatch(removeTagAction(tag));
        }
    )
};

export const editTag = (newTag: Tag, tag: string) => (dispatch, getState: () => AppState) => {
    newTag.key = newTag.name+"Key";
    return callEditTag(newTag, tag).then(
        (data) => {
            // toast.success("Tag renamed.");
            return dispatch(editTagAction(tag, newTag));
        }
    )
};