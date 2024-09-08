import {Item, Menu, Submenu} from "react-contexify";
import * as React from "react";
import {Category, Channel} from "../../types/generatedTypes";
import {MenuItemEventHandler} from "react-contexify/lib/types";
import {RECOMMENDED_KEY} from "./ChannelCategory";

export interface ChannelMenuProps {
    addCategory: () => any;
    putChannelIntoCategory: (category: string, channel: string) => any;
    removeChannelFromCategory: (category: string, channel: string) => any;
    categories: Category[];
    channel: Channel;
    menuId: string;
    category: Category
}

export class ChannelMenu extends React.Component<ChannelMenuProps, {}> {
    constructor(props) {
        super(props);
    }

    public render() {
        return (
            <Menu id={this.props.menuId}>
                <AddCategorySubmenu {...this.props}/>
                <RemoveCategorySubmenu {...this.props}/>
            </Menu>
        )
    }
};

const AddCategorySubmenu = (props: ChannelMenuProps) => (

    <Submenu label="Add into category">
        {props.categories.map((category: Category) => {
            return <Item
                key={"submenu-channel-" + category.name}
                onClick={(e: MenuItemEventHandler) => {
                    props.putChannelIntoCategory(category.name, props.channel.youtubeId)
                }}
                disabled={props.channel.presentCategories.some(existingCategory => {
                    return existingCategory === category.name
                })}
            >{category.name}</Item>
        })}
        <Item onClick={props.addCategory}>Add new category</Item>

    </Submenu>
);

const RemoveCategorySubmenu = (props: ChannelMenuProps) => (
    <Item onClick={(e: MenuItemEventHandler) => {
        props.removeChannelFromCategory(props.category.name, props.channel.youtubeId)
    }}>{props.category.key===RECOMMENDED_KEY?"Stop recommending":("Remove from category " +props.category.name)}</Item>
);