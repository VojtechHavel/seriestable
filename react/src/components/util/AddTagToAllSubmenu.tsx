import {Item, Submenu} from "react-contexify";
import {Tag, Video} from "../../types/generatedTypes";
import {MenuItemEventHandler} from "react-contexify/lib/types";
import {TagIconAndName} from "./TagIconAndName";
import * as React from "react";
import {connect} from "react-redux";
import {AppState} from "../../store/rootReducer";
import {addTagToVideos} from "../../actions/youtubeActions";
import {TagState} from "../../store/tagReducer";

interface DispatchProps {
    addTagToVideos: (videoIds: string[], tag: string) => any
}

interface StateProps {
    tagState: TagState
}

interface AddTagSubmenuProps {
    videos: Video[],
}

export const AddTagSubmenu = (props: AddTagSubmenuProps & StateProps & DispatchProps) => {

    return (<Submenu label="Add tag to filtered">
        {props.tagState.tags.map((tag: Tag) => {
            return <Item
                key={"submenu-tag-" + tag.name}
                onClick={(e: MenuItemEventHandler) => {
                    props.addTagToVideos(props.videos.filter(video => !video.tags.includes(tag.name)).map(video => video.youtubeId), tag.name);
                }}
            ><TagIconAndName tag={tag}/></Item>
        })}
    </Submenu>)
};

const mapStateToProps = (appState: AppState) => {
    return {
        tagState: appState.tagState
    };
};

export default connect<StateProps, DispatchProps, AddTagSubmenuProps>(mapStateToProps, {
    addTagToVideos
})(AddTagSubmenu)