import React, {Component} from 'react';
import "./LoginForm.scss"
import autobind from 'class-autobind';
import {Link} from "react-router-dom";

interface LoginFormProps {
    handleSubmit: (password: string, email: string) => any
}

interface LoginFormState {
    errors: any,
    email: string;
    password: string,
    processing: boolean
}


class LoginForm extends Component<LoginFormProps, LoginFormState> {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            processing: false,
            errors: null
        };

        autobind(this);
    }


    public render() {
        return (
            <form onSubmit={this.handleSubmit}>

                <h5>Login with Email</h5>

                <div className="form-group">
                    <label htmlFor="formEmailInput">Email:</label>
                    <input
                        id="formEmailInput"
                        className="form-control"
                        name="email"
                        type="text"
                        checked={!!this.state.email}
                        onChange={this.handleInputChange}/>
                    {this.renderErrors("email")}
                </div>

                <div className="form-group">
                    <label htmlFor="formPasswordInput">Password:</label>

                    <input
                        className="form-control"
                        id="formPasswordInput"
                        name="password"
                        type="password"
                        value={this.state.password}
                        onChange={this.handleInputChange}
                    />
                    {this.renderErrors("password")}
                </div>

                {this.renderErrors("global")}

                {this.renderSubmitButton()}
            </form>
        );
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

    private renderSubmitButton() {
        if (!this.state.processing) {
            return (<div><input type="submit" className="btn btn-primary" value="Login"/>&nbsp;&nbsp;&nbsp;
                    <Link to="send-reset-password-link" className="button">Forgot password?</Link>
                </div>);
        } else {
            return (<div className="btn btn-primary loading"/> )
        }
    }

    private handleSubmit(event) {
        // log contains unhashed password!
        this.setState({processing: true});
        this.props.handleSubmit(this.state.email, this.state.password).then((data) => {
            this.setState({
                processing: false,
            });
            // redirects after success
        }, (errorResponse) => {

            let errors = null;
            if(errorResponse && errorResponse.response && errorResponse.response.data && errorResponse.response.data.errors){
                errors =  errorResponse.response.data.errors;
            }

            this.setState({
                errors,
                processing: false,
            });
        });

        event.preventDefault();
    }

}

export default LoginForm;