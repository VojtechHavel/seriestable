import {Action} from "redux";
import {ActionType} from "./ActionTypes";
import State from "./State";
import {Tag} from "./generatedTypes";

export interface AddTagAction extends Action {
    type: ActionType.ADD_TAG
    payload: {
        tag: string,
        addTagState: State
    }
}

export interface RemoveTagAction extends Action {
    type: ActionType.REMOVE_TAG
    payload: {
        tag: string
    }
}

export interface EditTagAction extends Action {
    type: ActionType.EDIT_TAG
    payload: {
        tag: string,
        newTag: Tag
    }
}
