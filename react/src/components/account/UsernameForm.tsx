import React, {Component} from 'react';

import "./LoginForm.scss"
import autobind from 'class-autobind';
import {connect} from "react-redux";
import {AppState} from "../../store/rootReducer";
import {UserState} from "../../types/UserState";
import EditableName from "../util/EditableName";
import {changeUsername} from "../../actions/userActions";

interface ConnectedProps {
    userState: UserState,
    changeUsername: (name: string)=>any
}

interface UsernameFormState {
    isNameEditable: boolean,
    errors: string[][] | null;
    name: string
}

class UsernameForm extends Component<ConnectedProps, UsernameFormState> {
    constructor(props) {
        super(props);
        this.state = {
            isNameEditable: false,
            errors: null,
            name: this.props.userState.name ? this.props.userState.name : ""
        };
        autobind(this);
    }

    public render() {
        return (
            <div>
                <div className="row">
                    <div className={"col-lg-4"}>
                        <label className="col-form-label">Name:</label>
                    </div>
                    <div className={"col-lg-8"}>
                        <span className={"col-form-value"}>
                        <EditableName
                            value={this.props.userState.name ? this.props.userState.name : ""}
                            editable={this.state.isNameEditable}
                            onSubmit={this.handleSubmit}
                            onEdit={this.setEditMode}
                            onCancel={this.setReadMode}
                        />
                        </span>
                    </div>
                </div>
                {this.renderErrors("name")}
            </div>
        )
    }

    private renderErrors(input) {
        if (this.state.errors) {
            if (this.state.errors[input]) {
                return this.state.errors[input].map(error => (
                    <div key={error} className="validation-error">{error}</div>
                ));
            }
        }
        return null;
    }

    private setEditMode() {
        this.setState({
            isNameEditable: true
        });
    }

    private setReadMode() {
        this.setState({
            isNameEditable: false
        });
    }

    private handleSubmit(newName: string) {
        this.props.changeUsername(newName).then(() => {
        }, (errors) => {
            console.log("errors", errors);
            this.setState({
                errors,
                isNameEditable: false,
                name: this.props.userState.name ? this.props.userState.name : ""
            })
        });

        this.setState({
            isNameEditable: false,
            name: newName
        })
    }

}

const mapStateToProps = ({userState}: AppState) => {
    return {
        userState
    };
};

export default connect<any, any, any>(mapStateToProps, {changeUsername})(UsernameForm);