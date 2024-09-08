import * as React from "react";
import {RouteComponentProps} from "react-router";
import {
    callGetVideo,
} from "../../actions/api/youtubeApi";
import autobind from 'class-autobind';
import VideoPageView from "./VideoPageView";
import Loading from "../util/Loading";
import {connect} from "react-redux";
import {AppState} from "../../store/rootReducer";
import {getRecommendedVideos, markAsFinished, markAsNotStarted, updateTimeWatched} from "../../actions/youtubeActions";
import {UserState} from "../../types/UserState";
import {VISITOR_ROLE} from "../../actions/userActions";
import {Video} from "../../types/generatedTypes";

interface VideoPageProps extends RouteComponentProps<any> {

}

interface DispatchProps {
    markAsNotStarted: (youtubeId:string)=>any,
    markAsFinished: (youtubeId:string)=>any,
    getRecommendedVideos: (youtubeId:string)=>any,
    updateTimeWatched: (youtubeId:string, timeWatched: number)=>any,
}

interface VideoPageState {
    video: Video,
    loading: boolean,
    isVisitor: boolean
}

interface StateProps {
    userState: UserState
}

class VideoPage extends React.Component<VideoPageProps & DispatchProps & StateProps, VideoPageState> {
    constructor(props) {
        super(props);
        document.title = "Video | Videomark.app";

        this.state = {
            loading: true,
            isVisitor: this.props.userState.role===VISITOR_ROLE,
            video: {} as Video
        };
        console.log("ChannelPage props", props);
        const videoId = this.props.match.params.id;
        this.loadVideo(videoId);
        autobind(this);
    }

    public render() {
        if(this.state.loading){
            return <Loading/>
        }else {
            document.title = this.state.video.title + " | Videomark.app";

            return <VideoPageView
                isVisitor={this.state.isVisitor}
                video={this.state.video}
                changeWatchedTime={this.changeWatchedTime}
                markAsFinished={this.markAsFinished}
                markAsNotStarted={this.markAsNotStarted}
            />;
        }
    }

    public componentDidUpdate(prevProps) {
        if(this.props.match.params.id!==prevProps.match.params.id){
            this.loadVideo(this.props.match.params.id);
        }
    }

    private changeWatchedTime(timeWatched){
        if(!this.state.isVisitor) {
            this.props.updateTimeWatched(this.state.video.youtubeId, timeWatched);
        }
        this.state.video.timeWatched = timeWatched;
        this.setState({
            video: this.state.video
        })
    }

    private markAsFinished(){
        if(!this.state.isVisitor) {
            this.props.markAsFinished(this.state.video.youtubeId);
        }
        this.state.video.finishedAt = new Date().getTime();
        this.setState({
            video: {...this.state.video}
        });
        this.props.getRecommendedVideos(this.state.video.youtubeId);
    }

    private markAsNotStarted(){
        if(!this.state.isVisitor) {
            this.props.markAsNotStarted(this.state.video.youtubeId);
        }
        this.state.video.finishedAt = null;
        this.setState({
            video: {...this.state.video}
        })
    }

    private loadVideo(videoId) {
        callGetVideo(videoId).then((data: Video) => {
            console.log("result", data);
            this.setState({
                loading: false,
                video: data
            });
        })
    }
}

const mapStateToProps = ({userState}: AppState) => {
    return {
        userState,
    };
};

export default connect<StateProps, DispatchProps, VideoPageProps>(mapStateToProps, {getRecommendedVideos, markAsNotStarted, markAsFinished, updateTimeWatched})(VideoPage)