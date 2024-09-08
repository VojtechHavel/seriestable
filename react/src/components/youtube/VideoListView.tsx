import * as React from 'react';
import Loading from '../util/Loading';
import "./VideoListView.scss"
import autobind from 'class-autobind';

import {Video, VideoListType} from "../../types/generatedTypes";
import VideoTile from "./VideoTile";

import {dom, library} from '@fortawesome/fontawesome-svg-core'
import {faAngleLeft, faAngleRight, faSync} from "@fortawesome/free-solid-svg-icons";
import Pagination from "./Pagination";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

library.add(faAngleRight, faAngleLeft, faSync);
dom.watch();

export interface VideoListViewProps {
    videos: Video[],
    pageSize: number,
    videoListType: VideoListType
}

export interface VideoListViewState {
    tagDropdownVisible: boolean;
    page: number
}


class VideoListView extends React.Component<VideoListViewProps, VideoListViewState> {

    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            tagDropdownVisible: false,
            page: 0
        }
    }

    public render() {


        console.log("page", this.state.page);

        if (!this.props.videos) {
            return <Loading/>
        } else {

            if (this.props.videos.length > 0) {
                return (
                    <div className="page-section">
                        {this.renderVideos(this.props.videos, this.props.pageSize)}
                        {this.props.videoListType===VideoListType.RECOMMENDED?
                            this.renderRefreshPageButton():
                            <Pagination pageSize={this.props.pageSize} page={this.state.page}
                                        onPageChange={this.onPageChange} itemCount={this.props.videos.length}/>
                        }
                        </div>
                );
            } else {
                return (
                    <div className="page-section">
                        <h2 className={"page-section-empty"}>No videos.</h2>
                    </div>
                );
            }

        }
    }

    private onPageChange(page: number){
        this.setState({page})
    }


    private renderVideos(videos: Video[], pageSize: number) {
        videos = videos.slice(this.state.page * pageSize, this.state.page * pageSize + pageSize);

        let colClasses = "col-md-4 col-lg-2 col-6";
        if(this.props.videoListType===VideoListType.RECOMMENDED){
            colClasses = "col-md-6 col-lg-4 col-12"
        }

        return (<div className="row">
            {videos.map((video: Video) => {
                return (
                    <VideoTile
                        className={colClasses}
                        key={video.youtubeId}
                        video={video}/>
                )
            })}
        </div>)
    }

    private renderRefreshPageButton() {
        return <div className={"refresh-suggestions"} onClick={this.refreshRecommendations}>
            <FontAwesomeIcon
                data-tip={"Refresh suggestions"}
                icon={"sync"}/>
        </div>
    }

    private refreshRecommendations(){
        const lastPage: boolean = Math.ceil(this.props.videos.length / this.props.pageSize)<=(this.state.page+1);
        if(!lastPage){
            this.onPageChange(this.state.page+1);
        }else{
            this.onPageChange(0);
        }
    }
}

export default VideoListView;