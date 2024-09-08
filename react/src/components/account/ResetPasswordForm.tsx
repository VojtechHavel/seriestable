import React, {Component} from 'react';
import {withRouter} from "react-router-dom";
import "./LoginForm.scss"
import autobind from 'class-autobind';
import State from "../../types/State";

interface ResetPasswordFormState {
    errors: any,
    formState: State,
    new_password: string,
    email: string | null,
    token: string | null
}

interface ResetPasswordFormProps {
    handleSubmit: any
}

class ResetPasswordForm extends Component<ResetPasswordFormProps, ResetPasswordFormState> {
    constructor(props) {
        super(props);

        const search = props.location.search;
        const params = new URLSearchParams(search);
        const token = params.get('token');
        const email = params.get('email');

        this.state = {
            formState: State.INITIAL,
            new_password: "",
            errors: null,
            email,
            token
        };
        autobind(this);

    }

    public render() {

        return (
            <div>
                <div className="form-group">
                    {this.renderPassword()}
                </div>
            </div>)
    }

    private handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        // @ts-ignore
        this.setState({
            [name]: value
        });
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

    private renderSubmitButtons() {
        if (this.state.formState !== State.PROCESSING) {
            return (
                <div className="edit-buttons">
                    <input type="submit" className="btn btn-primary" value="Change"/>
                </div>
            );
        } else {
            return (<div className="edit-buttons btn btn-primary loading"/>)
        }
    }

    private handleSubmit(event) {
        this.setState({formState: State.PROCESSING});
        this.props.handleSubmit(this.state.token, this.state.email, this.state.new_password).then(() => {
            this.setState({
                formState: State.OK,
            })
        }, (errors) => {
            this.setState({formState: State.ERROR});

            console.log("errors.response", errors.response);

            if (errors && errors.response && errors.response.data) {
                this.setState({
                    errors: errors.response.data.errors
                })
            }
        });
        event.preventDefault();
    }

    private renderPassword() {
        if (this.state.formState === State.OK) {
            return (
                <div className="success-message">
                    Password was changed successfully.
                </div>
            )
        } else {
            return (
                <form onSubmit={this.handleSubmit}>

                    <div className="form-group">
                        <label htmlFor="formNewPasswordInput">New Password:</label>

                        <input
                            className="form-control"
                            id="formNewPasswordInput"
                            name="new_password"
                            type="password"
                            value={this.state.new_password}
                            onChange={this.handleInputChange}
                        />
                        {this.renderErrors("password")}
                        {this.renderErrors("token")}
                    </div>

                    {this.renderSubmitButtons()}


                </form>


            )
        }
    }
}

export default withRouter(ResetPasswordForm);