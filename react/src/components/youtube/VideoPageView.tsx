import * as React from 'react';
import ReactPlayer from 'react-player'
import autobind from 'class-autobind';
import "./VideoPageView.scss"
import Loading from "../util/Loading";
import Sidepanel from "./Sidepanel";
import {Video} from "../../types/generatedTypes";
import VideoList from "./VideoList";

interface VideoPageState {
    playing: boolean,
    videoReady: boolean,
    timeWatched: number,
    justFinished: boolean
}

interface VideoPageProps {
    video: Video
    changeWatchedTime: any;
    markAsFinished: any;
    markAsNotStarted: any;
    isVisitor: boolean
}

export default class VideoPageView extends React.Component<VideoPageProps, VideoPageState> {
    private player: any;

    constructor(props) {
        super(props);
        autobind(this);
        console.log("VideoPageView props", props);
        this.state = {
            justFinished: false,
            videoReady: false,
            playing: false,
            timeWatched: this.props.video.timeWatched
        }
    }

    public render() {
        return (
            <div className="container-fluid">
                <div className={"row"}>
                    <div className="col-lg-9">
                        {this.renderVideo()}
                    </div>
                    <div className="col-lg-3">
                        <Sidepanel
                            timeWatched={this.state.timeWatched}
                            handleSeekTo={this.handleSeekTo}
                            finish={this.onEnded}
                            markAsNotStarted={this.markAsNotStarted}
                            togglePlaying={this.togglePlaying}
                            changeWatchedTime={this.props.changeWatchedTime}
                            playing={this.state.playing}
                            video={this.props.video}
                            player={this.player}
                            justFinished={this.state.justFinished}
                        />
                    </div>
                </div>
            </div>
        )
    }

    public componentDidUpdate(prevProps) {
        if(this.props.video.youtubeId!==prevProps.video.youtubeId){
            this.setState({
                justFinished: false,
                videoReady: false,
                playing: false,
                timeWatched: this.props.video.timeWatched
            })
        }
    }


    private ref = player => {
        this.player = player
    };

    private onPause() {
        this.props.changeWatchedTime(this.player.getCurrentTime());
        this.setState({
            playing: false,
            timeWatched: this.player.getCurrentTime()
        })
    }

    private togglePlaying() {
        this.setState({
            playing: !this.state.playing,
            justFinished: false
        });
    }

    private renderVideo() {
        console.log("this.props.video", this.props.video);
        if (this.state.justFinished) {
            return this.renderFinished()
        } else {
            return (
                <div className={"player-wrapper"}>
                    <ReactPlayer
                        loop={false}
                        onProgress={this.onProgress}
                        onReady={this.onVideoReady}
                        onPlay={this.onPlay}
                        onEnded={this.onEnded}
                        playing={this.state.playing}
                        className={"react-player"}
                        onPause={this.onPause}
                        ref={this.ref}
                        width="100%"
                        controls={true}
                        height="100%"
                        url={"https://www.youtube.com/watch?v=" + this.props.video.youtubeId}
                        config={{
                            youtube: {
                                playerVars: {
                                    fs: 1,
                                    start: Math.floor(this.props.video.timeWatched)
                                }
                            }
                        }}
                    />
                    <div className={"video-loading-indicator"}>
                        {this.state.videoReady ? null : <Loading/>}
                    </div>
                </div>
            );
        }
    }

    private renderFinished() {
        return (<div className={"recommended-videos"}>
            <VideoList/>
        </div>)
    }

    private onVideoReady() {
        this.setState({
            videoReady: true
        })
    }

    private onProgress(state) {
        console.log("onProgress");
        if ((state.playedSeconds > this.state.timeWatched) && (state.playedSeconds < this.state.timeWatched + 3)) {
            this.setState({
                timeWatched: state.playedSeconds
            });
        }
    }

    private onPlay() {
        this.setState({
            playing: true,
            justFinished: false
        })
    }

    private onEnded() {
        this.setState({
            justFinished: true,
            playing: false
        });
        this.props.markAsFinished();
    }


    private handleSeekTo(time: number) {
        this.seekTo(time);
        this.props.changeWatchedTime(time);

    }

    private seekTo(time: number){
        if (this.player) {
            this.player.seekTo(time);
        }
        this.setState({
            timeWatched: time,
            justFinished: false
        }, ()=>{
            if (this.player) {
                this.player.seekTo(time);
            }
        });
    }

    private markAsNotStarted() {
        this.seekTo(0);
        this.props.markAsNotStarted();

    }
}