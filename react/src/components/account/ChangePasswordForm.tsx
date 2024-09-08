import React, {Component} from 'react';

import "./LoginForm.scss"
import autobind from 'class-autobind';
import {UserState} from "../../types/UserState";
import {connect} from "react-redux";
import {changePassword} from "../../actions/userActions";
import {AppState} from "../../store/rootReducer";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import "./ChangePasswordForm.scss";

interface ChangePasswordFormState {
    isEditable: boolean,
    errors: string[][] | null;
    currentPassword: string,
    newPassword: string,
    processing: boolean,
    isConfirm: boolean
}


interface StateProps {
    userState: UserState,
}

interface DispatchProps {
    changePassword: (currentPassword: string, newPassword: string) => any
}

class ChangePasswordForm extends Component<StateProps & DispatchProps, ChangePasswordFormState> {
    constructor(props) {
        super(props);
        this.state = {
            isConfirm: false,
            isEditable: false,
            currentPassword: "",
            newPassword: "",
            errors: null,
            processing: false,
        };
        autobind(this);

    }

    public render() {

        return (
            <div className={"change-password-form"}>
                <div className="form-group">
                    {this.renderNewPassword()}
                    {this.renderConfirmPassword()}
                </div>
            </div>)
    }

    private handleNewPasswordChange(event) {
        const target = event.target;
        const value = target.value;
        this.setState({
            newPassword: value
        });
    }

    private handleCurrentPasswordChange(event) {
        const target = event.target;
        const value = target.value;
        this.setState({
            currentPassword: value
        });
    }

    private renderErrors(input) {
        console.log("renderErrors input", input);
        console.log("this.state.errors", this.state.errors);
        console.log("renderErrors input", input);
        if (this.state.errors) {
            if (this.state.errors[input]) {
                return this.state.errors[input].map(error => (
                    <div key={error} className="validation-error">{error}</div>));
            }
        }
        return null;
    }

    private setEditMode() {
        this.setState({
            isEditable: true
        });
    }

    private setReadMode() {
        this.setState({
            isEditable: false
        });
    }

    private onCancel() {
        this.setState({
            isEditable: false,
            isConfirm: false,
            newPassword: ""
        });
    }

    private renderChangeButtons() {
        if(!this.state.isConfirm) {
            return (
                <div className="edit-buttons">
                    <input type="submit" className="btn btn-primary" value="Change"/><span
                    className="btn btn-default btn-cancel"
                    onClick={this.setReadMode}>Cancel</span>
                </div>
            );
        }else {
            return null;
        }
    }

    private renderConfirmButtons() {
        if (!this.state.processing) {
            return (
                <div className="edit-buttons">
                    <input type="submit" className="btn btn-primary" value="Change"/><span className="btn btn-default btn-cancel"
                                                                                           onClick={this.onCancel}>Cancel</span>
                </div>
            );
        } else {
            return (<div className="edit-buttons btn btn-primary loading"/>)
        }
    }

    private handleSubmit(event) {
        this.setState({processing: true});
        this.props.changePassword(this.state.currentPassword, this.state.newPassword).then(() => {
            this.setState({
                isEditable: false,
                isConfirm: false,
            });
        }, (errorResponse) => {

            let errors = null;
            if(errorResponse && errorResponse.response && errorResponse.response.data && errorResponse.response.data.errors){
                errors =  errorResponse.response.data.errors;
            }

            console.log("errors", errors);

            this.setState({
                errors,
                processing: false,
            });
        });
        event.preventDefault();
    }

    private handleChange(event){
        event.preventDefault();

        this.setState({
            isConfirm: true
        });
    }

    private renderNewPassword() {
        if (this.state.isEditable) {
            return (
                <div>
                    <form onSubmit={this.handleChange}>
                        <div className="row">
                            <div className={"col-lg-4"}>
                                <label className="col-form-label">Password:</label>
                            </div>
                            <div className={"col-lg-8"}>
                        <span className={""}>
                            <input
                                autoFocus={true}
                                className="form-control"
                                id="formNewPasswordInput"
                                name="newPassword"
                                type="password"
                                value={this.state.newPassword}
                                onChange={this.handleNewPasswordChange}
                            />
                        </span>
                            </div>
                        </div>

                        {this.renderErrors("newPassword")}
                        {this.renderChangeButtons()}

                    </form>

                </div>


            )
        } else {
            return (
                <div>
                    <div className="row not-edit-password">
                        <div className={"col-lg-4"}>
                            <label className="col-form-label">Password:</label>
                        </div>
                        <div className={"col-lg-8 not-edit-password-value"}>
                        <span className={""}>
                            *****
                        </span>
                            <span className="editable-name-icons">
                    <span className={"editable-name-icon"} onClick={this.setEditMode}>
                        <FontAwesomeIcon icon={"pen"}/>
                    </span>
                </span>
                        </div>
                    </div>
                </div>)
        }
    }

    private renderConfirmPassword() {
        if (this.state.isConfirm) {
            return (
                <div className={"old-password"}>
                    <form onSubmit={this.handleSubmit}>
                        <div className="row">
                            <div className={"col-lg-4"}>
                                <label className="col-form-label">Old Password:</label>
                            </div>
                            <div className={"col-lg-8"}>
                        <span className={"col-form-value"}>
                            <input
                                autoFocus={true}
                                className="form-control"
                                id="formCurrentPasswordInput"
                                name="currentPassword"
                                type="password"
                                value={this.state.currentPassword}
                                onChange={this.handleCurrentPasswordChange}
                            />
                        </span>
                            </div>
                        </div>

                        {this.renderErrors("currentPassword")}
                        {this.renderConfirmButtons()}

                    </form>

                </div>


            )
        } else {
            return null;
        }
    }

}

const mapStateToProps = ({userState}: AppState) => {
    return {
        userState
    };
};

export default connect<StateProps, DispatchProps, {}>(mapStateToProps, {changePassword})(ChangePasswordForm);