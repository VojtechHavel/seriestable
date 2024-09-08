import * as React from 'react';
import ReactModal from 'react-modal';
import "./Modal.scss";

import { library, dom } from '@fortawesome/fontawesome-svg-core'
import {faTimes} from "@fortawesome/free-solid-svg-icons";
library.add(faTimes);
dom.watch();


export interface ModalProps {
    showModal: boolean,
    onClose: ()=>any
}

export default class Modal extends React.Component<ModalProps, any> {
    constructor(props) {
        super(props);
    }

    public render() {
        const modalStyles = {
            overlay: {
                zIndex: 10,
                backgroundColor: 'rgba(0, 0, 0, 0.75)'
            }
        };

        return (
            <ReactModal
                style={modalStyles}
                isOpen={this.props.showModal}
                ariaHideApp={false}
                onRequestClose={this.props.onClose}
                className="modal-parent"
            >
                <div className="modal-child">
                    <span onClick={this.props.onClose} className="modal-close-icon">
                        <i className="fa fa-times" aria-hidden="true"/>
                    </span>

                    {this.props.children}
                </div>
            </ReactModal>
        );
    }
}