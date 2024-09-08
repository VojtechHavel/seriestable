import * as React from "react";
import autobind from 'class-autobind';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {dom, library} from '@fortawesome/fontawesome-svg-core'
import {MenuProvider} from "react-contexify";
import "./ChannelPage.scss"

import {faInfo, faSearch} from "@fortawesome/free-solid-svg-icons";
import {Category, Channel} from "../../types/generatedTypes";
import {Link} from "react-router-dom";
import {ChannelMenu} from "./ChannelMenu";
import Modal from "../util/Modal";
import AddFormView from "../util/AddFormView";
import State from "../../types/State";
import "./ChannelTile.scss"
import ChannelImage from "./ChannelImage";

library.add(faSearch, faInfo);

dom.watch();

interface ChannelTileProps {
    channel: Channel,
    removeChannelFromCategory: (category: string, channelId: string) => any,
    category: Category,
    categories: Category[],
    addChannelToCategory: any,
    addCategory: any
}

interface ChannelTileState {
    showAddCategoryModal: boolean,
    addingCategoryState: State
}

class ChannelTile extends React.Component<ChannelTileProps, ChannelTileState> {
    private channelMenu: any = null;

    constructor(props) {
        super(props);
        this.state = {
            showAddCategoryModal: false,
            addingCategoryState: State.INITIAL
        };
        autobind(this);
    }

    public render() {
        const menuId = this.props.category.name + "_channel_menu_id_" + this.props.channel.youtubeId;

        return (<div className={"channel-tile tile col-md-3 col-lg-2 col-6"}>
            <MenuProvider className={"tile-child channel-tile-child"} ref={ref => this.channelMenu = ref}
                          id={menuId}>
                {this.renderChannel(this.props.channel)}
                {this.renderChannelSettingsIcon()}

                <ChannelMenu
                    category={this.props.category}
                    menuId={menuId}
                    categories={this.props.categories}
                    putChannelIntoCategory={this.props.addChannelToCategory}
                    addCategory={this.handleOpenAddCategoryModal}
                    channel={this.props.channel}
                    removeChannelFromCategory={this.removeFromCategory}
                />

                <Modal
                    key="AddCategoryFromChannelModal"
                    onClose={this.handleCloseAddCategoryModal}
                    showModal={this.state.showAddCategoryModal}>
                    <AddFormView
                        placeholder={"Category name"}
                        title={"Add new category for channels"}
                        processing={this.state.addingCategoryState}
                        onSubmit={this.addCategory}/>
                </Modal>
            </MenuProvider>
        </div>);
    }


    private addCategory(categoryName: string) {
        this.setState({
            addingCategoryState: State.PROCESSING
        });
        this.props.addCategory(categoryName).then(() => {
            // toast.success("Category added.")
        }).finally(() => {
                this.setState({
                    addingCategoryState: State.OK,
                    showAddCategoryModal: false
                });
            }
        )
    }

    private renderChannel(channel: Channel) {


        return (<Link className={"tile-link channel-link hover-shadow"} to={"youtube/channels/" + channel.youtubeId}>
            <div className={"tile-title channel-title"}>{channel.title}</div>
            <ChannelImage channelId={this.props.channel.youtubeId} imageUrl={this.props.channel.image}/>
        </Link>)
    }

    private handleCloseAddCategoryModal() {
        this.setState({
            showAddCategoryModal: false
        })
    }


    private handleOpenAddCategoryModal() {
        this.setState({
            showAddCategoryModal: true
        })
    }

    private renderChannelSettingsIcon() {
        return (<span className={"tile-menu-icon channel-menu-icon"} onClick={(e) => {
            console.log("mouse down");
            // @ts-ignore
            // e.preventDefault();

            console.log("channelMenu", this.channelMenu);
            console.log("e", e);

            this.channelMenu.handleEvent(e);
        }}>
        <FontAwesomeIcon icon={"ellipsis-v"}/></span>)
    }


    private removeFromCategory(category: string, channelId: string) {
        this.props.removeChannelFromCategory(category, channelId);
    }

}

export default ChannelTile;