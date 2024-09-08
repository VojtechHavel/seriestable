import * as React from "react";
import autobind from 'class-autobind';
import {connect} from "react-redux";
import {AppState} from "../../store/rootReducer";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {library, dom, IconProp} from '@fortawesome/fontawesome-svg-core'
import Linkify from 'react-linkify';

import {
    faTimes,
    faPencilAlt,
    faCheck,
    faExternalLinkAlt,
    faInfo,
    faBookmark,
    faTag,
    faStickyNote,
    faStepBackward,
    faStepForward,
    faFastBackward,
    faFastForward,
    faRedoAlt,
    faPause,
    faPlay,
    faPauseCircle,
    faFileAlt
} from "@fortawesome/free-solid-svg-icons";
import {faYoutube} from "@fortawesome/free-brands-svg-icons";
import SidepanelBookmarks from "./SidepanelBookmarks";
import SidepanelTags from "./SidepanelTags";
import {Link} from "react-router-dom";
import {formatTime, getTimeAgo} from "../../utils/time";
import {UserState} from "../../types/UserState";
import {VISITOR_ROLE} from "../../actions/userActions";
import "./Sidepanel.scss"
import {Bookmark, Tag, Video} from "../../types/generatedTypes";
import {callUpdateBookmarks} from "../../actions/api/youtubeApi";
import {addTagToVideo, removeTagFromVideo, updateNote, UpdateNoteSignature} from "../../actions/youtubeActions";
import {TagState} from "../../store/tagReducer";
import Tooltip from "../util/Tooltip";
import TextareaWithSave from "../util/TextareaWithSave";
import {formatCount} from "../../utils/counts";

library.add(faBookmark, faStickyNote, faTag, faTimes, faPencilAlt, faCheck, faExternalLinkAlt, faYoutube, faInfo,
    faStepBackward, faStepForward, faFastBackward, faFastForward, faRedoAlt, faPause, faPlay, faPauseCircle, faFileAlt);
dom.watch();

export interface SidepanelProps {
    video: Video,
    player: any,
    changeWatchedTime: any;
    handleSeekTo: any;
    finish: any;
    togglePlaying: any;
    markAsNotStarted: any;
    playing: boolean,
    timeWatched: number
    justFinished: boolean
}

interface SidepanelState {
    showInfo: boolean,
    showDescription: boolean,
    showControls: boolean,
    showTags: boolean,
    showNotes: boolean,
    showBookmarks: boolean,
    note: string,
    bookmarks: Bookmark[],
    videoTags: string[]
}

interface DispatchProps {
    removeTagFromVideo: (videoId: string, tag: string) => any
    addTagToVideo: (videoId: string, tag: string) => any,
    updateNote: UpdateNoteSignature
}

interface StateProps {
    userState: UserState,
    tagState: TagState
}


enum SidepanelType {
    INFO = "INFO",
    CONTROLS = "CONTROLS",
    NOTE = "NOTE",
    BOOKMARKS = "BOOKMARKS",
    DESCRIPTION = "DESCRIPTION",
    YOUTUBE = "YOUTUBE",
    TAGS = "TAGS"
}

class Sidepanel extends React.Component<StateProps & DispatchProps & SidepanelProps, SidepanelState> {

    constructor(props) {
        super(props);
        autobind(this);
        this.state = this.defaultState(props);
    }

    public render() {
        return (<div className={"sidepanel"}>
            <div className={"sidepanel-menu"}>
                {this.renderSidepanelMenuIcon(SidepanelType.INFO, true)}
                {this.state.showInfo ? this.renderInfo() : null}
                {this.renderSidepanelMenuIcon(SidepanelType.CONTROLS, true)}
                {this.state.showControls ? this.renderControls() : null}
                {this.renderSidepanelMenuIcon(SidepanelType.DESCRIPTION, true)}
                {this.state.showDescription ? this.renderDescription() : null}
                {this.props.userState.role === VISITOR_ROLE ? null : this.renderSidepanelMenuIcon(SidepanelType.NOTE, true)}
                {this.state.showNotes ? this.renderNote() : null}
                {this.renderSidepanelMenuIcon(SidepanelType.BOOKMARKS, true)}
                {this.state.showBookmarks ? this.renderBookmarks() : null}
                {this.props.userState.role === VISITOR_ROLE ? null : this.renderSidepanelMenuIcon(SidepanelType.TAGS, true)}
                {this.state.showTags ? this.renderTags() : null}
                <a data-tip="Watch on YouTube" className={"sidepanel-icon youtube-icon youtube-link"}
                   href={"https://www.youtube.com/watch?v=" + this.props.video.youtubeId + "&t=" + Math.floor(this.props.timeWatched)}
                   target="_blank">
                    <i className="fab fw fa-youtube"/> <span className={"youtube-label"}>Watch on YouTube</span>
                </a>
            </div>
        </div>)
    }

    public componentDidUpdate(prevProps) {
        if (this.props.video.youtubeId !== prevProps.video.youtubeId) {
            this.setState(this.defaultState(this.props))
        }
    }

