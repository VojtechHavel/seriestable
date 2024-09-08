import React, {Component} from 'react';
import autobind from 'class-autobind';
import "./PageNotFound.scss";

class PageNotFound extends Component {
    constructor(props) {
        super(props);
        document.title = "Page not found | Videomark.app";
        autobind(this);
    }

    render() {

        // setTimeout(()=>{ history.push("/");}, 7000);

        return (
            <div className="container">

                <div className="panel panel-default">
                    <ul className="list-group">
                        <li className="list-group-item list-item-center">
                            <div>
                                <h3>Page not found</h3>
                            </div>

                            <div className="broken-page-image">
                                <img src="/img/logoBroken.svg"></img>
                                {/*<BrokenPageLogo/>*/}
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        )
            ;
    }
}

export default PageNotFound;