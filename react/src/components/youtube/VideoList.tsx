import * as React from "react";
import {ComponentClass} from "react";
import autobind from 'class-autobind';
import {Video, VideoListType} from "../../types/generatedTypes";
import VideoListView from "./VideoListView";
import State from "../../types/State";
import Loading from "../util/Loading";
import {connect} from "react-redux";
import {RouterProps, withRouter} from "react-router";
import {addTag} from "../../actions/tagActions";
import {AppState} from "../../store/rootReducer";
import {TagState} from "../../store/tagReducer";
import {getVisibleVideos} from "../../store/videoSelector";
import {UserState} from "../../types/UserState";
import {VISITOR_ROLE} from "../../actions/userActions";
import {VideoListState} from "../../types/VideoListState";

interface VideoListComponentState {
    showAddTagModal: boolean
}

export interface VideoListProps {
}

interface ConnectedProps {
    userState: UserState,
    addTag: (tag:string)=>Promise<any>,
    tagState: TagState,
    videoListState: VideoListState,
    videoList: {videos: Video[]}
}

class VideoList extends React.Component<VideoListProps & ConnectedProps & RouterProps, VideoListComponentState> {
    constructor(props) {
        super(props);
        this.state = {
            showAddTagModal: false,
        };
        autobind(this);
    }

    public render() {
        console.log("render VideoList");
        if ((this.props.videoListState.state === State.OK) && this.props.userState.state===State.OK || this.props.userState.role===VISITOR_ROLE) {
            return <div><VideoListView
                videoListType={this.props.videoListState.videoListType}
                pageSize={this.props.videoListState.videoListType===VideoListType.RECOMMENDED?6:this.props.userState.pageSize}
                videos={this.props.videoList.videos}/>
            </div>
                ;
        } else {
            return <Loading/>
        }
    }
}


const mapStateToProps = (appState: AppState) => {
    return {
        userState: appState.userState,
        tagState: appState.tagState,
        videoListState: appState.videoListState,
        videoList: getVisibleVideos(appState),
    };
};
export default withRouter(connect(mapStateToProps, {addTag})(VideoList) as any) as ComponentClass<VideoListProps>