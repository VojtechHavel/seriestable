import VideoList from './VideoList';
import * as React from "react";
import {RouteComponentProps} from "react-router";
import autobind from 'class-autobind';
import Loading from "../util/Loading";
import {getChannel, reloadChannel} from "../../actions/youtubeActions";
import {connect} from "react-redux";
import State from "../../types/State";
import {VideoListState} from "../../types/VideoListState";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {dom, library} from '@fortawesome/fontawesome-svg-core'
import VideoFilter from "./VideoFilter";
import {AppState} from "../../store/rootReducer";
import {Item, Menu, MenuProvider, Submenu} from "react-contexify";
import "./ChannelPage.scss"

import {faInfo, faSearch, faSync} from "@fortawesome/free-solid-svg-icons";
import VideoListStatistics from "./VideoListStatistics";
import {
    callAddChannelToCategory,
    callGetChannelLoadById,
    callRemoveChannelFromCategory
} from "../../actions/api/youtubeApi";
import {Channel, Video, VideoListPageResponse, VideoListType} from "../../types/generatedTypes";
import {MenuItemEventHandler} from "react-contexify/lib/types";
import {VISITOR_ROLE} from "../../actions/userActions";
import Timer = NodeJS.Timer;
import AddTagToAllSubmenu from "../util/AddTagToAllSubmenu";
import {exportAsFile} from "../../utils/exportAsFile";
import ChannelImage from "./ChannelImage";
import {getVisibleVideos} from "../../store/videoSelector";

library.add(faSearch, faInfo, faSync);

dom.watch();

interface ChannelPageState {
    showFilter: boolean;
    showStatistics: boolean;
    channelId: string;
    loadedVideosCount: number,
    loadFinished: boolean,
    presentCategories: string[]
}

interface ConnectedProps {
    getChannel: (channelId: string) => any,
    reloadChannel: (channelId: string) => any,
    videoListState: VideoListState,
    videosList: {videos: Video[]},
    userRole: string
}

class ChannelPage extends React.Component<ConnectedProps & RouteComponentProps<any, any>, ChannelPageState> {
    private menu: any;

    private intervalGetChannelLoad: Timer;

    constructor(props) {
        super(props);
        document.title = "Channel | Videomark.app";

        this.state = {
            showFilter: false,
            showStatistics: false,
            channelId: this.props.match.params.id,
            loadedVideosCount: 0,
            loadFinished: false,
            presentCategories: []
        };
        console.log("ChannelPage props", props);
        this.props.getChannel(this.props.match.params.id).then((data) => {
            if (data) {
                this.setCategories(data)
            }
        });
        autobind(this);
        this.intervalGetChannelLoad = setInterval(this.getChannelLoad, 5000);
    }

    public render() {
        if (this.props.videoListState.state === State.OK && this.props.videoListState.videoListType === VideoListType.CHANNEL) {
            document.title = (this.props.videoListState.information as Channel).title + " | Videomark.app";
            return <div className="container channel-page">
                {this.renderChannelBanner()}
                {this.renderChannelLoading()}
                <VideoList/>
            </div>
        } else if (this.props.videoListState.state === State.ERROR) {
            return <div className="container channel-page">
                <div className={"page-section hover-icon-parent"}>
                    <div className={"page-header-child"}><h3
                        className={"page-header-title"}>Error occurred while loading channel. Please try again
                        later.</h3>
                    </div>
                </div>
            </div>;
        } else {
            return <Loading/>
        }
    }

    public componentWillUnmount() {
        clearInterval(this.intervalGetChannelLoad);
    }

    private setCategories(videoListPageResponse: VideoListPageResponse) {
        console.log("setCategories", videoListPageResponse);
        this.setState({
            presentCategories: (videoListPageResponse.information as Channel).presentCategories
        })
    }

    private renderFilter() {
        if (this.state.showFilter) {
            return <VideoFilter
                onClose={this.toggleFilter}
                videoListType={VideoListType.CHANNEL}
            />
        } else {
            return null;
        }
    }

    private renderChannelLoading() {
        if (this.shouldDisplayLoadingBanner()) {
            return <div className={"page-section loading-channel"}>
                <h3>Loading channel</h3>
                <div>{this.getLoaded()} / {this.getTotal()} loaded</div>
                <div>{this.props.videoListState.videos.length} displayed</div>
                <div onClick={() => this.props.reloadChannel(this.state.channelId)} className={"refresh-icon"}>
                    <FontAwesomeIcon icon={"sync"}/></div>
            </div>
        } else {
            return null;
        }
    }

    private getLoaded(): number {
        if (this.state.loadedVideosCount > (this.props.videoListState.information as Channel).totalVideos) {
            return (this.props.videoListState.information as Channel).totalVideos;
        }
        if (this.props.videoListState.videos.length > this.state.loadedVideosCount) {
            return this.props.videoListState.videos.length;
        }

        return this.state.loadedVideosCount;
    }

    private getTotal(): number {
        if (this.state.loadFinished) {
            return this.getLoaded();
        } else {
            if (this.props.videoListState.videos.length > (this.props.videoListState.information as Channel).totalVideos) {
                return this.props.videoListState.videos.length;
            }
            return (this.props.videoListState.information as Channel).totalVideos;
        }
    }

