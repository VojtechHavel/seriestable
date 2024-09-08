import * as React from 'react';
import "../youtube/YoutubeOverview.scss"
import autobind from 'class-autobind';
import State from "../../types/State";
import "./AddFormView.scss"


export interface AddFormProps {
    onSubmit: (id: string) => any,
    processing: State,
    title: string,
    placeholder: string,
    initialValue?: string
}

export interface IState {
    inputValue: string,
}

export default class AddFormView extends React.Component<AddFormProps, IState> {

    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            inputValue: this.props.initialValue?this.props.initialValue:""
        }
    }

    public render() {
        return (<div className={"col-lg-12 add-channel-input"}>
            <h3>{this.props.title}</h3>
            <form onSubmit={this.onSubmit}>
            <input placeholder={this.props.placeholder}  autoFocus={true} className="form-control" type={"text"} value={this.state.inputValue}
                   onChange={this.handleChange}/>
            {this.renderSubmitButton()}
            </form>
        </div>)
    }



    private onSubmit(e) {
        e.preventDefault();
        if (this.props.processing !== State.PROCESSING) {
            this.props.onSubmit(this.state.inputValue);
        }
    }

    private renderSubmitButton(){
        if (this.props.processing !== State.PROCESSING) {
            return (<input type="submit" className="btn btn-primary" value="OK"/>);
        } else {
            return (<div className="btn btn-primary loading"/> )
        }
    }

    private handleChange(event) {
        this.setState({inputValue: event.target.value});
    }
}