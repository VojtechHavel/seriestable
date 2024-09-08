import * as React from "react";
import autobind from 'class-autobind';
import {Bookmark} from "../../types/generatedTypes";
import {formatTime} from "../../utils/time";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import EditableName from "../util/EditableName";
import "./SidepanelBookmarks.scss";

export interface SidepanelBookmarksProps {
    bookmarks: Bookmark[],
    youtubeId: string,
    handleSeekTo: (time: number) => any,
    addBookmark: any,
    removeBookmark: any,
    handleBookmarksChange: any
}

interface State {
    bookmarkBeingEdited: Bookmark | null,
}

export default class SidepanelBookmarks extends React.Component<SidepanelBookmarksProps, State> {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            bookmarkBeingEdited: null
        }
    }

    public render() {
        this.props.bookmarks.sort((bookmark1: Bookmark, bookmark2: Bookmark) => {
            if (bookmark1.timeInSeconds < bookmark2.timeInSeconds) {
                return -1;
            } else {
                return 1;
            }
        });

        let key = 0;

        return (<div className={"sidepanel-section"}>
            <div className={"row"}>
                <div className={"offset-md-3 icon-button action-button col-md-6"}
                     onClick={this.props.addBookmark}>
                    <FontAwesomeIcon icon={"plus"}/> Add bookmark
                </div>
            </div>

            {this.props.bookmarks.map(bookmark => {
                key++;
                return <div className="hover-icon-parent row bookmark-row" key={key}>
                    <div className="col-10">
                        <span
                            className="bookmark-time"
                            onClick={() => {
                                this.props.handleSeekTo(bookmark.timeInSeconds)
                            }}>
                            {formatTime(bookmark.timeInSeconds)}
                        </span>
                        <EditableName
                            onCancel={() => {
                                this.handleEditCancel(bookmark)
                            }}
                            onSubmit={(name) => {
                                this.props.handleBookmarksChange(bookmark, name);
                                this.setState({
                                    bookmarkBeingEdited: null
                                })
                            }}
                            value={bookmark.name}
                            onEdit={() => {
                                this.handleEditBookmark(bookmark)
                            }}
                            editable={this.state.bookmarkBeingEdited === bookmark}
                        />
                    </div>


                    <div className={"col-2"} onClick={() => {
                        this.props.removeBookmark(bookmark)
                    }}>
                        <FontAwesomeIcon
                            data-tip={"Remove bookmark"} icon={"trash"}
                            className={"remove-bookmark-icon hover-icon"}/>
                    </div>
                </div>
            })}
        </div>);
    }

    private handleEditBookmark(bookmark: Bookmark) {
        this.setState({
            bookmarkBeingEdited: bookmark === this.state.bookmarkBeingEdited ? null : bookmark
        })
    }

    private handleEditCancel(bookmark: Bookmark) {
        this.setState({
            bookmarkBeingEdited: null
        })
    }
}