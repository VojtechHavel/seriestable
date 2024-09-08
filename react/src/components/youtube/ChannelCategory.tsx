import * as React from 'react';
import "./YoutubeOverview.scss"
import autobind from 'class-autobind';
import State from "../../types/State";
import {Item, Menu, MenuProvider} from "react-contexify";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Category, Channel} from "../../types/generatedTypes";
import AddFormView from "../util/AddFormView";
import {addChannelToCategoryFunction} from "../../actions/api/youtubeApi";
import Modal from "../util/Modal";
import "./ChannelCategory.scss"

import {
    faPen,
    faPlus,
    faTrash,
    faCheck,
    faTimes,
    faChevronDown,
    faChevronRight
} from "@fortawesome/free-solid-svg-icons";
import {dom, library} from '@fortawesome/fontawesome-svg-core'
import Confirm from "../util/Confirm";
import ChannelTile from "./ChannelTile";
import EditableName from "../util/EditableName";
import Tooltip from "../util/Tooltip";

library.add(faPlus, faPen, faTrash, faCheck, faTimes, faChevronDown, faChevronRight);
dom.watch();

export interface ChannelCategoryProps {
    category: Category
    removeChannelFromCategory: (categoryName: string, channelId: string) => any,
    addChannelToCategory: addChannelToCategoryFunction,
    categories: Category[],
    addCategory: (categoryName: string) => any,
    removeCategory: (categoryName: string) => any,
    renameCategory: (oldCategoryName: string, newCategoryName: string) => any,
    history: any
}

interface ChannelCategoryState {
    addingChannelState: State,
    addingCategoryState: State,
    showAddChannelModal: boolean,
    renamingCategory: boolean,
    deleteCategoryConfirmVisible: boolean,
    collapsed: boolean,
    categoryName: string
}

export const RECOMMENDED_KEY: string = "SERIESTABLE_DEFAULT_RECOMMENDED_CHANNELS_KEY";

