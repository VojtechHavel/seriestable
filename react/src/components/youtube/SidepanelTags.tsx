import * as React from "react";
import autobind from 'class-autobind';
import "./SidepanelTags.scss"
import {Tag, Video} from "../../types/generatedTypes";
import {TagState} from "../../store/tagReducer";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {IconProp} from "@fortawesome/fontawesome-svg-core";
import Tooltip from "../util/Tooltip";

export interface SidepanelTagsProps {
    video: Video,
    tagsState: TagState,
    toggleTag: (tag: Tag, isTagged: boolean)=>any,
    videoTags: string[]
}

interface SidepanelTagsState {
    showPresent: boolean,
    showMissing: boolean
}

export default class SidepanelTags extends React.Component<SidepanelTagsProps, SidepanelTagsState> {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            showMissing: false,
            showPresent: true
        }
    }

    public render() {
        const activeClass = "col-md-6 btn btn-primary";
        const nonActiveClass = "col-md-6 btn btn-default";


        return <div className={"sidepanel-section"}>
            <div className="row">
                <div
                    data-tip="Show tags present on the video"
                    onClick={this.toggleShowPresent}
                    className={this.state.showPresent ? activeClass : nonActiveClass}>
                    Present
                </div>
                <div
                    data-tip="Show tags missing from the video"
                    onClick={this.toggleShowMissing}
                    className={this.state.showMissing ? activeClass : nonActiveClass}>
                    Missing
                </div>
            </div>
            <div className={"sidepanel-tags-list"}>
                {this.renderTags()}
            </div>
        </div>;
    }

    private toggleShowPresent() {
        this.setState({
            showPresent: !this.state.showPresent,
            showMissing: this.state.showPresent,
        })
    }

    private toggleShowMissing() {
        this.setState({
            showMissing: !this.state.showMissing,
            showPresent: this.state.showMissing,
        })
    }

    private renderTags() {
        return this.props.tagsState.tags.sort(this.tagSorter).map(this.renderTag)
    }

    private tagSorter = (tag1: Tag, tag2: Tag) => {
        return tag1.name.localeCompare(tag2.name)
    };

    private renderTag(tag: Tag) {
        const isTagged: boolean = this.props.videoTags.some(tagTest => tagTest === tag.name);
        if (!this.state.showMissing && !isTagged) {
            return null;
        }

        if (!this.state.showPresent && isTagged) {
            return null;
        }

        let icon: IconProp = "tag";
        if (tag.icon) {
            icon = tag.icon as IconProp
        }

        const iconStyle = {
            color: tag.color ? tag.color : "#2196F3",
            opacity: isTagged ? 1 : 0.5
        };


        return (<div className={"row"} key={tag.key}>
            <div
                data-tip={isTagged ? "Remove tag " + tag.name + " from the video" : "Add tag " + tag.name + " to the video"}
                onClick={() => {
                    this.props.toggleTag(tag, isTagged)
                }} className={"col-md-10 sidepanel-tags-list-item"}>
                <div style={iconStyle}>
                    <FontAwesomeIcon fixedWidth={true} icon={icon}/>
                    <span className={"sidepanel-tags-name"}>
                {tag.name}
                </span>
                </div>
            </div>
            <Link data-tip={"Go to tag " + tag.name} className={"col-md-2 sidepanel-tag-link"}
                  to={"/youtube/tags/" + tag.name}>
                <FontAwesomeIcon icon={"angle-right"}/>
                <Tooltip/>
            </Link>
        </div>)
    }
}