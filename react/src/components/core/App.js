import * as React from 'react';
import './App.scss';
import history from "../../utils/history"

import Layout from "../layout/Layout";
import {toast} from 'react-toastify';
import {connect} from "react-redux";
import {afterLoginAction, loginAsVisitor} from '../../actions/userActions';
import {withRouter} from "react-router";

class App extends React.Component {

    constructor(props) {
        super(props);
        console.log("App props", props);

        const search = props.location.search;
        const params = new URLSearchParams(search);
        const loginToken = params.get('login-token');
        const signupToken = params.get('signup-token');
        const storageToken = localStorage.getItem("apiToken");

        const error = params.get('error');

        if (error) {
            toast.error(error);
            window.location.replace("/");
        } else if (signupToken) {
            this.props.afterLoginAction(signupToken);
            // redirecting to root to hide apiToken
            history.push('/');
        } else if (loginToken) {
            this.props.afterLoginAction(loginToken);
            // redirecting to root to hide apiToken
            history.push('/');
        } else if (storageToken) {
            this.props.afterLoginAction(storageToken);
        } else {
            this.props.loginAsVisitor();
            console.log("not logged in");
        }
    }

    render() {
        return (
            <div className="App">
                <Layout/>
            </div>
        );
    }
}

export default withRouter(connect(null, {
    afterLoginAction,
    loginAsVisitor
})(App));
