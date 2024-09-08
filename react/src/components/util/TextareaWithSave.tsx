import * as React from 'react';
import autobind from 'class-autobind';
import './TextareaWithSave.scss'

import {library, dom} from '@fortawesome/fontawesome-svg-core'
import {faSave} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {debounce} from 'lodash';

library.add(faSave);
dom.watch();

interface TextareaWithSaveState {
    note: string,
}

export type OnSaveType = (value: string) => any

export interface TextareaWithSaveProps {
    note: string,
    autoFocus?: boolean,
    onSave: OnSaveType,
}

export default class TextareaWithSave extends React.Component<TextareaWithSaveProps, TextareaWithSaveState> {

    private debounceNoteUpdate = debounce((value) => {
        this.props.onSave(value);
    }, 400);

    constructor(props) {
        super(props);
        this.state = {
            note: this.props.note || ""
        };
        autobind(this);
    }

    public render() {
        let saveIconClass = "save-icon";
        if(this.props.note===this.state.note){
            saveIconClass = saveIconClass + " disabled";
        }

        return <div className={"note-textarea"}>
            <span className={saveIconClass} onClick={this.saveNote}><FontAwesomeIcon icon={"save"}/></span>
            <textarea onFocus={this.moveCaretAtEnd} autoFocus={this.props.autoFocus || this.props.autoFocus ===undefined} onChange={this.handleNoteChange} value={this.state.note || ""}/>
        </div>
    }

    public componentWillUnmount() {
        this.debounceNoteUpdate.flush();
    }

    private moveCaretAtEnd(e) {
        const textareaValue = e.target.value;
        e.target.value = '';
        e.target.value = textareaValue;
        e.target.scrollTop = e.target.scrollHeight;
    }

    private saveNote(){
        if(this.props.note!==this.state.note) {
            this.props.onSave(this.state.note);
        }
    }

    private handleNoteChange(event) {
        this.setState({note: event.target.value});
        this.debounceNoteUpdate(event.target.value);
    }
}