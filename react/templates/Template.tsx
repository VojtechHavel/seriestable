import * as React from "react";
import autobind from 'class-autobind';
import {connect} from "react-redux";

export interface TemplateProps {

}

interface TemplateState {

}

interface DispatchProps {

}

interface StateProps {

}

class Template extends React.Component<StateProps & DispatchProps & TemplateProps, TemplateState> {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
        }
    }

    public render(){
        return null;
    }
}

const mapStateToProps = () => {
    return {
    };
};

export default connect<StateProps, DispatchProps, TemplateProps>(mapStateToProps, {})(Template)