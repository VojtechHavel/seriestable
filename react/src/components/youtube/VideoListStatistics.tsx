import * as React from 'react';
import autobind from 'class-autobind';
import "./VideoListStatistics.scss"
import {Video, VideoListType} from "../../types/generatedTypes";
import {formatTime} from "../../utils/time";

export interface VideoListStatisticsProps {
    videos: Video[],
    videoListType: VideoListType,
    onClose: ()=>void
}

export default class VideoListStatistics extends React.Component<VideoListStatisticsProps, {}> {

    constructor(props) {
        super(props);
        autobind(this);
    }

    public render() {
        console.log("rendering");
        return (<div className={"video-list-statistics"}>
            <h3>Statistics</h3>
            {this.renderInformation("Number of videos", this.props.videos.length)}
            {this.renderInformation("Total length", formatTime(this.calculateTotalVideoLength(this.props.videos)))}
            {this.renderInformation("Time watched", formatTime(this.calculateWatchedLength(this.props.videos)))}
            {this.renderInformation("Time remaining", formatTime(this.calculateRemainingTime(this.props.videos)))}
            {this.renderNumberOfFinishedVideos()}
        </div>)
    }

    private renderInformation(label, value){
        return (
            <div className={"row"}>
                <div className={"col-md-4"}/>
                <div className={"col-md-3 label"}>{label}</div>
                <div className="col-md-3 value">{value}</div>
                <div className="col-md-2"/>
            </div>
        )
    }

    private renderNumberOfFinishedVideos(){
        if(this.props.videoListType!==VideoListType.CONTINUE_WATCHING) {
            return this.renderInformation("Number of finished videos", this.countNumberOfFinishedVideos(this.props.videos));
        }else{
            return null;
        }
    }

    private calculateTotalVideoLength(videos: Video[]):number{
        let length:number = 0;
        videos.forEach(video=>{
            length = length+video.duration;
        });
        return length;
    }

    private calculateWatchedLength(videos: Video[]):number{
        let length:number = 0;
        videos.forEach(video=>{
            length = length+this.getVideoWatchedTime(video);
        });
        return length;
    }

    private calculateRemainingTime(videos: Video[]):number{
        let length:number = 0;
        videos.forEach(video=>{
            length = length+(video.duration-this.getVideoWatchedTime(video));
        });
        return length;
    }

    private countNumberOfFinishedVideos(videos: Video[]):number{
        let count:number = 0;
        videos.forEach(video=>{
            if(video.finishedAt!==null) {
                count = count + 1;
            }
        });
        return count;
    }

    private getVideoWatchedTime(video: Video){
        return video.finishedAt!==null?video.duration:video.timeWatched;
    }

}