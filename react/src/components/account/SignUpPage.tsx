import React, {Component} from 'react';
import "./LoginPage.scss"
import SocialForm from "./SocialForm";
import {saveStore, signUp} from "../../actions/userActions";
import SignupForm from "./SignupForm";
import {connect} from "react-redux";

interface StateProps {

}

interface DispatchProps {
    saveStore: any,
    signUp: any
}

interface SignUpPageState {

}

export interface SignUpPageProps {

}

class SignUpPage extends Component<SignUpPageProps & DispatchProps & StateProps, SignUpPageState> {
    constructor(props) {
        document.title = "Sign Up | Videomark.app";

        super(props);
    }

    public render() {

        this.props.saveStore();

        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-3 col-sm-1"/>
                    <div id="signup-form" className="col-md-6 col-sm-10">

                        <div className="panel panel-default">
                            <ul className="list-group">
                                <li className="list-group-item">
                                    <SignupForm handleSubmit={this.props.signUp}/>
                                </li>
                                <li className="list-group-item">
                                    <SocialForm/>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default connect<StateProps, DispatchProps, SignUpPageProps>(null, {signUp, saveStore})(SignUpPage);