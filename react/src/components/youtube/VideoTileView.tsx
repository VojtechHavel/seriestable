import * as React from 'react';
import "./VideoTileView.scss"
import autobind from 'class-autobind';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {Link, RouteComponentProps, withRouter} from "react-router-dom";
import {Tag, Video, VideoListType} from "../../types/generatedTypes";
import {formatTime, getTimeAgo} from "../../utils/time";
import {ComponentClass} from "react";
import {MenuProvider} from "react-contexify";
import 'react-contexify/dist/ReactContexify.min.css';
import {VideoTileMenu, VideoTileMenuProps} from "./VideoTileMenu";
import LinesEllipsis from 'react-lines-ellipsis'

import {library, dom} from '@fortawesome/fontawesome-svg-core'
import {faClock} from "@fortawesome/free-regular-svg-icons";
import {faEllipsisV} from "@fortawesome/free-solid-svg-icons";
import Tooltip from "../util/Tooltip";
import {formatCount} from "../../utils/counts";

library.add(faEllipsisV);
library.add(faClock);
dom.watch();


export interface VideoTileViewProps {
    video: Video,
    tags: Tag[]
    markAsNotStarted: (videoId: string) => void,
    stopRecommending: (videoId: string) => void,
    markAsFinished: (videoId: string) => void,
    showAddTagForm: () => void,
    addTagToVideo: (video: string, tag: string) => void,
    removeTagFromVideo: (video: string, tag: string) => void,
    showMenu: boolean,
    className?: string,
    videoListType: VideoListType
}

export interface VideoTileViewState {
    tagDropdownVisible: boolean;
}

class VideoTileView extends React.Component<VideoTileViewProps & RouteComponentProps<any>, VideoTileViewState> {
    private menu: any;

    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            tagDropdownVisible: false
        }
    }


    public render() {
        if (this.props.showMenu) {
            return this.renderWithMenu()
        } else {
            return this.renderWithoutMenu()
        }
    }

    public renderWithoutMenu() {
        return (
            <div className={this.props.className + " video-tile"} key={this.props.video.youtubeId}>
                <div className={"video-tile-link hover-shadow"}>
                    {this.renderInside()}
                </div>
            </div>)
    }

    public renderWithMenu() {

        const menuProps:VideoTileMenuProps = {
            addTagToVideo: this.props.addTagToVideo,
            video: this.props.video,
            tags: this.props.tags,
            markAsFinished: this.props.markAsFinished,
            markAsNotStarted: this.props.markAsNotStarted,
            addNewTag: this.props.showAddTagForm,
            removeTagFromVideo: this.props.removeTagFromVideo,
            stopRecommending: this.props.stopRecommending,
            videoListType: this.props.videoListType
        };

        // @ts-ignore
        return (
            <div className={this.props.className + " video-tile hover-icon-parent"} key={this.props.video.youtubeId}>
                <MenuProvider ref={ref => this.menu = ref} className={"video-tile-link hover-shadow"}
                              id={"menu_id" + this.props.video.youtubeId}>
                    {this.renderInside()}
                </MenuProvider>
                <VideoTileMenu {...menuProps}/>
            </div>
        );
    }


    private renderInside() {
        const video = this.props.video;

        return (
            <div className={"video-tile-inner-wrapper"}>
                {/*<div>*/}
                {video.finishedAt!==null ? <div className="video-overlay"/> : null}
                {/*</div>*/}

                <div className={"video-tile-inner-image-wrapper"}>
                    {this.props.showMenu ? this.renderSettingsIcon(video) : null}
                    {video.duration ? this.renderDurationIcon(video) : null}
                    <Link to={"/youtube/videos/" + video.youtubeId}>
                        <img src={video.thumbnailUrl}/>
                    </Link>
                </div>
                <div className={"video-tile-inner-text-wrapper"}>
                    <Link
                        data-tip={video.title}
                        className={"video-tile-video-title"} to={"/youtube/videos/" + video.youtubeId}>
                        <LinesEllipsis text={video.title}
                                       maxLine='3'
                                       ellipsis='...'
                                       trimRight={true}
                                       basedOn='letters'
                        />
                    </Link>
                    <Link
                        data-tip={video.channelTitle}
                        className={"video-tile-channel-title ellipsis"}
                          to={"/youtube/channels/" + video.channelYoutubeId}>
                        {video.channelTitle}
                    </Link>
                    <div className={"video-tile-published-at"}
                        data-tip={new Date(video.publishedAt).toLocaleString()}>
                        {getTimeAgo(video.publishedAt / 1000)}
                    </div>
                    <div
                        data-tip={formatCount(video.viewCount) + " views <br />"+
                        formatCount(video.likeCount) +" likes <br />"+
                        formatCount(video.dislikeCount) +" dislikes <br />"+
                        formatCount(video.commentCount) +" comments"}
                        className={"video-tile-statistics ellipsis"}>
                        <span className={"view-count"}>{formatCount(video.viewCount)}</span>&nbsp;
                        (<span className={"like-count"}>{formatCount(video.likeCount)}</span>
                        /<span className={"dislike-count"}>{formatCount(video.dislikeCount)}</span>&nbsp;
                        •&nbsp;<span className={"comment-count"}>{formatCount(video.commentCount)}</span>
                        )
                    </div>
                </div>
                <Tooltip/>
            </div>
        )
    }

    private renderSettingsIcon(video: Video) {
        return (<span className={"menu-icon hover-icon"} onClick={(e) => {
            this.menu.handleEvent(e);
        }}>
        <FontAwesomeIcon icon={"ellipsis-v"}/></span>)
    }

    private renderDurationIcon(video: Video) {
        return (<span className={"duration-icon"}>{this.renderTimeWatched(video)}{formatTime(video.duration)}</span>)
    }

    private renderTimeWatched(video: Video) {
        if (video.timeWatched && !video.finishedAt!==null) {
            return "" + formatTime(video.timeWatched) + " / ";
        } else {
            return "";
        }
    }
}

export default withRouter<RouteComponentProps<VideoTileViewProps>>(VideoTileView) as ComponentClass<VideoTileViewProps>;