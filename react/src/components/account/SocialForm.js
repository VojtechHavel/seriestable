import React, { Component } from 'react';

import "./SocialForm.scss"
import {API_URL} from "../../config/apiUrl";
import { library, dom } from '@fortawesome/fontawesome-svg-core'
import {faGoogle, faFacebookF} from "@fortawesome/free-brands-svg-icons";
library.add(faGoogle, faFacebookF);
dom.watch();

class SocialForm extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="row">

                <div className="col-lg-12 btn-social">
                    <form action={API_URL+"/signin/facebook"} method="post">
                        <button type="submit" className="btn btn-facebook-login"><span className="social-icon"><i className="fab fa-facebook-f"/></span>Connect with Facebook</button>
                    </form>
                  </div>

                <div className="col-lg-12 btn-social">
                    <form action={API_URL+"/signin/google"} method="post">
                        <button type="submit" className="btn btn-google-login"><span className="social-icon"><i className="fab fa-google"/></span>Connect with Google</button>
                    </form>
                  </div>

            </div>
        );
    }
}

export default SocialForm;