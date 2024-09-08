import * as React from 'react';
import "./VideoTileView.scss"
import autobind from 'class-autobind';


import {Video} from "../../types/generatedTypes";
import VideoTileView from "./VideoTileView";
import {connect} from "react-redux";
import {
    addTagToVideo,
    markAsFinished,
    markAsNotStarted,
    removeTagFromVideo,
    stopRecommending
} from "../../actions/youtubeActions";
import {AppState} from "../../store/rootReducer";
import {UserState} from "../../types/UserState";
import {VISITOR_ROLE} from "../../actions/userActions";
import {TagState} from "../../store/tagReducer";
import AddFormView from "../util/AddFormView";
import Modal from "../util/Modal";
import {toast} from "react-toastify";
import {addTag} from "../../actions/tagActions";
import {ComponentClass} from "react";
import {RouterProps, withRouter} from "react-router";
import {VideoListState} from "../../types/VideoListState";

export interface VideoTileProps {
    video: Video,
    className?: string
}

interface DispatchProps {
    markAsNotStarted: (videoId: string) => any,
    markAsFinished: (videoId: string) => any,
    stopRecommending: (videoId: string) => any,
    removeTagFromVideo: any,
    addTagToVideo: any,
    addTag: (tag: string) => any
}

interface StateProps {
    userState: UserState,
    tagState: TagState,
    videoListState: VideoListState
}

export interface VideoTileViewState {
    showAddTagModal: boolean
}

class VideoTile extends React.Component<VideoTileProps & DispatchProps & StateProps & RouterProps, VideoTileViewState> {

    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            showAddTagModal: false
        }
    }


    public render() {
        return [
            <VideoTileView
                key="video-tile-view"
                className={this.props.className}
                showMenu={this.props.userState.role !== VISITOR_ROLE}
                removeTagFromVideo={this.props.removeTagFromVideo}
                markAsNotStarted={this.props.markAsNotStarted}
                stopRecommending={this.props.stopRecommending}
                showAddTagForm={this.showAddTagForm}
                video={this.props.video}
                tags={this.props.tagState.tags}
                addTagToVideo={this.props.addTagToVideo}
                videoListType={this.props.videoListState.videoListType}
                markAsFinished={this.props.markAsFinished}
            />,
            <Modal
                key="AddTagModalFromVideo"
                onClose={this.handleCloseAddTagModal}
                showModal={this.state.showAddTagModal}>
                <AddFormView
                    placeholder={"Tag name"}
                    title={"Add tag"}
                    processing={this.props.tagState.addTagState}
                    onSubmit={this.addTag}/>
            </Modal>
        ];
    }


    // Add tag modal
    private handleCloseAddTagModal() {
        this.setState({
            showAddTagModal: false
        })
    }

    private showAddTagForm() {
        if (this.props.userState !== null) {
            this.setState({
                showAddTagModal: true
            })
        } else {
            toast.info("To add tag, Sign up!");
            this.props.history.push('/signup')
        }
    }

    private addTag(tag) {
        this.props.addTag(tag).finally(() => {
            this.setState({
                showAddTagModal: false
            })
        });
    }
}


const mapStateToProps = (appState: AppState) => {
    return {
        userState: appState.userState,
        tagState: appState.tagState,
        videoListState: appState.videoListState
    };
};

export default withRouter(connect<StateProps, DispatchProps, VideoTileProps>(mapStateToProps, {
    addTag,
    removeTagFromVideo,
    addTagToVideo,
    markAsNotStarted,
    markAsFinished,
    stopRecommending
})(VideoTile) as any) as ComponentClass<VideoTileProps>