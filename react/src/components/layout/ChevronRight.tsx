import {Component} from "react";
import {library} from '@fortawesome/fontawesome-svg-core'
import {faChevronRight} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from "react";
import "./ChevronRight.scss"


library.add(faChevronRight);

export default class ChevronRight extends Component<{}, {}> {
        public render(){
            return <FontAwesomeIcon className={"mobile-navbar-chevron"} icon={"chevron-right"}/>
        }
}