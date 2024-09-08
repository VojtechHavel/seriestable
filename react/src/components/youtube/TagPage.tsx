import * as React from "react";
import Modal from "../util/Modal";
import autobind from 'class-autobind';
import State from "../../types/State";
import {toast} from "react-toastify";
import AddFormView from "../util/AddFormView";
import {connect} from "react-redux";
import {RouterProps, withRouter} from "react-router";
import {AppState} from "../../store/rootReducer";
import {addTag} from "../../actions/tagActions";
import {UserState} from "../../types/UserState";
import {TagState} from "../../store/tagReducer";
import {Tag} from "../../types/generatedTypes";
import "./TagPage.scss"
import Loading from "../util/Loading";
import TagTile from "./TagTile";

interface YoutubeOverviewState {
    showAddTagModal: boolean
}

interface TagPageProps extends RouterProps{
}

interface ConnectedProps {
    userState: UserState,
    tagState: TagState,
    addTag: (tag: string)=>Promise<any>
}

class TagPage extends React.Component<TagPageProps & ConnectedProps, YoutubeOverviewState> {

    constructor(props) {
        super(props);
        document.title = "Tags | Videomark.app";

        console.log("YoutubeOverview props", props);

        this.state = {
            showAddTagModal: false
        };

        autobind(this);
    }


    public render() {
        console.log("rerender TagPage");

        return [
            <div key="tagPage" className="container" id="tags">
                <div className={"page-section page-header"}><h1>Tags</h1></div>
                {this.renderTags()}
                {this.renderAddTagButton()}
            </div>,

            <Modal
                key="AddTagModal"
                onClose={this.handleCloseAddTagModal}
                showModal={this.state.showAddTagModal}>
                <AddFormView
                    placeholder={"Tag name"}
                    title={"Add tag"}
                    processing={this.props.tagState.addTagState}
                    onSubmit={this.addTag}/>
            </Modal>
        ];
    }
    private renderTags() {
        if (this.props.userState.state !== State.PROCESSING && this.props.tagState.tags) {
            if(this.props.tagState.tags.length > 0) {
                return (
                    <div className="page-section tag-list">
                        <div className={"row"}>
                            {this.props.tagState.tags.sort((tag1, tag2) => {
                                return tag1.name.localeCompare(tag2.name)
                            }).map((tag: Tag) => {
                                console.log("tag", tag.name);
                                return this.renderTag(tag)
                            })}
                        </div>
                    </div>
                );
            }else{
                return <div className="page-section">
                    <h2 className={"page-section-empty"}>You don't have any tags.</h2>
                </div>
            }
        } else {
            return <Loading/>
        }
    }

    private renderTag(tag: Tag) {
        return <TagTile
            rootClass={"col-md-3 col-lg-2 col-6"}
            key={tag.key}
            tag={tag}/>
    }

    private renderAddTagButton() {
        return <div className={"hover-shadow"}>
            <div  onClick={this.showAddTagForm} className={"page-section add-section"}>
                <div className={"col-lg-12"}>
                    <h3>Add Tag</h3>
                </div>
            </div>
        </div>
    }

    private handleCloseAddTagModal() {
        this.setState({
            showAddTagModal: false
        })
    }

    private addTag(tag: string){
        this.props.addTag(tag).then(()=>{
            this.setState({
                showAddTagModal: false
            })
        })
    }

    private showAddTagForm() {
        if (this.props.userState.state === State.OK) {
            this.setState({
                showAddTagModal: true
            })
        } else {
            toast.info("To add tag, Sign up!");
            this.props.history.push('/signup')
        }
    }
}

const mapStateToProps = ({userState, tagState}: AppState) => {
    return {
        userState,
        tagState
    };
};

export default withRouter(connect(mapStateToProps, {addTag})(TagPage) as any);