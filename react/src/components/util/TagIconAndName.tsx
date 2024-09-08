import {Tag} from "../../types/generatedTypes";
import {IconProp} from "@fortawesome/fontawesome-svg-core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import * as React from "react";

interface TagIconAndNameProps {
    tag: Tag
};

export const TagIconAndName = (props: TagIconAndNameProps) =>{

    let icon: IconProp = "tag";
    if(props.tag.icon){
        icon = props.tag.icon  as IconProp
    }

    const iconStyle = {
        color: props.tag.color?props.tag.color:"#2196F3"
    };

    return (<span>
        <span style={iconStyle} className={"menu-tag-icon"}><FontAwesomeIcon icon={icon}/></span>  {props.tag.name}
    </span>)
};