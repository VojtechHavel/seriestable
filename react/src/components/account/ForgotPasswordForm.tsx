import React, {Component} from 'react';
import autobind from 'class-autobind';
import {Link} from "react-router-dom";

interface ForgotPasswordFormProps {
    handleSubmit: any
}

interface ForgotPasswordFormState {
    errors: any;
    email: string;
    processing: boolean,
    body: string,
    success: boolean
}

class ForgotPasswordForm extends Component<ForgotPasswordFormProps, ForgotPasswordFormState> {
    constructor(props) {
        super(props);


        this.state = {
            errors: [],
            email: "",
            processing: false,
            body: "",
            success: false
        };

        autobind(this);
    }



    public render() {
        if (!this.state.success) {
            return (
                <form onSubmit={this.handleSubmit}>

                    <h5>Reset password</h5>
                    <div>Enter your email address and we will send you a link to reset your password.</div>
                    <br/>
                    <div className="form-group">
                        <label htmlFor="formEmailInput">Email:</label>
                        <input
                            id="formEmailInput"
                            className="form-control"
                            name="email"
                            type="text"
                            value={this.state.email}
                            onChange={this.handleInputChange}/>
                        {this.renderErrors("email")}
                    </div>

                    {this.renderSubmitButton()}
                </form>
            );
        } else {
            return (
                <div className="success-message">
                    Password reset link was sent to {this.state.email}.<br/>
                    If you didn't receive this email, please check your junk / spam mail or<br/>
                    <button className="btn btn-primary" onClick={this.sendNext}>Send another link</button>
                    or&nbsp;
                    <Link className="button" to="/contact">Contact us</Link>
                </div>
            )
        }
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
            return (<input type="submit" className="btn btn-primary" value="Reset password"/>);
        } else {
            return (<div className="btn btn-primary loading"/>)
        }
    }

    private handleSubmit(event) {
        this.setState({processing: true});
        this.props.handleSubmit(this.state.email).then((errors) => {
            this.setState({processing: false});
            this.setState({
                body: "",
                success: true
            })
        }, (errors) => {
            this.setState({processing: false});

            console.log("errors.response", errors.response);

            if(errors && errors.response && errors.response.data) {
                this.setState({
                    errors: errors.response.data.errors
                })
            }
        });

        event.preventDefault();
    }

    private sendNext() {
        this.setState({
            success: false
        })
    }
}

export default ForgotPasswordForm;