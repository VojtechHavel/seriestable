import * as React from 'react';
import "./YoutubeOverview.scss"
import autobind from 'class-autobind';
import "./TagPage.scss";
import Modal from "../util/Modal";
import { CirclePicker } from 'react-color'
import "./TagEditModal.scss"
import {Tag} from "../../types/generatedTypes";
import IconPicker from "./IconPicker";

export interface TagEditModalProps {
    showModal: boolean,
    onClose: any,
    tag: Tag,
    onSubmit: (newTag: Tag)=>any
}

export interface TagEditModalState {
    tag: Tag
}

export default class TagEditModal extends React.Component<TagEditModalProps, TagEditModalState> {

    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            tag: {...props.tag}
        }
    }

    public render() {
        return (
            <Modal
                key="AddChannelModal"
                onClose={this.props.onClose}
                showModal={this.props.showModal}>
                <input autoFocus={true} className="form-control tag-edit-modal-name" type={"text"} value={this.state.tag.name}
                       onChange={this.handleNameChange}/>
                <IconPicker
                    onChange={this.handleIconChange}
                    icon={this.state.tag.icon?this.state.tag.icon:"tag"}
                />
                <CirclePicker
                    color={ this.state.tag.color?this.state.tag.color:"#2196F3"}
                    onChange={this.handleColorChange}
                    circleSize={44}
                    width={"380px"}
                />
                <input type="submit" onClick={this.handleSubmit} className="btn btn-primary" value="OK"/>
            </Modal>)
    }


    private handleNameChange(event) {
        this.state.tag.name = event.target.value;
        this.setState({tag: this.state.tag});
    }

    private handleColorChange(color){
        this.state.tag.color = color.hex;
        this.setState({tag: this.state.tag});
    }

    private handleIconChange(icon, event){
        this.state.tag.icon = icon;
        this.setState({tag: this.state.tag});
    }

    private handleSubmit() {
        this.props.onSubmit(this.state.tag);
    }
}