import React, {Component} from 'react';
import "./Loading.scss";

export default class Loading extends Component {

    constructor(props){
        super(props);
        // console.log("Loading props", this.props);
    }

    render() {
        return (
            <span className="loading">
                <img src="/loading.gif"/>
            </span>
        );
    }
};






