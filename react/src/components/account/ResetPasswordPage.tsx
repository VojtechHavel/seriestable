import React, {Component} from 'react';
import "./LoginPage.scss"
import ResetPasswordForm from "./ResetPasswordForm";
import {resetPassword} from "../../actions/userActions";
import {connect} from "react-redux";

interface DispatchProps {
    resetPassword: any;
}

// Page shown after clicking link in email for forgetting password
class ResetPasswordPage extends Component<DispatchProps, {}> {
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

                                    <ResetPasswordForm handleSubmit={this.props.resetPassword}/>

                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(null, {resetPassword})(ResetPasswordPage);