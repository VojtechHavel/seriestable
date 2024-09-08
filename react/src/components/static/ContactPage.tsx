import React, {Component} from 'react';
import ContactForm from "./ContactForm";
import {sendFeedback} from "../../actions/api/contactApi";

class ContactPage extends Component<{}, {}> {
    constructor(props) {
        document.title = "Contact | Videomark.app";

        super(props);
    }

    public render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-3 col-sm-1"/>
                    <div id="login-form" className="col-md-6 col-sm-10">

                        <div className="panel panel-default">
                            <ul className="list-group">
                                <li className="list-group-item">
                                    <ContactForm handleSubmit={sendFeedback}/>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ContactPage;