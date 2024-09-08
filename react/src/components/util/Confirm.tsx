import * as React from 'react';
import "../youtube/YoutubeOverview.scss"
import autobind from 'class-autobind';
import State from "../../types/State";
import "./AddFormView.scss"
import Modal from "./Modal";
import "./Confirm.scss"

export interface ConfirmProps {
    onConfirm: () => any,
    onClose: () => any,
    processing: State,
    title: string,
    visible: boolean
}

export default class Confirm extends React.Component<ConfirmProps, {}> {

    constructor(props) {
        super(props);
        autobind(this);
    }

    public render() {
        if (this.props.visible) {
            return (
                <div className="confirm-dialog">
                    <Modal
                        key="AddCategoryModal"
                        onClose={this.props.onClose}
                        showModal={this.props.visible}>
                        <div>
                            <h3>{this.props.title}</h3>
                            {this.renderButtons()}
                        </div>
                    </Modal>
                </div>)
        } else {
            return null;
        }
    }

    private onConfirm(e) {
        e.preventDefault();
        if (this.props.processing !== State.PROCESSING) {
            this.props.onConfirm();
        }
    }

    private renderButtons() {
        if (this.props.processing !== State.PROCESSING) {
            return (<div className={"confirm-buttons"}>
                <span onClick={this.props.onClose} className={"cancel-button"}>Cancel</span>
                <input onClick={this.onConfirm} type="submit" autoFocus={true} className="btn btn-primary" value="Yes"/>
            </div>);
        } else {
            return (<div className="btn btn-primary loading"/>)
        }
    }
}