    private defaultState = (props: SidepanelProps): SidepanelState => {
        return {
            showDescription: false,
            showInfo: true,
            showControls: true,
            showTags: false,
            showNotes: false,
            showBookmarks: false,
            note: this.props.video.note || "",
            bookmarks: this.props.video.bookmarks || [],
            videoTags: this.props.video.tags || []
        }
    };

    private renderTags() {
        return <SidepanelTags videoTags={this.state.videoTags} tagsState={this.props.tagState}
                              toggleTag={this.toggleTag} video={this.props.video}/>
    }

    private toggleTag(tag: Tag, isTagged: boolean) {
        console.log("taggg");
        if (isTagged) {
            this.props.removeTagFromVideo(this.props.video.youtubeId, tag.name);
            this.setState({
                videoTags: this.state.videoTags.filter(tagName => tagName !== tag.name)

            });
        } else {
            this.state.videoTags.push(tag.name);
            this.setState({
                videoTags: this.state.videoTags
            });
            this.props.addTagToVideo(this.props.video.youtubeId, tag.name)
        }
    }

    private renderNote() {
        return <TextareaWithSave note={this.state.note} onSave={this.updateNote}/>
    }

    private updateNote(note) {
        this.props.updateNote(this.props.video.youtubeId, note).then(() => {
            this.setState({
                note
            });
        });
    }

    private renderBookmarks() {
        return <SidepanelBookmarks
            handleSeekTo={this.props.handleSeekTo}
            bookmarks={this.state.bookmarks}
            youtubeId={this.props.video.youtubeId}
            addBookmark={this.addBookmark}
            removeBookmark={this.removeBookmark}
            handleBookmarksChange={this.handleBookmarksChange}
        />
    }

    private renderInfo() {
        return (
            <div className={"sidepanel-section"}>
                <h5 className="video-title">
                    {this.props.video.title}
                </h5>
                <div className={"row video-channel-link"}>
                    <Link
                        className={"col-md-12"}
                        to={"/youtube/channels/" + this.props.video.channelYoutubeId}>
                        {this.props.video.channelTitle}
                    </Link>
                </div>
                <div className={"video-info-date sidepanel-info"}>
                    <span
                        className={"label"}>Published at:</span> {new Date(this.props.video.publishedAt).toLocaleString()} ({getTimeAgo(this.props.video.publishedAt / 1000)})
                </div>

                <div className={"sidepanel-info"}>
                    <span
                        className={"label"}>Views: </span> {formatCount(this.props.video.viewCount)}
                </div>

                <div className={"sidepanel-info"}>
                    <span
                        className={"label"}>Likes: </span> {formatCount(this.props.video.likeCount)}
                </div>

                <div className={"sidepanel-info"}>
                    <span
                        className={"label"}>Dislikes: </span> {formatCount(this.props.video.dislikeCount)}
                </div>

                <div className={"sidepanel-info"}>
                    <span
                        className={"label"}>Comments: </span> {formatCount(this.props.video.commentCount)}
                </div>


                {this.renderFinishedAt(this.props.video.finishedAt)}

            </div>)
    }

    private renderFinishedAt(finishedAt: number | null) {
        if (finishedAt !== null) {
            return <div className={"video-info-date"}>
                <span
                    className={"label"}>Finished at:</span> {new Date(finishedAt).toLocaleString()} ({getTimeAgo(finishedAt / 1000)})
            </div>
        } else {
            return null;
        }
    }

    private renderDescription() {
        const componentDecorator = (href, text, key) => (
            <a href={href} key={key} target="_blank">
                {text}
            </a>
        );

        return (
            <div className={"sidepanel-section"}>
                <div className={"video-description"}>
                    <div className={"row"}>
                        <Linkify componentDecorator={componentDecorator}>{this.props.video.description}</Linkify>
                    </div>
                </div>
            </div>)
    }

    private renderControls() {
        const className = "icon-button action-button col-sm-12 col-md-6";

        return (
            <div className={"sidepanel-section"}>
                <div className={"row"}>

                    <div className={"col-xl-12 current-time"}>
                    <span>
                        {formatTime(this.props.timeWatched)} / {formatTime(this.props.video.duration - 1)}
                    </span>
                    </div>

                    <div key="play-button"
                         className={className}
                         onClick={this.props.togglePlaying}>
                        <FontAwesomeIcon flip={"vertical"} icon={this.props.playing ? "pause" : "play"}/>
                        {this.props.playing ? " Pause" : " Play"}
                    </div>

                    {this.renderReplayOrFinish(className)}

                    {/*//old*/}

                    <div className={className}
                         onClick={() => this.addWatchedTime(-5)}>
                        <FontAwesomeIcon icon={"step-backward"}/> -5 sec
                    </div>

                    <div className={className}
                         onClick={() => this.addWatchedTime(5)}>
                        <FontAwesomeIcon icon={"step-forward"}/> +5 sec
                    </div>

                </div>
            </div>)
    }

