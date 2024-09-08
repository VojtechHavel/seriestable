import React from 'react'
import {Link, matchPath, RouteComponentProps, withRouter} from "react-router-dom";
import {connect} from "react-redux";
import classNames from "classnames"
import "./UserNav.scss"
import {logout} from "../../actions/userActions";
import {UserState} from "../../types/UserState";
import State from "../../types/State";
import {AppState} from "../../store/rootReducer";
import ChevronRight from "./ChevronRight";

interface ConnectedProps {
    userState: UserState,
    logout: ()=>any

}

class UserNav extends React.Component<ConnectedProps & RouteComponentProps<any>, any> {

    constructor(props) {
        super(props);
        this.state = {
            dropdownExpanded: false
        };
        this.toggleDropdown = this.toggleDropdown.bind(this);
        this.hideDropdown = this.hideDropdown.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }


    public render() {
        if (this.props.userState.state===State.OK) {
            if(this.props.userState.role==="USER") {
                return this.renderLoggedUser()
            }else{
                return this.renderNotLoggedUser()
            }
        } else {
            return null;
        }
    }

    private isUrlActive(path) {
        const match = matchPath(this.props.location.pathname, {path, exact: true});
        return match !== null;
    }

    private getNavItemClassName(pathname: string){
        let className = "nav-item";
        if(this.isUrlActive(pathname)) {
                className+=" active";
        }
        return className;
    }

    private createLi(name){

        const linkPath = "/"+name.toLowerCase().replace(" ","");

        return (
            <li className={this.getNavItemClassName(linkPath)}>
                <Link className={"nav-link"} to={linkPath}>{name} <ChevronRight/></Link>
            </li>
        )
    }

    private renderNotLoggedUser() {
        return (
            <ul className="navbar-nav navbar-not-logged">
                {this.createLi("Login")}
                {this.createLi("Sign Up")}
                {this.createLi("Contact")}
            </ul>
        )
    }

    private toggleDropdown() {
        this.setState({
            dropdownExpanded: !this.state.dropdownExpanded
        })
    }

    private hideDropdown() {
        const that = this;
        setTimeout(() => {
            that.setState({
                dropdownExpanded: false
            })
        }, 200);
    }

    private handleLogout() {
        this.hideDropdown();
        this.props.logout();
    }

    private renderLoggedUser() {
        const dropdownTitle = classNames("dropdown", {"show": this.state.dropdownExpanded});
        const dropdownContent = classNames("dropdown-menu", {"show": this.state.dropdownExpanded});

        return (
            <div className={dropdownTitle}>
                <button
                    onBlur={this.hideDropdown}
                    onClick={this.toggleDropdown}
                    className="btn btn-secondary dropdown-toggle" id="dropdownMenuLink" data-toggle="dropdown"
                    aria-haspopup="true" aria-expanded="false">
                    {this.props.userState.name}
                </button>

                <div className={dropdownContent} aria-labelledby="dropdownMenuLink">
                    <Link to="/contact" className={this.getDropdownItemClassName("/contact")}>Contact us <ChevronRight/></Link>
                    <Link to="/settings" className={this.getDropdownItemClassName("/settings")}>Settings <ChevronRight/></Link>
                    <button onMouseDown={this.handleLogout} className="dropdown-item">Logout <ChevronRight/></button>
                </div>
            </div>
        )
    }

    private getDropdownItemClassName(pathname: string){
        let className = "dropdown-item";
        if(this.isUrlActive(pathname)) {
            className+=" active";
        }
        return className;
    }
}

const mapStateToProps = ({userState}: AppState) => {
    return {
        userState
    };
};


export default withRouter(connect(mapStateToProps, {logout})(UserNav) as any);