class ChannelCategory extends React.Component<ChannelCategoryProps, ChannelCategoryState> {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            addingChannelState: State.INITIAL,
            addingCategoryState: State.INITIAL,
            showAddChannelModal: false,
            renamingCategory: false,
            deleteCategoryConfirmVisible: false,
            collapsed: false,
            categoryName: this.props.category.name
        }
    }

    public render() {
        if (this.props.category.key !== RECOMMENDED_KEY) {
            return this.renderCategory();
        } else {
            return this.renderRecommendedSection();
        }
    }

    private renderRecommendedSection() {
        return (
            <div className={"channel-category recommended-section"}>
                <div className={"page-section hover-icon-parent"}>
                    <div className={"channel-category-menu row"}><span
                        className={"page-header-title"}>Recommended</span></div>
                    {this.renderCollapseIcon()}
                    {this.renderChannels()}
                </div>
            </div>
        )
    }

    private renderCategory() {

        const menuId = this.props.category.key + "category_menu_id";

        return (
            <div onClick={this.redirectToCategoryPage} className={"hover-shadow channel-category"}>
                <MenuProvider className={"hover-section page-section hover-icon-parent"}
                              id={menuId}>
                    <div className="channel-category-menu row">
                        <EditableName
                            className={"page-header-title"}
                            onSubmit={this.onRename}
                            editable={this.state.renamingCategory}
                            value={this.state.categoryName}
                            onCancel={this.onDisableRenamingCategory}
                            onEdit={this.onEnableRenamingCategory}
                        />
                        {this.state.renamingCategory ? null : this.renderCategoryMenuIcons()}

                    </div>
                    {this.renderCollapseIcon()}
                    {this.renderChannels()}
                </MenuProvider>
                <Menu id={menuId}>
                    <Item onClick={this.onEnableRenamingCategory}>Rename category</Item>
                    <Item onClick={this.onDeleteCategoryConfirmOpen}>Delete category</Item>
                    <Item onClick={this.handleOpenAddChannelModal}>Add channel</Item>
                </Menu>
                <Confirm
                    title={"Are you sure you want to delete the whole category?"}
                    onClose={this.onDeleteCategoryConfirmClose}
                    visible={this.state.deleteCategoryConfirmVisible}
                    onConfirm={this.removeCategory}
                    processing={State.INITIAL}
                />
                <Tooltip/>
            </div>
        )
    }

    private redirectToCategoryPage(e) {

        console.log("classes", e.target.classList);

        const isAllowedClass: boolean = e.target.classList.contains("channel-overview") ||
            e.target.classList.contains("page-section") ||
            e.target.classList.contains("channel-category-menu") ||
            e.target.classList.contains("page-header-child") ||
            e.target.classList.contains("channel-tile")
        ;

        if (this.state.renamingCategory) {

            if (isAllowedClass) {
                this.setState({
                    renamingCategory: false
                })
            }
        } else {


            if (isAllowedClass) {
                this.props.history.push('/youtube/categories/' + this.props.category.name)
            }
        }
    }

    private onEnableRenamingCategory() {
        this.setState({
            renamingCategory: true
        });
    }

    private onDisableRenamingCategory() {

        this.setState({
            renamingCategory: false
        })
    }

    private removeCategory() {
        this.props.removeCategory(this.props.category.name);
    }

    private renderCollapseIcon() {
        if (this.state.collapsed) {
            return (
                <span
                    data-tip="Uncollapse"
                    onClick={() => {
                        this.setState({collapsed: false})
                    }}
                    className={"collapse-icon hover-icon"}>
                    <FontAwesomeIcon icon={"chevron-right"}/>
                </span>
            )
        } else {
            return (
                <span
                    data-tip="Collapse"
                    onClick={() => {
                        this.setState({collapsed: true})
                    }}
                    className={"collapse-icon hover-icon"}>
                    <FontAwesomeIcon icon={"chevron-down"}/>
                </span>
            )
        }
    }

    private renderChannels() {
        if (this.state.collapsed === false) {
            return (
                <div className="channel-overview row">
                    {this.props.category.channels ? this.props.category.channels.map((channel: Channel) => {
                        return (
                            <ChannelTile
                                key={channel.youtubeId}
                                addChannelToCategory={this.props.addChannelToCategory}
                                addCategory={this.props.addCategory}
                                categories={this.props.categories}
                                channel={channel}
                                category={this.props.category}
                                removeChannelFromCategory={this.props.removeChannelFromCategory}
                            />)
                    }) : null}
                    <Modal
                        key="AddChannelModal"
                        onClose={this.handleCloseAddChannelModal}
                        showModal={this.state.showAddChannelModal}>
                        <AddFormView
                            placeholder={"Channel id"}
                            title={"Add channel"}
                            processing={this.state.addingChannelState}
                            onSubmit={this.addChannel}/>
                    </Modal>
                </div>
            );
        } else {
            return null;
        }
    }


    private renderCategoryMenuIcons() {
        return (
            <span className={"category-menu-icons"}>
                    <span className={"hover-icon"} data-tip="Delete category" onClick={this.onDeleteCategoryConfirmOpen}>
                        <FontAwesomeIcon icon={"trash"}/>
                    </span>
                    <span  data-tip="Add channel" onClick={this.handleOpenAddChannelModal} className={"hover-icon add-channel-button"}>
                        <FontAwesomeIcon icon={"plus"}/>
                    </span>
            </span>)
    }

    private addChannel(channelName: string) {
        this.setState({
            addingChannelState: State.PROCESSING,
        });
        this.props.addChannelToCategory(this.props.category.name, channelName).then(() => {
            this.setState({
                addingChannelState: State.OK,
            });
            this.handleCloseAddChannelModal();
        }, (error)=>{
            this.setState({
                addingChannelState: State.INITIAL,
            });
            this.handleCloseAddChannelModal();
        });
    }

    private handleCloseAddChannelModal() {
        this.setState({
            showAddChannelModal: false
        })
    }


    private handleOpenAddChannelModal() {
        this.setState({
            showAddChannelModal: true
        })
    }

    private onDeleteCategoryConfirmClose() {
        this.setState({
            deleteCategoryConfirmVisible: false
        })
    }

    private onDeleteCategoryConfirmOpen() {
        this.setState({
            deleteCategoryConfirmVisible: true
        })
    }

    private onRename(newName: string) {
        this.props.renameCategory(this.props.category.name, newName).then(null, () => {
            this.setState({
                categoryName: this.props.category.name,
            })
        });
        this.setState({
            categoryName: newName,
            renamingCategory: false,
        })
    }
}

export default ChannelCategory;