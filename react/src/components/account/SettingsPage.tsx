import React from 'react';
import "./LoginPage.scss"
import UsernameForm from "./UsernameForm";
import ChangePasswordForm from "./ChangePasswordForm";
import autobind from 'class-autobind';
import ChangeEmailForm from "./ChangeEmailForm";
import {connect} from "react-redux";
import {changeEmail, changePageSize, changePassword, changeRememberFilters} from "../../actions/userActions";
import {AppState} from "../../store/rootReducer";
import {UserState} from "../../types/UserState";
import pageSizes from "../../types/PageSize";
import "./SettingsPage.scss"

interface DispatchProps {
    changePageSize: (pageSize: any) => any,
    changeRememberFilters: (remember: boolean) => any,
    changeEmail: any,
    changePassword: any,
}

interface StateProps {
    userState: UserState,
}

export interface SettingsPageProps {

}


class SettingsPage extends React.Component<SettingsPageProps & StateProps & DispatchProps> {
    constructor(props) {
        super(props);
        document.title = "Settings | Videomark.app";

        autobind(this);
    }

    public render() {
        return (
            <div className="container settings-page">
                <div className="row">
                    <div className="col-md-3 col-sm-1"/>

                    <div className="col-md-6 col-sm-10">

                        <div className="panel panel-default">
                            <ul className="list-group">
                                <li className="list-group-item">
                                    {this.renderPageSizeSelection()}
                                </li>

                                <li className="list-group-item">
                                    {this.renderRememberFilters()}
                                </li>

                                <li className="list-group-item">
                                    <UsernameForm/>
                                </li>

                                <li className="list-group-item">
                                    <ChangeEmailForm/>
                                </li>

                                <li className="list-group-item">
                                    <ChangePasswordForm/>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    private renderPageSizeSelection() {
        return <div className="page-size-selection row">

            <div className={"col-lg-4"}>
                <label htmlFor="pageSizeSelect" className="col-form-label">Videos per page:</label>
            </div>
            <div className={"col-lg-8"}>
                <div className="btn-group">
                    {pageSizes.map((pageSize) => {
                        return this.renderPageSizeOption(pageSize);
                    })}
                </div>
            </div>
        </div>

    }

    private renderRememberFilters() {
        return <div className="page-size-selection row">

            <div className={"col-lg-4"}>
                <label htmlFor="remeber-filters-buttons" className="col-form-label">Remember filters:</label>
            </div>
            <div className={"col-lg-8"}>
                <div id="remeber-filters-buttons" className="btn-group">
                    <button
                        type="button"
                        onClick={() => this.props.changeRememberFilters(true)}
                        className={this.props.userState.rememberFilters? "btn btn-primary" : "btn btn-default"}>
                        Yes
                    </button>
                    <button
                        type="button"
                        onClick={() => this.props.changeRememberFilters(false)}
                        className={!this.props.userState.rememberFilters? "btn btn-primary" : "btn btn-default"}>
                        No
                    </button>
                </div>
            </div>
        </div>

    }

    private renderPageSizeOption(pageSize: number) {
        return <button
            key={"page-size-button-key-id-"+pageSize}
            type="button"
            onClick={() => this.props.changePageSize(pageSize)}
            className={this.props.userState.pageSize === pageSize ? "btn btn-primary" : "btn btn-default"}>
            {pageSize}
        </button>
    }
}

const mapStateToProps = ({userState}: AppState) => {
    return {
        userState
    };
};

export default connect<StateProps, DispatchProps, SettingsPageProps>(mapStateToProps, {changePassword, changePageSize, changeRememberFilters, changeEmail})(SettingsPage);