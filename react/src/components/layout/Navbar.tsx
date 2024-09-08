import React from 'react'
import "./Navbar.scss"
import {Link, RouteProps, withRouter} from "react-router-dom";
import UserNav from "./UserNav";
import classNames from "classnames"
import autobind from 'class-autobind';
import Logo from "../static/Logo";

import {library, dom} from '@fortawesome/fontawesome-svg-core'
import {faBars,  faTimes} from "@fortawesome/free-solid-svg-icons";
import ChevronRight from "./ChevronRight";
import {connect} from "react-redux";
import {AppState} from "../../store/rootReducer";
import {VISITOR_ROLE} from "../../actions/userActions";

library.add(faBars, faTimes);
dom.watch();

interface NavbarState {
    expanded: boolean
}

interface NavbarProps {
    userRole: string
}

const TAGS_PATHNAME = "/youtube/tags";
const VIDEO_PATHNAME = "/youtube/go-to-video";
const NOTES_PATHNAME = "/youtube/notes";
const OVERVIEW_PATHNAME = "/";
const CONTINUE_WATCHING_PATHNAME = "/youtube/continue-watching";


class Navbar extends React.Component<RouteProps & NavbarProps, NavbarState> {

    constructor(props) {
        super(props);
        this.state = {
            expanded: false
        };
        autobind(this);
        console.log("Navbar props", props);
    }

    public render() {
        return (
            <div className="navbar-component">
                <div className={this.state.expanded?"container expanded":"container"}>
                    <nav className="navbar navbar-expand-lg bg-faded">

                        {this.getHomeLink()}
                        <span className={"navbar-desktop-page-links"}>
                            {this.renderNavbarPageLinks()}
                        </span>

                        <ul className="navbar-desktop navbar-nav mr-auto ml-auto"/>

                        {/*hamburger*/}
                        <button
                            onClick={this.toggleNavbar}
                                className={"navbar-toggler" + (this.state.expanded? " expanded": "")}
                            type="button" data-toggle="collapse"
                            data-target="#mobile-navbar" aria-controls="mobile-navbar"
                            aria-expanded={this.state.expanded}
                            aria-label="Toggle navigation">
                            <i className="fa fa-bars hamburger" aria-hidden="true"/>
                            <i className="fa fa-times hamburger-close" aria-hidden="true"/>
                        </button>

                        <div
                            className={classNames("collapse", "navbar-collapse", {"show": this.state.expanded})}
                            id="mobile-navbar"
                            onClick={this.toggleNavbar}
                            aria-expanded={this.state.expanded}>

                            <div className={"navbar-mobile-page-links"}>
                                {this.renderNavbarPageLinks()}
                            </div>

                            <ul className="navbar-nav mr-auto ml-auto"/>

                            <UserNav/>

                        </div>
                    </nav>
                </div>
            </div>
        )
    }


    private renderNavbarPageLinks() {
        return <span>
            {this.getChannelsLink()}
            {this.getVideoLink()}
            {this.getTagsLink()}
            {this.getNotesLink()}
            {this.getContinueWatchingLink()}
        </span>
    }


    private toggleNavbar() {
        // console.log("togelling");
        this.setState({
            expanded: !this.state.expanded
        })
    }

    private getHomeLink() {

        return (<Link
            className={"nav-brand"}
            to={OVERVIEW_PATHNAME}><Logo/><span>Videomark.App</span></Link>);
    }

    private getChannelsLink() {
        return (<Link
            className={this.getClassName(OVERVIEW_PATHNAME)}
            to={OVERVIEW_PATHNAME}><span>Channels</span> <ChevronRight/></Link>);
    }

    private getTagsLink() {
        return (<Link
            className={this.getClassName(TAGS_PATHNAME)}
            to={TAGS_PATHNAME}><span>Tags</span> <ChevronRight/></Link>);
    }

    private getVideoLink() {
        return (<Link
            className={this.getClassName(VIDEO_PATHNAME)}
            to={VIDEO_PATHNAME}><span>Video</span> <ChevronRight/></Link>);
    }

    private getContinueWatchingLink() {
        return (<Link
            className={this.getClassName(CONTINUE_WATCHING_PATHNAME)}
            to={CONTINUE_WATCHING_PATHNAME}><span>Continue Watching</span> <ChevronRight/></Link>);
    }

   private getNotesLink() {
        return (<Link
            className={this.getClassName(NOTES_PATHNAME)}
            to={NOTES_PATHNAME}><span>Notes</span> <ChevronRight/></Link>);
    }

    private getClassName(pathname: string) {
        let className = "nav-item";
        if(this.props.userRole===VISITOR_ROLE && (pathname===TAGS_PATHNAME || pathname===CONTINUE_WATCHING_PATHNAME || pathname===NOTES_PATHNAME )){
            className += " disabled";
        }
        if (this.props.location) {
            if (this.props.location.pathname === pathname) {
                className += " active";
            }
        }
        return className;
    }
}

const mapStateToProps = ({userState}: AppState) => {
    return {
        userRole: userState.role
    };
};

export default withRouter(connect(mapStateToProps, {})(Navbar) as any);