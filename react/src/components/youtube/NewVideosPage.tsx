import * as React from "react";
import autobind from 'class-autobind';
import VideoList from "./VideoList";
import Loading from "../util/Loading";
import {connect} from "react-redux";
import {getNewVideos} from "../../actions/youtubeActions";
import {VideoListState} from "../../types/VideoListState";
import State from "../../types/State";
import {AppState} from "../../store/rootReducer";
import {Item, Menu, MenuProvider} from "react-contexify";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import VideoFilter from "./VideoFilter";
import VideoListStatistics from "./VideoListStatistics";
import {VideoListType} from "../../types/generatedTypes";
import AddTagToAllSubmenu from "../util/AddTagToAllSubmenu";
import {exportAsFile} from "../../utils/exportAsFile";

interface DispatchProps {
    getNewVideos: () => any
}

interface StateProps {
    videoListState: VideoListState,
}

interface NewVideosPageProps {
}

interface NewVideosPageState {
    showFilter: boolean,
    showStatistics: boolean,
}

class NewVideosPage extends React.Component<NewVideosPageProps & DispatchProps & StateProps, NewVideosPageState> {
    private menu: any;

    constructor(props) {
        super(props);
        document.title = "New | Videomark.app";

        this.state = {
            showFilter: false,
            showStatistics: false,
        };

        console.log(props, props);

        console.log("NewVideosPage props", props);
        this.props.getNewVideos();
        autobind(this);
    }

    public render() {
        console.log("render this.props", this.props);
        if (this.props.videoListState.state === State.OK) {
            return <div className={"container"}>
                {this.renderNewVideosBanner()}
                <VideoList/>
            </div>;
        } else {
            return <Loading/>
        }
    }

    private renderFilter() {
        if (this.state.showFilter) {
            return <VideoFilter
                onClose={this.toggleFilter}
                videoListType={VideoListType.NEW}/>
        } else {
            return null;
        }
    }

    private toggleFilter() {
        this.setState({
            showFilter: !this.state.showFilter
        })
    }

    private toggleStatistics() {
        this.setState({
            showStatistics: !this.state.showStatistics
        })
    }

    private renderNewVideosBanner() {
        return (
            <div className={"page-section page-header hover-shadow"}>
                <MenuProvider ref={ref => this.menu = ref} className={"page-header-child"}
                              id={"new_menu_id"}>
                    <div onClick={this.toggleHeader}>
                        {this.renderSettingsIcon()}
                        <h1 className={"page-header-title"}>New Videos</h1>
                    </div>
                    {this.renderStatistics()}
                    {this.renderFilter()}
                </MenuProvider>
                <Menu id={"new_menu_id"}>
                    <Item onClick={this.toggleFilter}>{this.state.showFilter ? "Hide filter" : "Show filter"}</Item>
                    <Item
                        onClick={this.toggleStatistics}>{this.state.showStatistics ? "Hide statistics" : "Show statistics"}</Item>
                    <Item onClick={()=>exportAsFile(this.props.videoListState.videos)}>Export</Item>
                    <AddTagToAllSubmenu
                        videos={this.props.videoListState.videos}
                    />
                </Menu>
            </div>
        )
    }

    private toggleHeader(e) {
        if (this.state.showStatistics && this.state.showFilter) {
            this.setState({
                showStatistics: false,
                showFilter: false
            })
        } else {
            this.setState({
                showStatistics: true,
                showFilter: true
            })
        }
    }

    private renderSettingsIcon() {
        return (<span className={"header-menu-icon"} onClick={(e) => {
            this.menu.handleEvent(e);
        }}>
        <FontAwesomeIcon icon={"ellipsis-v"}/></span>)
    }

    private renderStatistics() {
        if (this.state.showStatistics) {
            return <VideoListStatistics
                onClose={this.toggleStatistics}
                videoListType={VideoListType.NEW}
                videos={this.props.videoListState.videos}/>
        } else {
            return null;
        }
    }
}


const mapStateToProps = (appState: AppState) => {
    return {
        videoListState: {
            ...appState.videoListState
        }
    };
};

export default connect<StateProps, DispatchProps, NewVideosPageProps>(mapStateToProps, {getNewVideos})(NewVideosPage)