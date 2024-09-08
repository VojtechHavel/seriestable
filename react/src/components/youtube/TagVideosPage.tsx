import * as React from "react";
import autobind from 'class-autobind';
import VideoList from "./VideoList";
import Modal from "../util/Modal";
import AddFormView from "../util/AddFormView";
import {RouteComponentProps} from "react-router";
import State from "../../types/State";
import Loading from "../util/Loading";
import {connect} from "react-redux";
import {addPlaylistToTag, addVideoToTag, getTag} from "../../actions/youtubeActions";
import {VideoListState} from "../../types/VideoListState";
import {AppState} from "../../store/rootReducer";
import {Item, Menu, MenuProvider} from "react-contexify";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import VideoFilter from "./VideoFilter";
import VideoListStatistics from "./VideoListStatistics";
import {editTag} from "../../actions/tagActions";
import {Tag, Video, VideoListType} from "../../types/generatedTypes";
import TagEditModal from "./TagEditModal";
import {TagIcon} from "./TagIcon";
import "./TagVideosPage.scss"
import AddTagToAllSubmenu from "../util/AddTagToAllSubmenu";
import {exportAsFile} from "../../utils/exportAsFile";
import {getVisibleVideos} from "../../store/videoSelector";

interface TagVideosPageState {
    showAddVideoModal: boolean,
    showAddPlaylistModal: boolean,
    showEditTagModal: boolean,
    addingVideoState: State,
    addingPlaylistState: State,
    showFilter: boolean,
    showStatistics: boolean,
}

interface ConnectedProps {
    videosList: {videos: Video[]},
    videoListState: VideoListState,
    getTag: (tag: string) => any,
    editTag: (newTag: Tag, tag: string) => any,
    addVideoToTag: (videoUrl: string, tag: string) => Promise<any>,
    addPlaylistToTag: (tag: string, videoUrl: string) => Promise<any>,
}

/**
 * Page with videos with the specific tag
 */
class TagVideosPage extends React.Component<ConnectedProps & RouteComponentProps<any, any>, TagVideosPageState> {
    private menu: any;

    constructor(props) {
        super(props);
        document.title = "Tag | Videomark.app";

        this.state = {
            showEditTagModal: false,
            showAddPlaylistModal: false,
            showFilter: false,
            showStatistics: false,
            showAddVideoModal: false,
            addingVideoState: State.INITIAL,
            addingPlaylistState: State.INITIAL,
        };
        this.props.getTag(this.props.match.params.id);
        console.log("TagVideosPage props", props);
        autobind(this);
    }

    public render() {
        if (this.pageLoaded()) {
            document.title = this.getTag().name + " | Videomark.app";

            return <div className={"tag-videos-page container"}>
                {this.renderTagBanner()}
                <VideoList/>
                <Modal
                    key="addVideoModal"
                    onClose={this.toggleAddVideoModal}
                    showModal={this.state.showAddVideoModal}>
                    <AddFormView
                        title={"Add tag '" + this.getTag().name + "' to video"}
                        placeholder={"video url"}
                        processing={this.state.addingVideoState}
                        onSubmit={this.addTagToVideo}/>
                </Modal>
                <Modal
                    key="addPlaylistModal"
                    onClose={this.toggleAddPlaylistModal}
                    showModal={this.state.showAddPlaylistModal}>
                    <AddFormView
                        title={"Add videos in playlist to tag '" + this.getTag().name + "'"}
                        placeholder={"video url"}
                        processing={this.state.addingPlaylistState}
                        onSubmit={this.addPlaylistToTag}/>
                </Modal>
                <TagEditModal
                    showModal={this.state.showEditTagModal}
                    onClose={this.toggleEditTagModal}
                    tag={this.getTag()}
                    onSubmit={this.editTag}/>
            </div>;
        } else {
            return <Loading/>
        }
    }

    private pageLoaded(): boolean {
        return this.props.videoListState.state === State.OK &&
            this.props.videoListState.videoListType === VideoListType.TAG &&
            this.props.videoListState.id === this.props.match.params.id
    }

    private toggleAddVideoModal() {
        this.setState({
            showAddVideoModal: !this.state.showAddVideoModal
        })
    }

    private toggleAddPlaylistModal() {
        this.setState({
            showAddPlaylistModal: !this.state.showAddPlaylistModal
        })
    }

    private toggleEditTagModal() {
        this.setState({
            showEditTagModal: !this.state.showEditTagModal
        })
    }

    private addTagToVideo(videoUrl: string) {
        this.setState({
            showAddVideoModal: false
        });
        this.props.addVideoToTag(videoUrl, this.getTag().name);
    }

    private renderFilter() {
        if (this.state.showFilter) {
            return <VideoFilter
                onClose={this.toggleFilter}
                videoListType={VideoListType.TAG}/>
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


    private renderStatistics() {
        if (this.state.showStatistics) {
            return <VideoListStatistics
                onClose={this.toggleStatistics}
                videoListType={VideoListType.TAG}
                videos={this.props.videosList.videos}/>
        } else {
            return null;
        }
    }

    private renderTagBanner() {
        console.log("renderTagBanner videos", this.props.videosList.videos);
        return (
            <div className={"page-header hover-shadow page-section"}>
                <MenuProvider ref={ref => this.menu = ref} className={"page-header-child"}
                              id={"tag_page_menu_id"}>
                    <div onClick={this.toggleHeader}>
                        {this.renderSettingsIcon()}
                        <span className={"page-header-logo"}><TagIcon tag={this.getTag()}/></span>
                        <h1 className={"page-header-title"}>{this.getTag().name}</h1>
                    </div>
                    {this.renderStatistics()}
                    {this.renderFilter()}
                </MenuProvider>
                <Menu id={"tag_page_menu_id"}>
                    <Item onClick={this.toggleFilter}>{this.state.showFilter ? "Hide filter" : "Show filter"}</Item>
                    <Item
                        onClick={this.toggleStatistics}>{this.state.showStatistics ? "Hide statistics" : "Show statistics"}</Item>
                    <Item onClick={this.toggleAddVideoModal}>Add video</Item>
                    <Item onClick={this.toggleAddPlaylistModal}>Add playlist</Item>
                    <Item onClick={()=>exportAsFile(this.props.videosList.videos)}>Export</Item>
                    <AddTagToAllSubmenu
                        videos={this.props.videosList.videos}
                    />
                    <Item onClick={this.toggleEditTagModal}>Rename tag</Item>
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

    private editTag(newTag: Tag) {
        this.props.editTag(newTag, this.getTag().name).then(() => {
            this.setState({
                showEditTagModal: false
            });
            this.props.history.push('/youtube/tags/' + newTag.name)
        });
    }

    private addPlaylistToTag(playlistUrl: string) {
        this.setState({
            addingPlaylistState: State.PROCESSING
        });
        this.props.addPlaylistToTag(playlistUrl, this.getTag().name).then(() => {
            this.setState({
                addingPlaylistState: State.OK,
                showAddPlaylistModal: false
            });
        }, () => {
            this.setState({
                addingPlaylistState: State.ERROR,
                showAddPlaylistModal: false
            });
        })
    }

    private getTag(): Tag {
        return this.props.videoListState.information as Tag;
    }
}

const mapStateToProps = (appState: AppState) => {
    return {
        videoListState: appState.videoListState,
        videosList: getVisibleVideos(appState)
    };
};
export default connect(mapStateToProps, {getTag, addVideoToTag, addPlaylistToTag, editTag})(TagVideosPage)