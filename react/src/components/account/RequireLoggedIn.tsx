import React from 'react';
import {withRouter} from "react-router-dom";
import {toast} from 'react-toastify';
import Loading from "../util/Loading";
import {connect} from "react-redux";
import {AppState} from "../../store/rootReducer";
import {UserState} from "../../types/UserState";
import {RouterProps} from "react-router";
import State from "../../types/State";

interface LoggedComponentProps {

}

interface ConnectedProps {
    userState: UserState
}

export default function requireLoggedIn(Component) {

    class LoggedComponent extends React.Component<ConnectedProps & LoggedComponentProps & RouterProps, any> {

        public render() {
            if (this.props.userState.state === State.PROCESSING || this.props.userState.state === State.INITIAL) {
                return (<div className="middle-loading"><Loading/></div>)
            } else {
                if (this.props.userState.state === State.OK && this.props.userState.role !== 'USER') {
                    toast.info("This page is for logged in users only. We redirected you to login page.");
                    this.props.history.replace('/login');
                    return (<div className="middle-loading"><Loading/></div>);
                }else {
                    return <Component {...this.props} />;
                }
            }
        }
    }


    const mapStateToProps = ({userState}: AppState) => {
        return {
            userState
        };
    };

    return withRouter(connect(mapStateToProps, {})(LoggedComponent) as any);
}