import * as React from 'react';
import "./Modal.scss";
import autobind from 'class-autobind';
import {library, dom} from '@fortawesome/fontawesome-svg-core'
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import "./EditableName.scss"

library.add(faTimes);
dom.watch();


export interface EditableNameProps {
    onCancel: () => any,
    onSubmit: (newValue: string) => any,
    value: string,
    onEdit: () => any,
    className?: string,
    editable: boolean
}

export interface EditableNameState {
    value: string
}

export default class EditableName extends React.Component<EditableNameProps, EditableNameState> {
    private inputRef: React.RefObject<HTMLInputElement> = React.createRef();


    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value
        };
        autobind(this);
    }

    public render() {
            return (
                <form className={"editable-name"} onSubmit={this.onSubmit}>
                <span className={"editable-name-value"}>
                    <span suppressContentEditableWarning={true} ref={this.inputRef} className={this.props.className}
                          onKeyDown={this.handleCategoryTitleKeyDown} onChange={this.handleChange}
                          contentEditable={this.props.editable}>{this.state.value}</span>
                </span>
                    {this.renderIcons()}
                </form>
            );
    }


    public componentDidUpdate(prevProps: EditableNameProps, prevState, snapshot) {
        if (!prevProps.editable && this.props.editable) {
            if (this.inputRef.current != null) {
                this.inputRef.current.focus();
                const char = this.inputRef.current.innerText.length; // character at which to place caret  content.focus();
                const sel = window.getSelection();
                if (sel != null) {
                    sel.collapse(this.inputRef.current.firstChild, char);
                }
            }
        }

        if (this.inputRef.current) {
            if(prevProps.value !== this.props.value) {
                this.inputRef.current.innerText = this.props.value;
            }
        }
    }

    private renderIcons() {
        if (this.props.editable) {
            return (
                <span className="editable-name-icons">
                    <span className={"editable-name-icon hover-icon"}  onClick={this.onSubmit}>
                        <FontAwesomeIcon icon={"check"}/>
                    </span>
                    <span className={"editable-name-icon hover-icon"} onClick={this.onCancel}>
                         <FontAwesomeIcon icon={"times"}/>
                    </span>
                </span>
            )
        } else {
            return (
                <span className="editable-name-icons">
                    <span className={"editable-name-icon hover-icon"} onClick={this.props.onEdit}>
                        <FontAwesomeIcon icon={"pen"}/>
                    </span>
                </span>
            )
        }
    }

    private onCancel(){
        this.setState({
            value: this.props.value
        });
        if (this.inputRef.current) {
            this.inputRef.current.innerText = this.props.value;
        }
        this.props.onCancel();
    }

    private handleCategoryTitleKeyDown(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.onSubmit(e);
            console.log('enter press here! ')
        }
        if (e.key === 'Escape') {
            e.preventDefault();
            if (this.props.onCancel) {
                this.props.onCancel();
            }
        }

        console.log("e", e);
    }

    private onSubmit(e) {
        e.preventDefault();
        if (this.inputRef.current) {
            this.props.onSubmit(this.inputRef.current.innerText);
        }
    }

    private handleChange(event) {
        this.setState({value: event.target.value});
    }
}