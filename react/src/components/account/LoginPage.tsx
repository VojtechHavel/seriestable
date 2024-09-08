import React, {Component} from 'react';
import "./LoginPage.scss"
import LoginForm from "./LoginForm";
import SocialForm from "./SocialForm";
import {connect} from "react-redux";
import {login} from "../../actions/userActions";

interface StateProps {
}

interface DispatchProps {
    login: (password: string, email: string) => any
}

interface LoginPageState {
}

class LoginPage extends Component<StateProps & DispatchProps, LoginPageState> {
    constructor(props) {
        document.title = "Login | Videomark.app";

        super(props);
    }

    public render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-3 col-sm-1"/>
                    <div id="login-form" className="col-md-6 col-sm-10">

                        <div className="panel panel-default">
                            <ul className="list-group">
                                <li className="list-group-item">
                                    <LoginForm handleSubmit={this.props.login}/>
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

export default connect(null, {login})(LoginPage);