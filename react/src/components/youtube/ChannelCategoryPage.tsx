import VideoList from './VideoList';
import * as React from "react";
import {RouteComponentProps} from "react-router";
import autobind from 'class-autobind';
import Loading from "../util/Loading";
import {getCategory} from "../../actions/youtubeActions";
import {connect} from "react-redux";
import State from "../../types/State";
import {VideoListState} from "../../types/VideoListState";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {dom, library} from '@fortawesome/fontawesome-svg-core'
import VideoFilter from "./VideoFilter";
import {AppState} from "../../store/rootReducer";
import {Item, Menu, MenuProvider} from "react-contexify";
import "./ChannelPage.scss"

import {faInfo, faSearch} from "@fortawesome/free-solid-svg-icons";
import VideoListStatistics from "./VideoListStatistics";
import "./ChannelCategoryPage.scss"
import {Video, VideoListType} from "../../types/generatedTypes";
import AddTagToAllSubmenu from "../util/AddTagToAllSubmenu";
import {exportAsFile} from "../../utils/exportAsFile";
import {getVisibleVideos} from "../../store/videoSelector";

library.add(faSearch, faInfo);

dom.watch();

interface ChannelCategoryPageState {
    showFilter: boolean;
    showStatistics: boolean;
    categoryName: string;
}

interface ConnectedProps {
    videosList: {videos: Video[]},
    getCategory: (categoryName: string) => any,
    videoListState: VideoListState
}

class ChannelCategoryPage extends React.Component<ConnectedProps & RouteComponentProps<any, any>, ChannelCategoryPageState> {
    private menu: any;

    constructor(props) {
        super(props);
        document.title = "Category | Videomark.app";

        this.state = {
            showFilter: false,
            showStatistics: false,
            categoryName: this.props.match.params.id,
        };
        console.log("ChannelPage props", props);
        this.props.getCategory(this.props.match.params.id);
        autobind(this);
    }

    public render() {
        if (this.props.videoListState.state === State.OK && this.props.videoListState.id === this.state.categoryName) {
            document.title = this.state.categoryName + " | Videomark.app";

            return <div className="container">
                {this.renderCategoryBanner()}
                <VideoList/>
            </div>
        } else {
            return <Loading/>
        }
    }

    private renderFilter() {
        if (this.state.showFilter) {
            return <VideoFilter
                videoListType={VideoListType.CHANNEL}
                onClose={this.toggleFilter}

            />
        } else {
            return null;
        }
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

    private renderCategoryBanner() {
        const menuId = "channel_menu_id_" + this.state.categoryName;

        if (this.props.videoListState.state === State.OK) {
            return (
                <div className={"page-header hover-shadow page-section"}>
                    <MenuProvider ref={ref => this.menu = ref}
                                  className={"page-header-child"}
                                  id={menuId}>
                        <div onClick={this.toggleHeader}>
                            {this.renderSettingsIcon()}
                            <h1 className={"page-header-title"}>{this.state.categoryName}</h1>
                        </div>
                        {this.renderStatistics()}
                        {this.renderFilter()}
                    </MenuProvider>
                    <Menu id={menuId}>
                        <Item onClick={this.toggleFilter}>{this.state.showFilter ? "Hide filter" : "Show filter"}</Item>
                        <Item
                            onClick={this.toggleStatistics}>{this.state.showStatistics ? "Hide statistics" : "Show statistics"}</Item>
                        <Item onClick={()=>exportAsFile(this.props.videosList.videos)}>Export</Item>
                        <AddTagToAllSubmenu
                            videos={this.props.videosList.videos}
                        />
                    </Menu>
                </div>
            )
        } else {
            return null;
        }
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
            return <VideoListStatistics onClose={this.toggleStatistics} videoListType={VideoListType.CHANNEL}
                                        videos={this.props.videoListState.videos}/>
        } else {
            return null;
        }
    }
}

const mapStateToProps = (appState: AppState) => {
    return {
        videosList: getVisibleVideos(appState),
        videoListState: {
            ...appState.videoListState,
        }
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getCategory: (categoryName: string) => dispatch(getCategory(categoryName))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChannelCategoryPage)