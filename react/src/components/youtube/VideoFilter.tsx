import * as React from "react";
import autobind from 'class-autobind';
import {connect} from "react-redux";
import {AppState} from "../../store/rootReducer";
import "./VideoFilter.scss";
import {debounce} from 'lodash';
import {
    addTagInclusion,
    clearFilter,
    removeTagInclusion,
    setSearchByType,
    setSearchByValue,
    setSortBy,
    setVideoState,
} from "../../actions/filterActions";
import {UserState} from "../../types/UserState";
import {VISITOR_ROLE} from "../../actions/userActions";
import {Item, Menu, MenuProvider} from "react-contexify";
import {
    Filter,
    InclusionType,
    SortByOption,
    Tag,
    VideoListType,
    VideoSearchBy,
    VideoState
} from "../../types/generatedTypes";
import {dom, IconProp, library} from "@fortawesome/fontawesome-svg-core";
import {MenuItemEventHandler} from "react-contexify/lib/types";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {TagState} from "../../store/tagReducer";
import {VideoListState} from "../../types/VideoListState";
import {faTimes} from "@fortawesome/free-solid-svg-icons";

library.add(faTimes);
dom.watch();

export interface VideoFilterProps {
    videoListType: VideoListType,
    onClose: () => void
}

interface StateProps {
    filterState: Filter,
    userState: UserState,
    tagState: TagState,
    videoListState: VideoListState
}

interface DispatchProps {
    setVideoState: (videoState: VideoState, show: boolean) => any,
    setSearchByType: (videoSearchBy: VideoSearchBy, show: boolean) => any,
    setSortBy: (sortByOption: SortByOption) => any,
    addTagInclusion: (tag: string, inclusionType: InclusionType) => any,
    removeTagInclusion: (tag: string, inclusionType: InclusionType) => any,
    setSearchByValue: (title: string) => any,
    clearFilter: () => any,
}

interface VideoFilterState {
    shorterThanMinutes: number
    shorterThanSeconds: number,
    searchByTitle: string
}

class VideoFilter extends React.Component<VideoFilterProps & StateProps & DispatchProps, VideoFilterState> {
    private debouncedSearch = debounce(() => {
        console.log("calling");
        this.props.setSearchByValue(this.state.searchByTitle)
    }, 700);

    constructor(props) {
        super(props);
        this.state = {
            searchByTitle: this.props.filterState.title ? this.props.filterState.title : "",
            shorterThanMinutes: 0,
            shorterThanSeconds: 0
        };
        autobind(this);
    }

    public render() {
        console.log("rendering filter");
        return (
            <div className={"video-filter"}>
                <h3>Search</h3>
                {this.renderSearch()}
                <h3>Filter</h3>
                {this.renderStateFilter()}
                {this.props.userState.role === VISITOR_ROLE ? null : this.renderTags()}
                <h3>Sort</h3>
                {this.renderSorting()}
                {this.renderClearFilter()}
            </div>
        )
    }

    private renderStateFilter() {
        if (this.props.videoListType !== VideoListType.CONTINUE_WATCHING) {
            return (
                <div className="video-state-filter">
                    <div className="row">
                        <div className="col-button col-lg-2 offset-lg-3">

                            <button type="button" onClick={() => {
                                this.props.setVideoState(VideoState.NOT_STARTED, !this.props.filterState.notStarted)
                            }}
                                    className={this.props.filterState.notStarted ? "btn btn-primary" : "btn btn-default"}>
                                Not Started
                            </button>
                        </div>
                        <div className="col-button col-lg-2">

                            <button type="button" onClick={() => {
                                this.props.setVideoState(VideoState.STARTED, !this.props.filterState.started)
                            }}
                                    className={this.props.filterState.started ? "btn btn-primary" : "btn btn-default"}>Started
                            </button>

                        </div>
                        <div className="col-button col-lg-2">

                            <button type="button" onClick={() => {
                                this.props.setVideoState(VideoState.FINISHED, !this.props.filterState.finished)
                            }}
                                    className={this.props.filterState.finished ? "btn btn-primary" : "btn btn-default"}>Finished
                            </button>
                        </div>

                    </div>
                </div>);
        } else {
            return null;
        }
    }

