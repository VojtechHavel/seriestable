import * as React from 'react';
import "./VideoTileView.scss"
import autobind from 'class-autobind';
import {Tag} from "../../types/generatedTypes";
import {connect} from "react-redux";
import {Item, Menu, MenuProvider} from "react-contexify";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {removeTag, editTag} from "../../actions/tagActions";
import "./TagTile.scss"
import {addPlaylistToTag, addVideoToTag} from "../../actions/youtubeActions";
import Modal from "../util/Modal";
import AddFormView from "../util/AddFormView";
import State from "../../types/State";

import {dom, library} from '@fortawesome/fontawesome-svg-core'
import {faEllipsisV} from "@fortawesome/free-solid-svg-icons";
import EditTagModal from "./TagEditModal";
import {TagIcon} from "./TagIcon";
import Confirm from "../util/Confirm";
import {toast} from "react-toastify";

library.add(faEllipsisV);
dom.watch();


export interface TagTileProps {
    tag: Tag,
    rootClass: string,
}

interface ConnectedProps {
    removeTag: (tag: string) => any,
    addVideoToTag: (videoUrlOrId: string, tag: string) => any
    editTag: (newTag: Tag, tag: string) => any
    addPlaylistToTag: (playlistUrlOrId: string, tag: string) => any
}

export interface TagTileState {
    showAddVideoModal: boolean,
    showEditTagModal: boolean
    showAddPlaylistModal: boolean,
    showDeleteTagConfirm: boolean,
    addingVideoState: State,
    addingPlaylistState: State
}

class TagTile extends React.Component<TagTileProps & ConnectedProps, TagTileState> {

    private menu: any;

    constructor(props) {
        super(props);
        this.state = {
            showAddPlaylistModal: false,
            showEditTagModal: false,
            showDeleteTagConfirm: false,
            addingVideoState: State.INITIAL,
            showAddVideoModal: false,
            addingPlaylistState: State.INITIAL
        };
        autobind(this);
    }

    public render() {

        console.log("rerender Tag ", this.props.tag.name);

        const menuId = "tag_menu_id_" + this.props.tag.key;



        return <div className={"tile tag-tile " + this.props.rootClass}>
            <MenuProvider ref={ref => this.menu = ref} className={"tile-child"}
                          id={menuId}>
                {this.renderSettingsIcon()}
                <Link className={"tile-link hover-shadow"} to={"tags/" + this.props.tag.name}>
                    <div className={"tile-title tag-tile-title"}>
                        {this.props.tag.name}
                    </div>
                    <TagIcon tag={this.props.tag}/>
                </Link>
            </MenuProvider>
            <Menu id={menuId}>
                <Item onClick={() => this.toggleAddVideoModal()}>Add Video</Item>
                <Item onClick={() => this.toggleAddPlaylistModal()}>Add Playlist</Item>
                <Item onClick={() => this.toggleEditTagModal()}>Edit Tag</Item>
                <Item onClick={this.toggleDeleteTagConfirm}>Remove Tag</Item>
            </Menu>
            <Modal
                key="addVideoModal"
                onClose={this.toggleAddVideoModal}
                showModal={this.state.showAddVideoModal}>
                <AddFormView
                    title={"Add video to tag '" + this.props.tag.name + "'"}
                    placeholder={"video url"}
                    processing={this.state.addingVideoState}
                    onSubmit={this.addTagToVideo}/>
            </Modal>
            <Modal
                key="addPlaylistModal"
                onClose={this.toggleAddPlaylistModal}
                showModal={this.state.showAddPlaylistModal}>
                <AddFormView
                    title={"Add all videos in playlist to tag '" + this.props.tag.name + "'"}
                    placeholder={"playlist"}
                    processing={this.state.addingPlaylistState}
                    onSubmit={this.addPlaylistToTag}/>
            </Modal>
            <EditTagModal
                tag={this.props.tag}
                onSubmit={this.handleEditTag}
                onClose={this.toggleEditTagModal}
                showModal={this.state.showEditTagModal}
            />
            <Confirm
                title={"Are you sure you want to delete the whole tag?"}
                onClose={this.toggleDeleteTagConfirm}
                visible={this.state.showDeleteTagConfirm}
                onConfirm={() => this.props.removeTag(this.props.tag.name)}
                processing={State.INITIAL}
            />
        </div>
    }

    private handleEditTag(tag: Tag) {
        this.props.editTag(tag, this.props.tag.name).then(() => {
            this.setState({
                showEditTagModal: false
            });
        });
    }

    private renderSettingsIcon() {
        return (<span className={"tile-menu-icon"} onClick={(e) => {
            this.menu.handleEvent(e);
        }}>
        <FontAwesomeIcon icon={"ellipsis-v"}/></span>)
    }

    private toggleAddVideoModal() {
        this.setState({
            showAddVideoModal: !this.state.showAddVideoModal
        })
    }

    private toggleEditTagModal() {
        this.setState({
            showEditTagModal: !this.state.showEditTagModal
        })
    }

    private toggleDeleteTagConfirm() {
        this.setState({
            showDeleteTagConfirm: !this.state.showDeleteTagConfirm
        })
    }

    private toggleAddPlaylistModal() {
        this.setState({
            showAddPlaylistModal: !this.state.showAddPlaylistModal
        })
    }

    private addTagToVideo(videoUrl: string) {
        this.setState({
            showAddVideoModal: false
        });
        this.props.addVideoToTag(videoUrl, this.props.tag.name).then(() =>{
            toast.success("Video was tagged "+this.props.tag.name)
        });
    }

    private addPlaylistToTag(playlistUrl: string) {
        this.setState({
            addingPlaylistState: State.PROCESSING
        });
        this.props.addPlaylistToTag(playlistUrl, this.props.tag.name).then(() => {
            this.setState({
                addingPlaylistState: State.OK,
                showAddPlaylistModal: false
            });
            toast.success("All videos in playlist were tagged "+this.props.tag.name)
        }, () => {
            this.setState({
                addingPlaylistState: State.ERROR,
                showAddPlaylistModal: false
            });
        })
    }
}

export default connect<any, ConnectedProps, TagTileProps>(null, {removeTag, addVideoToTag, addPlaylistToTag, editTag})(TagTile)