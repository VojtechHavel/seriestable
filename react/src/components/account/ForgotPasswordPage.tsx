import React, {Component} from 'react';
import "./LoginPage.scss"
import {forgotPassword} from "../../actions/userActions";
import {connect} from "react-redux";
import ForgotPasswordForm from "./ForgotPasswordForm";

interface ForgotPasswordPageProps{

}

interface DispatchProps{
    forgotPassword: any
}

class ForgotPasswordPage extends Component<ForgotPasswordPageProps & DispatchProps , {}> {
    constructor(props) {
        super(props);

    }

    public render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-3 col-sm-1"/>

                    <div id="user-form" className="col-md-6 col-sm-10">

                        <div className="panel panel-default">
                            <ul className="list-group">
                                <li className="list-group-item">
                                    <ForgotPasswordForm handleSubmit={this.props.forgotPassword}/>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(null, {forgotPassword})(ForgotPasswordPage);