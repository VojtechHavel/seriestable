import * as React from "react";
import autobind from 'class-autobind';
import {connect} from "react-redux";
import {Video} from "../../types/generatedTypes";
import "./NoteTile.scss"
import VideoTile from "./VideoTile";
import {AppState} from "../../store/rootReducer";
import {UserState} from "../../types/UserState";
import {updateNote, UpdateNoteSignature} from "../../actions/youtubeActions";
import TextareaWithSave from "../util/TextareaWithSave";

export interface NoteTileProps {
    video: Video
}

interface NoteTileState {

}

interface DispatchProps {
    updateNote: UpdateNoteSignature
}

interface StateProps {
    userState: UserState
}

class NoteTile extends React.Component<StateProps & DispatchProps & NoteTileProps, NoteTileState> {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
        }
    }

    public render(){
        return <div className={"row hover-section page-section note-tile"}>
            <div className={"col-md-4"}>
                <VideoTile video={this.props.video}/>
            </div>
            <div className={"col-md-8"}>
                <TextareaWithSave autoFocus={false} note={this.props.video.note} onSave={this.updateNote}/>
            </div>
        </div>;
    }

    private updateNote(note) {
        this.props.updateNote(this.props.video.youtubeId, note);
    }
}

const mapStateToProps = ({userState}: AppState) => {
    return {userState};
};

export default connect<StateProps, DispatchProps, NoteTileProps>(mapStateToProps, {updateNote})(NoteTile)