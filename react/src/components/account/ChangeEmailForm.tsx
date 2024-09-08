import React, {Component} from 'react';

import "./LoginForm.scss"
import autobind from 'class-autobind';
import {connect} from "react-redux";
import {UserState} from "../../types/UserState";
import {AppState} from "../../store/rootReducer";

import {library, dom} from '@fortawesome/fontawesome-svg-core'
import {faPen} from "@fortawesome/free-solid-svg-icons";
import EditableName from "../util/EditableName";
import {changeEmail} from "../../actions/userActions";

library.add(faPen);
dom.watch();


interface StateProps {
    userState: UserState,
}

interface DispatchProps {
    changeEmail: (password: string, email: string) => any
}

interface ChangeEmailFormState {
    isEmailEditable: boolean,
    email: string,
    processing: boolean,
    errors: string[][] | null;
    password: string;
    isConfirm: boolean
}

class ChangeEmailForm extends Component<StateProps & DispatchProps, ChangeEmailFormState> {
    constructor(props) {
        super(props);
        this.state = {
            isEmailEditable: false,
            email: this.props.userState.email || "email@videomark.app",
            processing: false,
            errors: null,
            password: "",
            isConfirm: false
        };
        autobind(this);

    }

    public render() {

        return (
            <div>
                <div className="row">
                    <div className={"col-lg-4"}>
                        <label className="col-form-label">Email:</label>
                    </div>
                    <div className={"col-lg-8"}>
                        <span className={"col-form-value"}>
                        <EditableName
                            value={this.state.email}
                            editable={this.state.isEmailEditable}
                            onSubmit={this.handleNewEmailSubmit}
                            onEdit={this.setEditMode}
                            onCancel={this.setReadMode}
                        />
                        </span>
                    </div>
                </div>

                {this.renderErrors("email")}

                {this.renderConfirm()}
            </div>)
    }

    private handleNewEmailSubmit(newEmail) {
        if (newEmail !== this.props.userState.email) {
            this.setState({
                email: newEmail,
                isConfirm: true,
                isEmailEditable: false
            })
        } else {
            this.setState({
                isConfirm: false,
                isEmailEditable: false
            })
        }
    }

    private renderErrors(input) {
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
            isEmailEditable: true
        });
    }

    private setReadMode() {
        this.setState({
            isEmailEditable: false,
            email: this.props.userState.email || ""
        });
    }

    private renderSubmitButtons() {
        if (!this.state.processing) {
            return (
                <div className="edit-buttons">
                    <input type="submit" className="btn btn-primary" value="Change Email"/><span
                    className="btn btn-cancel btn-default"
                    onClick={this.onConfirmCancel}>Cancel</span>
                </div>
            );
        } else {
            return (<div className="edit-buttons btn btn-primary loading"/>)
        }
    }

    private onConfirmCancel() {
        this.setState({
            email: this.props.userState.email || "",
            isConfirm: false,
            isEmailEditable: false
        })
    }

    private handleSubmit(event) {
        this.setState({processing: true});
        this.props.changeEmail(this.state.password, this.state.email).then(() => {
            this.setState({
                isConfirm: false,
                processing: false,
                isEmailEditable: false,
            });
        }, (errorResponse) => {

            let errors = null;
            if(errorResponse && errorResponse.response && errorResponse.response.data && errorResponse.response.data.errors){
                errors =  errorResponse.response.data.errors;
            }

            console.log("errors", errors);

            console.log();
            this.setState({
                errors,
                processing: false,
            });
        });

        event.preventDefault();
    }

    private renderConfirm() {
        if (this.state.isConfirm) {
            return (
                <form onSubmit={this.handleSubmit}>

                    {this.props.userState.hasPassword &&

                    <div className="form-group row">
                        <label className={"col-form-label col-lg-4"} htmlFor="formCurrentPasswordInput">Password:</label>
                        <div className="col-lg-8">
                            <input
                                className="form-control"
                                id="formCurrentPasswordInput"
                                name="currentPassword"
                                type="password"
                                value={this.state.password}
                                onChange={this.handlePasswordChange}
                                autoFocus={true}
                            />
                        </div>
                        {this.renderErrors("currentPassword")}
                    </div>
                    }

                    {this.renderSubmitButtons()}
                </form>)
        } else {
            return null;
        }
    }


    private handlePasswordChange(event) {
        const target = event.target;
        const value = target.value;

        this.setState({
            password: value
        });
    }


}

const mapStateToProps = ({userState}: AppState) => {
    return {
        userState
    };
};

export default connect<StateProps, DispatchProps, {}>(mapStateToProps, {changeEmail})(ChangeEmailForm);