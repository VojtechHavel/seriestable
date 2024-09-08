import {Tag} from "../../types/generatedTypes";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {IconProp} from "@fortawesome/fontawesome-svg-core";
import React from "react";
import "./TagIcon.scss"

export function TagIcon(props: {tag: Tag}) {

    const iconStyle = {
        backgroundColor: props.tag.color ? props.tag.color : "#2196F3"
    };

    let icon: IconProp = "tag";
    if (props.tag.icon) {
        icon = props.tag.icon as IconProp
    }

    return (
        <div style={iconStyle} className={"tag-icon-circle"}>
            <div className={"tag-icon-circle-child"}>
                            <span className={"tag-icon"}>
                                <FontAwesomeIcon icon={icon}/>
                            </span>
            </div>
        </div>
    )
}