    private renderSorting() {
        return (
            <div className="video-sorting">
                <div className="">
                    <div className={"row sort-label"}>
                        <div className={"col-lg-12"}>
                            Sort by duration
                        </div>
                    </div>
                    <div className={"row"}>
                        <button type="button" onClick={() => this.props.setSortBy(SortByOption.SHORTEST)}
                                className={this.props.filterState.sortBy === SortByOption.SHORTEST ? "btn btn-primary col-lg-3 offset-lg-3" : "btn btn-default col-lg-3 offset-lg-3"}>Shortest
                            first
                        </button>
                        <button type="button" onClick={() => this.props.setSortBy(SortByOption.LONGEST)}
                                className={this.props.filterState.sortBy === SortByOption.LONGEST ? "btn btn-primary col-lg-3" : "btn btn-default col-lg-3"}>Longest
                            first
                        </button>
                    </div>

                    {this.renderSortByRemaining()}

                    <div className={"row sort-label"}>
                        <div className={"col-lg-12"}>
                            Sort by date
                        </div>
                    </div>

                    <div className={"row"}>

                        <button type="button" onClick={() => this.props.setSortBy(SortByOption.NEWEST)}
                                className={this.props.filterState.sortBy === SortByOption.NEWEST ? "btn btn-primary col-lg-3 offset-lg-3" : "btn btn-default col-lg-3 offset-lg-3"}>Newest
                            first
                        </button>
                        <button type="button" onClick={() => this.props.setSortBy(SortByOption.OLDEST)}
                                className={this.props.filterState.sortBy === SortByOption.OLDEST ? "btn btn-primary col-lg-3" : "btn btn-default col-lg-3"}>Oldest
                            first
                        </button>
                    </div>
                    {this.renderSortByAdded()}
                    {this.renderSortByLastWatched()}

                    <div className={"row sort-label"}>
                        <div className={"col-lg-12"}>
                            Sort by statistics
                        </div>
                    </div>
                    {this.renderSortByViews()}
                    {this.renderSortByLikes()}
                    {this.renderSortByRatio()}

                </div>
            </div>);
    }

    private renderSortByRemaining() {
        if (this.props.userState.role === VISITOR_ROLE) {
            return null;
        } else {
            return (<div className={"row"}>

                <button type="button" onClick={() => this.props.setSortBy(SortByOption.SHORTEST_REMAINING)}
                        className={this.props.filterState.sortBy === SortByOption.SHORTEST_REMAINING ? "btn btn-primary col-lg-3 offset-lg-3" : "btn btn-default col-lg-3 offset-lg-3"}>Shortest
                    remaining first
                </button>
                <button type="button" onClick={() => this.props.setSortBy(SortByOption.LONGEST_REMAINING)}
                        className={this.props.filterState.sortBy === SortByOption.LONGEST_REMAINING ? "btn btn-primary col-lg-3" : "btn btn-default col-lg-3"}>Longest
                    remaining first
                </button>
            </div>)
        }
    }

    private renderSortByAdded() {
        if (this.props.videoListType === VideoListType.TAG) {
            return (
                <div className={"row"}>

                    <button type="button" onClick={() => this.props.setSortBy(SortByOption.ADDED_FIRST)}
                            className={this.props.filterState.sortBy === SortByOption.ADDED_FIRST ? "btn btn-primary col-lg-3 offset-lg-3" : "btn btn-default col-lg-3 offset-lg-3"}>
                        Recently added first
                    </button>
                    <button type="button" onClick={() => this.props.setSortBy(SortByOption.ADDED_LAST)}
                            className={this.props.filterState.sortBy === SortByOption.ADDED_LAST ? "btn btn-primary col-lg-3" : "btn btn-default col-lg-3"}>
                        Recently added last
                    </button>
                </div>
            )
        } else {
            return null;
        }
    }

    private renderSortByViews() {
        return (
            <div className={"row"}>

                <button type="button" onClick={() => this.props.setSortBy(SortByOption.MOST_VIEWS)}
                        className={this.props.filterState.sortBy === SortByOption.MOST_VIEWS ? "btn btn-primary col-lg-3 offset-lg-3" : "btn btn-default col-lg-3 offset-lg-3"}>
                    Most views
                </button>
                <button type="button" onClick={() => this.props.setSortBy(SortByOption.LEAST_VIEWS)}
                        className={this.props.filterState.sortBy === SortByOption.LEAST_VIEWS ? "btn btn-primary col-lg-3" : "btn btn-default col-lg-3"}>
                    Least views
                </button>
            </div>
        )
    }

    private renderSortByLikes() {
        return (
            <div className={"row"}>

                <button type="button" onClick={() => this.props.setSortBy(SortByOption.MOST_LIKES)}
                        className={this.props.filterState.sortBy === SortByOption.MOST_LIKES ? "btn btn-primary col-lg-2 offset-lg-3" : "btn btn-default col-lg-2 offset-lg-3"}>
                    Most likes
                </button>
                <button type="button" onClick={() => this.props.setSortBy(SortByOption.MOST_DISLIKES)}
                        className={this.props.filterState.sortBy === SortByOption.MOST_DISLIKES ? "btn btn-primary col-lg-2" : "btn btn-default col-lg-2"}>
                    Most dislikes
                </button>
                <button type="button" onClick={() => this.props.setSortBy(SortByOption.MOST_COMMENTS)}
                        className={this.props.filterState.sortBy === SortByOption.MOST_COMMENTS ? "btn btn-primary col-lg-2" : "btn btn-default col-lg-2"}>
                    Most comments
                </button>
            </div>
        )
    }

    private renderSortByRatio() {
        return [
            <div key={"renderSortByRatio-positive"} className={"row"}>

                <button type="button" onClick={() => this.props.setSortBy(SortByOption.HIGHEST_LIKES_TO_DISLIKES_RATIO)}
                        className={this.props.filterState.sortBy === SortByOption.HIGHEST_LIKES_TO_DISLIKES_RATIO ? "btn btn-primary col-lg-3 offset-lg-3" : "btn btn-default col-lg-3 offset-lg-3"}>
                    Most likes to dislikes
                </button>
                <button type="button" onClick={() => this.props.setSortBy(SortByOption.HIGHEST_COMMENTS_TO_VIEWS_RATIO)}
                        className={this.props.filterState.sortBy === SortByOption.HIGHEST_COMMENTS_TO_VIEWS_RATIO ? "btn btn-primary col-lg-3" : "btn btn-default col-lg-3"}>
                    Most comments to views
                </button>
            </div>,
            <div key={"renderSortByRatio-likes"}  className={"row"}>

                <button type="button" onClick={() => this.props.setSortBy(SortByOption.HIGHEST_LIKES_TO_VIEWS_RATIO)}
                        className={this.props.filterState.sortBy === SortByOption.HIGHEST_LIKES_TO_VIEWS_RATIO ? "btn btn-primary col-lg-3 offset-lg-3" : "btn btn-default col-lg-3 offset-lg-3"}>
                    Most likes to views
                </button>
                <button type="button" onClick={() => this.props.setSortBy(SortByOption.HIGHEST_DISLIKE_TO_VIEWS_RATIO)}
                        className={this.props.filterState.sortBy === SortByOption.HIGHEST_DISLIKE_TO_VIEWS_RATIO ? "btn btn-primary col-lg-3" : "btn btn-default col-lg-3"}>
                    Most dislikes to views
                </button>
            </div>

        ]
    }

    private renderSortByLastWatched() {
        return (
            <div className={"row"}>
                <button type="button" onClick={() => this.props.setSortBy(SortByOption.WATCHED_FIRST)}
                        className={this.props.filterState.sortBy === SortByOption.WATCHED_FIRST ? "btn btn-primary col-lg-3 offset-lg-3" : "btn btn-default col-lg-3 offset-lg-3"}>Recently
                    watched
                    first
                </button>
                <button type="button" onClick={() => this.props.setSortBy(SortByOption.WATCHED_LAST)}
                        className={this.props.filterState.sortBy === SortByOption.WATCHED_LAST ? "btn btn-primary col-lg-3" : "btn btn-default col-lg-3"}>Recently
                    watched
                    last
                </button>
            </div>
        )
    }

    private renderTags() {
        const includeTagsId = "menu_id_must_include_tag";
        const excludeTagsId = "menu_id_must_exclude_tag";

        return (
            <div>
                <div className={"row"}>
                    <MenuProvider event="onClick" className={"btn btn-default col-lg-3 offset-lg-3"}
                                  id={includeTagsId}>
                        Must be tagged
                    </MenuProvider>
                    {this.renderIncludeTagMenu(includeTagsId, InclusionType.INCLUDE)}
                    <MenuProvider event="onClick" className={"btn btn-default col-lg-3"}
                                  id={excludeTagsId}>
                        Must not be tagged
                    </MenuProvider>
                    {this.renderIncludeTagMenu(excludeTagsId, InclusionType.EXCLUDE)}
                </div>
                <div className={"row tag-inclusion"}>
                    <div className={"col-lg-3 offset-lg-3"}>
                        {this.renderIncludeTags(InclusionType.INCLUDE)}
                    </div>
                    <div className={"col-lg-3"}>
                        {this.renderIncludeTags(InclusionType.EXCLUDE)}
                    </div>
                </div>
            </div>

        )
    }

    private handleSearchByTitleChange(event) {
        const target = event.target;
        const value = target.value;

        this.setState({
            searchByTitle: value
        });

        this.debouncedSearch();
    }

    private onSubmit(event) {
        event.preventDefault();
        this.props.setSearchByValue(this.state.searchByTitle);
    }

