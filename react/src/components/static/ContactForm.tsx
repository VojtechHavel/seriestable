import autobind from 'class-autobind';
import "./ContactForm.scss"
import {connect} from "react-redux";
import * as React from "react";
import {UserState} from "../../types/UserState";
import State from "../../types/State";

export interface ContactFormProps {

}

interface ContactFormState {
    errors: any,
    email: string,
    body: string,
    formState: State
}

interface DispatchProps {
    handleSubmit: (email: string, body: string) => any
}

interface StateProps {
    userState: UserState
}

class ContactForm extends React.Component<StateProps & DispatchProps & ContactFormProps, ContactFormState> {
    constructor(props) {
        super(props);
        const email = this.props.userState ? this.props.userState.email? this.props.userState.email: "" : "";
        this.state = {
            email,
            formState: State.INITIAL,
            body: "",
            errors: []
        };

        autobind(this);
    }


    public render() {
        if (this.state.formState===State.INITIAL || this.state.formState===State.ERROR) {
            return (
                <form onSubmit={this.handleSubmit}>

                    <h5>Contact us</h5>

                    <div className="form-group">
                        <label htmlFor="formEmailInput">Your email:</label>
                        <input
                            id="formEmailInput"
                            className="form-control"
                            name="email"
                            type="text"
                            value={this.state.email}
                            onChange={this.handleEmailChange}/>
                        {this.renderErrors("email")}
                    </div>

                    <div className="form-group">
                        <label htmlFor="formBody">Body:</label>

                        <textarea
                            style={{height: "130px"}}
                            className="form-control"
                            id="formBody"
                            name="body"
                            value={this.state.body}
                            onChange={this.handleBodyChange}
                        />
                        {this.renderErrors("body")}
                    </div>

                    {this.renderErrors("global")}

                    {this.renderSubmitButton()}
                </form>
            );
        } else {
            return (
                <div className="success-message">
                    Thank you for your feedback!
                    <div>
                        <button className="btn btn-primary" onClick={this.sendNext}>Send another</button>
                    </div>
                </div>
            )
        }
    }

    private handleEmailChange(event) {
        const target = event.target;
        const value = target.value;

        this.setState({
            email: value
        });
    }

    private handleBodyChange(event) {
        const target = event.target;
        const value = target.value;

        this.setState({
            body: value
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
        if (this.state.formState===State.INITIAL || this.state.formState===State.ERROR) {
            return (<input type="submit" className="btn btn-primary" value="Submit"/>);
        } else {
            return (<div className="btn btn-primary loading"/> )
        }
    }

    private handleSubmit(event) {
        // console.log("submitted", this.getTagsState);
        this.setState({formState: State.PROCESSING});
        this.props.handleSubmit(this.state.email, this.state.body).then(()=>{
            this.setState({
                body: "",
                formState: State.OK
            })
        }, (errors) => {
            this.setState({formState: State.ERROR});
            if (errors && errors.response && errors.response.data && errors.response.data.errors) {
                this.setState({
                    errors: errors.response.data.errors
                })
            }
        });

        event.preventDefault();
    }

    private sendNext() {
        this.setState({
            formState: State.INITIAL
        })
    }

}

const mapStateToProps = ({userState}) => {
    return {
        userState
    };
};

export default connect(mapStateToProps, null)(ContactForm);