import * as React from "react";
import autobind from 'class-autobind';
import Loading from "../util/Loading";
import {connect} from "react-redux";
import {VideoListState} from "../../types/VideoListState";
import State from "../../types/State";
import {AppState} from "../../store/rootReducer";
import {Item, Menu, MenuProvider} from "react-contexify";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import VideoFilter from "./VideoFilter";
import {addTagToVideos, getNotesVideos} from "../../actions/youtubeActions";
import NoteTile from "./NoteTile";
import Pagination from "./Pagination";
import {getVisibleVideos} from "../../store/videoSelector";
import {Video, VideoListType} from "../../types/generatedTypes";
import "./NotePage.scss"
import AddTagToAllSubmenu from "../util/AddTagToAllSubmenu";
import {TagState} from "../../store/tagReducer";
import {addTag} from "../../actions/tagActions";
import {exportAsFile} from "../../utils/exportAsFile";

interface DispatchProps {
    getNotesVideos: () => any,
    addTagToVideos: any,
    addTag: any,
}

interface StateProps {
    videoList: { videos: Video[] },
    videoListState: VideoListState
    pageSize: number,
    tagState: TagState
}

interface NotesPageProps {
}

interface NotesPageState {
    showFilter: boolean,
    page: number
}

class NotesPage extends React.Component<NotesPageProps & DispatchProps & StateProps, NotesPageState> {
    private menu: any;

    constructor(props) {
        super(props);
        document.title = "Notes | Videomark.app";

        this.state = {
            showFilter: false,
            page: 0
        };

        console.log(props, props);

        console.log("NotesPage props", props);
        this.props.getNotesVideos();
        autobind(this);
    }

    public render() {
        console.log("render this.props", this.props);
        if (this.props.videoListState.state === State.OK && this.props.videoListState.videoListType === VideoListType.NOTES) {
            return <div className={"container"}>
                {this.renderNotesBanner()}
                {this.renderNotesList()}
            </div>;
        } else {
            return <Loading/>
        }
    }

    private onPageChange(page: number) {
        this.setState({page})
    }

    private renderFilter() {
        if (this.state.showFilter) {
            return <VideoFilter
                onClose={this.toggleFilter}
                videoListType={VideoListType.NOTES}/>
        } else {
            return null;
        }
    }

    private toggleFilter() {
        this.setState({
            showFilter: !this.state.showFilter
        })
    }

    private renderNotesBanner() {
        return (
            <div className={"row page-section page-header hover-shadow"}>
                <MenuProvider ref={ref => this.menu = ref} className={"page-header-child"}
                              id={"continue_watching_menu_id"}>
                    <div onClick={this.toggleHeader}>
                        {this.renderSettingsIcon()}
                        <h1 className={"page-header-title"}>Notes</h1>
                    </div>
                    {this.renderFilter()}
                </MenuProvider>
                <Menu id={"continue_watching_menu_id"}>
                    <Item onClick={this.toggleFilter}>{this.state.showFilter ? "Hide filter" : "Show filter"}</Item>
                    <Item onClick={() => exportAsFile(this.props.videoList.videos)}>Export</Item>
                    <AddTagToAllSubmenu
                        videos={this.props.videoList.videos}
                    />
                </Menu>
            </div>
        )
    }

    private toggleHeader(e) {
        if (this.state.showFilter) {
            this.setState({
                showFilter: false
            })
        } else {
            this.setState({
                showFilter: true
            })
        }
    }

    private renderNotesList() {
        const videos = this.props.videoList.videos.slice(this.state.page * this.props.pageSize, this.state.page * this.props.pageSize + this.props.pageSize);

        if (videos.length > 0) {
            return (
                <div className={"notes-list"}>
                    {videos.map((video) => {
                        console.log("note", video.note);
                        return <NoteTile video={video} key={video.youtubeId}/>
                    })}
                    <Pagination pageSize={this.props.pageSize} page={this.state.page} onPageChange={this.onPageChange}
                                itemCount={this.props.videoList.videos.length}/>
                </div>
            )
        } else {
            return <div className="page-section row">
                <h2 className={"page-section-empty col-xl-12"}>No notes.</h2>
            </div>
        }
    }

    private renderSettingsIcon() {
        return (<span className={"header-menu-icon"} onClick={(e) => {
            this.menu.handleEvent(e);
        }}>
        <FontAwesomeIcon icon={"ellipsis-v"}/></span>)
    }
}


const mapStateToProps = (appState: AppState) => {
    return {
        videoList: getVisibleVideos(appState),
        videoListState: appState.videoListState,
        pageSize: appState.userState.pageSize,
        tagState: appState.tagState
    };
};

export default connect<StateProps, DispatchProps, NotesPageProps>(mapStateToProps, {
    getNotesVideos,
    addTagToVideos,
    addTag
})(NotesPage)