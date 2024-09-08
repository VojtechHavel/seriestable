import * as React from 'react';
import * as ReactDOM from 'react-dom';
import "bootstrap/dist/css/bootstrap.min.css"
import 'react-toastify/dist/ReactToastify.min.css'
import './index.scss';
import store from '../../store/store';
import {Provider} from "react-redux";
import App from "./App";
import history from "../../utils/history";
import {Router} from 'react-router'

//
// const store = createStore<UserState, SetUsernameAction, null, null>(username, {
//     username: "vojtastore"
// });

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <App/>
        </Router>
    </Provider>,
    document.getElementById('root') as HTMLElement
);
