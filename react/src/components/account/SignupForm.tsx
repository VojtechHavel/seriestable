import React, {Component} from 'react';
import "./LoginForm.scss"
import autobind from 'class-autobind';

export interface SignupFormProps {
    handleSubmit: (name: string, email: string, password: string)=>any
}

interface SignupFormState {
    email: string,
    password: string,
    name: string,
    errors: string[][] | null;
    processing: boolean

}

class SignupForm extends Component<SignupFormProps, SignupFormState> {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            name: "",
            errors: null,
            processing: false
        };
        autobind(this);
    }



    public render() {
        return (
            <form onSubmit={this.handleSubmit}>

                <h5>Sign up with Email</h5>

                <div className="form-group">
                    <label htmlFor="formNameInput">Name:</label>
                    <input
                        id="formNameInput"
                        className="form-control"
                        name="name"
                        value={this.state.name}
                        onChange={this.handleInputChange}/>
                    {this.renderErrors("name")}
                </div>

                <div className="form-group">
                    <label htmlFor="formEmailInput">Email:</label>
                    <input
                        id="formEmailInput"
                        className="form-control"
                        name="email"
                        type="text"
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

    private handleSubmit(event) {
        this.setState({processing: true});
        this.props.handleSubmit(this.state.name, this.state.email, this.state.password).then(null,(errorResponse) => {

            let errors = null;
            if(errorResponse && errorResponse.response && errorResponse.response.data && errorResponse.response.data.errors){
                errors =  errorResponse.response.data.errors;
            }

            this.setState({processing: false});
            if (errors) {
                console.log("errors", errors);
                this.setState({
                    errors
                })
            }
        });

        event.preventDefault();
    }

    private renderSubmitButton() {
        if (!this.state.processing) {
            return (<input type="submit" className="btn btn-primary" value="Register"/>);
        } else {
            return (<div className="btn btn-primary loading"/> )
        }
    }

    private renderErrors(input) {
        if (this.state.errors) {
            if (this.state.errors[input]) {
                return this.state.errors[input].map(error => (<div key={error} className="validation-error">{error}</div>));
            }
        }
        return null;
    }
}

export default SignupForm;