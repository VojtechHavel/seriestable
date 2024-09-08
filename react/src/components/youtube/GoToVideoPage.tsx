import * as React from "react";
import autobind from 'class-autobind';
import State from "../../types/State";
import AddFormView from "../util/AddFormView";
import {connect} from "react-redux";
import {RouterProps, withRouter} from "react-router";
import {AppState} from "../../store/rootReducer";
import {UserState} from "../../types/UserState";
import "./GoToVideoPage.scss"
import {getVideoId} from "../../utils/getVideoId";
import {toast} from "react-toastify";

interface YoutubeOverviewState {
}

interface GoToVideoPageProps extends RouterProps {
}

interface ConnectedProps {
    userState: UserState
}

class GoToVideoPage extends React.Component<GoToVideoPageProps & ConnectedProps, YoutubeOverviewState> {

    constructor(props) {
        super(props);
        document.title = "Go to video | Videomark.app";

        autobind(this);
    }


    public render() {
        console.log("rerender GoToVideoPage");

        const goToVideo = (value: string) => {
            const videoId = getVideoId(value);
            if(videoId===null){
                toast.error("Video was not found");
            }else{
                this.props.history.push('/youtube/videos/' + videoId)
            }
        };

        return [
            <div key="GoToVideoPage" className="container" id="go-to-video">
                <div className={"page-section page-header"}><h1>Video</h1></div>
                <div className="page-section video-form">
                    <div className={"row"}>
                        <AddFormView
                            placeholder={"Video URL"}
                            title={"Go to video"}
                            processing={State.INITIAL}
                            onSubmit={goToVideo}/>
                    </div>
                </div>
            </div>,
        ];
    }
}

const mapStateToProps = ({userState}: AppState) => {
    return {
        userState
    };
};

export default withRouter(connect(mapStateToProps, {})(GoToVideoPage) as any);