    private renderReplayOrFinish(className) {
        if (this.props.video.finishedAt !== null) {
            return <div key={"replay-button"} data-tip="Watch video again and mark it as not finished."
                        className={className}
                        onClick={this.replay}>
                <FontAwesomeIcon flip={"vertical"} icon={"redo-alt"}/> Replay
                <Tooltip/>
            </div>
        } else {
            return <div key="finish-button" className={className}
                        onClick={this.props.finish}>
                <FontAwesomeIcon icon={"check"}/> Finish
            </div>
        }
    }

    private renderSidepanelMenuIcon(type: SidepanelType, mobile: boolean) {
        let icon = "info";
        let title = "";
        let selected = false;

        switch (type) {
            case SidepanelType.BOOKMARKS:
                icon = "bookmark";
                selected = this.state.showBookmarks;
                title = "Bookmarks";
                break;
            case SidepanelType.TAGS:
                icon = "tag";
                selected = this.state.showTags;
                title = "Tags";
                break;
            case SidepanelType.NOTE:
                icon = "sticky-note";
                title = "Notes";
                selected = this.state.showNotes;
                break;
            case SidepanelType.INFO:
                icon = "info";
                title = "Information";
                selected = this.state.showInfo;
                break;
            case SidepanelType.CONTROLS:
                icon = "pause-circle";
                title = "Controls";
                selected = this.state.showControls;
                break;
            case SidepanelType.DESCRIPTION:
                icon = "file-alt";
                title = "Description";
                selected = this.state.showDescription;
                break;
        }

        let className = "sidepanel-icon icon-button noselect";
        if (selected) {
            className = className + " selected";
        }

        return (
            <span onClick={() => this.toggleSidepanelSection(type)} className={className}>
                    <FontAwesomeIcon fixedWidth={true}
                                     icon={icon as IconProp}/> {mobile ? title : null} {this.renderCollapseIcon(!selected)}
            </span>
        )
    }

    private renderCollapseIcon(collapsed: boolean) {
        if (collapsed) {
            return (
                <span
                    className={"collapse-icon"}>
                    <FontAwesomeIcon icon={"chevron-right"}/>
                </span>
            )
        } else {
            return (
                <span
                    className={"collapse-icon"}>
                    <FontAwesomeIcon icon={"chevron-down"}/>
                </span>
            )
        }
    }

    private toggleSidepanelSection(type: SidepanelType) {
        switch (type) {
            case SidepanelType.BOOKMARKS:
                this.setState({
                    showBookmarks: !this.state.showBookmarks
                });
                break;
            case SidepanelType.TAGS:
                this.setState({
                    showTags: !this.state.showTags
                });
                break;
            case SidepanelType.NOTE:
                this.setState({
                    showNotes: !this.state.showNotes
                });
                break;
            case SidepanelType.INFO:
                this.setState({
                    showInfo: !this.state.showInfo
                });
                break;
            case SidepanelType.CONTROLS:
                this.setState({
                    showControls: !this.state.showControls
                });
                break;
            case SidepanelType.DESCRIPTION:
                this.setState({
                    showDescription: !this.state.showDescription
                });
                break;
        }
    }


    private addWatchedTime(time) {
        let newTime = this.props.timeWatched + time;
        if (newTime < 0) {
            newTime = 0;
        }

        this.props.handleSeekTo(newTime);
    }

    private replay() {
        this.props.markAsNotStarted();
    }

    // Bookmarks
    private addBookmark() {
        console.log("add bookmark");

        const newBookmark: Bookmark = {
            name: "Videomark",
            timeInSeconds: this.props.timeWatched
        };

        const bookmarks = JSON.parse(JSON.stringify(this.state.bookmarks));
        bookmarks.push(newBookmark);
        if (this.props.userState.role !== VISITOR_ROLE) {
            callUpdateBookmarks(this.props.video.youtubeId, bookmarks);
        }
        this.setState({
            bookmarks
        })
    }

    private removeBookmark(bookmark: Bookmark) {
        this.state.bookmarks.splice(this.state.bookmarks.indexOf(bookmark), 1);
        const bookmarks = JSON.parse(JSON.stringify(this.state.bookmarks));
        if (this.props.userState.role !== VISITOR_ROLE) {
            callUpdateBookmarks(this.props.video.youtubeId, bookmarks);
        }
        this.setState({
            bookmarks
        })
    }

    private handleBookmarksChange(bookmark: Bookmark, name) {
        bookmark.name = name;
        this.setState({bookmarks: this.state.bookmarks});
        if (this.props.userState.role !== VISITOR_ROLE) {
            callUpdateBookmarks(this.props.video.youtubeId, this.state.bookmarks);
        }
    }
}

const mapStateToProps = ({userState, tagState}: AppState) => {
    return {userState, tagState};
};

export default connect<StateProps, DispatchProps, SidepanelProps>(mapStateToProps, {
    addTagToVideo,
    updateNote,
    removeTagFromVideo
})(Sidepanel)