    private getChannelLoad() {
        callGetChannelLoadById(this.state.channelId).then((data) => {
            console.log("getChannelLoad", data);
            this.setState({
                loadedVideosCount: data.videoCount,
                loadFinished: data.loadFinished
            });
            if (data.loadFinished) {
                clearInterval(this.intervalGetChannelLoad);
            }
        })

    }

    private toggleFilter() {
        this.setState({
            showFilter: !this.state.showFilter
        })

    }

    private renderSettingsIcon() {
        return (<span className={"header-menu-icon"} onClick={(e) => {
            this.menu.handleEvent(e);
        }}>
        <FontAwesomeIcon icon={"ellipsis-v"}/></span>)
    }

    private toggleStatistics() {
        this.setState({
            showStatistics: !this.state.showStatistics
        })
    }

    private renderChannelBanner() {
        return (
            <div className={"page-header page-section hover-shadow"}>
                <MenuProvider ref={ref => this.menu = ref} className={"page-header-child"}
                              id={"channel_menu_id_" + this.state.channelId}>
                    <div onClick={this.toggleHeader}>

                        {this.renderSettingsIcon()}
                        <ChannelImage className={"page-header-image"} channelId={(this.props.videoListState.information as Channel).youtubeId} imageUrl={(this.props.videoListState.information as Channel).image}/>
                        <h1 className={"page-header-title"}>{(this.props.videoListState.information as Channel).title}</h1>
                    </div>
                    {this.renderStatistics()}
                    {this.renderFilter()}
                </MenuProvider>
                <Menu id={"channel_menu_id_" + this.state.channelId}>
                    <Item onClick={this.toggleFilter}>{this.state.showFilter ? "Hide filter" : "Show filter"}</Item>
                    <Item
                        onClick={this.toggleStatistics}>{this.state.showStatistics ? "Hide statistics" : "Show statistics"}</Item>
                    <Item onClick={()=>exportAsFile(this.props.videosList.videos)}>Export</Item>
                    <AddTagToAllSubmenu
                        videos={this.props.videosList.videos}
                    />
                    {this.props.userRole !== VISITOR_ROLE ?
                        <RemoveCategorySubmenu
                            channel={this.props.videoListState.information as Channel}
                            presentCategories={this.state.presentCategories}
                            onClick={this.removeCategory}
                        />
                        : null}
                    {this.props.userRole !== VISITOR_ROLE ?
                        <AddCategorySubmenu
                            channel={this.props.videoListState.information as Channel}
                            presentCategories={this.state.presentCategories}
                            onClick={this.addCategory}
                        />
                        : null}

                </Menu>
            </div>
        )
    }

    private removeCategory(categoryName) {
        return callRemoveChannelFromCategory(categoryName, this.state.channelId).then((channel: Channel) => {
            this.setState({
                presentCategories: this.state.presentCategories.filter((category) => {
                    return category !== categoryName;
                })
            })
        })
    }

    private addCategory(categoryName) {
        return callAddChannelToCategory(categoryName, this.state.channelId).then((channel: Channel) => {
            this.state.presentCategories.push(categoryName);

            this.setState({
                presentCategories: this.state.presentCategories
            })
        })
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

    private renderStatistics() {
        if (this.state.showStatistics) {
            return <VideoListStatistics
                onClose={this.toggleStatistics}
                videoListType={VideoListType.CHANNEL}
                videos={this.props.videoListState.videos}/>
        } else {
            return null;
        }
    }

    private shouldDisplayLoadingBanner() {
        if (!this.state.loadFinished) {
            return this.props.videoListState.state === State.OK && this.props.videoListState.videoListType === VideoListType.CHANNEL && !(this.props.videoListState.information as Channel).loaded;
        } else {
            return this.props.videoListState.videos.length < this.state.loadedVideosCount
        }
    }
}

interface CategorySubmenuProps {
    channel: Channel,
    onClick: any,
    presentCategories: string[]
}

const RemoveCategorySubmenu = (props: CategorySubmenuProps) => (
    <Submenu label="Remove from category">
        {props.channel.allCategories.map((category: string) => {
            return <Item
                key={"submenu-category-" + category}
                onClick={(e: MenuItemEventHandler) => {
                    props.onClick(category)
                }}
                disabled={!props.presentCategories.some(existingCategory => {
                    return existingCategory === category
                })}
            >{category}</Item>
        })}
    </Submenu>
);

const AddCategorySubmenu = (props: CategorySubmenuProps) => (
    <Submenu label="Put into category">
        {props.channel.allCategories.map((category: string) => {
            return <Item
                key={"submenu-category-" + category}
                onClick={(e: MenuItemEventHandler) => {
                    props.onClick(category)
                }}
                disabled={props.presentCategories.some(existingCategory => {
                    return existingCategory === category
                })}
            >{category}</Item>
        })}
    </Submenu>
);


const mapStateToProps = (appState: AppState) => {
    return {
        videosList: getVisibleVideos(appState),
        videoListState: {
            ...appState.videoListState,
        },
        userRole: appState.userState.role
    };
};

export default connect(mapStateToProps, {getChannel, reloadChannel})(ChannelPage)