    private renderSearch() {
        return (
            <div className="video-search">
                <div className={"row"}>
                    <div className="col-button offset-lg-3 col-lg-2">
                        <button type="button" onClick={() => {
                            this.props.setSearchByType(VideoSearchBy.TITLE, !this.props.filterState.searchByTitle)
                        }}
                                className={this.props.filterState.searchByTitle ? "btn btn-primary" : "btn btn-default"}>
                            Title
                        </button>
                    </div>

                    <div className="col-button col-lg-2">
                        <button type="button" onClick={() => {
                            this.props.setSearchByType(VideoSearchBy.DESCRIPTION, !this.props.filterState.searchByDescription)
                        }}
                                className={this.props.filterState.searchByDescription ? "btn btn-primary" : "btn btn-default"}>Description
                        </button>
                    </div>

                    <div className="col-button col-lg-2">
                        <button type="button" onClick={() => {
                            this.props.setSearchByType(VideoSearchBy.NOTE, !this.props.filterState.searchByNote)
                        }}
                                className={this.props.filterState.searchByNote ? "btn btn-primary" : "btn btn-default"}>Note
                        </button>
                    </div>
                </div>

                <div className={"row"}>
                    <div className={"offset-lg-3 col-lg-6 title-input"}>
                        <form onSubmit={this.onSubmit}>
                            <input
                                autoFocus={true}
                                autoComplete={"off"}
                                className="form-control"
                                id="formSearchBy"
                                name="searchByTitle"
                                type="text"
                                value={this.state.searchByTitle}
                                onChange={this.handleSearchByTitleChange}
                            />
                        </form>
                    </div>
                </div>

            </div>);
    }

    private renderIncludeTagMenu(id: string, includeType: InclusionType) {
        console.log("renderIncludeTagMenu", includeType);
        console.log("renderIncludeTagMenu id", id);
        const menuTags = this.props.tagState.tags
            .filter((tag: Tag) => {
                const inclusionTags = this.props.filterState.includeTags.concat(this.props.filterState.excludeTags);
                if (this.props.videoListState.videoListType === VideoListType.TAG) {
                    inclusionTags.push(this.props.videoListState.id);
                }
                return !inclusionTags.some(includeTags => {
                    return includeTags === tag.name
                })
            });

        if (menuTags.length > 0) {
            return <Menu id={id}>
                {
                    menuTags.map((tag: Tag) => {

                        let icon: IconProp = "tag";
                        if (tag.icon) {
                            icon = tag.icon as IconProp
                        }

                        const iconStyle = {
                            color: tag.color ? tag.color : "#2196F3"
                        };

                        return <Item
                            key={id + "submenu-tag-" + tag.name}
                            onClick={(e: MenuItemEventHandler) => {
                                console.log("includeType", includeType);
                                this.props.addTagInclusion(tag.name, includeType)
                            }}
                        ><span style={iconStyle} className={"menu-tag-icon"}><FontAwesomeIcon
                            icon={icon}/></span> {tag.name}
                        </Item>
                    })}
            </Menu>
        } else {
            return (<Menu id={id}><Item disabled={true}>Empty</Item></Menu>)
        }
    }

    private renderIncludeTags(inclusionType: InclusionType) {
        let inclusionTags;
        if (inclusionType === InclusionType.INCLUDE) {
            inclusionTags = this.props.filterState.includeTags
        } else {
            inclusionTags = this.props.filterState.excludeTags;
        }

        return inclusionTags.map((tagName: string) => {
            const tag: Tag | undefined = this.props.tagState.tags.find((tagFound: Tag) => {
                return tagFound.name === tagName;
            });

            if (!tag) {
                return null;
            } else {
                let icon: IconProp = "tag";
                if (tag.icon) {
                    icon = tag.icon as IconProp
                }

                const iconStyle = {
                    color: tag.color ? tag.color : "#2196F3"
                };

                return (<div
                    onClick={() => {
                        this.props.removeTagInclusion(tag.name, inclusionType)
                    }}
                    key={"tag_inclusion_" + inclusionType + "_" + tag.key}
                    className={"row tag-inclusion-row"}>
                    <div className={"col-lg-12"}>
                                <span style={iconStyle} className={"menu-tag-icon"}><FontAwesomeIcon
                                    icon={icon}/></span> {tag.name} <span
                        className={"remove-tag-inclusion"}>
                                <FontAwesomeIcon
                                    icon={"times"}/>
                            </span>
                    </div>
                </div>)
            }
        })
    }

    private renderClearFilter() {
        return (
            <button type={"button"} onClick={this.clearFilter} className="btn btn-link">Clear</button>
        )
    }

    private clearFilter() {
        this.setState({
            searchByTitle: ""
        });
        this.props.clearFilter();
    }
}

const mapStateToProps = ({filterState, userState, tagState, videoListState}: AppState) => {
    return {
        filterState,
        userState,
        tagState,
        videoListState,
    };
};

export default connect<StateProps, DispatchProps, VideoFilterProps>(mapStateToProps, {
    setVideoState,
    setSortBy,
    setSearchByType,
    setSearchByValue,
    removeTagInclusion,
    addTagInclusion,
    clearFilter
})(VideoFilter)