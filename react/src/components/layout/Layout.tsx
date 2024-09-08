import React from 'react'

import "./Layout.scss";
import Navbar from "./Navbar";
import Routes from "../core/Routes";
import {ToastContainer, Slide} from 'react-toastify';

export default class Template extends React.Component<{}, {}> {

    public render() {
       return (
            <div className="site">
                <div className="site-content">
                    <Navbar/>
                    <div id="main-content">
                        <Routes/>
                    </div>
                </div>
                <ToastContainer
                    position="bottom-right"
                    autoClose={5000}
                    hideProgressBar={true}
                    newestOnTop={false}
                    closeOnClick={true}
                    pauseOnHover={true}
                    transition={Slide}
                />
            </div>
        )
    }
}