import {Reducer} from 'redux';
import {ActionType} from "../types/ActionTypes";
import State from "../types/State";
import {AddTagAction, EditTagAction, RemoveTagAction} from "../types/TagActionsTypes";
import {Tag} from "../types/generatedTypes";
import {LoginUserAction} from "../types/UserActionsTypes";

export interface TagState {
    tags: Tag[],
    addTagState: State
}

export const initialState: TagState = {
    tags: [],
    addTagState: State.INITIAL
};

type TagAction = RemoveTagAction | AddTagAction | EditTagAction | LoginUserAction;


const tagReducer: Reducer<TagState> = (state: TagState = initialState, action: TagAction): TagState => {
        const newState: TagState = {
            ...state
        };
        switch (action.type) {
            case ActionType.LOGIN_USER:
                newState.tags = action.payload.userSettings.tags;
                return newState;
            case ActionType.ADD_TAG:
                newState.addTagState = action.payload.addTagState;

                if (action.payload.addTagState === State.OK) {
                    newState.tags = [...state.tags, {
                        name: action.payload.tag,
                        key: action.payload.tag + "Key",
                        color: "",
                        icon: ""
                    }]
                }

                return newState;
            case ActionType.REMOVE_TAG:
                return {
                    ...state,
                    tags: state.tags.filter(tag => tag.name !== action.payload.tag)
                };
            case ActionType.EDIT_TAG:
                return {
                    ...state,
                    tags: state.tags.map<Tag>(tag => {
                        if (tag.name === action.payload.tag) {
                            tag = action.payload.newTag;
                        }
                        return tag;
                    })
                };
            default:
                return state;
        }
    }
;

export default tagReducer;